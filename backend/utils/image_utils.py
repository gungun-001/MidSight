"""
Image Utilities
===============
Validation and preprocessing helpers for uploaded skin images.
"""

import io
import logging
from typing import Optional

import numpy as np
from PIL import Image, UnidentifiedImageError

logger = logging.getLogger(__name__)

# ── Constants ─────────────────────────────────────────────────────────────────
TARGET_SIZE = (224, 224)          # MobileNetV2 input size
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
ALLOWED_MIME_TYPES = {
    "image/jpeg", "image/jpg", "image/png", "image/webp",
}


def validate_image(image_bytes: bytes, content_type: Optional[str] = None) -> Optional[str]:
    """
    Validate uploaded image bytes.

    Returns an error message string if invalid, or None if valid.
    """
    # Size check
    if len(image_bytes) > MAX_FILE_SIZE:
        return f"File too large ({len(image_bytes) / 1024 / 1024:.1f} MB). Maximum allowed is 10 MB."

    # MIME type check (if provided by client)
    if content_type and content_type.lower() not in ALLOWED_MIME_TYPES:
        return f"Unsupported file type '{content_type}'. Please upload JPG, PNG, or WebP."

    # Attempt to open with Pillow to verify it's a real image
    try:
        img = Image.open(io.BytesIO(image_bytes))
        img.verify()  # Checks for corruption
    except UnidentifiedImageError:
        return "File does not appear to be a valid image."
    except Exception as exc:
        return f"Image validation failed: {str(exc)}"

    return None  # All good


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """
    Preprocess raw image bytes for MobileNetV2 inference.

    Steps:
      1. Decode bytes → PIL Image
      2. Convert to RGB (handles RGBA, grayscale, etc.)
      3. Resize to 224×224
      4. Convert to float32 numpy array
      5. Apply MobileNetV2 preprocessing (scale to [-1, 1])
      6. Add batch dimension → shape (1, 224, 224, 3)

    Returns
    -------
    np.ndarray of shape (1, 224, 224, 3)
    """
    # Lazy import TensorFlow preprocessing
    from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

    # Open image
    img = Image.open(io.BytesIO(image_bytes))

    # Ensure RGB (3 channels)
    if img.mode != "RGB":
        img = img.convert("RGB")

    # Resize to model input size using high-quality resampling
    img = img.resize(TARGET_SIZE, Image.LANCZOS)

    # Convert to numpy array
    img_array = np.array(img, dtype=np.float32)  # shape: (224, 224, 3)

    # Apply MobileNetV2 preprocessing: scales pixels to [-1, 1]
    img_array = preprocess_input(img_array)

    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)  # shape: (1, 224, 224, 3)

    logger.debug("Preprocessed image shape: %s, dtype: %s", img_array.shape, img_array.dtype)
    return img_array
