# Resume Bullet Strength Analyzer

AI-powered API for analyzing resume bullet point strength using machine learning.

## Quick Start

The API is deployed on Hugging Face Spaces. Visit the Space to use it!

## API Endpoints

- `GET /` - API information
- `GET /health` - Health check
- `POST /predict` - Predict single bullet strength
- `POST /predict/batch` - Predict multiple bullets

## Example Usage

```bash
curl -X POST "https://YOUR_SPACE.hf.space/predict" \
  -H "Content-Type: application/json" \
  -d '{"text": "Implemented caching to reduce API latency by 40%"}'
```

## Interactive Documentation

Visit `/docs` for Swagger UI interactive documentation.

## Model

The model uses TF-IDF vectorization with Logistic Regression, trained on labeled resume bullet points.

