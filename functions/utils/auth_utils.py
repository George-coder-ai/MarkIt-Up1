from extensions import bcrypt
from flask_jwt_extended import create_access_token

def hash_password(password):
    return bcrypt.generate_password_hash(password).decode('utf-8')

def check_password(password_hash, password):
    return bcrypt.check_password_hash(password_hash, password)

def generate_token(user_id):
    return create_access_token(identity=str(user_id))
