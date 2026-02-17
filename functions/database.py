from extensions import mongo
from bson.objectid import ObjectId
import os

# In-memory storage for development when MongoDB is not available
_memory_db = {
    'users': [],
    'settings': []
}

def _use_memory_db():
    return os.environ.get('MONGO_URI') is None or 'localhost' in os.environ.get('MONGO_URI', '')

def get_user_by_email(email):
    if _use_memory_db():
        email_lower = email.lower()
        for user in _memory_db['users']:
            if user.get('email', '').lower() == email_lower:
                return user
        return None
    return mongo.db.users.find_one({"email": email.lower()})

def get_user_by_id(user_id):
    if _use_memory_db():
        for user in _memory_db['users']:
            if str(user.get('_id')) == str(user_id):
                return user
        return None
    if isinstance(user_id, str):
        user_id = ObjectId(user_id)
    return mongo.db.users.find_one({"_id": user_id})

def create_user(user_data):
    if _use_memory_db():
        user_data['_id'] = len(_memory_db['users']) + 1  # Simple ID
        _memory_db['users'].append(user_data)
        class MockResult:
            inserted_id = user_data['_id']
        return MockResult()
    return mongo.db.users.insert_one(user_data)

def get_user_settings(user_id):
    if _use_memory_db():
        for setting in _memory_db['settings']:
            if str(setting.get('user_id')) == str(user_id):
                return setting
        return None
    if isinstance(user_id, str):
        user_id = ObjectId(user_id)
    return mongo.db.settings.find_one({"user_id": user_id})

def update_user_settings(user_id, settings_data):
    if _use_memory_db():
        for i, setting in enumerate(_memory_db['settings']):
            if str(setting.get('user_id')) == str(user_id):
                _memory_db['settings'][i].update(settings_data)
                return
        settings_data['user_id'] = user_id
        _memory_db['settings'].append(settings_data)
        class MockResult:
            modified_count = 1
        return MockResult()
    if isinstance(user_id, str):
        user_id = ObjectId(user_id)
    return mongo.db.settings.update_one(
        {"user_id": user_id},
        {"$set": settings_data},
        upsert=True
    )
