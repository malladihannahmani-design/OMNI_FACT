import os
import io
import re
from typing import Optional, List
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
import requests
from bs4 import BeautifulSoup
from PIL import Image
import pytesseract
from sqlalchemy import create_engine, Column, Integer, String, Float, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

from .model import MisinfoMLEngine

# Database setup
DATABASE_URL = "sqlite:///./claims_history.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class ClaimRecord(Base):
    __tablename__ = "claims"
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    input_mode = Column(String, default="text")
    source_url = Column(String, nullable=True)
    raw_text = Column(Text)
    classification = Column(String) # "Credible", "Suspicious", "Fake"
    risk_score = Column(Float) # 0.0 - 100.0%
    confidence = Column(Float)
    flagged_keywords = Column(Text) # comma-separated

Base.metadata.create_all(bind=engine)

# ML Engine instance
ml_engine = MisinfoMLEngine()

app = FastAPI(
    title="Misinformation Detection & Risk Score API",
    description="Cyberpunk-grade NLP & XAI continuous risk engine for misinformation classification",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    text: Optional[str] = None
    url: Optional[str] = None
    input_mode: Optional[str] = "text"

@app.get("/api/health")
def health_check():
    return {"status": "online", "model": "RandomForest+LogisticRegression (TF-IDF)", "time": datetime.utcnow()}

@app.post("/api/scrape-url")
def scrape_url_endpoint(payload: dict):
    url = payload.get("url")
    if not url:
        raise HTTPException(status_code=400, detail="URL is required")
    try:
        resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
        soup = BeautifulSoup(resp.text, "html.parser")
        for tag in soup(["script", "style", "nav", "footer", "header"]):
            tag.extract()
        title = soup.title.string if soup.title else "Untitled Article"
        paragraphs = [p.get_text().strip() for p in soup.find_all("p") if len(p.get_text().strip()) > 30]
        content = "\n\n".join(paragraphs)
        return {"url": url, "title": title, "content": content}
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Failed to scrape URL: {str(e)}")

@app.post("/api/analyze")
async def analyze_claim(
    text: Optional[str] = Form(None),
    url: Optional[str] = Form(None),
    input_mode: Optional[str] = Form("text"),
    file: Optional[UploadFile] = File(None)
):
    extracted_text = text or ""

    # Image OCR handling
    if file:
        try:
            image_bytes = await file.read()
            image = Image.open(io.BytesIO(image_bytes))
            ocr_text = pytesseract.image_to_string(image)
            extracted_text = ocr_text.strip()
            input_mode = "image"
        except Exception as ocr_err:
            raise HTTPException(status_code=400, detail=f"OCR Extraction failed: {str(ocr_err)}")

    # URL Scraping handling
    elif url and (not extracted_text or len(extracted_text) < 15):
        try:
            resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
            soup = BeautifulSoup(resp.text, "html.parser")
            paragraphs = [p.get_text().strip() for p in soup.find_all("p") if len(p.get_text().strip()) > 30]
            extracted_text = "\n\n".join(paragraphs)
            input_mode = "url"
        except Exception as url_err:
            raise HTTPException(status_code=400, detail=f"URL scraping failed: {str(url_err)}")

    if not extracted_text or len(extracted_text.strip()) == 0:
        raise HTTPException(status_code=400, detail="Text payload cannot be empty")

    # Run ML analysis
    result = ml_engine.predict(extracted_text)

    # Save to SQLite Database
    db = SessionLocal()
    try:
        record = ClaimRecord(
            input_mode=input_mode,
            source_url=url,
            raw_text=extracted_text,
            classification=result["verdict"],
            risk_score=result["risk_score"],
            confidence=result["confidence"],
            flagged_keywords=",".join([k["word"] for k in result["suspicious_keywords"][:5]])
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        result["db_id"] = record.id
    finally:
        db.close()

    return {"success": True, "result": result}

@app.get("/api/history")
def get_claims_history(limit: int = 50):
    db = SessionLocal()
    try:
        records = db.query(ClaimRecord).order_by(ClaimRecord.created_at.desc()).limit(limit).all()
        return {
            "history": [
                {
                    "id": r.id,
                    "created_at": r.created_at.isoformat(),
                    "input_mode": r.input_mode,
                    "source_url": r.source_url,
                    "snippet": r.raw_text[:140] + "...",
                    "classification": r.classification,
                    "risk_score": r.risk_score,
                    "confidence": r.confidence,
                }
                for r in records
            ]
        }
    finally:
        db.close()
