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
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

if __name__ == '__main__':
    app.run()

db = SQLAlchemy(app)

class Guest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image_url = db.Column(db.String)
    date = db.Column(db.String)

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image_url = db.Column(db.String)
    date = db.Column(db.String)

with app.app_context():
    db.create_all()

UPLOAD_FOLDER = 'static/images/guests'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

@app.get('/')
def index():
    return render_template('guest.html')

@app.get('/register')
def register():
    return render_template('register.html')

@app.get('/review')
def review():
    return render_template('review.html')

@app.get('/sitemap')
def sitemap():
    return render_template('sitemap.html')

@app.get('/guests')
def get_guests():
    guests = Guest.query.order_by(desc(Guest.id)).all()  # Retrieve all guest records from the database
    image_urls = [{'url':guest.image_url, 'date':guest.date} for guest in guests]  # Extract the image URLs
    return {'image_urls': image_urls}

@app.get('/reviews')
def get_reviews():
    reviews = Review.query.order_by(desc(Review.id)).all()  # Retrieve all guest records from the database
    image_urls = [{'url':review.image_url, 'date':review.date} for review in reviews]  # Extract the image URLs
    return {'image_urls': image_urls}


@app.post('/upload')
def add_guest():
    # Check if the 'image' field is present in the request
    if 'image' not in request.files:
        return {'error': 'No image found in the request'}, 400

    image = request.files['image']
    date = request.form['date']

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
    guest = Guest(image_url=image_path, date=date)
    db.session.add(guest)
    db.session.commit()

    return {'message': 'Image uploaded and guest record created successfully!'}

@app.post('/upload-review')
def add_review():
    # Check if the 'image' field is present in the request
    if 'image' not in request.files:
        return {'error': 'No image found in the request'}, 400

    image = request.files['image']
    date = request.form['date']

    # Check if the file has an allowed extension
    if not allowed_file(image.filename):
        return {'error': 'Invalid file extension'}, 400

    # Generate a random filename
    extension = image.filename.rsplit('.', 1)[1].lower()
    random_name = ''.join(random.choices(string.ascii_lowercase + string.digits, k=10))
    filename = f"{random_name}.{extension}"
    image_path = os.path.join(UPLOAD_FOLDER, filename)
    image.save(image_path)

    # Create a new review record in the database
    review = Review(image_url=image_path, date=date)
    db.session.add(review)
    db.session.commit()

    return {'message': 'Image uploaded and review created successfully!'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS