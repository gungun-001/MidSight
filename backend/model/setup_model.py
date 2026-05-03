"""
MedSight - Download Dataset + Train Model
"""
import os, sys, shutil, random, logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(SCRIPT_DIR)
DATASET_DIR = os.path.join(BACKEND_DIR, "dataset")
TRAIN_DIR = os.path.join(DATASET_DIR, "train")
VAL_DIR = os.path.join(DATASET_DIR, "val")
RAW_DIR = os.path.join(BACKEND_DIR, "raw_dataset")
MODEL_PATH = os.path.join(SCRIPT_DIR, "skin_model.h5")
TARGET_CLASSES = ["Acne", "Eczema", "Normal", "Psoriasis"]

def download_dataset():
    os.makedirs(RAW_DIR, exist_ok=True)
    if os.path.exists(RAW_DIR) and len(os.listdir(RAW_DIR)) > 0:
        logger.info("Raw dataset already exists, skipping download")
        return True

    # Set token as env var
    token = os.environ.get("KAGGLE_API_TOKEN", "")
    if not token:
        token_file = os.path.join(os.path.expanduser("~"), ".kaggle", "access_token")
        if os.path.exists(token_file):
            with open(token_file) as f:
                token = f.read().strip()
            os.environ["KAGGLE_API_TOKEN"] = token

    try:
        from kaggle.api.kaggle_api_extended import KaggleApi
        api = KaggleApi()
        api.authenticate()
        logger.info("Downloading dermnet dataset (~500MB)... Please wait...")
        api.dataset_download_files("shubhamgoel27/dermnet", path=RAW_DIR, unzip=True)
        logger.info("Dataset downloaded!")
        return True
    except Exception as e:
        logger.error(f"Download failed: {e}")
        return False

def find_and_organize():
    logger.info("Organizing dataset...")
    image_exts = {'.jpg', '.jpeg', '.png', '.bmp', '.webp', '.gif'}
    all_folders = {}
    for root, dirs, files in os.walk(RAW_DIR):
        imgs = [f for f in files if os.path.splitext(f.lower())[1] in image_exts]
        if imgs:
            folder_name = os.path.basename(root).lower().strip()
            all_folders[folder_name] = {"path": root, "count": len(imgs)}

    logger.info(f"Found {len(all_folders)} image folders")

    class_keywords = {
        "Acne": ["acne", "rosacea"],
        "Eczema": ["eczema", "atopic", "dermatitis"],
        "Psoriasis": ["psoriasis", "lichen planus"],
        "Normal": ["normal", "healthy"],
    }

    matched = {}
    for cls, keywords in class_keywords.items():
        best = None
        best_count = 0
        for folder_name, info in all_folders.items():
            for kw in keywords:
                if kw in folder_name and info["count"] > best_count:
                    best = info
                    best_count = info["count"]
                    break
        if best:
            matched[cls] = best
            logger.info(f"  {cls} -> {best_count} images")

    if len(matched) < 2:
        logger.error("Could not match enough classes!")
        logger.info("Available folders (top 20):")
        for name, info in sorted(all_folders.items(), key=lambda x: -x[1]["count"])[:20]:
            logger.info(f"  '{name}' - {info['count']} images")
        return False

    for cls in TARGET_CLASSES:
        os.makedirs(os.path.join(TRAIN_DIR, cls), exist_ok=True)
        os.makedirs(os.path.join(VAL_DIR, cls), exist_ok=True)

    for cls, info in matched.items():
        src = info["path"]
        images = [f for f in os.listdir(src) if os.path.splitext(f.lower())[1] in image_exts]
        random.shuffle(images)
        images = images[:500]
        split = int(len(images) * 0.8)
        for img in images[:split]:
            shutil.copy2(os.path.join(src, img), os.path.join(TRAIN_DIR, cls, img))
        for img in images[split:]:
            shutil.copy2(os.path.join(src, img), os.path.join(VAL_DIR, cls, img))
        logger.info(f"  {cls}: {split} train + {len(images)-split} val")

    # Handle missing Normal
    if len(os.listdir(os.path.join(TRAIN_DIR, "Normal"))) == 0:
        logger.info("Creating synthetic Normal skin images...")
        _create_normal(os.path.join(TRAIN_DIR, "Normal"), 200)
        _create_normal(os.path.join(VAL_DIR, "Normal"), 50)

    logger.info("Dataset organized!")
    return True

def _create_normal(out_dir, count):
    from PIL import Image, ImageFilter
    import numpy as np
    for i in range(count):
        r, g, b = random.randint(170,235), random.randint(130,195), random.randint(95,165)
        arr = np.zeros((224,224,3), dtype=np.uint8)
        arr[:,:,0] = np.clip(r + np.random.randint(-20,20,(224,224)), 0, 255)
        arr[:,:,1] = np.clip(g + np.random.randint(-20,20,(224,224)), 0, 255)
        arr[:,:,2] = np.clip(b + np.random.randint(-20,20,(224,224)), 0, 255)
        img = Image.fromarray(arr).filter(ImageFilter.GaussianBlur(radius=2))
        img.save(os.path.join(out_dir, f"normal_{i:04d}.jpg"), quality=90)

def train_model():
    logger.info("Starting model training (this takes 10-30 min)...")
    sys.path.insert(0, BACKEND_DIR)
    from model.train import train
    train(data_dir=DATASET_DIR, epochs=15, batch_size=32, fine_tune_epochs=8)
    if os.path.exists(MODEL_PATH):
        mb = os.path.getsize(MODEL_PATH) / (1024*1024)
        logger.info(f"Model saved! Size: {mb:.1f} MB")

if __name__ == "__main__":
    print("=" * 60)
    print("  MedSight - Model Setup (Download + Train)")
    print("=" * 60)

    if os.path.exists(MODEL_PATH):
        mb = os.path.getsize(MODEL_PATH) / (1024*1024)
        logger.info(f"Model already exists ({mb:.1f} MB)")
        ans = input("Retrain? (y/n): ").strip().lower()
        if ans != 'y':
            sys.exit(0)

    has_dataset = os.path.exists(TRAIN_DIR) and any(
        os.path.exists(os.path.join(TRAIN_DIR, c)) and len(os.listdir(os.path.join(TRAIN_DIR, c))) > 0
        for c in TARGET_CLASSES
    )

    if not has_dataset:
        if not download_dataset():
            sys.exit(1)
        if not find_and_organize():
            sys.exit(1)

    train_model()
    print("\nDone! Restart backend: python main.py")
