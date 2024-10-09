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

## Schema diagram (Jhon)
<img src="https://github.com/Hamza-Anver/LegallyChemie/blob/main/images/schema.jpg" width="500"> 

## ER model (Hamza)
<img src="https://github.com/Hamza-Anver/LegallyChemie/blob/main/images/erdiagram.png" width="500"> 


## Instruction on how to start & run DB (Sami)
Configuration
Create a .env file in the root of your project directory to store environment variables like your MongoDB connection URI. The .env file should look like this:

```bash
DB_STRING="mongodb://<username>:<password>@<host>:<port>/<database>"

Replace <username>, <password>, <host>, <port>, and <database> with your actual MongoDB credentials.