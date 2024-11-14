

# tests/__init__.py
import pytest
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load the .env.test file
load_dotenv(".env.test")

@pytest.fixture(scope="module")
def test_db():
    """
    fixture for setting up and tearing down the test database.
    provides a clean test database for each test module.
    """
    db_string = os.getenv("DB_STRING")
    client = MongoClient(db_string)
    db = client["LegallyChemieTest"]  # Use the test database

    yield db  # Provide the test database to tests

    # Clean up test data after tests
    db.users.delete_many({})
    db.products.delete_many({})
    db.rules.delete_many({})
    client.close()
