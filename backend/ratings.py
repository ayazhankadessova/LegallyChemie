from bson import ObjectId

"""
@file ratings.py
@briefmodule providing the functionalities to rate products

@details

"""

class CommunityRatingsManager:
    def __init__(self, users_collection):
        self.users_collection = users_collection

    def add_community_rating(self, product_id: ObjectId, skin_type: str, rating: int) -> bool:
        update_result = self.products_collection.update_one(
            {"_id": product_id},
            {
                "$inc": {
                    f"communityRatings.{skin_type}.totalRating": rating,
                    f"communityRatings.{skin_type}.ratingCount": 1,
                },
                "$set": {
                    f"communityRatings.{skin_type}.averageRating": {
                        "$round": [
                            {"$divide": [
                                f"$communityRatings.{skin_type}.totalRating",
                                f"$communityRatings.{skin_type}.ratingCount"
                            ]},
                            2
                        ]
                    }
                }
            }
        )
        return update_result.modified_count > 0

