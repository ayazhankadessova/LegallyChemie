from dotenv import load_dotenv
from pymongo import MongoClient
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from bson import ObjectId
from search import final
import os

# loading .env file & initializing the Flask app
load_dotenv()
# initialize FastAPI
app = FastAPI()

# getting values from .env file & setting up db
db_string = os.getenv("DB_STRING")
client = MongoClient(db_string)
db = client.LegallyChemie
collection = db.get_collection("products")

# helper function to convert MongoDB ObjectId to str
def product_serializer(product) -> dict:
    return {
        "id": str(product["_id"]),
        "name": product.get("name"),  # Avoid KeyError
        "ingredients": product.get("ingredients", [])  # Default to empty list
    }

# pydantic model for request & response bodies
class ProductInput(BaseModel):
    user_input: str

### CRUD endpoints ###
# create a new product -> POST /{entities}/: Create a new record. (1/5)
@app.post("/products/")
def create_product(product_input: ProductInput):
    # print(f"Received input: {product_input}")
    user_input = product_input.user_input 
    # print(f"User input extracted: {user_input}")
    # test_input: "L'Oreal Collagen Moisture Filler Daily Moisturizer"
    product_data = final(user_input)
    if product_data:
        collection.insert_one(product_data)
        return {"message": "Product created successfully"}
    else:
        raise HTTPException(status_code=404, detail="Product not found")

# retrieving all products for task -> GET /{entities}/: Retrieve a list of all records. (2/5)
@app.get("/products/")
def get_products():
    products = list(collection.find({}))
    return [product_serializer(product) for product in products]

# retrieving a single product -> GET /{entities}/:id Retrieve a single record. (3/5)
@app.get("/products/{product_id}") #test case id: 670d965c94c0676f2a1b2deb
def get_product(product_id: str):
    product = collection.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product_serializer(product)

# updating an existing product by ID -> PUT /{entities}/:id Update a record. (4/5)
@app.put("/products/{product_id}")
def update_product(product_id: str, updated_product: ProductInput):  #test case id: 670d965c94c0676f2a1b2deb
    result = collection.update_one(
        {"_id": ObjectId(product_id)},
        {"$set": {"name": updated_product.user_input}}  # updating only name field
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product updated successfully"}

# deleting a product by ID -> DELETE /{entities}/:id Delete a record. (5/5)
@app.delete("/products/{product_id}") 
def delete_product(product_id: str): #test case id: 670d965c94c0676f2a1b2deb
    result = collection.delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
