from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
from ..auth.jwt_manager import token_required
from .processor import WatermarkProcessor

watermark_bp = Blueprint('watermark', __name__)
processor = WatermarkProcessor(current_app.config)

@watermark_bp.route('/protect', methods=['POST'])
@token_required
def protect_image(current_user_id):
    if 'image' not in request.files:
        return jsonify({'message': 'No image uploaded'}), 400
        
    file = request.files['image']
    if not file.filename:
        return jsonify({'message': 'No file selected'}), 400
        
    filename = secure_filename(file.filename)
    temp_path = os.path.join(current_app.config['TEMP_PATH'], filename)
    
    try:
        # Save uploaded file
        file.save(temp_path)
        
        # Process image
        options = {
            'visible_text': request.form.get('watermark_text'),
        }
        
        protected_path, metadata = processor.add_watermark(
            temp_path,
            current_user_id,
            options
        )
        
        if protected_path:
            # Log the protection
            db.execute(
                """INSERT INTO artworks (user_id, title, original_path, protected_path, watermark_data)
                   VALUES (?, ?, ?, ?, ?)""",
                (current_user_id, filename, temp_path, protected_path, json.dumps(metadata))
            )
            db.commit()
            
            return jsonify({
                'message': 'Image protected successfully',
                'protected_path': protected_path
            }), 200
            
        return jsonify({'message': 'Protection failed'}), 500
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500
        
    finally:
        # Cleanup temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)
