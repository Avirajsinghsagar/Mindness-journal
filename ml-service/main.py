from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import numpy as np
from transformers import pipeline
from sklearn.ensemble import IsolationForest, GradientBoostingRegressor
import warnings
warnings.filterwarnings("ignore")

app = FastAPI(title="MindWell ML Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lightweight model ~67MB only
print("Loading sentiment model (lightweight)...")
sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english",
    truncation=True,
    max_length=512
)
print("Model loaded successfully!")


# ─── Request Models ───────────────────────────────────────────

class JournalText(BaseModel):
    text: str

class MoodHistory(BaseModel):
    mood_scores: List[float]
    energy_scores: List[float]

class AnomalyRequest(BaseModel):
    mood_scores: List[float]


# ─── 1. Sentiment Analysis ────────────────────────────────────

@app.post("/analyze-sentiment")
async def analyze_sentiment(data: JournalText):
    if not data.text or len(data.text.strip()) < 5:
        return {
            "dominant_emotion": "neutral",
            "sentiment": "NEUTRAL",
            "sentiment_score": 5.0,
            "confidence": 0.0,
            "message": "Text too short to analyze"
        }
    try:
        result = sentiment_pipeline(data.text[:512])[0]
        label = result["label"]   # POSITIVE or NEGATIVE
        confidence = round(result["score"], 4)

        # Map to emotion label
        if label == "POSITIVE":
            dominant_emotion = "joy"
            sentiment_score = round(5 + (confidence * 5), 2)
        else:
            dominant_emotion = "sadness"
            sentiment_score = round(5 - (confidence * 4), 2)

        sentiment_score = max(1.0, min(10.0, sentiment_score))

        return {
            "dominant_emotion": dominant_emotion,
            "sentiment": label,
            "sentiment_score": sentiment_score,
            "confidence": confidence,
            "emotions": {
                dominant_emotion: confidence,
                "neutral": round(1 - confidence, 4)
            }
        }
    except Exception as e:
        return {
            "dominant_emotion": "neutral",
            "sentiment": "NEUTRAL",
            "sentiment_score": 5.0,
            "confidence": 0.0,
            "error": str(e)
        }


# ─── 2. Mood Prediction ───────────────────────────────────────

@app.post("/predict-mood")
async def predict_mood(data: MoodHistory):
    mood = data.mood_scores
    energy = data.energy_scores

    if len(mood) < 3:
        avg = sum(mood) / len(mood) if mood else 5.0
        return {
            "predicted_mood": round(avg, 2),
            "confidence": "low",
            "message": "Need at least 3 entries for prediction",
            "trend": "neutral"
        }
    try:
        X, y = [], []
        for i in range(2, len(mood)):
            features = [
                mood[i-1],
                mood[i-2],
                sum(mood[max(0, i-3):i]) / min(3, i),
                energy[i-1] if i-1 < len(energy) else 5.0,
                i % 7
            ]
            X.append(features)
            y.append(mood[i])

        model = GradientBoostingRegressor(n_estimators=50, random_state=42)
        model.fit(X, y)

        last_features = [
            mood[-1],
            mood[-2],
            sum(mood[-3:]) / min(3, len(mood)),
            energy[-1] if energy else 5.0,
            len(mood) % 7
        ]
        prediction = float(model.predict([last_features])[0])
        prediction = round(max(1.0, min(10.0, prediction)), 2)

        recent_avg = sum(mood[-3:]) / 3
        older_avg = sum(mood[:-3]) / max(1, len(mood) - 3)

        if recent_avg > older_avg + 0.5:
            trend = "improving"
        elif recent_avg < older_avg - 0.5:
            trend = "declining"
        else:
            trend = "stable"

        return {
            "predicted_mood": prediction,
            "confidence": "high" if len(mood) >= 7 else "medium",
            "trend": trend,
            "recent_average": round(recent_avg, 2),
            "data_points_used": len(mood)
        }
    except Exception as e:
        avg = sum(mood) / len(mood)
        return {
            "predicted_mood": round(avg, 2),
            "confidence": "low",
            "trend": "neutral",
            "error": str(e)
        }


# ─── 3. Anomaly Detection ─────────────────────────────────────

@app.post("/detect-anomaly")
async def detect_anomaly(data: AnomalyRequest):
    scores = data.mood_scores

    if len(scores) < 5:
        return {
            "is_anomaly": False,
            "alert": False,
            "message": "Need at least 5 entries for anomaly detection",
            "anomaly_score": 0.0
        }
    try:
        X = np.array(scores).reshape(-1, 1)
        model = IsolationForest(contamination=0.15, random_state=42)
        model.fit(X)

        latest = np.array([[scores[-1]]])
        prediction = model.predict(latest)[0]
        anomaly_score = float(model.decision_function(latest)[0])
        is_anomaly = prediction == -1

        mean = float(np.mean(scores[:-1]))
        std = float(np.std(scores[:-1]))
        consecutive_low = all(s < 4 for s in scores[-3:]) if len(scores) >= 3 else scores[-1] < 4
        should_alert = is_anomaly and scores[-1] < mean - std and consecutive_low

        if should_alert:
            message = "Your mood has been lower than usual. Consider a breathing exercise or journaling about what's on your mind."
        elif is_anomaly and scores[-1] > mean + std:
            message = "Great streak! Your mood is notably higher than usual."
        else:
            message = "Your mood pattern looks normal."

        return {
            "is_anomaly": bool(is_anomaly),
            "alert": bool(should_alert),
            "anomaly_score": round(anomaly_score, 4),
            "current_mood": scores[-1],
            "average_mood": round(mean, 2),
            "message": message
        }
    except Exception as e:
        return {
            "is_anomaly": False,
            "alert": False,
            "message": str(e),
            "anomaly_score": 0.0
        }


# ─── Health Check ─────────────────────────────────────────────

@app.get("/")
async def root():
    return {
        "status": "MindWell ML Service running",
        "endpoints": [
            "/analyze-sentiment",
            "/predict-mood",
            "/detect-anomaly"
        ]
    }