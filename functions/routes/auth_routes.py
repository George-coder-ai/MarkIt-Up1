from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import get_user_by_email, create_user, get_user_by_id
from models.user_model import User
from utils.auth_utils import hash_password, check_password, generate_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    if get_user_by_email(email):
        return jsonify({"error": "Email already exists"}), 400

    password_hash = hash_password(password)
    user_doc = User.create_user_doc(name, email, password_hash)
    result = create_user(user_doc)

    if result.inserted_id:
        token = generate_token(result.inserted_id)
        return jsonify({
            "message": "User created successfully",
            "access_token": token,
            "user": User.format_user({**user_doc, "_id": result.inserted_id})
        }), 201
    
    return jsonify({"error": "Failed to create user"}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    user = get_user_by_email(email)
    if not user or not check_password(user['password_hash'], password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = generate_token(user['_id'])
    return jsonify({
        "message": "Login successful",
        "access_token": token,
        "user": User.format_user(user)
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = get_user_by_id(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    return jsonify(User.format_user(user)), 200
