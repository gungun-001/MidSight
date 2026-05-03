"""
AI-Based Skin Disease Detection and Severity Analysis System
FastAPI Backend — Main entry point

Endpoints:
  GET  /health   → Health check
  POST /predict  → Image classification + severity analysis
  POST /chat     → AI chatbot for skin disease questions
"""

import os
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from typing import Optional, List
from model.predictor import SkinDiseasePredictor
from utils.image_utils import validate_image, preprocess_image
from utils.suggestions import get_suggestions

from dotenv import load_dotenv
load_dotenv()

# ── Logging ──────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

# ── Global predictor instance ─────────────────────────────────────────────────
predictor: Optional[SkinDiseasePredictor] = None

# ── Groq client ───────────────────────────────────────────────────────────────
groq_client = None
try:
    from groq import Groq
    api_key = os.getenv("GROQ_API_KEY")
    if api_key:
        groq_client = Groq(api_key=api_key)
        logger.info("Groq client initialized ✓")
    else:
        logger.warning("GROQ_API_KEY not set — chatbot disabled.")
except ImportError:
    logger.warning("groq package not installed — chatbot disabled.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the ML model on startup, release on shutdown."""
    global predictor
    logger.info("Loading skin disease detection model...")
    predictor = SkinDiseasePredictor()
    predictor.load()
    logger.info("Model loaded successfully ✓")
    yield
    logger.info("Shutting down — releasing model resources.")
    predictor = None


# ── FastAPI app ───────────────────────────────────────────────────────────────
app = FastAPI(
    title="AI Skin Disease Detection API",
    description="Deep learning-powered skin disease classification and severity analysis",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow the Vite dev server and production frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev
        "http://localhost:4173",   # Vite preview
        "https://*.vercel.app",    # Vercel deployment
        "*",                       # Open for demo; restrict in production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request Models ────────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    context: Optional[str] = None  # Optional diagnosis context


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/health", tags=["System"])
async def health_check():
    """Returns API health status and model readiness."""
    return {
        "status": "healthy",
        "model_loaded": predictor is not None and predictor.is_ready,
        "chatbot_available": groq_client is not None,
        "version": "1.0.0",
    }


@app.post("/predict", tags=["Inference"])
async def predict(file: UploadFile = File(...)):
    """
    Accepts a skin image and returns:
      - disease: classified condition name
      - severity: Mild | Moderate | Severe
      - confidence: float 0–1
      - suggestions: list of treatment recommendations
    """
    if predictor is None or not predictor.is_ready:
        raise HTTPException(status_code=503, detail="Model not loaded. Please try again shortly.")

    # ── 1. Read and validate the uploaded file ────────────────────────────────
    try:
        image_bytes = await file.read()
    except Exception as exc:
        logger.error("Failed to read uploaded file: %s", exc)
        raise HTTPException(status_code=400, detail="Could not read uploaded file.")

    if not image_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # Validate image format and size
    validation_error = validate_image(image_bytes, file.content_type)
    if validation_error:
        raise HTTPException(status_code=422, detail=validation_error)

    # ── 2. Preprocess ─────────────────────────────────────────────────────────
    try:
        img_array = preprocess_image(image_bytes)
    except Exception as exc:
        logger.error("Image preprocessing failed: %s", exc)
        raise HTTPException(status_code=422, detail=f"Image preprocessing failed: {str(exc)}")

    # ── 3. Run inference ──────────────────────────────────────────────────────
    try:
        disease, confidence, severity = predictor.predict(img_array)
    except Exception as exc:
        logger.error("Model inference failed: %s", exc)
        raise HTTPException(status_code=500, detail="Model inference failed. Please try again.")

    # ── 4. Build response ─────────────────────────────────────────────────────
    suggestions = get_suggestions(disease, severity)

    response = {
        "disease": disease,
        "severity": severity,
        "confidence": round(float(confidence), 4),
        "suggestions": suggestions,
    }

    logger.info(
        "Prediction: disease=%s severity=%s confidence=%.2f",
        disease, severity, confidence,
    )
    return JSONResponse(content=response)


@app.post("/chat", tags=["Chatbot"])
async def chat(request: ChatRequest):
    """
    AI chatbot for skin disease questions.
    Uses Groq API with a dermatology-focused system prompt.
    """
    if groq_client is None:
        raise HTTPException(
            status_code=503,
            detail="Chatbot not available. Please set GROQ_API_KEY in .env file."
        )

    # Build system prompt
    system_prompt = """You are MedSight AI Assistant, a helpful dermatology expert chatbot.
You help users understand skin conditions, their symptoms, treatments, and precautions.

IMPORTANT RULES:
- Always remind users that you provide educational information only, not medical diagnosis.
- Recommend consulting a dermatologist for proper diagnosis and treatment.
- Be empathetic and supportive.
- Provide clear, actionable advice when possible.
- If the user shares diagnosis results, help explain what they mean.
- Keep responses concise but informative (2-4 paragraphs max).
- You can discuss: Acne, Eczema, Psoriasis, and general skin health.
"""

    if request.context:
        system_prompt += f"\n\nCurrent diagnosis context: {request.context}"

    # Build messages for Groq
    messages = [{"role": "system", "content": system_prompt}]
    for msg in request.messages:
        messages.append({"role": msg.role, "content": msg.content})

    try:
        completion = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages,
            temperature=0.7,
            max_tokens=500,
        )
        reply = completion.choices[0].message.content
        return JSONResponse(content={"reply": reply})
    except Exception as exc:
        logger.error("Chatbot error: %s", exc)
        raise HTTPException(status_code=500, detail=f"Chatbot error: {str(exc)}")


# ── Dev entry point ───────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
