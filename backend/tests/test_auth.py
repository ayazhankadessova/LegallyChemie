

# tests/test_auth.py
from fastapi.testclient import TestClient
from server import app

client = TestClient(app)

def test_login():
    """
    tests the /login route for successful response.
    """
    response = client.get("/login")
    assert response.status_code == 200

def test_callback():
    """
    tests the /callback route with a mock session token.
    """
    response = client.get("/callback", cookies={"session": "mock_session_token"})
    assert response.status_code == 200


