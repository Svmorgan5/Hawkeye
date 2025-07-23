import json
import pytest
from backend.application import create_app
from backend.application.models import db, Institution, User


#If you get an error while running start with this command to set the PYTHONPATH set PYTHONPATH=%cd%
@pytest.fixture
def client():
    app = create_app('TestingConfig')
    app.config['TESTING'] = True
    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.session.remove()
        db.drop_all()

def test_create_user(client):
    payload = {
        "email": "pytestuser1@example.com",
        "name": "Pytest User",
        "password": "TestPass123!",
        "phone": "555-555-0000",
        "role": "Admin"
    }
    response = client.post('/users/', data=json.dumps(payload), content_type='application/json')
    print(response.get_json())  # Add this line for debugging
    assert response.status_code == 201
    data = response.get_json()
    assert data["email"] == "pytestuser1@example.com"

def test_login_user(client):
    # First, create the user
    payload = {
        "email": "pytestlogin@example.com",
        "name": "Login User",
        "password": "TestPass123!",
        "phone": "555-555-0008",  # Unique phone
        "role": "Admin"
    }
    client.post('/users/', data=json.dumps(payload), content_type='application/json')

    # Now, try to log in
    login_payload = {
        "email": "pytestlogin@example.com",
        "password": "TestPass123!"
    }
    response = client.post('/users/login', data=json.dumps(login_payload), content_type='application/json')
    assert response.status_code in (200, 201)
    data = response.get_json()
    assert "token" in data

def test_get_members_unauthorized(client):
    response = client.get('/members/')
    assert response.status_code in (400, 404)

def test_create_member_with_auth(client):
    # Create an institution
    with client.application.app_context():
        institution = Institution(name="Test Institution", is_school=True)
        db.session.add(institution)
        db.session.commit()
        institution_id = institution.id

    # Create user
    user_payload = {
        "email": "pytestmember@example.com",
        "name": "Member User",
        "password": "TestPass123!",
        "phone": "555-555-0009",
        "role": "Admin"
    }
    client.post('/users/', data=json.dumps(user_payload), content_type='application/json')

    # Manually assign institution_id to user
    with client.application.app_context():
        user = db.session.query(User).filter_by(email="pytestmember@example.com").first()
        user.institution_id = institution_id
        db.session.commit()

    # Now login and create member as before
    login_payload = {
        "email": "pytestmember@example.com",
        "password": "TestPass123!"
    }
    login_resp = client.post('/users/login', data=json.dumps(login_payload), content_type='application/json')
    token = login_resp.get_json()["token"]

    member_payload = {
        "name": "Test Member",
        "email": "member@example.com",
        "role": "Student",
        "groups": "A"
    }
    response = client.post('/members/', data=json.dumps(member_payload), content_type='application/json',
                           headers={"Authorization": f"Bearer {token}"})
    assert response.status_code in (200, 201)
    data = response.get_json()
    assert data["name"] == "Test Member"

def test_get_nonexistent_member(client):
    # Assuming 99999 is not a valid member_id
    response = client.get('/members/99999')
    assert response.status_code in (400, 404)