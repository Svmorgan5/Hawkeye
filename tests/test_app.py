import io, json, os
import pytest
from moto import mock_s3
import boto3
from backend.application import create_app
from backend.application.models import db, Institution, User, Camera
from werkzeug.security import generate_password_hash
from types import SimpleNamespace
import requests

# ─── Constants used across tests ──────────────────────────────
TEST_BUCKET   = "tech-res-project-hawkeye"
AWS_TEST_KEY  = "testkey"
AWS_TEST_SEC  = "testsecret"
AWS_TEST_REG  = "us-east-2"

# ─── PyTest fixtures ─────────────────────────────────────────
@pytest.fixture(scope="session", autouse=True)
def aws_env_vars():
    """Set env vars so utils.load_dotenv picks them up."""
    os.environ["AWS_ACCESS_KEY_ID"]     = AWS_TEST_KEY
    os.environ["AWS_SECRET_ACCESS_KEY"] = AWS_TEST_SEC
    os.environ["AWS_REGION"]            = AWS_TEST_REG
    os.environ["AWS_BUCKET_NAME"]       = TEST_BUCKET
    yield

@pytest.fixture(scope="function")
def s3_stub():
    """Start/stop moto’s AWS stub and create the test bucket."""
    with mock_s3():
        s3 = boto3.client(
            "s3",
            aws_access_key_id=AWS_TEST_KEY,
            aws_secret_access_key=AWS_TEST_SEC,
            region_name=AWS_TEST_REG,
        )
        if AWS_TEST_REG == "us-east-1":
            s3.create_bucket(Bucket=TEST_BUCKET)
        else:
            s3.create_bucket(
                Bucket=TEST_BUCKET,
                CreateBucketConfiguration={"LocationConstraint": AWS_TEST_REG},
            )
        yield s3


@pytest.fixture
def client(s3_stub):          # depend on the stub to ensure bucket exists
    app = create_app("TestingConfig")
    app.config["TESTING"] = True
    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.session.remove()
        db.drop_all()


# ─── Helper to create & login a user quickly ─────────────────
def _create_and_login(client, email="u@example.com", role="Admin"):
    user_payload = {
        "email": email,
        "name": "Tester",
        "password": "TestPass123!",
        "phone": "555-111-2222",
        "role": role,
    }
    client.post("/users/", data=json.dumps(user_payload), content_type="application/json")
    login_payload = {"email": email, "password": "TestPass123!"}
    resp = client.post("/users/login", data=json.dumps(login_payload), content_type="application/json")
    return resp.get_json()["token"]

# ─── Existing tests (unchanged) ───────────────────────────────
def test_create_user(client):
    payload = {
        "email": "pytestuser1@example.com",
        "name": "Pytest User",
        "password": "TestPass123!",
        "phone": "555-555-0000",
        "role": "Admin",
    }
    resp = client.post("/users/", data=json.dumps(payload), content_type="application/json")
    assert resp.status_code == 201
    assert resp.get_json()["email"] == payload["email"]

def test_login_user(client):
    token = _create_and_login(client, "pytestlogin@example.com")
    assert token

def test_get_members_unauthorized(client):
    resp = client.get("/members/")
    assert resp.status_code in (400, 404)

def test_upload_user_image_s3(client):
    token = _create_and_login(client, "imguser@example.com")
    img = io.BytesIO(b"\x89PNG\r\n\x1a\n" + b"\x00"*50)
    img.name = "dummy.png"
    resp = client.post("/users/1/upload-image",
                       data={"file": img},
                       headers={"Authorization": f"Bearer {token}"},
                       content_type="multipart/form-data")
    assert resp.status_code == 200
    s3_url = resp.get_json()["image"]
    assert s3_url.startswith(f"https://{TEST_BUCKET}.s3.amazonaws.com/users/1/")

def test_create_member_with_auth(client):
    with client.application.app_context():
        inst = Institution(name="Test Inst", is_school=True)
        db.session.add(inst); db.session.commit()
        inst_id = inst.id
    token = _create_and_login(client, "memberadmin@example.com")
    with client.application.app_context():
        user = db.session.get(User, 1)
        user.institution_id = inst_id
        db.session.commit()
    member_payload = {
        "name": "Test Member",
        "email": "member@example.com",
        "role": "Student",
        "groups": "A",
    }
    resp = client.post("/members/", data=json.dumps(member_payload),
                       headers={"Authorization": f"Bearer {token}"},
                       content_type="application/json")
    assert resp.status_code in (200, 201)
    assert resp.get_json()["name"] == "Test Member"

def test_get_nonexistent_member(client):
    resp = client.get("/members/99999")
    assert resp.status_code in (400, 404)

def test_camera_snapshot_archives_to_s3(client, monkeypatch):
    token = _create_and_login(client, "camuser@example.com")
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
            stream_url=None,
        )
        db.session.add(cam)
        db.session.commit()
        cam_id = cam.id

    dummy_bytes = b"\xff\xd8\xff\xee" + b"\x00" * 100
    def _fake_get(url, timeout=5):
        assert url == "http://dummy.cam/img.jpg"
        return SimpleNamespace(status_code=200, content=dummy_bytes)
    monkeypatch.setattr(requests, "get", _fake_get)

    resp = client.get(
        f"/cameras/{cam_id}/snapshot",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 200
    assert resp.data == dummy_bytes
    s3_url = resp.headers.get("X-S3-URL")
    assert s3_url and s3_url.startswith(f"https://{TEST_BUCKET}.s3.amazonaws.com/snapshots/{cam_id}/")

