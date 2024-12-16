from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from ..database import db
from .jwt_manager import generate_tokens

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    
    if not all(k in data for k in ['email', 'password', 'username']):
        return jsonify({'message': 'Missing required fields'}), 400
    
    hashed_password = generate_password_hash(data['password'])
    
    try:
        cursor = db.execute(
            """INSERT INTO users (email, password_hash, username) 
               VALUES (?, ?, ?)""",
            (data['email'], hashed_password, data['username'])
        )
        db.commit()
        
        access_token, refresh_token = generate_tokens(cursor.lastrowid)
        
        return jsonify({
            'message': 'User created successfully',
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 201
        
    except Exception as e:
        return jsonify({'message': str(e)}), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    
    if not all(k in data for k in ['email', 'password']):
        return jsonify({'message': 'Missing required fields'}), 400
    
    user = db.execute(
        "SELECT * FROM users WHERE email = ?",
        (data['email'],)
    ).fetchone()
    
    if user and check_password_hash(user['password_hash'], data['password']):
        access_token, refresh_token = generate_tokens(user['id'])
        
        return jsonify({
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 200
        
    return jsonify({'message': 'Invalid credentials'}), 401
