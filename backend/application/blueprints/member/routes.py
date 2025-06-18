from flask import request, jsonify
from backend.application.models import db, Member
from backend.application.blueprints.member import members_bp
from backend.application.blueprints.member.memberSchemas import member_schema, members_schema
from marshmallow import ValidationError
import csv
import io

# Create a member (single)
@members_bp.route('/', methods=['POST'])
def create_member():
    try:
        member_data = member_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400

    new_member = Member(**member_data)
    db.session.add(new_member)
    db.session.commit()
    return member_schema.jsonify(new_member), 201

# Get all members
@members_bp.route('/', methods=['GET'])
def get_members():
    members = db.session.query(Member).all()
    return members_schema.jsonify(members), 200

# Get a single member
@members_bp.route('/<int:member_id>', methods=['GET'])
def get_member(member_id):
    member = db.session.get(Member, member_id)
    if not member:
        return jsonify({"error": "Member not found"}), 404
    return member_schema.jsonify(member), 200

# Update a member
@members_bp.route('/<int:member_id>', methods=['PUT'])
def update_member(member_id):
    member = db.session.get(Member, member_id)
    if not member:
        return jsonify({"error": "Member not found"}), 404
    try:
        member_data = member_schema.load(request.json, partial=True)
    except ValidationError as e:
        return jsonify(e.messages), 400
    for field, value in member_data.items():
        setattr(member, field, value)
    db.session.commit()
    return member_schema.jsonify(member), 200

# Delete a member
@members_bp.route('/<int:member_id>', methods=['DELETE'])
def delete_member(member_id):
    member = db.session.get(Member, member_id)
    if not member:
        return jsonify({"error": "Member not found"}), 404
    db.session.delete(member)
    db.session.commit()
    return jsonify({"message": "Member deleted"}), 200

# Bulk create members from CSV or RTF
@members_bp.route('/upload', methods=['POST'])
def upload_members():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files['file']
    filename = file.filename.lower()
    members_created = []
    if filename.endswith('.csv'):
        stream = io.StringIO(file.stream.read().decode("UTF8"), newline=None)
        reader = csv.DictReader(stream)
        for row in reader:
            try:
                member_data = member_schema.load(row)
                new_member = Member(**member_data)
                db.session.add(new_member)
                members_created.append(member_schema.dump(new_member))
            except ValidationError:
                continue
        db.session.commit()
        return jsonify({"created": members_created}), 201
    elif filename.endswith('.rtf'):
        content = file.stream.read().decode("UTF8")
        lines = [line.strip() for line in content.splitlines() if ',' in line]
        for line in lines:
            parts = [p.strip() for p in line.split(',')]
            if len(parts) >= 2:
                member_data = {"name": parts[0], "email": parts[1]}
                try:
                    member_data = member_schema.load(member_data)
                    new_member = Member(**member_data)
                    db.session.add(new_member)
                    members_created.append(member_schema.dump(new_member))
                except ValidationError:
                    continue
        db.session.commit()
        return jsonify({"created": members_created}), 201
    else:
        return jsonify({"error": "Unsupported file type"}), 400