"""
MedSight — AI Skin Diagnostic Inference Script
==============================================
Submission-Ready Version

This script performs real-time classification of skin conditions using a 
MobileNetV2 CNN model. It outputs the disease name, confidence score, 
and severity classification.

Usage:
    python backend/inference.py <image_path>
"""

import os
import sys
import argparse
import logging

# Suppress TensorFlow logging for a cleaner output
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 

try:
    import numpy as np
    import tensorflow as tf
    from PIL import Image
    from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
except ImportError as e:
    print(f"\n[ERROR] Missing dependency: {e.name}")
    print("Please install required packages using:")
    print("pip install tensorflow numpy Pillow")
    sys.exit(1)

# ── Robust Path Configuration ───────────────────────────────────────────────
# Get the absolute path of the directory where this script is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Model is expected at backend/model/skin_model.h5
MODEL_PATH = os.path.join(BASE_DIR, "model", "skin_model.h5")

# Configuration
CLASS_LABELS = ["Acne", "Eczema", "Normal", "Psoriasis"]
IMG_SIZE = (224, 224)

# ── Logic ───────────────────────────────────────────────────────────────────

def get_severity(confidence):
    """Maps model confidence to a clinical severity level."""
    if confidence < 0.50:
        return "Mild"
    elif confidence < 0.75:
        return "Moderate"
    else:
        return "Severe"

def run_inference(image_path):
    # 1. Path Verification
    if not os.path.exists(image_path):
        print(f"\n[ERROR] Image file not found: {image_path}")
        return

    if not os.path.exists(MODEL_PATH):
        print(f"\n[ERROR] Model file not found at: {MODEL_PATH}")
        print("Note: Ensure you have run 'python backend/model/setup_model.py' to train the model.")
        return

    # 2. Model Loading
    print(f"\n[1/3] Loading Neural Engine...")
    try:
        # Using compile=False to avoid issues if custom metrics aren't defined
        model = tf.keras.models.load_model(MODEL_PATH, compile=False)
    except Exception as e:
        print(f"[ERROR] Failed to load model: {e}")
        return

    # 3. Preprocessing
    print(f"[2/3] Preprocessing image: {os.path.basename(image_path)}...")
    try:
        img = Image.open(image_path).convert('RGB')
        img = img.resize(IMG_SIZE)
        img_array = np.array(img).astype(np.float32)
        img_array = np.expand_dims(img_array, axis=0)
        # MobileNetV2 expects input scaled to [-1, 1]
        img_array = preprocess_input(img_array)
    except Exception as e:
        print(f"[ERROR] Image processing failed: {e}")
        return

    # 4. Inference
    print(f"[3/3] Running classification...")
    try:
        predictions = model.predict(img_array, verbose=0)
        probs = predictions[0]
        
        class_idx = np.argmax(probs)
        confidence = float(probs[class_idx])
        disease = CLASS_LABELS[class_idx]
        severity = get_severity(confidence)

        # 5. Result Display
        print("\n" + "+" + "-"*40 + "+")
        print("|" + " MEDSIGHT AI DIAGNOSIS ".center(40) + "|")
        print("+" + "-"*40 + "+")
        print(f"|  Disease:    {disease:<25} |")
        print(f"|  Confidence: {confidence*100:>6.2f}%                    |")
        print(f"|  Severity:   {severity:<25} |")
        print("+" + "-"*40 + "+")
        
        if disease != "Normal":
            print(f"\n[ADVICE] Detected {disease}. Consult a dermatologist for verification.")
        else:
            print(f"\n[ADVICE] Skin appears normal. Maintain your routine and use sunscreen.")

    except Exception as e:
        print(f"[ERROR] Inference failed: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="MedSight Skin Disease Inference Tool",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument("image", help="Path to the JPG/PNG image file for analysis")
    
    # Print custom banner
    print(r"""
    __  ___         _______ _       __    __ 
   /  |/  /__  ____/ / ___/(_)___ _/ /_  / /_
  / /|_/ / _ \/ __  /\__ \/ / __ `/ __ \/ __/
 / /  / /  __/ /_/ /___/ / / /_/ / / / / /_  
/_/  /_/\___/\__,_//____/_/\__, /_/ /_/\__/  
                          /____/             
    """)

    if len(sys.argv) < 2:
        parser.print_help()
        sys.exit(0)

    args = parser.parse_args()
    run_inference(args.image)
