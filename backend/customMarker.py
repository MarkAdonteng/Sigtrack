from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)
IMAGES_DIRECTORY = 'images'

@app.route('/images', methods=['GET'])
def list_images():
    def get_directory_structure(rootdir):
        dir_structure = {}
        for root, dirs, files in os.walk(rootdir):
            dir_path = root.replace(rootdir, '').strip(os.sep)
            dir_files = [f for f in files if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif'))]
            if dir_files:
                dir_structure[dir_path] = dir_files
        return dir_structure

    directory_structure = get_directory_structure(IMAGES_DIRECTORY)
    return jsonify(directory_structure)

@app.route('/images/<path:filename>', methods=['GET'])
def get_image(filename):
    return send_from_directory(IMAGES_DIRECTORY, filename)

if __name__ == '__main__':
    app.run(debug=True)
