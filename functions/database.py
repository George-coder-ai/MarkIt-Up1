from extensions import mongo
from bson.objectid import ObjectId

def get_user_by_email(email):
    return mongo.db.users.find_one({"email": email})

def get_user_by_id(user_id):
    if isinstance(user_id, str):
        user_id = ObjectId(user_id)
    return mongo.db.users.find_one({"_id": user_id})

def create_user(user_data):
    return mongo.db.users.insert_one(user_data)

def get_user_settings(user_id):
    if isinstance(user_id, str):
        user_id = ObjectId(user_id)
    return mongo.db.settings.find_one({"user_id": user_id})

def update_user_settings(user_id, settings_data):
    if isinstance(user_id, str):
        user_id = ObjectId(user_id)
    return mongo.db.settings.update_one(
        {"user_id": user_id},
        {"$set": settings_data},
        upsert=True
    )
