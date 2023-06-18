from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
from sqlalchemy import desc

import os
import string
import random


app = Flask(__name__)

app.secret_key = "SECRET"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"

db = SQLAlchemy(app)

class Guest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image_url = db.Column(db.String)

with app.app_context():
    db.create_all()

UPLOAD_FOLDER = 'static/images/guests'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

@app.get('/')
def index():
    return render_template('index.html')

@app.get('/guests')
def get_guests():
    guests = Guest.query.order_by(desc(Guest.id)).all()  # Retrieve all guest records from the database
    image_urls = [guest.image_url for guest in guests]  # Extract the image URLs
    return {'image_urls': image_urls}


@app.post('/upload')
def add_guest():
    # Check if the 'image' field is present in the request
    if 'image' not in request.files:
        return {'error': 'No image found in the request'}, 400

    image = request.files['image']

    # Check if the file has an allowed extension
    if not allowed_file(image.filename):
        return {'error': 'Invalid file extension'}, 400

    # Generate a random filename
    extension = image.filename.rsplit('.', 1)[1].lower()
    random_name = ''.join(random.choices(string.ascii_lowercase + string.digits, k=10))
    filename = f"{random_name}.{extension}"
    image_path = os.path.join(UPLOAD_FOLDER, filename)
    image.save(image_path)

    # Create a new guest record in the database
    guest = Guest(image_url=image_path)
    db.session.add(guest)
    db.session.commit()

    return {'message': 'Image uploaded and guest record created successfully!'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS