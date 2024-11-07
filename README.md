# 🌸 Skincare Community Web App 🌸

## 💻 Tech Stack:

### Backend:
- Python (Flask) 🐍
- MongoDB 🛢️
- Auth0 🔒
- GPT API 🤖 (to provide users with insights on ingredient incompatibility)

### Frontend:
- React ⚛️ (with `npm start`)
- Bootstrap 🎨

## 📱 Screens:
- **Homepage**: Login screen to enter the Skincare Community.
- **Product Screen (Fridge)**: Cool, refreshing view of all the saved products in your skincare fridge. ❄️

# Week 05
## Description of data model
## Database: LegallyChemie 
This database tracks users, skincare products, and ingredient compatibility. It includes the following collections:
#### 1. Users
- **auth0Id**: A unique identifier for user authentication.
- **nickname**: The user's display name or preferred name.
- **fridge**: A collection or list of products owned or used by the user, referencing the `products` collection.

#### 2. Products 
- Contains details about skincare products.
- Each product is stored as a key-value pair:
- **Product Name (e.g., "xxx cleanser")**: Key representing the product.
- **Details**: Value that includes information such as:
- **ingredients**: A list of ingredients in the product.

#### 3. Ingredients 
- Each ingredient is a key-value pair where the ingredient name is the key and the value is a list of its associated chemical property tags (e.g. AHA, Retinoid etc.)

#### 4. Rules 
- For the initial stage, we plan the rules DB to foundationally contain each property tag to be a key with a value that is a list with other property tags they are not compatible with (e.g. "AHA": ["BHA", "PHA"])

## Schema diagram 
<img src="https://github.com/Hamza-Anver/LegallyChemie/blob/main/images/schema_draft.jpeg" width="500"> 

## ER model 
<img src="https://github.com/Hamza-Anver/LegallyChemie/blob/main/images/erdiagram.png" width="500"> 


## Instruction on how to start & run DB 
Configuration
Create a .env file in the root of your project directory to store environment variables like your MongoDB connection string. The .env file should look like this:

```bash
DB_STRING="mongodb://<username>:<password>@<host>:<port>/<database>"

Replace <username>, <password>, <host>, <port>, and <database> with your actual MongoDB credentials.
```

# Week 06
## How set-up testing for API endpoints
Please refer to the previous week's **Instruction on how to start & run DB** to know how to set up the DB environment. 
Then, `cd backend` and `pip install requirement.txt` to get all the dependencies installed. After that, inside the **backend** folder, run `python server.py`. Through **postman** (I'm assuming you have this installed since the professor mentioned we'll be using it 👀), try out the following **Postman Tests** in the following section for each endpoint, using the sample `product_id` and `user-input` provided. 😊

## Postman Tests

Check out the `postmen_tests` folder to see labeled test cases for each endpoint scenario. 
In case you don't have the time to go through those, here are the test cases conducted for each, in our case the localhost address by default is set to `http://127.0.0.1:8000/`:

- **Retrieve all records**: 
  - Send a `GET` request to `/products/` to retrieve a list of all products.
  
- **Retrieve a specific record by ID**: 
  - Send a `GET` request to `/products/{product_id}` (replace `{product_id}` with the actual ID) to retrieve a specific product's details.
  - Sample product_id: `670d98eecb7f4d011c14d87e`
  
- **Create a new record**: 
  - Send a `POST` request to `/products/` with a JSON body containing the product details, such as:
    ```json
    {
        "user_input": "L'Oreal Collagen Moisture Filler Daily Moisturizer"
    }
    ```
  
- **Update an existing record**: 
  - Send a `PUT` request to `/products/{product_id}` (replace `{product_id}` with the actual ID) with a JSON body containing the updated details, like:
    ```json
    {
        "user_input": "L'Oreal Professionnel L'oreal Face Primer"
    }
    ```
  - Sample product_id: `670d98eecb7f4d011c14d87e`

- **Delete a record**: 
  - Send a `DELETE` request to `/products/{product_id}` (replace `{product_id}` with the actual ID) to delete a specific product from the database.
  - Sample product_id: `670d98eecb7f4d011c14d87e`

# Week 08 

- **WireFrame Prototype** 
  - https://www.figma.com/design/EDfRWhEi1mNnm3Vwgd8HVj/Wireframing?node-id=40-2&t=VI5CKqNwzFJzjHJA-1
