"""
Training Script — MobileNetV2 Transfer Learning
================================================
Trains a skin disease classifier on a dataset structured as:

  dataset/
    train/
      Acne/        ← images
      Eczema/
      Normal/
      Psoriasis/
    val/
      Acne/
      Eczema/
      Normal/
      Psoriasis/

Usage:
  python model/train.py --data_dir ./dataset --epochs 20 --batch_size 32

The trained model is saved to: backend/model/skin_model.h5
"""

import os
import argparse
import logging

import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models, optimizers, callbacks
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing.image import ImageDataGenerator

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

# ── Constants ─────────────────────────────────────────────────────────────────
IMG_SIZE = (224, 224)
CLASS_LABELS = ["Acne", "Eczema", "Normal", "Psoriasis"]
NUM_CLASSES = len(CLASS_LABELS)
MODEL_SAVE_PATH = os.path.join(os.path.dirname(__file__), "skin_model.h5")


def build_model(num_classes: int = NUM_CLASSES) -> tf.keras.Model:
    """Build MobileNetV2 transfer learning model."""
    base_model = MobileNetV2(
        input_shape=(*IMG_SIZE, 3),
        include_top=False,
        weights="imagenet",
    )
    # Phase 1: freeze base
    base_model.trainable = False

    inputs = tf.keras.Input(shape=(*IMG_SIZE, 3))
    x = base_model(inputs, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.BatchNormalization()(x)
    x = layers.Dense(256, activation="relu")(x)
    x = layers.Dropout(0.4)(x)
    x = layers.Dense(128, activation="relu")(x)
    x = layers.Dropout(0.3)(x)
    outputs = layers.Dense(num_classes, activation="softmax")(x)

    model = models.Model(inputs, outputs)
    return model, base_model


def get_data_generators(data_dir: str, batch_size: int):
    """Create augmented training and validation data generators."""
    train_datagen = ImageDataGenerator(
        preprocessing_function=tf.keras.applications.mobilenet_v2.preprocess_input,
        rotation_range=20,
        width_shift_range=0.15,
        height_shift_range=0.15,
        shear_range=0.1,
        zoom_range=0.2,
        horizontal_flip=True,
        brightness_range=[0.8, 1.2],
        fill_mode="nearest",
    )

    val_datagen = ImageDataGenerator(
        preprocessing_function=tf.keras.applications.mobilenet_v2.preprocess_input,
    )

    train_gen = train_datagen.flow_from_directory(
        os.path.join(data_dir, "train"),
        target_size=IMG_SIZE,
        batch_size=batch_size,
        class_mode="categorical",
        classes=CLASS_LABELS,
        shuffle=True,
    )

    val_gen = val_datagen.flow_from_directory(
        os.path.join(data_dir, "val"),
        target_size=IMG_SIZE,
        batch_size=batch_size,
        class_mode="categorical",
        classes=CLASS_LABELS,
        shuffle=False,
    )

    return train_gen, val_gen


def train(data_dir: str, epochs: int, batch_size: int, fine_tune_epochs: int = 10):
    """Full training pipeline with two phases: feature extraction + fine-tuning."""

    logger.info("Building model...")
    model, base_model = build_model()

    # ── Phase 1: Train classification head ───────────────────────────────────
    logger.info("Phase 1: Training classification head (base frozen)...")
    model.compile(
        optimizer=optimizers.Adam(learning_rate=1e-3),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )

    train_gen, val_gen = get_data_generators(data_dir, batch_size)

    cb_list = [
        callbacks.EarlyStopping(patience=5, restore_best_weights=True, monitor="val_accuracy"),
        callbacks.ReduceLROnPlateau(factor=0.5, patience=3, min_lr=1e-6, monitor="val_loss"),
        callbacks.ModelCheckpoint(MODEL_SAVE_PATH, save_best_only=True, monitor="val_accuracy"),
    ]

    history1 = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=epochs,
        callbacks=cb_list,
    )

    # ── Phase 2: Fine-tune top layers of base ─────────────────────────────────
    logger.info("Phase 2: Fine-tuning top 30 layers of MobileNetV2...")
    base_model.trainable = True
    # Freeze all layers except the last 30
    for layer in base_model.layers[:-30]:
        layer.trainable = False

    model.compile(
        optimizer=optimizers.Adam(learning_rate=1e-5),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )

    history2 = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=fine_tune_epochs,
        callbacks=cb_list,
    )

    logger.info("Training complete. Model saved to %s", MODEL_SAVE_PATH)

    # Final evaluation
    val_loss, val_acc = model.evaluate(val_gen)
    logger.info("Final validation accuracy: %.4f | loss: %.4f", val_acc, val_loss)

    return model


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train skin disease classifier")
    parser.add_argument("--data_dir", type=str, default="./dataset",
                        help="Path to dataset directory with train/ and val/ subdirs")
    parser.add_argument("--epochs", type=int, default=20,
                        help="Number of training epochs (phase 1)")
    parser.add_argument("--batch_size", type=int, default=32,
                        help="Batch size")
    parser.add_argument("--fine_tune_epochs", type=int, default=10,
                        help="Number of fine-tuning epochs (phase 2)")
    args = parser.parse_args()

    if not os.path.exists(args.data_dir):
        logger.error("Dataset directory not found: %s", args.data_dir)
        logger.info("Please structure your dataset as:")
        logger.info("  dataset/train/{Acne,Eczema,Normal,Psoriasis}/")
        logger.info("  dataset/val/{Acne,Eczema,Normal,Psoriasis}/")
        exit(1)

    train(args.data_dir, args.epochs, args.batch_size, args.fine_tune_epochs)
