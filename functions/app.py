import os
from flask import Flask, jsonify
from config import Config
from extensions import mongo, jwt, bcrypt, cors
from routes.auth_routes import auth_bp
from database import _memory_db, _use_memory_db

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    mongo.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({"status": "healthy", "service": "MarkItUp AI Backend"}), 200

    @app.route('/db-check', methods=['GET'])
    def db_check():
        try:
            # For in-memory DB, just return success
            if os.environ.get('MONGO_URI') is None or 'localhost' not in os.environ.get('MONGO_URI', ''):
                return jsonify({"status": "connected", "database": "In-Memory DB"}), 200
            # Ping the database
            mongo.db.command('ping')
            return jsonify({"status": "connected", "database": "MongoDB"}), 200
        except Exception as e:
            return jsonify({"status": "disconnected", "error": str(e)}), 500

    @app.route('/debug/users', methods=['GET'])
    def debug_users():
        """Debug endpoint to see users in memory DB"""
        if _use_memory_db():
            users = []
            for user in _memory_db['users']:
                users.append({
                    "_id": user.get("_id"),
                    "name": user.get("name"),
                    "email": user.get("email"),
                    "password_hash": user.get("password_hash")[:20] + "..." if user.get("password_hash") else None
                })
            return jsonify({"users": users}), 200
        return jsonify({"error": "Not using in-memory DB"}), 400

    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=Config.DEBUG)
