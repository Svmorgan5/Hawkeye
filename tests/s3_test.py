"""
PyTest smoke‑test for S3 setup.
- Lists buckets (validates keys)
- Uploads a tiny object
- Downloads it via presigned URL
- Deletes the object
"""

import io
import os
import time
import boto3
import pytest
import requests
from dotenv import load_dotenv
from botocore.exceptions import ClientError

# ─── Load secrets from .env ────────────────────────────────────
load_dotenv()

AWS_ACCESS_KEY_ID     = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION            = os.getenv("AWS_REGION", "us-east-2")          # your bucket’s region
BUCKET_NAME           = os.getenv("AWS_BUCKET_NAME", "tech-res-project-hawkeye")

# ─── Fixture: reusable S3 client ───────────────────────────────
@pytest.fixture(scope="session")
def s3_client():
    assert AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY, \
        "AWS secrets not found – add them to .env or your shell"
    return boto3.client(
        "s3",
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_REGION,
    )

# ─── Tests ─────────────────────────────────────────────────────
def test_bucket_visible(s3_client):
    names = [b["Name"] for b in s3_client.list_buckets()["Buckets"]]
    assert BUCKET_NAME in names, f"Bucket {BUCKET_NAME} not visible to these credentials"

def test_upload_and_download(s3_client):
    key   = f"pytest/{int(time.time())}.txt"
    data  = b"pytest_s3_smoke"

    # Upload
    s3_client.upload_fileobj(io.BytesIO(data), BUCKET_NAME, key, ExtraArgs={"ACL": "private"})

    # Presigned URL
    url  = s3_client.generate_presigned_url(
        "get_object",
        Params={"Bucket": BUCKET_NAME, "Key": key},
        ExpiresIn=30,
    )
    resp = requests.get(url, timeout=5)
    assert resp.status_code == 200
    assert resp.content == data

    # Clean up
    s3_client.delete_object(Bucket=BUCKET_NAME, Key=key)
