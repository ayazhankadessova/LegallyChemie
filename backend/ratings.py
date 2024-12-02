from bson import ObjectId

"""
@file ratings.py
@briefmodule providing the functionalities to rate products

@details

"""

class RatingsManager:
    def __init__(self, users_collection):
        self.users_collection = users_collection

    #function to update products rating
    def add_rating(self, product_id: ObjectId, rating: int) -> bool:
        update_result = self.products_collection.update_one(
            {"_id": product_id},
            {
                "$inc": {"ratings.totalRating": rating, "ratings.ratingCount": 1},
                "$set": {"ratings.averageRating": {
                    "$round": [
                        {"$divide": ["$ratings.totalRating", "$ratings.ratingCount"]},
                        2
                    ]
                }}
            }
        )
        return update_result.modified_count > 0
    
    #average rating function implemented
    def get_average_rating(self, product_id: ObjectId) -> float:
        product = self.products_collection.find_one({"_id": product_id}, {"ratings": 1})
        if product and "ratings" in product:
            return product["ratings"].get("averageRating", 0.0)
        return 0.0