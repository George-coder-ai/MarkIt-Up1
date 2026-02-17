from flask import Blueprint, request, jsonify
from firebase_service import (
    create_user_with_firebase,
    verify_id_token,
    get_user_by_email as firebase_get_user
)
from database import get_user_by_email, create_user, get_user_by_id
from models.user_model import User
from utils.auth_utils import generate_token
import firebase_admin

firebase_bp = Blueprint('firebase_auth', __name__)

@firebase_bp.route('/signup', methods=['POST'])
def firebase_signup():
    """
    Sign up with Firebase authentication
    Request body: {
        "name": "John Doe",
        "email": "john@example.com",
        "password": "password123"
    }
    """
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email', '').lower().strip()
        password = data.get('password')

        if not name or not email or not password:
            return jsonify({"error": "Missing required fields"}), 400

        # Check if user already exists locally
        if get_user_by_email(email):
            return jsonify({"error": "Email already exists"}), 400

        # Create user in Firebase
        try:
            firebase_user = create_user_with_firebase(email, password)
        except Exception as e:
            return jsonify({"error": str(e)}), 400

        # Also create in local database for metadata
        user_doc = User.create_user_doc(name, email, "firebase:" + firebase_user.uid)
        result = create_user(user_doc)

        if result.inserted_id:
            return jsonify({
                "message": "User created successfully",
                "user": User.format_user({**user_doc, "_id": result.inserted_id}),
                "uid": firebase_user.uid
            }), 201

        return jsonify({"error": "Failed to create user profile"}), 500

    except Exception as e:
        return jsonify({"error": f"Signup failed: {str(e)}"}), 500

@firebase_bp.route('/login', methods=['POST'])
def firebase_login():
    """
    Login endpoint - client sends Firebase ID token
    Request body: {
        "email": "john@example.com",
        "idToken": "firebase_id_token_from_client"
    }
    """
    try:
        data = request.get_json()
        email = data.get('email', '').lower().strip()
        id_token = data.get('idToken')

        if not email or not id_token:
            return jsonify({"error": "Missing email or idToken"}), 400

        # Verify the token with Firebase
        try:
            decoded_token = verify_id_token(id_token)
            firebase_uid = decoded_token['uid']
        except Exception:
            return jsonify({"error": "Invalid or expired token"}), 401

        # Get user from local database
        user = get_user_by_email(email)
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Generate JWT token for our app
        token = generate_token(user['_id'])
        return jsonify({
            "message": "Login successful",
            "access_token": token,
            "user": User.format_user(user)
        }), 200

    except Exception as e:
        return jsonify({"error": f"Login failed: {str(e)}"}), 500

@firebase_bp.route('/me', methods=['GET'])
def get_current_user():
    """
    Get current user info from Firebase token
    Headers: {
        "Authorization": "Bearer firebase_id_token"
    }
    """
    try:
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({"error": "Missing authorization header"}), 401

        token = auth_header.split(' ')[1] if ' ' in auth_header else auth_header

        # Verify Firebase token
        try:
            decoded_token = verify_id_token(token)
        except Exception:
            return jsonify({"error": "Invalid or expired token"}), 401

        email = decoded_token.get('email')
        user = get_user_by_email(email)

        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify(User.format_user(user)), 200

    except Exception as e:
        return jsonify({"error": f"Failed to get user: {str(e)}"}), 500

@firebase_bp.route('/logout', methods=['POST'])
def logout():
    """
    Logout endpoint (client should also clear Firebase session)
    """
    return jsonify({"message": "Logged out successfully"}), 200
