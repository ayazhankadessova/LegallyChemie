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

## Description of data model (John)
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

#### 3. Compatibility 
- **ingredients**: A dictionary or list of ingredients with associated properties.
- **incompatible**: Stores ingredient incompatibilities.
- Format: `"A": ["B", "C"]` indicates ingredient A is incompatible with ingredients B and C.

The products collection is linked to the users collection since the user adds products to their fridge. The products collection is also linked to the compatibility collections thorugh the ingredients through the ingredients in the products. 

## Schema diagram (Jhon)
<img src="https://github.com/Hamza-Anver/LegallyChemie/blob/main/images/schema.jpg" width="500"> 

## ER model (Hamza)
<img src="https://github.com/Hamza-Anver/LegallyChemie/blob/main/images/ER_Diagram.png" width="500"> 


## Instruction on how to start & run DB (Sami)
Configuration
Create a .env file in the root of your project directory to store environment variables like your MongoDB connection URI. The .env file should look like this:

```bash
DB_STRING="mongodb://<username>:<password>@<host>:<port>/<database>"

Replace <username>, <password>, <host>, <port>, and <database> with your actual MongoDB credentials.