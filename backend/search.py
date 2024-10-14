from bs4 import BeautifulSoup
import requests

def search_product(user_input):
    search_url = f"https://incidecoder.com/search?query={user_input}"
    print("search url", search_url)
    
    # Product search URL
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
    print("No results found.")
    return None

def extract_ingredients(product_url):
    response = requests.get(product_url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Extracting ingredients
    ingredients_section = soup.find('div', class_='showmore-section ingredlist-short-like-section')
    ingredients = ingredients_section.find_all('a', class_='ingred-link black')
    
    # Collecting ingredient names
    ingredient_list = [ingredient.text.strip() for ingredient in ingredients]
    return ingredient_list

def get_product_data(user_input):
    product_url = search_product(user_input)
    
    if product_url:
        ingredients = extract_ingredients(product_url)
        print("Ingredients:")
        for ingredient in ingredients:
            print(ingredient)

        # Creating a dictionary to store product name and ingredients
        product_data = {
            "name": user_input,
            "ingredients": ingredients
        }
        return product_data  # Return the product data instead of inserting it into the DB
    else:
        print("No product found.")
        return None

def final(user_input):
    product_data = get_product_data(user_input)  # Call the function to get product data
    print("Product Data:", product_data)  # Print the returned product data
    return product_data