from dotenv import load_dotenv
from flask_cors import CORS
from pymongo import MongoClient
from flask import Flask, jsonify
from bs4 import BeautifulSoup
import os
import requests


# loading .env file & initializing the Flask app
load_dotenv()
app = Flask(__name__)
CORS(app) # enabling CORS for all routes

# getting values from .env file
app.db_string = os.getenv("DB_STRING")
print("this is the db strong", app.db_string)

# function to initialize database
def initialize_database():
    try: 
        print("inside initialize_database()")
        client = MongoClient(app.db_string)
        print("this is the client: ", client)
        db = client.LegallyChemie # database name
        # collection_1 = db.get_collection("1") # collection name will be added
        collection_2 = db.get_collection("products") # collection name will be added
        # collection_3 = db.get_collection("3") # collection name will be added

    except Exception as e:
        print(e)
        return jsonify({"error": "Could not connect to the database."}), 500
    
    return collection_2

def search_product(user_input):
    search_url = f"https://incidecoder.com/search?query={user_input}"
    print("search url", search_url)
    
    # product search url
    response = requests.get(search_url)
    if response.status_code == 200: 
        html_product = BeautifulSoup(response.text, 'html.parser')
        first_result = html_product.find('a', class_='klavika simpletextlistitem')  
        print("first result", first_result)

    if first_result:
        product_link = first_result['href']
        print("product link", product_link)
        product_url = f"https://incidecoder.com{product_link}" 
        print("product url", product_url)
        return product_url
    else:
        print("No results found.")
        return None

def extract_ingredients(product_url):
    response = requests.get(product_url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # extracting ingredients
    ingredients_section = soup.find('div', class_='showmore-section ingredlist-short-like-section')
    ingredients = ingredients_section.find_all('a', class_='ingred-link black')
    
    # collecting ingredient names
    ingredient_list = [ingredient.text.strip() for ingredient in ingredients]
    return ingredient_list

if __name__ == "__main__":
    user_input = "L'Oreal Collagen Moisture Filler Daily Moisturizer"
    print("User input:", user_input)
    products_collection = initialize_database()
    print("products collection called successfully")
    product_url = search_product(user_input)
    
    if product_url:
        ingredients = extract_ingredients(product_url)
        print("Ingredients:")
        for ingredient in ingredients:
            print(ingredient)

        # creating a dictionary to store product name and ingredients
        product_data = {
            user_input: ingredients
        }

        # inserting into the MongoDB collection
        if products_collection is not None:
            result = products_collection.insert_one(product_data)
            print(f"Inserted product with id: {result.inserted_id}")
    else:
        print("No product found.")