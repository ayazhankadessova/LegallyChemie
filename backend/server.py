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
from pprint import pprint
import uvicorn
import os
from ratings import CommunityRatingsManager


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
secret_key = os.getenv("APP_SECRET_KEY")
app.add_middleware(SessionMiddleware, secret_key=secret_key)


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
@brief hardcoded urls
"""
frontend_url = "http://localhost:3000"
api_url = "http://localhost:8000"
# api_port = 8000
# api_host = "legallychemie.onrender.com"

"""
@brief configures CORS to allow requests from the React frontend.
@details allows all HTTP methods and headers from the appropriate url.
"""
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, api_url],
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
    print("Session after saving token:", request.session)

    # debugging
    session_cookie = request.cookies.get("session")
    print("Session Cookie (use in curl):", session_cookie)

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
                    "skin_type": "",
                }
            )
            print("this is a new user")
            return RedirectResponse(f"{frontend_url}/newuser?name={given_name}")
        else:
            print("user already exists")

    # redirecting user back to React app with a success status
    return RedirectResponse(f"{frontend_url}/landing?name={given_name}")


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
                "returnTo": f"{frontend_url}",  # URL to redirect to after logout
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


# function to give product that rating from the user
@app.patch("/{rating}/{product_id}")
async def setting_rating(rating: str, product_id: str, request: Request):
    print("inside rating function")
    print("this is the rating: ", rating)
    user = request.session.get("user")
    user_info = user.get("userinfo", {})
    user_id = user_info.get("sub")

    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found in session")

    user_doc = users_collection.find_one({"auth0_id": user_id})

    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")

    update_result = users_collection.update_one(
        {"auth0_id": user_id}, {"$set": {"rating": rating}}
    )

    # update the rating for the product for that skin type

    if update_result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Failed to update rating")

    return {"message": "Rating updated successfully", "rating": rating}


@app.get("/{day}/products/{product_id}/rating")
async def get_product_rating(day: str, product_id: str, request: Request):
    user = request.session.get("user")
    user_info = user.get("userinfo", {})
    user_id = user_info.get("sub")
    print("getting the rating for this product from this user: ", user_id)

    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found in session")

    user_doc = users_collection.find_one({"auth0_id": user_id})

    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")

    day_products = user_doc.get("products", {}).get(day, [])

    for product in day_products:
        if str(product["_id"]) == product_id:
            product_rating = product.get("rating", 0)
            print("this is the rating: ", product_rating)
            return {"rating": product_rating}

    raise HTTPException(status_code=404, detail="Product not found in user's routine")


@app.patch("/{day}/products/{product_id}/{rating}")
async def update_product_rating(
    day: str, product_id: str, rating: int, request: Request
):
    user = request.session.get("user")
    user_info = user.get("userinfo", {})
    user_id = user_info.get("sub")

    print("my rating being updated to: ", rating)

    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found in session")

    update_result = users_collection.update_one(
        {"auth0_id": user_id, f"products.{day}._id": ObjectId(product_id)},
        {"$set": {f"products.{day}.$.rating": rating}},
    )

    if update_result.modified_count == 0:
        raise HTTPException(
            status_code=404, detail="Product not found or rating unchanged"
        )

    return {"message": "Rating updated successfully"}


@app.get("/skintype")
async def get_skintype(request: Request):
    print("inside get skintype function")
    print("this is the session information: ", request.session)
    user = request.session.get("user")
    user_info = user.get("userinfo", {})
    user_id = user_info.get("sub")

    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found in session")

    user_doc = users_collection.find_one({"auth0_id": user_id})

    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")

    user_skintype = user_doc.get("skin_type", "")
    return {"skin_type": user_skintype}


@app.post("/{skintype}")
async def setting_skintype(skintype: str, request: Request):
    print("inside skintype function")
    print("this is the skin type: ", skintype)
    print("these are all the env variables: ")

    print("this is the request: ", request)
    user = request.session.get("user")
    user_info = user.get("userinfo", {})
    user_id = user_info.get("sub")

    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found in session")

    user_doc = users_collection.find_one({"auth0_id": user_id})

    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")

    update_result = users_collection.update_one(
        {"auth0_id": user_id}, {"$set": {"skin_type": skintype}}
    )

    if update_result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Failed to update skin type")

    return {"message": "Skin type updated successfully", "skin_type": skintype}


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


@app.get("/{day}/rules/")
async def get_user_rules(day: str, request: Request):
    user = request.session.get("user")
    user_info = user.get("userinfo", {})
    user_id = user_info.get("sub")

    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found in session")

    # fetching products for the user and day using session-based user_id
    products = await get_user_products(day, request)

    product_rules = {"avoid": [], "usewith": [], "usewhen": []}
    product_count = 0

    # fetching all the rules given the tags from the products
    for product in products:
        print("Product", product_count, ": ", product.get("name"))
        product_count += 1
        tags = product.get("tags", [])
        print("tags:", tags)
        avoid = []
        usewith = []
        usewhen = []
        count = 0

        for tag in tags:
            rule = rules_collection.find_one({"_id": {"$in": [tag]}})
            print("Rule", count, ": ", rule)
            count += 1
            if rule:
                avoid.extend(rule.get("rules", {}).get("avoid", []))
                print("260", avoid)
                usewith.extend(
                    [
                        {
                            "rule": rule_data,
                            "source": product["id"],
                        }
                        for rule_data in rule.get("rules", {}).get("usewith", [])
                    ]
                )

                if rule.get("rules", {}).get("usewhen", []):
                    for rule_data in rule.get("rules", {}).get("usewhen", []):
                        if rule_data.get("tag") != day:
                            usewhen.append(
                                {
                                    "rule": rule_data,
                                    "source": product["id"],
                                }
                            )

        print("265 Avoid:", avoid)
        for product_comp in products:
            # skip self
            if product_comp["id"] == product["id"]:
                continue
            print("Product Comp:", product_comp.get("tags", []))
            for tag in product_comp.get("tags", []):
                # check with avoid list
                for avoid_rule in avoid:
                    print("Avoid Rule Tag:", avoid_rule["tag"])
                    print("Avoid Rule Message:", avoid_rule["message"])
                    if tag == avoid_rule["tag"]:
                        product_rules["avoid"].append(
                            {
                                "source": product["id"],
                                "comp": product_comp["id"],
                                "rule": avoid_rule,
                                # "og_tag": extracted_other_tag
                            }
                        )
                    for usewith_index in range(len(usewith) - 1, -1, -1):
                        if tag == usewith[usewith_index]["rule"]["tag"]:
                            del usewith[usewith_index]

        product_rules["usewith"].extend(usewith)
        product_rules["usewhen"].extend(usewhen)

    # print("Product Rules for avoid:", product_rules["avoid"])
    # print("Product Rules for usewith:", product_rules["usewith"])
    # print("Product rules for usewhen: ", product_rules["usewhen"])

    # convert product IDs to names for output
    product_names = {product["id"]: product["name"] for product in products}

    product_rules["avoid"] = [
        {
            **rule,
            "source": product_names.get(rule["source"]),
            "source_id:": rule["source"],
            "comp": product_names.get(rule["comp"]),
            "comp_id": rule["comp"],
        }
        for rule in product_rules["avoid"]
    ]
    product_rules["usewith"] = [
        {
            **rule,
            "source": product_names.get(rule["source"]),
            "source_id:": rule["source"],
        }
        for rule in product_rules["usewith"]
    ]

    product_rules["usewhen"] = [
        {
            **rule,
            "source": product_names.get(rule["source"]),
            "source_id:": rule["source"],
        }
        for rule in product_rules["usewhen"]
    ]

    print("Product Rules:", product_rules)
    return product_rules


"""
@fn get_user_products
@brief retrieves all products for a specified user for a given time (AM/PM).
@param user_id the id of the user.
@param day time of day ("AM" or "PM").
@return a list of serialized product dictionaries.
"""


@app.get("/{day}/products/")
async def get_user_products(day: str, request: Request):
    user = request.session.get("user")
    user_info = user.get("userinfo", {})
    user_id = user_info.get("sub")
    # print("298this is the user: ")
    # pprint(user)
    # print("302this is the user's id: ", user_id)

    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found in session")

    user_doc = users_collection.find_one({"auth0_id": user_id})

    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")

    print("User Doc:", user_doc)
    product_ids = user_doc.get("products", [])
    print("Product IDs:", product_ids)

    # fetching product details based on AM or PM
    products = user_doc["products"].get(day, [])
    product_ids = [entry["_id"] for entry in products]
    product_ratings = {str(entry["_id"]): entry["rating"] for entry in products}
    user_products = list(products_collection.find({"_id": {"$in": product_ids}}))

    print(f"User Products for {day}:", user_products)
    for product in user_products:
        product_id_str = str(product["_id"])
        product["rating"] = product_ratings.get(product_id_str, 0)

    return [product_serializer(product) for product in user_products]


"""
@fn create_user_product
@brief adds a new product to a user's product list for a specified time (AM/PM).
@param user_id the id of the user.
@param day time of day ("AM" or "PM").
@param product_input the product input data provided by the user.
@return a message indicating whether a new or existing product was added.
"""


@app.post("/{day}/products/")
async def create_user_product(day: str, product_input: ProductInput, request: Request):
    user_input = product_input.user_input
    product_data = final(user_input)
    user = request.session.get("user")
    user_info = user.get("userinfo", {})
    user_id = user_info.get("sub")

    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found in session")

    if product_data:
        product_name = product_data.get("name")
        product_brand = product_data.get("brand")
        existing_product = products_collection.find_one(
            {"name": product_name, "brand": product_brand}
        )

        if existing_product:
            print("this product already exists")
            product_id = existing_product["_id"]

            # checking if the product is already in the user's AM/PM routine
            user = users_collection.find_one(
                {"auth0_id": user_id, f"products.{day}": product_id}
            )

            if user:
                return {"message": "Product already in user's products list"}
            else:
                # updating user's document to include this product in their products list
                update_result = users_collection.update_one(
                    {"auth0_id": user_id},
                    {
                        "$addToSet": {
                            f"products.{day}": {"_id": product_id, "rating": 0}
                        }
                    },
                )
                print("Update result:", update_result.modified_count)
                message = (
                    "Existing product added to user's products"
                    if update_result.modified_count > 0
                    else "Product already in user's products list"
                )
        else:
            # add tags for products collections according to ingredients collection
            ingredients = product_data.get("ingredients", [])
            tags = []
            for i in ingredients:
                ingredient = i.lower().replace(" ", "")
                ingredient_id = ingredients_collection.find_one({"_id": ingredient})
                if ingredient_id and "categories" in ingredient_id:
                    tags.extend(ingredient_id["categories"])
            tags = list(set(tags))
            product_data["tags"] = tags

            # insert products
            inserted_product = products_collection.insert_one(product_data)
            product_id = inserted_product.inserted_id
            print("New product ID:", product_id)

            update_result = users_collection.update_one(
                {"auth0_id": user_id},
                {"$addToSet": {f"products.{day}": {"_id": product_id, "rating": 0}}},
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


@app.delete("/{day}/products/{product_id}")
async def delete_user_product(day: str, product_id: str, request: Request):
    user = request.session.get("user")
    user_info = user.get("userinfo", {})
    user_id = user_info.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found in session")

    try:
        product_id = ObjectId(product_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid product ID format")

    product_key = f"products.{day}"
    print("this is the product key: ", product_key)
    result = users_collection.update_one(
        {"auth0_id": user_id}, {"$pull": {product_key: {"_id": product_id}}}
    )

    # checking if any documents were modified
    if result.modified_count == 0:
        raise HTTPException(
            status_code=404, detail="Product not found or user not found"
        )

    return {"message": "Product deleted successfully"}


# initialize RatingsManager with the products collection
community_ratings_manager = CommunityRatingsManager(products_collection)

"""
@fn add_community_rating
@brief Adds a community rating for a product based on a user's skin type.
@param day Time of day ("AM" or "PM").
@param product_id The ID of the product to be rated.
@param rating The rating to be given to the product (1-5).
@param request The HTTP request object.
@return A message indicating success or an error if the rating could not be added.
"""


@app.patch("/{day}/products/{product_id}/community-rating/{rating}")
async def add_community_rating(
    day: str, product_id: str, rating: int, request: Request
):
    print("Session Data:", request.session)  # Debugging
    user = request.session.get("user")
    user_info = user.get("userinfo", {})
    user_id = user_info.get("sub")

    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found in session")

    user_doc = users_collection.find_one({"auth0_id": user_id})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")

    skin_type = user_doc.get("skin_type")
    if not skin_type:
        raise HTTPException(status_code=400, detail="User has not set a skin type")

    try:
        product_id = ObjectId(product_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid product ID format")

    if rating < 1 or rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")

    # get action
    action = community_ratings_manager.add_or_update_rating(
        product_id, user_id, skin_type, rating
    )

    if action == "product_not_found":
        raise HTTPException(status_code=404, detail="Product not found")
    elif action == "update_failed":
        raise HTTPException(status_code=500, detail="Failed to update community rating")

    return {
        "message": f"Community rating {action} successfully",
        "rating": rating,
        "skin_type": skin_type,
        "day": day,
    }


"""
@fn get_community_ratings
@brief Retrieves the community ratings for a product by skin type.
@param day Time of day ("AM" or "PM").
@param product_id The ID of the product whose community ratings are being retrieved.
@return A JSON object containing the community ratings by skin type or an error if no ratings exist.
"""


@app.get("/{day}/products/{product_id}/community-ratings")
async def get_community_ratings(day: str, product_id: str):
    try:
        product_id = ObjectId(product_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid product ID format")

    community_ratings = community_ratings_manager.get_community_ratings(product_id)

    if not community_ratings:
        raise HTTPException(
            status_code=404,
            detail="Product not found or no community ratings available",
        )

    return {"communityRatings": community_ratings}


# if __name__ == "__main__":
#     uvicorn.run(app, host=api_host, log_level="info")
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", log_level="info")