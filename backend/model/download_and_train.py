"""
Download & Train Script for MedSight Skin Disease Model
=======================================================
Downloads a skin disease dataset from Kaggle and trains the MobileNetV2 model.

Prerequisites:
  1. pip install kaggle
  2. Place kaggle.json in ~/.kaggle/ (or C:\\Users\\<you>\\.kaggle\\kaggle.json on Windows)
     - Go to https://www.kaggle.com/settings → API → Create New Token

Usage:
  python model/download_and_train.py
"""

import os
import sys
import shutil
import logging
import glob
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(SCRIPT_DIR)
DATASET_DIR = os.path.join(BACKEND_DIR, "dataset")
TRAIN_DIR = os.path.join(DATASET_DIR, "train")
VAL_DIR = os.path.join(DATASET_DIR, "val")
RAW_DIR = os.path.join(BACKEND_DIR, "raw_dataset")

# Our 4 classes
TARGET_CLASSES = ["Acne", "Eczema", "Normal", "Psoriasis"]

# Mapping: common folder names in Kaggle datasets → our class names
CLASS_ALIASES = {
    # Acne
    "acne": "Acne",
    "acne and rosacea photos": "Acne",
    "acne-and-rosacea-photos": "Acne",
    "acne_and_rosacea": "Acne",
    # Eczema
    "eczema": "Eczema",
    "eczema photos": "Eczema",
    "eczema-photos": "Eczema",
    "atopic dermatitis": "Eczema",
    "atopic-dermatitis": "Eczema",
    "atopic_dermatitis": "Eczema",
    # Psoriasis
    "psoriasis": "Psoriasis",
    "psoriasis pictures lichen planus and related diseases": "Psoriasis",
    "psoriasis-pictures-lichen-planus-and-related-diseases": "Psoriasis",
    "psoriasis_lichen_planus": "Psoriasis",
    # Normal
    "normal": "Normal",
    "normal skin": "Normal",
    "healthy": "Normal",
}


def download_dataset():
    """Download skin disease dataset from Kaggle."""
    try:
        import kaggle
    except ImportError:
        logger.error("kaggle package not found. Install it: pip install kaggle")
        logger.info("Also make sure kaggle.json is in ~/.kaggle/ folder")
        logger.info("Get it from: https://www.kaggle.com/settings → API → Create New Token")
        sys.exit(1)

    # Try multiple dataset slugs
    datasets_to_try = [
        "shubhamgoel27/dermnet",
        "ismailpromus/skin-diseases-image-dataset",
        "riyaelizashaju/skin-disease-classification-image-dataset",
    ]

    os.makedirs(RAW_DIR, exist_ok=True)

    for dataset_slug in datasets_to_try:
        try:
            logger.info(f"Trying to download: {dataset_slug}")
            kaggle.api.authenticate()
            kaggle.api.dataset_download_files(dataset_slug, path=RAW_DIR, unzip=True)
            logger.info(f"✓ Downloaded {dataset_slug}")
            return True
        except Exception as e:
            logger.warning(f"Failed to download {dataset_slug}: {e}")
            continue

    logger.error("Could not download any dataset. Please download manually.")
    return False


def find_image_folders(root_dir):
    """Recursively find folders containing images."""
    image_extensions = {'.jpg', '.jpeg', '.png', '.bmp', '.webp'}
    result = {}

    for dirpath, dirnames, filenames in os.walk(root_dir):
        images = [f for f in filenames if os.path.splitext(f.lower())[1] in image_extensions]
        if len(images) >= 5:  # At least 5 images
            folder_name = os.path.basename(dirpath).lower().strip()
            result[folder_name] = {
                "path": dirpath,
                "count": len(images),
            }

    return result


