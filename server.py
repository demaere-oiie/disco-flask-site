from datetime import datetime
from flask import Flask, request, send_from_directory
from os import environ

################################################################################

import torch
from pathlib import Path
from PIL import Image
from transformers import CLIPProcessor, CLIPModel

# 1. Load the model
device = "cuda" if torch.cuda.is_available() else "cpu"
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

def classify_rps(image_path):
    image = Image.open(image_path)
    classes = ["a photo of a fist",
               "a photo of a flat hand",
               "a photo of a victory sign"]

    inputs = processor(text=classes, images=image, return_tensors="pt",
                       padding=True).to(device)

    with torch.no_grad():
        outputs = model(**inputs)

        # Calculate probabilities (logits)
        logits_per_image = outputs.logits_per_image
        probs = logits_per_image.softmax(dim=-1)

    r, p, s = probs[0]
    if r >= 0.5: cl = "R"
    elif s >= 0.5: cl = "S"
    elif p >= 0.5 and s <= 0.35: cl = "P"
    else: cl = "S"

    return f"{cl} {image_path} {r:.2f}:{p:.2f}:{s:.2f}"

def classify_oon(image_path):
    image = Image.open(image_path)
    classes = ["a photo of a person",
               "a photo of an octopus"]

    inputs = processor(text=classes, images=image, return_tensors="pt",
                       padding=True).to(device)

    with torch.no_grad():
        outputs = model(**inputs)

        # Calculate probabilities (logits)
        logits_per_image = outputs.logits_per_image
        probs = logits_per_image.softmax(dim=-1)

    s = "<pre>"
    for i, class_name in enumerate(classes):
        s += f"{class_name}: {probs[0][i]*100:.2f}%\n"
    s += "</pre>"
    return s

def classify_rpsd(image_path):
    image = Image.open(image_path)
    classes = ["a photo of a fist",
               "a photo of a flat hand",
               "a photo of a victory sign",
               "a photo of a thing"]

    inputs = processor(text=classes, images=image, return_tensors="pt",
                       padding=True).to(device)

    with torch.no_grad():
        outputs = model(**inputs)

        # Calculate probabilities (logits)
        logits_per_image = outputs.logits_per_image
        probs = logits_per_image.softmax(dim=-1)

    r, p, s, d = probs[0]
    if d >= 0.05: cl = "D"
    elif r >= 0.5: cl = "R"
    elif s >= 0.5: cl = "S"
    elif p >= 0.5 and s <= 0.35: cl = "P"
    else: cl = "D"

    return f"{cl} {image_path} {r:.2f}:{p:.2f}:{s:.2f}:{d:.2f}"

################################################################################

app = Flask(__name__)

@app.route("/dt")
def date_time():
    return f"hello from disco {environ['DISCO_DEPLOYMENT_NUMBER']}!!! the datetime is {datetime.now()}"

@app.route('/oon', methods=['GET', 'POST'])
def upload_oon_file():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        file.save("/tmp/foo")
        return "<pre>"+classify_oon("/tmp/foo")+"</pre><img src='/uploads/foo'>"
    return '''
    <!doctype html>
    <title>Upload new OON</title>
    <h1>Upload new "Oct or Not" image</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''

@app.route('/rps', methods=['GET', 'POST'])
def upload_rps_file():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        file.save("/tmp/foo")
        return "<pre>"+classify_rps("/tmp/foo")+"</pre><img src='/uploads/foo'>"
    return '''
    <!doctype html>
    <title>Upload new RPS</title>
    <h1>Upload new Rock-Paper-Scissors play</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''

@app.route('/rpsd', methods=['GET', 'POST'])
def upload_rpsd_file():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        file.save("/tmp/foo")
        return "<pre>"+classify_rpsd("/tmp/foo")+"</pre><img src='/uploads/foo'>"
    return '''
    <!doctype html>
    <title>Upload new RPSD</title>
    <h1>Upload new Rock-Paper-Scissors-Default image</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''

@app.route('/uploads/<name>')
def download_file(name):
    return send_from_directory('/tmp/',name)

@app.route('/')
def homepage():
    return '''
    <ul>
    <li>current <a href="/dt">datetime</a></li>
    <li>Upload new <a href="/oon">Oct or Not</a> Image</li>
    <li>Upload new <a href="/rps">Rock-Paper-Scissors</a> play</li>
    <li>Upload new <a href="/rpsd">Rock-Paper-Scissors-Default</a> image</li>
    <li>Webcam <a href="/test.htm">snaps</a></li>
    </ul>
    '''

@app.route('/test.htm')
def test_htm():
    return send_from_directory('/tmp/','test.htm')

@app.route('/test.js')
def test_js():
    return send_from_directory('/tmp/','test.js')

if __name__=="__main__":
    if 'DISCO_DEPLOYMENT_NUMBER' not in environ:
        app.run(host="0.0.0.0", port=8080, debug=True, ssl_context="adhoc")
    else:
        app.run(host="0.0.0.0", port=8080, debug=True)
