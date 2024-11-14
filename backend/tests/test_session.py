
# tests/test_session.py
from fastapi.testclient import TestClient
from server import app

client = TestClient(app)

def test_session_not_authenticated():
    """
    tests the /session route when user is not authenticated.
    """
    response = client.get("/session")
    assert response.status_code == 401
    assert response.json() == {"error": "Not authenticated"}

def test_logout():
    """
    tests the /logout route to ensure it logs out the user.
    """
    response = client.get("/logout/")
    assert response.status_code == 200  # Expected success status


