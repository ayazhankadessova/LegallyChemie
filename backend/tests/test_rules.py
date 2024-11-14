
# NEEDS TO BE FIXED CHECK LATER
# tests/test_rules.py
from fastapi.testclient import TestClient
from server import app

client = TestClient(app)

def test_get_user_rules():
    """
    tests retrieving rules for a user's products.
    """
    #mock session with user information
    with client as test_client:
        test_client.cookies.set("session", "mock_session_token")
        response = test_client.get("/AM/rules/", cookies={"session": "mock_session_token"})
    
    assert response.status_code == 200  # Expected success status
