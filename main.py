from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from database import init_db, add_ad, get_all_ads
import os

app = Flask(__name__, static_folder='.')
CORS(app)
init_db()

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

@app.route('/api/ads', methods=['GET'])
def get_ads():
    return jsonify(get_all_ads())

@app.route('/api/ads', methods=['POST'])
def create_ad():
    data = request.json
    id = add_ad(data.get('user_id', 0), data.get('title'), '', data.get('price', 0), data.get('contact', ''))
    return jsonify({'id': id}), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))