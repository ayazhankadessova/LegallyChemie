from dotenv import load_dotenv
from flask_cors import CORS
from pymongo import MongoClient
from flask import Flask, jsonify
import os

# loading .env file & initializing the Flask app
load_dotenv()
app = Flask(__name__)
CORS(app) # enabling CORS for all routes

# getting values from .env file
app.db_string = os.getenv("DB_STRING")

# function to initialize database
def initialize_database():
    try: 
        print("inside initialize_database()")
        client = MongoClient(app.db_string)
        print("this is the client: ", client)
        db = client.sweetcode # database name
        collection_1 = db.get_collection("1") # collection name will be added
        collection_2 = db.get_collection("2") # collection name will be added
        collection_3 = db.get_collection("3") # collection name will be added

    except Exception as e:
        print(e)
        return jsonify({"error": "Could not connect to the database."}), 500
    
    return collection_1, collection_2, collection_3