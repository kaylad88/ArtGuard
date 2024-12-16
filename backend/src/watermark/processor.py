from PIL import Image, ImageDraw, ImageFont
import json
import hashlib
from datetime import datetime
import os

class WatermarkProcessor:
    def __init__(self, config):
        self.config = config
        
    def add_watermark(self, image_path, user_id, options=None):
        """Add both visible and invisible watermarks to image"""
        try:
            with Image.open(image_path) as img:
                # Convert to RGB if necessary
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Add invisible watermark
                metadata = self._create_metadata(user_id)
                img_with_invisible = self._add_invisible_mark(img, metadata)
                
                # Add visible watermark if requested
                if options and options.get('visible_text'):
                    final_img = self._add_visible_mark(
                        img_with_invisible, 
                        options['visible_text']
                    )
                else:
                    final_img = img_with_invisible
                
                # Generate output path
                filename = f"protected_{os.path.basename(image_path)}"
                output_path = os.path.join(
                    self.config['PROTECTED_PATH'],
                    filename
                )
                
                # Save protected image
                final_img.save(output_path, quality=95)
                return output_path, metadata
                
        except Exception as e:
            print(f"Watermarking error: {e}")
            return None, None
    
    def _create_metadata(self, user_id):
        """Create watermark metadata"""
        timestamp = datetime.utcnow().isoformat()
        signature = hashlib.sha256(
            f"{user_id}:{timestamp}".encode()
        ).hexdigest()
        
        return {
            'user_id': user_id,
            'timestamp': timestamp,
            'signature': signature
        }
    
    def _add_invisible_mark(self, img, metadata):
        """Add invisible watermark containing metadata"""
        # Convert metadata to binary string
        metadata_str = json.dumps(metadata)
        binary_data = ''.join(format(ord(c), '08b') for c in metadata_str)
        
        # Add length prefix
        length_bits = format(len(binary_data), '032b')
        binary_data = length_bits + binary_data
        
        # Embed data in image
        pixels = list(img.getdata())
        if len(binary_data) > len(pixels) * 3:
            raise ValueError("Image too small for metadata")
            
        new_pixels = []
        data_idx = 0
        
        for pixel in pixels:
            new_pixel = list(pixel)
            for i in range(3):  # RGB channels
                if data_idx < len(binary_data):
                    # Replace least significant bit
                    new_pixel[i] = (new_pixel[i] & ~1) | int(binary_data[data_idx])
                    data_idx += 1
            new_pixels.append(tuple(new_pixel))
            
            if data_idx >= len(binary_data):
                new_pixels.extend(pixels[len(new_pixels):])
                break
        
        # Create new image with embedded data
        marked_img = Image.new('RGB', img.size)
        marked_img.putdata(new_pixels)
        return marked_img
    
    def _add_visible_mark(self, img, text):
        """Add visible watermark text"""
        draw = ImageDraw.Draw(img)
        width, height = img.size
        
        # Configure font
        font_size = int(min(width, height) / 30)
        try:
            font = ImageFont.truetype("arial.ttf", font_size)
        except:
            font = ImageFont.load_default()
        
        # Calculate text position
        text_bbox = draw.textbbox((0, 0), text, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_height = text_bbox[3] - text_bbox[1]
        
        x = width - text_width - 10
        y = height - text_height - 10
        
        # Add white outline for visibility
        outline_color = 'white'
        for dx, dy in [(-1,-1), (-1,1), (1,-1), (1,1)]:
            draw.text((x + dx, y + dy), text, font=font, fill=outline_color)
        
        # Add main text
        draw.text((x, y), text, font=font, fill='black')
        
        return img


