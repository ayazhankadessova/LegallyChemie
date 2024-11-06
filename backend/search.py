from bs4 import BeautifulSoup
import requests

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

def extract_ingredients(product_url):
    response = requests.get(product_url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    ingredients_section = soup.find('div', class_='showmore-section ingredlist-short-like-section')
    ingredients = ingredients_section.find_all('a', class_='ingred-link black')
    
    ingredient_list = [ingredient.text.strip() for ingredient in ingredients]
    return ingredient_list

def extract_image(product_url):
    response = requests.get(product_url)
    soup = BeautifulSoup(response.text, 'html.parser')
    picture_tag = soup.find('picture')
    image_tag = picture_tag.find('img')
    image_url = image_tag.get('src')
    return image_url

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

def final(user_input):
    product_data = get_product_data(user_input)  
    print("Product Data:", product_data) 
    return product_data
