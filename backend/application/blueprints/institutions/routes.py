import os
from flask import request, jsonify, current_app
from backend.application.models import db, Member, User, Institution
from backend.application.blueprints.institutions import institutions_bp
from backend.application.blueprints.institutions.institutionsSchemas import institution_schema, institutions_schema
from backend.application.blueprints.user.userSchemas import users_schema 
from backend.application.blueprints.member.memberSchemas import member_schema,members_schema
from marshmallow import ValidationError
import csv
import io
from werkzeug.utils import secure_filename
from backend.application.utils.utils import encode_token, token_required

@institutions_bp.route('/', methods=['POST'])
@token_required
def create_institution(current_user_id):
    user = db.session.get(User, current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    try:
        new_institution = institution_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400
    db.session.add(new_institution)
    db.session.commit()
    # Optionally, assign the user to this institution
    user.institution_id = new_institution.id
    db.session.commit()
    return institution_schema.jsonify(new_institution), 201

# Get all users for the current user's institution
@institutions_bp.route('/users', methods=['GET'])
@token_required
def get_institution_users(current_user_id):
    user = db.session.get(User, current_user_id)
    if not user or not user.institution_id:
        return jsonify({"error": "User or institution not found"}), 404
    users = db.session.query(User).filter_by(institution_id=user.institution_id).all()
    institution = db.session.get(Institution, user.institution_id)
    return jsonify({
        "institution": institution_schema.dump(institution),
        "users": users_schema.dump(users)
    }), 200

# Get all members for the current members institution
@institutions_bp.route('/members', methods=['GET'])
@token_required
def get_institution_members(current_user_id):
    user = db.session.get(User, current_user_id)
    if not user or not user.institution_id:
        return jsonify({"error": "User or institution not found"}), 404
    members = db.session.query(Member).filter_by(institution_id=user.institution_id).all()
    return members_schema.jsonify(members), 200

# Update an institution (only by the user who created/owns it)
@institutions_bp.route('/<int:institution_id>', methods=['PUT'])
@token_required
def update_institution(current_user_id, institution_id):
    user = db.session.get(User, current_user_id)
    institution = db.session.get(Institution, institution_id)
    if not user or not institution:
        return jsonify({"error": "User or Institution not found"}), 404
    if user.institution_id != institution.id:
        return jsonify({"error": "Unauthorized"}), 403
    try:
        institution_data = institution_schema.load(request.json, partial=True)
    except ValidationError as e:
        return jsonify(e.messages), 400
    updated_institution = institution_schema.load(request.json, instance=institution, partial=True)
    db.session.commit()
    return institution_schema.jsonify(updated_institution), 200

# Delete an institution (only by the user who created/owns it)
@institutions_bp.route('/<int:institution_id>', methods=['DELETE'])
@token_required
def delete_institution(current_user_id, institution_id):
    user = db.session.get(User, current_user_id)
    institution = db.session.get(Institution, institution_id)
    if not user or not institution:
        return jsonify({"error": "User or Institution not found"}), 404
    if user.institution_id != institution.id:
        return jsonify({"error": "Unauthorized"}), 403
    db.session.delete(institution)
    db.session.commit()
    return jsonify({"message": "Institution deleted"}), 200