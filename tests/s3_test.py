"""
Smoke‑test for real S3 credentials.
Lists buckets, uploads a tiny object, downloads via presigned URL,
then cleans up.  Requires valid AWS_* env vars.
"""

import io
import os
import time
import boto3
import pytest
import requests
from dotenv import load_dotenv

load_dotenv()  # pulls AWS keys from your local .env or Render env

AWS_ACCESS_KEY_ID     = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION            = os.getenv("AWS_REGION", "us-east-2")
BUCKET_NAME           = os.getenv("AWS_BUCKET_NAME", "tech-res-project-hawkeye")


# ─── Fixtures ────────────────────────────────────────────────────────────────
@pytest.fixture(scope="session")
def s3_client():
    assert AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY, "Missing AWS creds"
    return boto3.client(
        "s3",
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_REGION,
    )


# ─── Tests ───────────────────────────────────────────────────────────────────
def test_bucket_visible(s3_client):
    names = [b["Name"] for b in s3_client.list_buckets()["Buckets"]]
    assert BUCKET_NAME in names, f"Bucket {BUCKET_NAME} not visible to these keys"


def test_upload_and_download(s3_client):
    key   = f"pytest/{int(time.time())}.txt"
    data  = b"pytest_s3_smoke"

    # Upload
    s3_client.upload_fileobj(io.BytesIO(data), BUCKET_NAME, key, ExtraArgs={"ACL": "private"})

    # Presigned URL
    url   = s3_client.generate_presigned_url(
        "get_object",
        Params={"Bucket": BUCKET_NAME, "Key": key},
        ExpiresIn=30,
    )
    resp  = requests.get(url, timeout=5)
    assert resp.status_code == 200
    assert resp.content == data

    # Clean up
    s3_client.delete_object(Bucket=BUCKET_NAME, Key=key)
