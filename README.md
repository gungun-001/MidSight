# 🔬 MedSight — AI-Powered Skin Diagnostic Platform

MedSight is a sophisticated, full-stack medical AI application designed for skin disease detection and analysis. It combines deep learning (MobileNetV2) with modern web aesthetics to provide a comprehensive diagnostic experience.

![MedSight Banner](https://img.shields.io/badge/MedSight-AI_Diagnostic-purple?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/React_18-Vite-blue?style=flat-square) ![Backend](https://img.shields.io/badge/FastAPI-Python-green?style=flat-square) ![ML](https://img.shields.io/badge/TensorFlow-MobileNetV2-orange?style=flat-square) ![LLM](https://img.shields.io/badge/Groq-Llama_3.1-red?style=flat-square)

---

## 🌟 Core Features

### 1. Neural Inspector (Upload & Analyze)
- **Deep Learning Inference**: Real-time classification using a trained MobileNetV2 CNN.
- **4 Detection Classes**: Acne, Eczema, Psoriasis, and Normal Skin.
- **Severity Scoring**: Automatic categorization into *Mild*, *Moderate*, or *Severe*.
- **Interactive Stepper**: 4-step analysis pipeline (Upload → Analyze → Detect → Complete).

### 2. MedSight AI Chatbot
- **LLM Integration**: Powered by Groq (Llama 3.1) for instant medical education.
- **Context Awareness**: The chatbot knows your diagnosis results and provides specific advice.
- **Dermatology Focus**: Specialized system prompt for skin-health related queries.

### 3. Real-time Analytics Dashboard
- **Dynamic Stats**: Tracks total scans, alerts (Severe/Moderate), and today's activity.
- **Trend Charts**: Visualizes detection history over the last 7 days.
- **Class Breakdown**: Horizontal bar charts showing the distribution of identified conditions.
- **Recent History**: Quick access to the last 5 diagnostic scans.

### 4. Professional Reporting & Persistence
- **PDF Generation**: Download professional medical reports with jsPDF.
- **Local History**: Save reports to the browser's `localStorage` for persistent access.
- **Report Management**: View detailed history, delete records, or re-download PDFs in the **Reports** section.

---

## 🏗️ Technical Architecture

### Frontend (React + Vite)
- **Styling**: Tailwind CSS + Glassmorphism design system.
- **Animations**: Framer Motion for smooth transitions and scan effects.
- **Icons**: Lucide-react for a modern, clean UI.
- **Charts**: Recharts for data visualization.

### Backend (FastAPI)
- **Inference Engine**: TensorFlow-based predictor loading `.h5` models.
- **Chat API**: Integration with Groq SDK for AI assistance.
- **Processing**: Pillow and NumPy for image optimization before neural processing.

---

## 🚀 Installation & Setup

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- Groq API Key ([Get it here](https://console.groq.com/keys))

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt

# Create .env file
echo "GROQ_API_KEY=your_key_here" > .env

# Run the backend
python main.py
```

### 3. Model Training (Crucial)
MedSight requires a trained model file (`skin_model.h5`). Use our one-click setup script:
```bash
cd backend
python model/setup_model.py
```
*This script will download the DermNet dataset from Kaggle, organize it, and train your model automatically.*

### 4. Frontend Setup
```bash
cd frontend
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000" > .env

# Run the dev server
npm run dev
```

---

## 🔌 API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/health` | `GET` | Health check & model status |
| `/predict` | `POST` | Image classification (multipart/form-data) |
| `/chat` | `POST` | Groq-powered AI chat assistant |

---

## ⚠️ Disclaimer
**Educational Use Only.** This application is designed for research and educational purposes. It does **NOT** provide medical diagnoses. Always consult a certified healthcare professional or dermatologist for medical concerns.

---

## 📄 License
Project developed for AI Healthcare Research. All rights reserved.
