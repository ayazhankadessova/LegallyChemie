from bson import ObjectId

"""
@file ratings.py
@brief Module providing functionalities to manage community ratings for products.

@details
methods to add or update user-specific ratings for products 
and retrieve the aggregated community ratings, categorized by skin types.
"""


class CommunityRatingsManager:
    def __init__(self, products_collection):
        self.products_collection = products_collection

    def add_or_update_rating(self, product_id: ObjectId, user_id: str, skin_type: str, rating: int) -> str:
        #find product in database
        product = self.products_collection.find_one({"_id": product_id})
        if not product:
            return "product_not_found"

        #initialize communityRatings structure
        if "communityRatings" not in product:
            product["communityRatings"] = {}

        if skin_type not in product["communityRatings"]:
            product["communityRatings"][skin_type] = {
                #track user-specific ratings
                "userRatings": {},  
                "totalRating": 0,
                "ratingCount": 0,
            }

        skin_type_data = product["communityRatings"][skin_type]

        if 'userRatings' not in skin_type_data:
            skin_type_data['userRatings'] = {}

        #default action if new rating
        action = "added"  

        #check if user previously rated the product
        previous_rating = skin_type_data["userRatings"].get(user_id)
        if previous_rating is not None:
            #adjust totalRating
            skin_type_data["totalRating"] -= previous_rating
            action = "updated"
        else:
            #increment ratingCount
            skin_type_data["ratingCount"] += 1

        #update new rating
        skin_type_data["userRatings"][user_id] = rating
        skin_type_data["totalRating"] += rating

        #updated product data in the database
        update_result = self.products_collection.update_one(
            {"_id": product_id},
            {"$set": {f"communityRatings.{skin_type}": skin_type_data}}
        )

        return action if update_result.modified_count > 0 else "update_failed"

    def get_community_ratings(self, product_id: ObjectId) -> dict:
        product = self.products_collection.find_one(
            {"_id": product_id},
            {"communityRatings": 1}  # Only retrieve the communityRatings field
        )
        return product.get("communityRatings", {}) if product else {}
