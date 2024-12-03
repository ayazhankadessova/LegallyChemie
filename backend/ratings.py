from bson import ObjectId

"""
@file ratings.py
@briefmodule providing the functionalities to rate products

@details

"""

class CommunityRatingsManager:
    def __init__(self, products_collection):
        self.products_collection = products_collection

    def add_or_update_rating(self, product_id: ObjectId, user_id: str, skin_type: str, rating: int) -> bool:
        #find the product
        product = self.products_collection.find_one({"_id": product_id})
        if not product:
            return False

        #initialize the communityRatings structure
        if "communityRatings" not in product:
            product["communityRatings"] = {}

        if skin_type not in product["communityRatings"]:
            product["communityRatings"][skin_type] = {
                #track user-specific rating
                "userRatings": {}, 
                "totalRating": 0,
                "ratingCount": 0,
            }

        skin_type_data = product["communityRatings"][skin_type]
        
        #action variable for return message in server.py
        action = "added"


        #check if user previously rated product
        previous_rating = skin_type_data["userRatings"].get(user_id)

        if previous_rating is not None:
            #user updating own rating--->adjust totalRating
            skin_type_data["totalRating"] -= previous_rating
            #action set to updated
            action = "updated"

        else:
            # new rating--->increment ratingCount
            skin_type_data["ratingCount"] += 1

        #update with new rating
        skin_type_data["userRatings"][user_id] = rating
        skin_type_data["totalRating"] += rating

        #update product in database
        update_result = self.products_collection.update_one(
            {"_id": product_id},
            {"$set": {f"communityRatings.{skin_type}": skin_type_data}}
        )

        return action if update_result.modified_count > 0 else "update_failed"
    
    def get_community_ratings(self, product_id: ObjectId) -> dict:
        product = self.products_collection.find_one(
            {"_id": product_id},
            {"communityRatings": 1}
        )
        return product.get("communityRatings", {}) if product else {}