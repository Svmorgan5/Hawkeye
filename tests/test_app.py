import io, json, os
import pytest
from moto import mock_aws as moto_mock_aws
import boto3
import requests
from types import SimpleNamespace

from backend.application import create_app, db
from backend.application.models import Institution, User, Camera

# set PYTHONPATH to include the backend directory
# ─── Constants ───────────────────────────────────────────────────────────────
TEST_BUCKET   = "tech-res-project-hawkeye"
AWS_TEST_KEY  = "testkey"
AWS_TEST_SEC  = "testsecret"
AWS_TEST_REG  = "us-east-2"

# ─── Global env vars for the whole test session ──────────────────────────────
@pytest.fixture(scope="session", autouse=True)
def aws_env_vars():
    os.environ["AWS_ACCESS_KEY_ID"]     = AWS_TEST_KEY
    os.environ["AWS_SECRET_ACCESS_KEY"] = AWS_TEST_SEC
    os.environ["AWS_REGION"]            = AWS_TEST_REG
    os.environ["AWS_BUCKET_NAME"]       = TEST_BUCKET
    yield

# ─── Moto S3 stub (session‑scoped) ───────────────────────────────────────────
@pytest.fixture(scope="session")
def s3_stub():
    with moto_mock_aws():
        s3 = boto3.client(
            "s3",
            aws_access_key_id=AWS_TEST_KEY,
            aws_secret_access_key=AWS_TEST_SEC,
            region_name=AWS_TEST_REG,
        )
        # non‑us‑east‑1 regions need LocationConstraint
        s3.create_bucket(
            Bucket=TEST_BUCKET,
            CreateBucketConfiguration={"LocationConstraint": AWS_TEST_REG},
        )
        yield s3

# ─── Flask test‑client with fresh DB per test ────────────────────────────────
@pytest.fixture
def client(s3_stub):
    app = create_app("TestingConfig")
    app.config["TESTING"] = True
    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.session.remove()
        db.drop_all()

# ─── Helper: create user + login, return token ───────────────────────────────
def _create_and_login(client, email="u@example.com", role="Admin"):
    user_payload = {
        "email": email,
        "name":  "Tester",
        "password": "TestPass123!",
        "phone": "555‑111‑2222",
        "role": role,
    }
    client.post("/users/", json=user_payload)
    token_resp = client.post("/users/login", json={"email": email, "password": "TestPass123!"})
    return token_resp.get_json()["token"]

# ─── Basic user / member tests (unchanged) ───────────────────────────────────
def test_create_user(client):
    payload = {
        "email": "pytestuser1@example.com",
        "name":  "Pytest User",
        "password": "TestPass123!",
        "phone": "555‑555‑0000",
        "role": "Admin",
    }
    resp = client.post("/users/", json=payload)
    assert resp.status_code == 201
    assert resp.get_json()["email"] == payload["email"]

def test_login_user(client):
    token = _create_and_login(client, "pytestlogin@example.com")
    assert token

def test_get_members_unauthorized(client):
    resp = client.get("/members/")
    assert resp.status_code in (400, 404)

# ─── S3 upload via /users/<id>/upload-image route ────────────────────────────
def test_upload_user_image_s3(client):
    token = _create_and_login(client, "imguser@example.com")
    img   = io.BytesIO(b"\x89PNG\r\n\x1a\n" + b"\x00"*50)
    img.name = "dummy.png"

    resp = client.post(
        "/users/1/upload-image",
        data={"file": img},
        headers={"Authorization": f"Bearer {token}"},
        content_type="multipart/form-data"
    )
    assert resp.status_code == 200
    assert resp.get_json()["image"].startswith(
        f"https://{TEST_BUCKET}.s3.amazonaws.com/users/1/"
    )

# ─── Member creation with auth ───────────────────────────────────────────────
def test_create_member_with_auth(client):
    # 1️⃣  Create the admin user and get token
    token = _create_and_login(client, "memberadmin@example.com")

    # 2️⃣  Create an institution and attach it to that user
    with client.application.app_context():
        inst = Institution(name="Snap Inst", is_school=True)
        db.session.add(inst); db.session.commit()

        user = db.session.get(User, 1)          # user now exists
        user.institution_id = inst.id
        db.session.commit()

    # 3️⃣  Create a member through the API
    member_payload = {
        "name":  "Test Member",
        "email": "member@example.com",
        "role":  "Student",
        "groups": "A",
    }
    resp = client.post(
        "/members/", json=member_payload,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert resp.status_code in (200, 201)
    assert resp.get_json()["name"] == "Test Member"


def test_get_nonexistent_member(client):
    resp = client.get("/members/99999")
    assert resp.status_code in (400, 404)

# ─── Camera snapshot route archives to S3 (mocked HTTP) ──────────────────────
def test_camera_snapshot_archives_to_s3(client, monkeypatch):
    token = _create_and_login(client, "camuser@example.com")

    # Create institution & camera
    with client.application.app_context():
        inst = Institution(name="Snap Inst", is_school=True)
        db.session.add(inst); db.session.commit()

        user = db.session.get(User, 1)
        user.institution_id = inst.id
        db.session.commit()

        cam = Camera(
            user_id=user.id,
            institution_id=inst.id,
            name="TestCam",
            location="Lab 1",
            snapshot_url="http://dummy.cam/img.jpg",
        )
        db.session.add(cam); db.session.commit()
        cam_id = cam.id

    # Fake snapshot bytes
    dummy_bytes = b"\xff\xd8\xff\xee" + b"\x00"*100
    def _fake_get(url, timeout=5):
        assert url == "http://dummy.cam/img.jpg"
        return SimpleNamespace(status_code=200, content=dummy_bytes)
    monkeypatch.setattr(requests, "get", _fake_get)

    resp = client.get(f"/cameras/{cam_id}/snapshot", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    assert resp.data == dummy_bytes
    s3_url = resp.headers.get("X-S3-URL")
    assert s3_url and s3_url.startswith(
        f"https://{TEST_BUCKET}.s3.amazonaws.com/snapshots/{cam_id}/"
    )
