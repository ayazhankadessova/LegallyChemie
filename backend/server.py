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
import uvicorn
import os
import json


"""
@file server.py
@brief FastAPI server for managing user authentication, product information, and rules.

@details
server application provides RESTful API endpoints to manage user authentication 
(using Auth0 for OAuth), handle user sessions, and interact with a MongoDB database. 
server supports operations for managing products and rules associated with each user 
and allows the frontend (React) application to communicate with it.

key functionalities:
- OAuth-based user login and session management.
- CRUD operations for user-specific products.
- rule-based recommendation checks to guide product usage.
- CORS and session middleware configuration to enable secure cross-origin requests and 
  session handling between the frontend and backend.
"""

# loading .env file & initializing the Flask app
load_dotenv()
# initialize FastAPI
app = FastAPI()


"""
@brief adds session middleware to the app for secure session management.
@details uses a secret key from the environment variables.
"""
app.add_middleware(SessionMiddleware, secret_key=os.getenv("APP_SECRET_KEY"))


"""
@brief initializes the MongoDB client and connects to the 'LegallyChemie' database.
@details collections for 'products', 'users', 'rules', and 'ingredients' are initialized.
"""
db_string = os.getenv("DB_STRING")
client = MongoClient(db_string)
db = client.LegallyChemie
products_collection = db.get_collection("products")
users_collection = db.get_collection("users")
rules_collection = db.get_collection("rules")
ingredients_collection = db.get_collection("ingredients")

"""
@brief configures CORS to allow requests from the React frontend.
@details allows all HTTP methods and headers from localhost:3000.
"""
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

"""
@brief initializes OAuth for user authentication with Auth0.
"""
oauth = OAuth()

oauth.register(
    name="auth0",
    client_id=os.getenv("AUTH0_CLIENT_ID"),
    client_secret=os.getenv("AUTH0_CLIENT_SECRET"),
    client_kwargs={
        "scope": "openid profile email",
    },
    server_metadata_url=f'https://{os.getenv("AUTH0_DOMAIN")}/.well-known/openid-configuration',
)


"""
@fn login
@brief login route
@brief initiates the login process by redirecting to Auth0 for user authentication.
@param request the http request object.
@return redirects to the Auth0 authorization url.
"""
@app.get("/login")
async def login(request: Request):
    redirect_uri = request.url_for("callback")
    return await oauth.auth0.authorize_redirect(request, redirect_uri)


"""
@fn callback
@brief handles the callback from Auth0 after authentication.
@param request the http request object.
@return redirects to the react frontend with the user's information.
"""
@app.get("/callback")
async def callback(request: Request):
    token = await oauth.auth0.authorize_access_token(request)
    # what is this token?
    request.session["user"] = token
    # print("Token: ", token)

    # extracting user info from the token
    user_info = token.get("userinfo", {})

    # saving 'given_name' & 'sub' (user ID) into separate variables
    given_name = user_info.get("given_name")
    user_id = user_info.get("sub")

    print("Given Name: ", given_name)
    print("User ID: ", user_id)

    request.session["user_id"] = user_id

    # storing userID in MongoDB
    if user_id:
        # checking if user already exists
        print("user_id is populated")
        existing_user = users_collection.find_one({"auth0_id": user_id})
        if not existing_user:
            # creating a new user entry
            users_collection.insert_one(
                {
                    "auth0_id": user_id,
                    "given_name": given_name,
                    "products": {"AM": [], "PM": []},
                }
            )
            print("this is a new user")
        else:
            print("user already exists")

    # redirecting user back to React app with a success status
    return RedirectResponse(
        f"http://localhost:3000/landing?name={given_name}&user_id={user_id}"
    )



"""
@fn logout
@brief logout route
@brief logs out the user by clearing the session and redirecting to Auth0's logout.
@param request the http request object.
@return redirects to the logout url with a return path to the react app.
"""
@app.get("/logout")
async def logout(request: Request):
    request.session.clear()
    return RedirectResponse(
        "https://"
        + os.getenv("AUTH0_DOMAIN")
        + "/v2/logout?"
        + urlencode(
            {
                "returnTo": "http://localhost:3000",  # URL to redirect to after logout
                "client_id": os.getenv("AUTH0_CLIENT_ID"),
            },
            quote_via=quote_plus,
        )
    )



