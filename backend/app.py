from flask import Flask, request, jsonify
from tensorflow.keras import datasets, layers, models, Model
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import CountVectorizer
from textblob import TextBlob
from flask_cors import CORS
import pandas as pd
from sklearn.cluster import KMeans
import json

from models.classification import logistic_regression
from models.regression import linear_regression
from models.clustering import kmeans_clustering
from models.pca import pca_analysis
from models.sentiment_analysis import sentiment_analysis
from models.cnn import cnn_predict, initialize_cnn_model
from models.nlp import process_text
from models.tfidf_model import calculate_tfidf
from models.problem_canvas import analyze_responses, question_packets, answer_packets
import logging
from models.visualization import visualization_bp
from models.species_identifier import predict_species
from models.entrepreneurship import analyze_opinion, case_study_questions


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
# Initialize models
cnn_model, intermediate_model = initialize_cnn_model()

# Download necessary NLTK data files
nltk.download('punkt')
nltk.download('wordnet')
nltk.download('stopwords')

# Configure logging
logging.basicConfig(level=logging.DEBUG)
app.register_blueprint(visualization_bp, url_prefix='/api')

@app.route('/entrepreneurship-opinion', methods=['POST'])
def entrepreneurship_opinion():
    try:
        data = request.get_json()
        case_study_index = data['case_study_index']
        user_opinion = data['opinion']
        if case_study_index < 0 or case_study_index >= len(case_study_questions):
            return jsonify({"error": "Invalid case study index"}), 400
        result = analyze_opinion(case_study_index, user_opinion)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/predict-species', methods=['POST'])
def predict_species_endpoint():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    try:
        predictions = predict_species(file)
        return jsonify(predictions)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/problem-canvas', methods=['POST'])
def problem_canvas():
    try:
        data = request.get_json()
        packet_name = data['packet_name']
        question_index = data['question_index']
        user_response = data['response']
        if packet_name not in question_packets or question_index < 0 or question_index >= len(question_packets[packet_name]):
            return jsonify({"error": "Invalid packet name or question index"}), 400
        result = analyze_responses(packet_name, question_index, user_response)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/classification', methods=['POST'])
def classification():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    try:
        result = logistic_regression(file)
        return jsonify(result)
    except ValueError as e:
        app.logger.error(f"Error in classification: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/regression', methods=['POST'])
def regression_endpoint():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    try:
        test_size = float(request.form.get('test_size', 0.2))
        if not (0 < test_size < 1):
            return jsonify({"error": "Test size must be between 0 and 1"}), 400
        mse, actuals, predictions = linear_regression(file, test_size)
        return jsonify({'mse': mse, 'actuals': actuals, 'predictions': predictions})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/clustering', methods=['POST'])
def clustering():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    k = request.form.get('k', 3)
    
    try:
        result = kmeans_clustering(file, k)
        return jsonify(result)
    except ValueError as e:
        app.logger.error(f"Error in clustering: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/pca', methods=['POST'])
def pca():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    try:
        result = pca_analysis(file)
        return jsonify(result)
    except Exception as e:
        app.logger.error(f"Error in PCA: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Endpoint for TF-IDF calculation
@app.route('/tfidf', methods=['POST'])
def tfidf():
    try:
        files = request.files.getlist('files')
        texts = json.loads(request.form.get('texts', '[]'))
        
        # Read the text content from each file
        if files:
            file_texts = [file.read().decode('utf-8') for file in files]
            texts.extend(file_texts)

        if not texts:
            return jsonify({"error": "No texts provided"}), 400

        result = calculate_tfidf(texts)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
        

@app.route('/process-text', methods=['POST'])
def process_text_endpoint():
    data = request.get_json()
    sentence = data.get('sentence', '')
    result = process_text(sentence)
    return jsonify(result)

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    try:
        response = cnn_predict(file, cnn_model, intermediate_model)
        return jsonify(response)
    except Exception as e:
        app.logger.error(f"Error in prediction: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/sentiment-analysis', methods=['POST'])
def sentiment_analysis_endpoint():
    data = request.get_json()
    text = data.get('text', '')
    try:
        result = sentiment_analysis(text)
        return jsonify(result)
    except Exception as e:
        app.logger.error(f"Error in sentiment analysis: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