def organize_dataset():
    """Organize downloaded dataset into our train/val structure."""
    logger.info("Organizing dataset...")

    # Find all image folders
    folders = find_image_folders(RAW_DIR)
    logger.info(f"Found {len(folders)} folders with images")

    if not folders:
        logger.error("No image folders found in raw_dataset/")
        return False

    # Create output directories
    for cls in TARGET_CLASSES:
        os.makedirs(os.path.join(TRAIN_DIR, cls), exist_ok=True)
        os.makedirs(os.path.join(VAL_DIR, cls), exist_ok=True)

    # Match folders to our classes
    matched = {}
    for folder_name, info in folders.items():
        target_class = CLASS_ALIASES.get(folder_name)
        if target_class:
            if target_class not in matched or info["count"] > matched[target_class]["count"]:
                matched[target_class] = info
                logger.info(f"  Matched '{folder_name}' → {target_class} ({info['count']} images)")

    if not matched:
        # Try partial matching
        logger.info("Trying partial name matching...")
        for folder_name, info in folders.items():
            for alias, target in CLASS_ALIASES.items():
                if alias in folder_name or folder_name in alias:
                    if target not in matched or info["count"] > matched[target]["count"]:
                        matched[target] = info
                        logger.info(f"  Partial match '{folder_name}' → {target} ({info['count']} images)")
                        break

    if len(matched) < 2:
        logger.error(f"Only matched {len(matched)} classes. Need at least 2.")
        logger.info("Available folders:")
        for name, info in sorted(folders.items()):
            logger.info(f"  '{name}' — {info['count']} images")
        return False

    # Copy images with 80/20 train/val split
    import random
    image_extensions = {'.jpg', '.jpeg', '.png', '.bmp', '.webp'}

    for cls, info in matched.items():
        src_dir = info["path"]
        images = [f for f in os.listdir(src_dir)
                  if os.path.splitext(f.lower())[1] in image_extensions]

        random.shuffle(images)
        split_idx = int(len(images) * 0.8)
        train_imgs = images[:split_idx]
        val_imgs = images[split_idx:]

        for img in train_imgs:
            shutil.copy2(os.path.join(src_dir, img), os.path.join(TRAIN_DIR, cls, img))
        for img in val_imgs:
            shutil.copy2(os.path.join(src_dir, img), os.path.join(VAL_DIR, cls, img))

        logger.info(f"  {cls}: {len(train_imgs)} train + {len(val_imgs)} val = {len(images)} total")

    # Handle missing "Normal" class by creating synthetic samples if needed
    normal_train = os.path.join(TRAIN_DIR, "Normal")
    if len(os.listdir(normal_train)) == 0:
        logger.warning("No 'Normal' skin images found. Creating placeholder with solid skin-tone images...")
        _create_normal_placeholders(normal_train, os.path.join(VAL_DIR, "Normal"))

    logger.info("✓ Dataset organized!")
    return True


def _create_normal_placeholders(train_dir, val_dir, count=50):
    """Create simple placeholder images for 'Normal' class if no real images found."""
    try:
        from PIL import Image
        import random

        for i in range(count):
            # Random skin-tone color
            r = random.randint(180, 230)
            g = random.randint(140, 190)
            b = random.randint(100, 160)

            img = Image.new('RGB', (224, 224), (r, g, b))
            # Add slight variation
            pixels = img.load()
            for x in range(224):
                for y in range(224):
                    nr = min(255, max(0, r + random.randint(-15, 15)))
                    ng = min(255, max(0, g + random.randint(-15, 15)))
                    nb = min(255, max(0, b + random.randint(-15, 15)))
                    pixels[x, y] = (nr, ng, nb)

            target = train_dir if i < int(count * 0.8) else val_dir
            img.save(os.path.join(target, f"normal_placeholder_{i}.jpg"))

        logger.info(f"  Created {count} placeholder normal skin images")
    except Exception as e:
        logger.warning(f"Could not create placeholders: {e}")


def train_model():
    """Run the training script."""
    logger.info("Starting model training...")

    # Check dataset exists
    for cls in TARGET_CLASSES:
        train_cls = os.path.join(TRAIN_DIR, cls)
        if not os.path.exists(train_cls) or len(os.listdir(train_cls)) == 0:
            logger.warning(f"Warning: No training images for class '{cls}'")

    # Import and run training
    sys.path.insert(0, BACKEND_DIR)
    from model.train import train

    model = train(
        data_dir=DATASET_DIR,
        epochs=15,
        batch_size=32,
        fine_tune_epochs=8,
    )

    logger.info("✓ Training complete! Model saved to model/skin_model.h5")
    logger.info("Restart the backend server: python main.py")


if __name__ == "__main__":
    print("=" * 60)
    print("  MedSight — Dataset Download & Model Training")
    print("=" * 60)

    # Step 1: Download
    if not os.path.exists(DATASET_DIR) or len(os.listdir(DATASET_DIR)) == 0:
        if os.path.exists(RAW_DIR) and os.listdir(RAW_DIR):
            logger.info("Raw dataset already downloaded, skipping download.")
        else:
            logger.info("Step 1: Downloading dataset from Kaggle...")
            success = download_dataset()
            if not success:
                print("\n" + "=" * 60)
                print("  MANUAL DOWNLOAD REQUIRED")
                print("=" * 60)
                print(f"\n1. Go to one of these Kaggle datasets:")
                print(f"   - https://www.kaggle.com/datasets/shubhamgoel27/dermnet")
                print(f"   - https://www.kaggle.com/datasets/ismailpromus/skin-diseases-image-dataset")
                print(f"\n2. Click 'Download' and extract the zip")
                print(f"\n3. Put the extracted folders in:")
                print(f"   {RAW_DIR}")
                print(f"\n4. Run this script again")
                sys.exit(1)

        # Step 2: Organize
        logger.info("Step 2: Organizing dataset...")
        if not organize_dataset():
            sys.exit(1)
    else:
        logger.info("Dataset already organized, skipping to training.")

    # Step 3: Train
    logger.info("Step 3: Training model...")
    train_model()
