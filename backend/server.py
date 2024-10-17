from dotenv import load_dotenv
from pymongo import MongoClient
from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
from bson import ObjectId
from search import final
from urllib.parse import quote_plus, urlencode
from authlib.integrations.starlette_client import OAuth
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
import os
import json

# loading .env file & initializing the Flask app
load_dotenv()
# initialize FastAPI
app = FastAPI()
# secret key for sessions
app.add_middleware(SessionMiddleware, secret_key=os.getenv("APP_SECRET_KEY"))
# getting values from .env file & setting up db
db_string = os.getenv("DB_STRING")
client = MongoClient(db_string)
db = client.LegallyChemie
products_collection = db.get_collection("products")
users_collection = db.get_collection("users")

# adding CORS middleware to allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# initializing OAuth
oauth = OAuth()

oauth.register(
    name="auth0",
    client_id=os.getenv("AUTH0_CLIENT_ID"),
    client_secret=os.getenv("AUTH0_CLIENT_SECRET"),
    client_kwargs={
        "scope": "openid profile email",
    },
    server_metadata_url=f'https://{os.getenv("AUTH0_DOMAIN")}/.well-known/openid-configuration'
)

# login route
@app.get("/login")
async def login(request: Request):
    redirect_uri = request.url_for("callback")
    return await oauth.auth0.authorize_redirect(request, redirect_uri)

# callback route
@app.get("/callback")
async def callback(request: Request):
    token = await oauth.auth0.authorize_access_token(request)
    request.session["user"] = token

    # extracting user ID from the token
    user_id = token.get("sub")  # This is typically the Auth0 user ID

    # storing userID in MongoDB
    if user_id:
        # checking if user already exists
        existing_user = users_collection.find_one({"auth0_id": user_id})
        if not existing_user:
            # creating a new user entry
            users_collection.insert_one({"auth0_id": user_id})  # Add other relevant user info here

    # redirecting user back to React app with a success status
    return RedirectResponse("http://localhost:3000/") 

# logout route
@app.get("/logout")
async def logout(request: Request):
    request.session.clear()
    return RedirectResponse(
        "https://" + os.getenv("AUTH0_DOMAIN")
        + "/v2/logout?"
        + urlencode(
            {
                "returnTo": "http://localhost:3000",  # can change
                "client_id": os.getenv("AUTH0_CLIENT_ID"),
            },
            quote_via=quote_plus,
        )
    )
# route to fetch current user session info
@app.get("/session")
async def session(request: Request):
    user = request.session.get("user")
    if user:
        return JSONResponse(content={"user": user})
    else:
        return JSONResponse(content={"error": "Not authenticated"}, status_code=401)


# helper function to convert MongoDB ObjectId to str
def product_serializer(product) -> dict:
    return {
        "id": str(product["_id"]),
        "name": product.get("name"), 
        "ingredients": product.get("ingredients", [])  
    }

# pydantic model for request & response bodies
class ProductInput(BaseModel):
    user_input: str

# @app.post("/users/")
# def create_user(nickname: str):
#     if nickname:
        # user information is stored in the database but this should include nickname, auth0 id of user + products list
        # collection.insert_one({})

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
        products_collection.insert_one(product_data)
        return {"message": "Product created successfully"}
    else:
        raise HTTPException(status_code=404, detail="Product not found")
    

# retrieving all products for task -> GET /{entities}/: Retrieve a list of all records. (2/5)
@app.get("/products/")
def get_products():
    products = list(products_collection.find({}))
    return [product_serializer(product) for product in products]

# retrieving a single product -> GET /{entities}/:id Retrieve a single record. (3/5)
@app.get("/products/{product_id}") #test case id: 670d965c94c0676f2a1b2deb
def get_product(product_id: str):
    product = products_collection.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product_serializer(product)

# updating an existing product by ID -> PUT /{entities}/:id Update a record. (4/5)
@app.put("/products/{product_id}")
def update_product(product_id: str, updated_product: ProductInput):  #test case id: 670d965c94c0676f2a1b2deb
    result = products_collection.update_one(
        {"_id": ObjectId(product_id)},
        {"$set": {"name": updated_product.user_input}}  # updating only name field
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product updated successfully"}

# deleting a product by ID -> DELETE /{entities}/:id Delete a record. (5/5)
@app.delete("/products/{product_id}") 
def delete_product(product_id: str): #test case id: 670d965c94c0676f2a1b2deb
    result = products_collection.delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")





