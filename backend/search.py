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

BASE_URL = "https://incidecoder.com"

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
@fn get_product_data_by_url(product_url)
@brief combines product details including brand, name, description, ingredients, and image into a dictionary.

@param user_input name of the product to search for.
@return dictionary containing the product's brand, name, description, ingredients, and image URL, or None if no product is found.
"""
    
def get_product_data_by_url(product_url):
    try:
        # Extract all product information using existing functions
        brand, name, description = extract_name_brand_description(product_url)
        ingredients = extract_ingredients(product_url)
        image_url = extract_image(product_url)
        
        # Create product data dictionary
        product_data = {
            "brand": brand,
            "name": name,
            "description": description,
            "ingredients": ingredients,
            "image": image_url
        }
        return product_data
    except Exception as e:
        print(f"Error getting product data from URL: {e}")
        return None

"""
@fn search_products(user_input, limit=5)
@brief searches for cosmetic products on IncideCoder and returns details for multiple matches.

@param user_input string containing product name/keywords to search for.
@param limit maximum number of search results to return (default 5).

@return list of dictionaries, each containing basic product details:
       - brand: product brand name 
       - name: product name
       - description: truncated product description
       - image: URL of product image
       - url: product page URL
       Returns empty list if no products found or search fails.
"""
def search_products(user_input, limit=5):
    """
    Searches for products and returns multiple results instead of just the first one
    """
    search_url = f"{BASE_URL}/search?query={user_input}"
    response = requests.get(search_url)
    products = []
    
    if response.status_code == 200:
        html_product = BeautifulSoup(response.text, 'html.parser')
        results = html_product.find_all('a', class_='klavika simpletextlistitem')
        
        for result in results[:limit]:  # Limit to first 5 results
            product_link = result['href']
            product_url = f"{BASE_URL}{product_link}"
            
            # Get basic info for search results
            brand, name, description = extract_name_brand_description(product_url)
            image_url = extract_image(product_url)
            
            products.append({
                "brand": brand,
                "name": name,
                "description": description, 
                "image": image_url,
                "url": product_url  # Store URL for fetching full details later
            })
    
    return products