# 🛡️ Misinformation Detector & Risk Engine

> **A Cyberpunk Multi-Modal Forensic Engine for Real-Time Misinformation Detection, Continuous ML Risk Scoring, and Explainable AI (XAI).**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?style=flat-square&logo=react)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-000000.svg?style=flat-square&logo=express)](https://expressjs.com/)
[![Gemini API](https://img.shields.io/badge/Google_Gemini-3.7_Flash-8E75B2.svg?style=flat-square&logo=google)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4.svg?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

---

## 📖 Executive Summary & Overview

The **Misinformation Detector & Risk Engine** is an advanced, multi-modal forensic web application designed to combat fake news, manipulated media, deceptive URLs, and propaganda in real time. Built with a high-contrast cyberpunk terminal aesthetic, the system ingests **plain text, article URLs, image screenshots, and video clips**, running them through a multi-tiered analysis framework that yields continuous risk scores, explainable AI token attribution, and comprehensive forensic breakdowns.

By combining deterministic local Machine Learning heuristics (Tier 1), automated cross-referencing against Google Fact Check APIs (Tier 2), and deep multi-modal reasoning powered by Google's Gemini models (Tier 3), the engine delivers verifiable, transparent, and actionable verdicts.

---

## ✨ Key Features

### 📡 Multi-Modal Input Ingestion
* **Text Analysis**: Direct analysis of claims, news headlines, social media posts, and long-form body text.
* **Smart Web Scraping**: Live extraction of article body text, domain metadata, and title information via Cheerio with built-in HTTP status pre-checking.
* **Optical Character Recognition (OCR)**: In-browser image text extraction powered by `tesseract.js` for analyzing memes, propaganda banners, and news screenshots.
* **Direct Video Forensics**: Seamless video uploading (up to 50MB) integrated directly with the Google AI File API (`GoogleAIFileManager`) to inspect visual artifacts, deepfake indicators, and audio transcripts.

### 🔬 3-Tier Multi-Modal Forensic Pipeline
1. **Tier 1: Local ML Classifier Engine**
   * Evaluates lexical features, sentiment polarity, clickbait punctuation, emotional intensity, and TF-IDF term frequencies using simulated ensemble models (Random Forest + Logistic Regression).
2. **Tier 2: Fact Check Verification Engine**
   * Queries the Google Fact Check Tools API for matching claims debunked or verified by independent non-partisan fact-checking organizations, supported by a local verified fallback ledger.
3. **Tier 3: Gemini Multimodal Forensic Engine**
   * Routes raw context or uploaded video streams into Gemini models (such as `gemini-3.7-flash`) to generate structured forensic reports, claim-by-claim breakdowns, evidence gap identification, and manipulative tactic detection.

### 🛡️ Safety Guards & Short-Circuits
* **Broken Link / 404 Safeguard**: Automatically pre-checks HTTP status and domain resolution before pipeline execution. If a link returns a 404/500 status code or is unreachable, the engine short-circuits to return a neutral `[BROKEN_LINK]` amber verdict, preventing false-positive fake news labels on dead links.
* **50MB Video Guard**: Enforces strict client-side and server-side byte limits (50MB) on video uploads with glowing cyber error alerts and live progress indicators (`[UPLOADING_TO_GEMINI_FILES_API...]`).

### 🔍 Explainable AI (XAI) & Transparency
* **LIME/SHAP-Style Token Attribution**: Highlights individual words contributing to risk or credibility using color-coded weights.
* **Radar & Distribution Charts**: Interactive Recharts visualizations displaying domain reachability, syntax density, bias direction, and model certainty.
* **Live Cyber Terminal**: Real-time streaming logs detailing every execution phase, network request, and override signal.
* **Historical Ledger**: Persistent session catalog storing past analyses for auditability and quick re-inspection.

---

## 📐 System Architecture

```text
[ USER INPUT: Text | URL | Image (OCR) | Video (File API) ]
                          │
                          ▼
            ┌───────────────────────────┐
            │   URL Pre-Check Guard     │ (HTTP Status / DNS Check)
            └─────────────┬─────────────┘
                          │
          ┌───────────────┴───────────────┐
          │                               │
[ BROKEN / 404 LINK ]            [ VALID TARGET ]
    │ (Short-Circuit)                     │
    ▼                                     ▼
Verdict: BROKEN_LINK             ┌────────────────────────────────┐
Risk Score: 0.0%                 │    3-TIER FORENSIC PIPELINE    │
                                 └────────────────┬───────────────┘
                                                  │
          ┌───────────────────────────────────────┼───────────────────────────────────────┐
          │                                       │                                       │
          ▼                                       ▼                                       ▼
┌──────────────────┐                    ┌──────────────────┐                    ┌──────────────────┐
│  TIER 1: ML      │                    │ TIER 2: FACT     │                    │ TIER 3: GEMINI   │
│  Lexical & TFIDF │                    │ CHECK API        │                    │ MULTIMODAL AI    │
└─────────┬────────┘                    └─────────┬────────┘                    └─────────┬────────┘
          │                                       │                                       │
          └───────────────────────────────────────┼───────────────────────────────────────┘
                                                  │
                                                  ▼
                                ┌──────────────────────────────────┐
                                │   MASTER SYNTHESIS ENGINE        │
                                │   Weighted Risk & Override Rules │
                                └─────────────────┬────────────────┘
                                                  │
                                                  ▼
                                ┌──────────────────────────────────┐
                                │   CYBERPUNK FORENSIC REPORT &    │
                                │   EXPLAINABLE AI (XAI) DASHBOARD │
                                └──────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### **Frontend**
* **Framework**: React 19 + TypeScript 5.8
* **Build Tool**: Vite 6
* **Styling**: Tailwind CSS v4 (with custom glowing cyberpunk themes)
* **Animations**: Motion (`motion/react`)
* **Icons**: Lucide React
* **Data Visualization**: Recharts (Pie, Radar, Bar charts)
* **OCR Engine**: Tesseract.js

### **Backend**
* **Runtime**: Node.js + Express 4.21
* **Execution**: `tsx` (Dev) / `esbuild` + CommonJS bundle (Prod)
* **Scraper**: Cheerio + standard HTTP AbortController fetch
* **AI Models**: Google Gen AI SDK (`@google/genai`) - Gemini 3.7 Flash & File API

---

## 📁 Repository Structure

```text
misinformation-detector/
├── metadata.json             # App metadata and major capabilities
├── package.json              # Dependencies and build scripts
├── server.ts                 # Express server & API endpoints (/api/analyze, /api/history, etc.)
├── server/
│   ├── db.ts                 # In-memory database & claims persistence ledger
│   ├── fact-check-api.ts     # Google Fact Check Tools API integration & local catalog
│   ├── gemini.ts             # Gemini 3.7 Flash forensic analyst pipeline & File API handling
│   ├── ml-engine.ts          # Tier 1 ML risk scoring engine (TF-IDF & lexical heuristics)
│   └── scraper.ts            # Web scraper with URL HTTP status pre-checking
├── src/
│   ├── App.tsx               # Main application component & layout shell
│   ├── main.tsx              # React entry point
│   ├── index.css             # Tailwind CSS entry imports & custom cyberpunk animations
│   ├── types.ts              # Global TypeScript interfaces & Verdict types
│   └── components/
│       ├── ForensicReportPanel.tsx  # Detailed forensic investigation breakdown
│       ├── HistorySidebar.tsx       # Saved claims history ledger
│       ├── OmniInput.tsx            # Multi-modal input panel (Text/URL/Image/Video)
│       ├── RiskGauge.tsx            # Risk score gauge & Broken Link warning card
│       ├── TerminalLoader.tsx       # Live terminal status log viewer
│       ├── ThreeTierInspector.tsx   # Tier 1 / Tier 2 / Tier 3 inspection tabs
│       └── XAIExplainer.tsx         # Token attributions & radar charts
└── vite.config.ts            # Vite configuration
```

---

## 🚀 Getting Started

### 1. Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### 2. Environment Setup
Create a `.env` file in the root directory (or declare variables in your environment):

```env
# Server Port (Defaults to 3000)
PORT=3000

# Google Gemini API Key (Required for Tier 3 Multimodal & Video Forensics)
GEMINI_API_KEY=your_gemini_api_key_here

# Google Fact Check API Key (Optional; falls back to local ledger if omitted)
FACT_CHECK_API_KEY=your_fact_check_api_key_here
```

> **Note**: For `.env.example`, keep placeholder values without actual secrets.

### 3. Installation
```bash
# Install all dependencies
npm install
```

### 4. Running the Development Server
```bash
# Starts the Express backend + Vite dev server concurrently
npm run dev
```
Open your browser at `http://localhost:3000`.

### 5. Production Build
```bash
# Build static client assets and bundle server.ts via esbuild
npm run build

# Start the compiled production server
npm run start
```

---

## 🔌 API Endpoint Reference

| Method | Endpoint | Description | Payload Example |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/analyze` | Analyzes text, URL, image, or video payload through the 3-Tier engine. | `{ inputMode: "text", text: "..." }` or `{ inputMode: "url", url: "https://..." }` |
| `POST` | `/api/scrape-url` | Performs HTTP status check and scrapes webpage article content. | `{ url: "https://example.com/article" }` |
| `POST` | `/api/ocr` | Extracts text from uploaded image files server-side. | `{ image: "data:image/png;base64,..." }` |
| `GET` | `/api/history` | Fetches saved forensic claims from the claims ledger. | None |
| `DELETE` | `/api/history/:id` | Deletes a claim entry from the ledger by ID. | None |
| `GET` | `/api/stats` | Retrieves database statistics (total claims, fake count, average risk). | None |

---

## 🔒 Security & Optimization

* **Server-Side API Proxying**: All Gemini API calls and external web scrapes occur exclusively on the Express server side, keeping sensitive API keys secure.
* **Video Safety Limits**: Enforces a 50MB upload ceiling to comply with fast processing guidelines and prevent memory exhaustion.
* **Sanitized Ingestion**: Input text and scraped articles are cleaned of malformed scripts and HTML tags before model tokenization.

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