"""
@fn session
@brief retrieves the current user session information.
@param request the http request object.
@return JSONResponse with user data or an error if the user is not authenticated.
"""
@app.get("/session")
async def session(request: Request):
    user = request.session.get("user")
    if user:
        return JSONResponse(content={"user": user})
    else:
        return JSONResponse(content={"error": "Not authenticated"}, status_code=401)


"""
@fn product_serializer
@brief helper function to convert a MongoDB product document into a serializable dictionary.
@param product MongoDB document representing the product.
@return a dictionary containing product fields in serializable format.
"""
def product_serializer(product) -> dict:
    return {
        "id": str(product["_id"]),
        "brand": product.get("brand"),
        "name": product.get("name"),
        "description": product.get("description"),
        "ingredients": product.get("ingredients", []),
        "image": product.get("image"),
        "tags": product.get("tags", []),
    }


# pydantic model for request & response bodies
class ProductInput(BaseModel):
    user_input: str

"""
@fn get_user_rules
@brief fetches rules applicable to products for a specific user.
@param user_id the id of the user in the database.
@return dictionary with product_id as key and list of incompatible product_ids.
"""
@app.get("/{user_id}/rules/")
def get_user_rules(user_id: str):

    # TODO: add separate AM and PM rule checking
    products = get_user_products(user_id, "AM")
    #products.extend(get_user_products(user_id, "PM"))

    product_rules = {}

    # fetch all the rules given the tags from the products
    for product in products:
        tags = product.get("tags", [])
        avoid = []
        for tag in tags:
            rule = rules_collection.find_one({"_id": {"$in": [tag]}})
            print("Rule: ", rule)
            if rule:
                avoid_rule = rule.get("rules", {}).get("avoid", [])
                avoid.extend(avoid_rule)

        for product_comp in products:
            # Skip self
            if product_comp["id"] == product["id"]:
                continue

            # Check if product_comp tags are in the avoid list
            for tag in product_comp.get("tags", []):
                if tag in avoid:
                    if product["id"] not in product_rules:
                        product_rules[product["id"]] = []
                    product_rules[product["id"]].append(
                        {"_id": product_comp["id"], "type": "avoid", "tag": tag}
                    )

    return product_rules


"""
@fn get_user_products
@brief retrieves all products for a specified user for a given time (AM/PM).
@param user_id the id of the user.
@param day time of day ("AM" or "PM").
@return a list of serialized product dictionaries.
"""
@app.get("/{user_id}/{day}/products/")
def get_user_products(user_id: str, day: str):
    user_doc = users_collection.find_one({"auth0_id": user_id})

    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")

    print("User Doc:", user_doc)
    product_ids = user_doc.get("products", [])
    print("Product IDs:", product_ids)

    # fetching product details based on AM or PM
    product_ids = user_doc["products"].get(day, [])
    user_products = list(products_collection.find({"_id": {"$in": product_ids}}))
    print(f"User Products for {day}:", user_products)

    return [product_serializer(product) for product in user_products]


