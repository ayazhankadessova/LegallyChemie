from bson import ObjectId

"""
@file ratings.py
@briefmodule providing the functionalities to rate products

@details

"""

class RatingsManager:
    def __init__(self, users_collection):
        self.users_collection = users_collection
        
