"""
FastAPI application for resume bullet strength prediction.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import os

app = FastAPI(title="Resume Bullet Strength API", version="1.0.0")

# Configure CORS to allow Angular app to call this API
# Get allowed origins from environment or use defaults
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "http://localhost:4200,http://localhost:4000,https://loganlabs.dev")
allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]

# If "*" is in the list, allow all origins (but can't use with credentials)
if "*" in allowed_origins:
    allowed_origins = ["*"]
    allow_creds = False
else:
    allow_creds = True

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=allow_creds,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model
model_path = "resume_strength_model.joblib"
if not os.path.exists(model_path):
    raise FileNotFoundError(
        f"Model file {model_path} not found. Please run train_model.py first."
    )

model = joblib.load(model_path)
print(f"Model loaded from {model_path}")


class Bullet(BaseModel):
    text: str


class PredictionResponse(BaseModel):
    label: str
    confidence: float


@app.get("/")
def root():
    return {
        "message": "Resume Bullet Strength Prediction API",
        "version": "1.0.0",
        "endpoints": {
            "/predict": "POST - Predict bullet strength",
            "/health": "GET - Health check"
        }
    }


@app.get("/health")
def health():
    return {"status": "healthy", "model_loaded": True}


@app.post("/predict", response_model=PredictionResponse)
def predict(bullet: Bullet):
    """
    Predict the strength of a resume bullet point.
    
    Args:
        bullet: Bullet object containing the text to analyze
        
    Returns:
        PredictionResponse with label and confidence score
    """
    if not bullet.text or not bullet.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    try:
        # Make prediction
        label = model.predict([bullet.text])[0]
        proba = model.predict_proba([bullet.text])[0]
        confidence = float(max(proba))
        
        return PredictionResponse(
            label=str(label),
            confidence=confidence
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


@app.post("/predict/batch")
def predict_batch(bullets: list[Bullet]):
    """
    Predict the strength of multiple resume bullet points at once.
    
    Args:
        bullets: List of Bullet objects
        
    Returns:
        List of predictions
    """
    if not bullets:
        raise HTTPException(status_code=400, detail="Bullets list cannot be empty")
    
    try:
        texts = [b.text for b in bullets]
        labels = model.predict(texts)
        probas = model.predict_proba(texts)
        
        results = []
        for i, text in enumerate(texts):
            confidence = float(max(probas[i]))
            results.append({
                "text": text,
                "label": str(labels[i]),
                "confidence": confidence
            })
        
        return {"predictions": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch prediction error: {str(e)}")


