

# tests/test_products.py
from fastapi.testclient import TestClient
from server import app
import pytest

client = TestClient(app)

@pytest.fixture(scope="function")
def setup_user(test_db):
    """
    sets up a test user and cleans up afterward.
    """
    user_id = "test_user_id"
    test_db.users.insert_one({
        "auth0_id": user_id,
        "given_name": "Test User",
        "products": {"AM": [], "PM": []}
    })
    yield user_id
    test_db.users.delete_many({"auth0_id": user_id})

def test_add_product(test_db, setup_user):
    """
    tests adding a product to the user's routine.
    """
    data = {"user_input": "Sample Product"}
    response = client.post("/AM/products/", json=data, cookies={"session": "mock_session_token"})
    assert response.status_code == 200
    assert "message" in response.json()

def test_get_user_products(test_db, setup_user):
    """
    tests retrieving products for a user.
    """
    response = client.get("/AM/products/", cookies={"session": "mock_session_token"})
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_delete_user_product(test_db, setup_user):
    """
    tests deleting a product from the user's routine.
    """
    product_data = {"name": "Sample Product", "brand": "Test Brand", "ingredients": [], "tags": []}
    inserted_product = test_db.products.insert_one(product_data)

    test_db.users.update_one(
        {"auth0_id": setup_user},
        {"$addToSet": {"products.AM": inserted_product.inserted_id}}
    )

    product_id = str(inserted_product.inserted_id)
    response = client.delete(f"/AM/products/{product_id}", cookies={"session": "mock_session_token"})
    assert response.status_code == 200
    assert response.json().get("message") == "Product deleted successfully"

