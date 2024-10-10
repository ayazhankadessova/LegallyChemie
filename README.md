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
Create a .env file in the root of your project directory to store environment variables like your MongoDB connection URI. The .env file should look like this:

```bash
DB_STRING="mongodb://<username>:<password>@<host>:<port>/<database>"

Replace <username>, <password>, <host>, <port>, and <database> with your actual MongoDB credentials.