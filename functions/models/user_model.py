from datetime import datetime
from bson.objectid import ObjectId

class User:
    @staticmethod
    def create_user_doc(name, email, password_hash):
        return {
            "name": name,
            "email": email,
            "password_hash": password_hash,
            "created_at": datetime.utcnow()
        }

    @staticmethod
    def format_user(user_doc):
        if not user_doc:
            return None
        return {
            "id": str(user_doc["_id"]),
            "name": user_doc.get("name"),
            "email": user_doc.get("email"),
            "created_at": user_doc.get("created_at").isoformat() if user_doc.get("created_at") else None
        }

class Settings:
    @staticmethod
    def create_settings_doc(user_id, preferences=None):
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
        return {
            "user_id": user_id,
            "preferences": preferences or {},
            "updated_at": datetime.utcnow()
        }
