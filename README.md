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
- **Components**
  1. `navbar.js` (Nav): This is the navigation bar which gives the user the option to go back or logout at any given page. The title at the center of the navbar is dynamically rendered depending on what `{name}` or `{banner}` is passed to be displayed on the given page. 
  2. `product_list.js` (ProductList): This is the mapping of all products for the given user. It gets the the users products from the API endpoint `@app.get("/{user_id}/products/")` then displays the image of the products on the cards where the user can click on the `view` button once on hover. 
  3. `product_view.js` (ProductCard): This component is the card that pops up on the right column of the screen once the user clicks on the `view` button on the product inside the fridge. This takes the ObjectID of the product that is stored in the user's product array (in the `users_collection`), then searches it in the `products_collection`. Once found, it displays the information onto the card. There is also a `remove from my routine` button that the user can click on to delete it from their products array. This will call the `@app.delete("/{user_id}/products/{product_id}")` API endpoint to delete the given product based on their ObjectID from the user's product array in the database. 
  4. `searchbar.js` (SearchBar): This component provides an input field and an "Add Product" button, allowing users to add products by name. On submission, it sends a `POST` request to `/{user_id}/products/` with the product name. 
    - **State Management**: 
      - `inputValue`: Tracks the text entered by the user.
      - `errorMessage`: Displays any errors (e.g., blank input or product not found).

    - **Functionality**:
      - Validates input and sends the product name. If added successfully, it calls `onProductAdded` to notify the parent component, clears the input, and reloads the page. If there’s an error, it displays a message.

- **Design decisions & Technical choices**
  - Design: We wanted to stay true to the project name and theme and stayed with the originally envisioned color palette, largely consisting of pink and purple. The fonts chosen are Roboto and Montserrat in the fridge page while the homepage and landing page uses Inter as their main font. Most if not all cards (rectangles) created have a border-radius, again, staying aligned with our vision on a more softer vibe and aesthetic for the website. We hope to integrate our designed mascot in furhter components that we add on.
  - Technical: We are using Next.js because we are more familiar with its directory structure (ie file-based routing system) and for additional benefits such as image optimization and automatic code splitting, both of which help with the website's efficiency. Furthermore, we use tailwindcss for parts where we want to implement a pre-set or singular css design (e.g. uppercase) while also using css files for more micro-adjustments we want to make. Lastly, we split up the backend into two python files, one which is the server while the other is serves as a web-scrapping module imported into the `server.py`.

- **How to Run (mock data integration)** 
Since our backend is already connected to our frontend, you won't need to set up the mock data integration but rather simply run it normally. Here's how to do it:
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Hamza-Anver/LegallyChemie.git
   ```
   
2. **Navigate to the project directory**:
Open 2 terminals, then navigate to `LegallyChemie/frontend` in one of them and `LegallyChemie/backend` on the other one.
   ```bash
   cd LegallyChemie/backend
   cd LegallyChemie/frontend
   ```
3. **Create your .env file in the backend directory**:
   Inside the `.env` file, put:

   ```
   DB_STRING='YOUR-DB-STRING'
   AUTH0_CLIENT_ID='YOUR-ID'
   AUTH0_CLIENT_SECRET='YOUR-SECRET'
   AUTH0_DOMAIN='YOUR-DOMAIN'
   APP_SECRET_KEY='legallchemie'
   ```
4. **Install dependencies**:
   for the frontend do:
   ```bash
   npm install
   ```
   and for the backend do:
   ```bash
   pip install -r requirements.txt
   ```

5. **Run the application**:
   for the backend do:
    ```bash
   python server.py
   ```
   and for the frontend do:
   ```bash
   npm run build
   npm start
   ```


Now open your browser and go to `http://localhost:3000` & then start clicking. 😄

- **WireFrame Prototype** 
  - https://www.figma.com/design/EDfRWhEi1mNnm3Vwgd8HVj/Wireframing?node-id=40-2&t=VI5CKqNwzFJzjHJA-1
- **AI Usage**: Credits to copilot, W3Schools, and [React](https://react.dev/learn/managing-state) for helping us write and design. 
