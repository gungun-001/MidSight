"""
SkinDiseasePredictor
====================
Loads a MobileNetV2-based transfer learning model and runs inference.

Model file: backend/model/skin_model.h5
  - If the file exists, it is loaded directly.
  - If it does NOT exist (first run / demo), a fresh MobileNetV2 with random
    classification head is built so the API still returns valid JSON.
    Run `python model/train.py` to produce a properly trained model.

Classes (index → label):
  0 → Acne
  1 → Eczema
  2 → Normal
  3 → Psoriasis

Severity thresholds (applied to the winning class probability):
  < 0.50  → Mild
  0.50–0.75 → Moderate
  ≥ 0.75  → Severe
"""

import os
import logging
import numpy as np

logger = logging.getLogger(__name__)

# Path to the saved Keras model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "skin_model.h5")

# Class labels — must match training order
CLASS_LABELS = ["Acne", "Eczema", "Normal", "Psoriasis"]

# Severity thresholds
SEVERITY_MILD_MAX = 0.50
SEVERITY_MODERATE_MAX = 0.75


class SkinDiseasePredictor:
    """Wraps the Keras model for skin disease classification."""

    def __init__(self):
        self.model = None
        self.is_ready = False

    # ── Load ──────────────────────────────────────────────────────────────────
    def load(self):
        """Load or build the model."""
        # Lazy import TensorFlow to keep startup fast when not needed
        import tensorflow as tf

        if os.path.exists(MODEL_PATH):
            logger.info("Loading saved model from %s", MODEL_PATH)
            self.model = tf.keras.models.load_model(MODEL_PATH)
            logger.info("Saved model loaded ✓")
        else:
            logger.warning(
                "Model file not found at %s — building untrained MobileNetV2 for demo. "
                "Run `python model/train.py` to train a real model.",
                MODEL_PATH,
            )
            self.model = self._build_model()

        self.is_ready = True

    # ── Build (fallback) ──────────────────────────────────────────────────────
    @staticmethod
    def _build_model():
        """
        Build a MobileNetV2 transfer-learning model.
        Used as a fallback when no saved weights are found.
        """
        import tensorflow as tf

        base = tf.keras.applications.MobileNetV2(
            input_shape=(224, 224, 3),
            include_top=False,
            weights="imagenet",
        )
        base.trainable = False  # freeze base for inference

        model = tf.keras.Sequential([
            base,
            tf.keras.layers.GlobalAveragePooling2D(),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.Dense(256, activation="relu"),
            tf.keras.layers.Dropout(0.4),
            tf.keras.layers.Dense(128, activation="relu"),
            tf.keras.layers.Dropout(0.3),
            tf.keras.layers.Dense(len(CLASS_LABELS), activation="softmax"),
        ])

        model.compile(
            optimizer="adam",
            loss="categorical_crossentropy",
            metrics=["accuracy"],
        )
        return model

    # ── Predict ───────────────────────────────────────────────────────────────
    def predict(self, img_array: np.ndarray):
        """
        Run inference on a preprocessed image array.

        Parameters
        ----------
        img_array : np.ndarray
            Shape (1, 224, 224, 3), values in [0, 1] after MobileNetV2 preprocessing.

        Returns
        -------
        tuple of (disease_name: str, confidence: float, severity: str)
        """
        if self.model is None:
            raise RuntimeError("Model is not loaded.")

        # Forward pass
        predictions = self.model.predict(img_array, verbose=0)  # shape: (1, 4)
        probs = predictions[0]  # shape: (4,)

        # Top class
        class_idx = int(np.argmax(probs))
        confidence = float(probs[class_idx])
        disease = CLASS_LABELS[class_idx]

        # Severity based on confidence of the winning class
        severity = self._classify_severity(confidence)

        return disease, confidence, severity

    # ── Severity ──────────────────────────────────────────────────────────────
    @staticmethod
    def _classify_severity(confidence: float) -> str:
        """
        Map confidence score to severity label.

        < 0.50  → Mild
        0.50–0.75 → Moderate
        ≥ 0.75  → Severe
        """
        if confidence < SEVERITY_MILD_MAX:
            return "Mild"
        elif confidence < SEVERITY_MODERATE_MAX:
            return "Moderate"
        else:
            return "Severe"