"""
@fn create_user_product
@brief adds a new product to a user's product list for a specified time (AM/PM).
@param user_id the id of the user.
@param day time of day ("AM" or "PM").
@param product_input the product input data provided by the user.
@return a message indicating whether a new or existing product was added.
"""
@app.post("/{user_id}/{day}/products/")
def create_user_product(user_id: str, day: str, product_input: ProductInput):
    user_input = product_input.user_input
    product_data = final(user_input)
    print("this is the day ", day)
    if product_data:
        product_name = product_data.get("name")
        existing_product = products_collection.find_one({"name": product_name})

        if existing_product:
            product_id = existing_product["_id"]

            # updating user's document to include this product in their products list
            update_result = users_collection.update_one(
                {"auth0_id": user_id},
                {
                    "$addToSet": {f"products.{day}": product_id}
                },  # using addtoSet to avoid duplicates
            )
            print("Update result:", update_result.modified_count)
            message = (
                "Existing product added to user's products"
                if update_result.modified_count > 0
                else "Product already in user's products list"
            )

        else:
            # add tags for products collections according to ingredients
            ingredients = product_data.get("ingredients", [])
            tags = []
            for i in ingredients:
                ingredient = i.lower().replace(" ", "")
                ingredient_id = ingredients_collection.find_one({"_id": ingredient})
                if ingredient_id and "categories" in ingredient_id:
                    tags.extend(ingredient_id["categories"])
            product_data["tags"] = tags

            # insert products
            inserted_product = products_collection.insert_one(product_data)
            product_id = inserted_product.inserted_id
            print("New product ID:", product_id)

            update_result = users_collection.update_one(
                {"auth0_id": user_id}, {"$addToSet": {f"products.{day}": product_id}}
            )
            print("Update result:", update_result.modified_count)
            message = (
                "New product created and added to user's products"
                if update_result.modified_count > 0
                else "Failed to add product to user's products list"
            )

        return {"message": message}
    else:
        raise HTTPException(status_code=404, detail="Product not found")


"""
@fn delete_user_product
@brief deletes a product from a user's product list for a specified time (AM/PM).
@param user_id the id of the user.
@param day time of day ("AM" or "PM").
@param product_id the id of the product to be deleted.
@return a message indicating successful deletion or an error if the product was not found.
"""
@app.delete("/{user_id}/{day}/products/{product_id}")
def delete_user_product(user_id: str, day: str, product_id: str):
    print("User ID:", user_id)
    print("Product ID:", product_id)
    result = users_collection.update_one(
        {"auth0_id": user_id}, {"$pull": {f"products.{day}": ObjectId(product_id)}}
    )

    # checking if any documents were modified
    if result.modified_count == 0:
        raise HTTPException(
            status_code=404, detail="Product not found or user not found"
        )

    return {"message": "Product deleted successfully"}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")

# SCRAP FUNCTIONS

# # create a new product -> POST /{entities}/: Create a new record. (1/5)
# @app.post("/products/")
# def create_product(product_input: ProductInput):
#     user_input = product_input.user_input
#     product_data = final(user_input)
#     if product_data:
#         products_collection.insert_one(product_data)
#         return {"message": "Product created successfully"}
#     else:
#         raise HTTPException(status_code=404, detail="Product not found")

# # updating an existing product by ID -> PUT /{entities}/:id Update a record. (4/5)
# @app.put("/products/{product_id}")
# def update_product(product_id: str, updated_product: ProductInput):  #test case id: 670d965c94c0676f2a1b2deb
#     result = products_collection.update_one(
#         {"_id": ObjectId(product_id)},
#         {"$set": {"name": updated_product.user_input}}  # updating only name field
#     )
#     if result.matched_count == 0:
#         raise HTTPException(status_code=404, detail="Product not found")
#     return {"message": "Product updated successfully"}

# # deleting a product by ID -> DELETE /{entities}/:id Delete a record. (5/5)
# @app.delete("/products/{product_id}")
# def delete_product(product_id: str): #test case id: 670d965c94c0676f2a1b2deb
#     result = products_collection.delete_one({"_id": ObjectId(product_id)})
#     if result.deleted_count == 0:
#         raise HTTPException(status_code=404, detail="Product not found")
#     return {"message": "Product deleted successfully"}

# # retrieving all products for task -> GET /{entities}/: Retrieve a list of all records. (2/5)
# @app.get("/products/")
# def get_products():
#     products = list(products_collection.find({}))
#     return [product_serializer(product) for product in products]

# # retrieving a single product -> GET /{entities}/:id Retrieve a single record. (3/5)
# @app.get("/products/{product_id}") #test case id: 670d965c94c0676f2a1b2deb
# def get_product(product_id: str):
#     product = products_collection.find_one({"_id": ObjectId(product_id)})
#     if not product:
#         raise HTTPException(status_code=404, detail="Product not found")
#     return product_serializer(product)
