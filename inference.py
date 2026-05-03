import os
import sys
import argparse
import numpy as np
import tensorflow as tf
from PIL import Image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

# Configuration
MODEL_PATH = "backend/model/skin_model.h5"
CLASS_LABELS = ["Acne", "Eczema", "Normal", "Psoriasis"]
IMG_SIZE = (224, 224)

# Severity mapping based on confidence
def get_severity(confidence):
    if confidence < 0.50:
        return "Mild"
    elif confidence < 0.75:
        return "Moderate"
    else:
        return "Severe"

def run_inference(image_path):
    if not os.path.exists(MODEL_PATH):
        print(f"Error: Model file not found at {MODEL_PATH}")
        print("Please run 'python backend/model/setup_model.py' first to train the model.")
        return

    # 1. Load Model
    print(f"Loading model from {MODEL_PATH}...")
    try:
        model = tf.keras.models.load_model(MODEL_PATH)
    except Exception as e:
        print(f"Error loading model: {e}")
        return

    # 2. Preprocess Image
    print(f"Preprocessing image: {image_path}...")
    try:
        img = Image.open(image_path).convert('RGB')
        img = img.resize(IMG_SIZE)
        img_array = np.array(img).astype(np.float32)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)
    except Exception as e:
        print(f"Error processing image: {e}")
        return

    # 3. Predict
    print("Running inference...")
    predictions = model.predict(img_array, verbose=0)
    probs = predictions[0]
    
    # 4. Results
    class_idx = np.argmax(probs)
    confidence = float(probs[class_idx])
    disease = CLASS_LABELS[class_idx]
    severity = get_severity(confidence)

    print("\n" + "="*30)
    print("      MEDSIGHT DIAGNOSIS")
    print("="*30)
    print(f"Disease:    {disease}")
    print(f"Confidence: {confidence:.2%}")
    print(f"Severity:   {severity}")
    print("="*30)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="MedSight Inference Script")
    parser.add_argument("image", help="Path to the image file for diagnosis")
    args = parser.parse_args()

    run_inference(args.image)
