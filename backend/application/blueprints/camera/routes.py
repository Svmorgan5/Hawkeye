from . import cameras_bp
from backend.application.blueprints.camera.cameraSchemas import camera_schema, cameras_schema
from flask import request, jsonify, Response
from backend.application.models import db, Camera
from marshmallow import ValidationError
from sqlalchemy import select, delete
from backend.application.extensions import limiter, cache
from backend.application.utils.utils import encode_token, token_required
import requests
import re


@cameras_bp.route('/', methods=['POST'])
@token_required
@limiter.limit("5 per hour")  # Limit to 5 requests per hour to avoid brute force attacks
def add_camera(current_user_id):
    try:
        camera_data = camera_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400

    new_camera = Camera(
        name=camera_data['name'],
        location=camera_data['location'],
        user_id=current_user_id,
        snapshot_url=camera_data['snapshot_url']  # If WE WANT TO MAKE IT REQUIRED
    )

    db.session.add(new_camera)
    db.session.commit()
    return camera_schema.jsonify(new_camera), 201


@cameras_bp.route('/', methods=['GET'])
@token_required
@limiter.limit("10 per hour")  # Limit to 10 requests per hour
@cache.cached(timeout=300)  # Cache the cameras for 5 minutes
def get_cameras(current_user_id):
    cameras = db.session.execute(
        select(Camera).where(Camera.user_id == current_user_id)
    ).scalars().all()
    return cameras_schema.jsonify(cameras), 200


def is_valid_url(url):
    return url.startswith('http://') or url.startswith('https://')

@cameras_bp.route('/<int:camera_id>/snapshot', methods=['GET'])
@token_required
@cache.cached(timeout=150)  # Cache the cameras for 2.5 minutes
def get_camera_snapshot(current_user_id, camera_id):
    camera = db.session.execute(
        select(Camera).where(Camera.id == camera_id, Camera.user_id == current_user_id)
    ).scalars().first()
    if not camera or not camera.snapshot_url:
        return jsonify({"error": "Camera or snapshot not found"}), 404

    if not is_valid_url(camera.snapshot_url):
        return jsonify({"error": "Invalid snapshot_url format"}), 400

    try:
        resp = requests.get(camera.snapshot_url, timeout=5)
        if resp.status_code != 200:
            return jsonify({"error": "Unable to fetch snapshot"}), 502
    except requests.RequestException as e:
        return jsonify({"error": f"Snapshot fetch failed: {str(e)}"}), 502

    return Response(resp.content, mimetype='image/jpeg')

@cameras_bp.route('/<int:camera_id>', methods=['PUT'])
@token_required
def update_camera(current_user_id, camera_id):
    query = select(Camera).where(Camera.id == camera_id)
    camera = db.session.execute(query).scalars().first()

    if camera is None:
        return jsonify({"error": "User not found"}), 200
    try:
        user_data = camera_schema.load(request.json, partial=True)  # allow partial updates
    except ValidationError as e:
        return jsonify(e.messages), 400


    for field, value in user_data.items():
        if value is not None:
            setattr(camera, field, value)

    db.session.commit()
    return camera_schema.jsonify(camera), 200


@cameras_bp.route("/<int:camera_id>", methods=['DELETE'])
@token_required
def delete_camera(current_user_id, camera_id):
    # Fetch the camera belonging to the current user
    query = select(Camera).where(Camera.id == camera_id, Camera.user_id == current_user_id)
    camera = db.session.execute(query).scalars().first()

    if not camera:
        return jsonify({"message": "Camera not found"}), 400

    db.session.delete(camera)
    db.session.commit()

    return jsonify({"message": "Camera deleted successfully."}), 200


#SEEMS LIKE THE MOST STRAIGHT FORWARD WAY TO ADD LIVE STREAMING
#MAY NEED TO ADD MORE ERROR HANDLING

@cameras_bp.route('/<int:camera_id>/stream_url', methods=['GET'])
@token_required
def get_camera_stream_url(current_user_id, camera_id):
    camera = db.session.execute(
        select(Camera).where(Camera.id == camera_id, Camera.user_id == current_user_id)
    ).scalars().first()
    if not camera or not camera.stream_url:
        return jsonify({"error": "Camera or stream not found"}), 404
    return jsonify({"stream_url": camera.stream_url})


#NEXT IS IF THE ABOVE LIVE STREAM CODE WONT WORK
# BE SURE TO import requests
# IMPORT THIS IF NOT ALREADY from flask import Response, stream_with_context

#@cameras_bp.route('/<int:camera_id>/livestream', methods=['GET'])
#@token_required
#def camera_livestream(current_user_id, camera_id):
    camera = db.session.execute(
        select(Camera).where(Camera.id == camera_id, Camera.user_id == current_user_id)
    ).scalars().first()
    if not camera or not camera.stream_url:
        return jsonify({"error": "Camera or stream not found"}), 404

    def generate():
        with requests.get(camera.stream_url, stream=True) as r:
            for chunk in r.iter_content(chunk_size=1024):
                if chunk:
                    yield chunk

    return Response(stream_with_context(generate()), mimetype='multipart/x-mixed-replace; boundary=frame')