import firebase_admin
from firebase_admin import credentials, auth
import os
from pathlib import Path

# Initialize Firebase
def init_firebase():
    if not firebase_admin._apps:
        # Get the path to the Firebase key file
        key_path = os.getenv('FIREBASE_KEY_PATH') or os.path.join(
            Path(__file__).parent, 'firebase-key.json'
        )
        
        if os.path.exists(key_path):
            cred = credentials.Certificate(key_path)
            firebase_admin.initialize_app(cred)
            print("Firebase initialized successfully")
        else:
            print(f"Warning: Firebase key not found at {key_path}")

def create_user_with_firebase(email, password):
    """Create a new user in Firebase"""
    try:
        user = auth.create_user(
            email=email,
            password=password
        )
        return user
    except firebase_admin.auth.AuthError as e:
        raise Exception(f"Firebase error: {str(e)}")

def verify_id_token(token):
    """Verify Firebase ID token"""
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except firebase_admin.auth.AuthError as e:
        raise Exception(f"Invalid token: {str(e)}")

def get_user_by_email(email):
    """Get user from Firebase by email"""
    try:
        user = auth.get_user_by_email(email)
        return user
    except firebase_admin.auth.UserNotFoundError:
        return None
    except firebase_admin.auth.AuthError as e:
        raise Exception(f"Firebase error: {str(e)}")

def delete_user(uid):
    """Delete user from Firebase"""
    try:
        auth.delete_user(uid)
        return True
    except firebase_admin.auth.AuthError as e:
        raise Exception(f"Firebase error: {str(e)}")
