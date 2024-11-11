from bs4 import BeautifulSoup
import requests

"""
@file search.py
@briefmodule providing the functionalities to search for and scrape product information from the Incidecoder website.

@details
enables searching for a product by name, extracting details such as brand name, product name, description, ingredients, and image.
uses BeautifulSoup and requests to scrape data from the  Incidecoder website based on user input. 
primary purpose is to support product data retrieval for applications requiring skincare product information.
"""


"""
@fn search_product(user_input)
@brief searches for a product on Incidecoder based on user input and retrieves the first result's URL.

@param user_input name of the product to search for.
@return URL of the first product result on Incidecoder, or None if no results are found.
"""
def search_product(user_input):
    search_url = f"https://incidecoder.com/search?query={user_input}"
    # print("search url", search_url)
    
    # Product search URL
    response = requests.get(search_url)
    if response.status_code == 200: 
        html_product = BeautifulSoup(response.text, 'html.parser')
        first_result = html_product.find('a', class_='klavika simpletextlistitem')  
        # print("first result", first_result)

        if first_result:
            product_link = first_result['href']
            # print("product link", product_link)
            product_url = f"https://incidecoder.com{product_link}" 
            # print("product url", product_url)
            return product_url
    print("No results found.")
    return None

"""
@fn extract_name_brand_description(product_url)
@brief extracts the brand name, product name, and description from a product page on Incidecoder.

@param product_url URL of the product page.
@return tuple containing the brand name, product name, and description.
"""
def extract_name_brand_description(product_url):
    response = requests.get(product_url)
    soup = BeautifulSoup(response.text, 'html.parser')
    brand_name_section = soup.find('a', class_='underline')
    brand_name = brand_name_section.text.strip() if brand_name_section else "Brand not found"
    product_name_section = soup.find('span', id='product-title')
    product_name = product_name_section.text.strip() if product_name_section else "Name not found"
    description_section = soup.find('span', id='product-details')
    description = description_section.text.strip() if description_section else "Description not found"
    return brand_name, product_name, description

"""
@fn extract_ingredients(product_url)
@brief extracts the list of ingredients from a product page on Incidecoder.

@param product_url URL of the product page.
@return list of ingredients for the product.
"""
def extract_ingredients(product_url):
    response = requests.get(product_url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    ingredients_section = soup.find('div', class_='showmore-section ingredlist-short-like-section')
    ingredients = ingredients_section.find_all('a', class_='ingred-link black')
    
    ingredient_list = [ingredient.text.strip() for ingredient in ingredients]
    return ingredient_list

"""
@fn extract_image(product_url)
@brief extracts the image URL of a product from its page on Incidecoder.

@param product_url URL of the product page.
@return URL of the product image.
"""
def extract_image(product_url):
    response = requests.get(product_url)
    soup = BeautifulSoup(response.text, 'html.parser')
    picture_tag = soup.find('picture')
    image_tag = picture_tag.find('img')
    image_url = image_tag.get('src')
    return image_url

"""
@fn get_product_data(user_input)
@brief combines product details including brand, name, description, ingredients, and image into a dictionary.

@param user_input name of the product to search for.
@return dictionary containing the product's brand, name, description, ingredients, and image URL, or None if no product is found.
"""
def get_product_data(user_input):
    product_url = search_product(user_input)
    
    if product_url:
        brand, name, description = extract_name_brand_description(product_url)
        ingredients = extract_ingredients(product_url)
        image_url = extract_image(product_url)
        # print("Ingredients:")
        # for ingredient in ingredients:
        #     print(ingredient)
        # print("Image URL:", image_url)
        # Creating a dictionary to store product name and ingredients
        product_data = {
            "brand": brand,
            "name": name,
            "description": description,
            "ingredients": ingredients,
            "image": image_url
        }
        return product_data  
    else:
        print("No product found.")
        return None

"""
@fn final(user_input)
@brief retrieves and prints complete product data for the specified user input.

@param user_input name or keywords of the product to search for.
@return dictionary containing product data, or None if no product is found.
"""
def final(user_input):
    product_data = get_product_data(user_input)  
    print("Product Data:", product_data) 
    return product_data
