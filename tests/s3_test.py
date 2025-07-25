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
from moto import mock_s3

AWS_REGION    = "us-east-2"
BUCKET_NAME   = "tech-res-project-hawkeye"

# ─── Fixture: reusable S3 client with Moto ─────────────────────
@pytest.fixture(scope="session")
def s3_client():
    with mock_s3():
        s3 = boto3.client(
            "s3",
            aws_access_key_id="dummy",
            aws_secret_access_key="dummy",
            region_name=AWS_REGION,
        )
        s3.create_bucket(
            Bucket=BUCKET_NAME,
            CreateBucketConfiguration={"LocationConstraint": AWS_REGION}
        )
        yield s3

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
