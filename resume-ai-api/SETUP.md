# Quick Setup Guide

## Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

## Step-by-Step Setup

### 1. Navigate to the Python API directory
```bash
cd resume-ai-api
```

### 2. Create and activate a virtual environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

**Note:** If you get a "Fatal error in launcher" when using `pip`, use `python -m pip` instead.

```bash
python -m pip install -r requirements.txt
```

Or install directly:
```bash
python -m pip install fastapi uvicorn[standard] scikit-learn pandas joblib pydantic
```

### 4. Train the model
```bash
python train_model.py
```

This will:
- Load data from `bullets.csv`
- Train the model
- Save it as `resume_strength_model.joblib`
- Show accuracy metrics

### 5. Start the API server
```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

The `--reload` flag enables auto-reload during development.

### 6. Test the API

Open your browser and visit:
- API docs: http://localhost:8000/docs
- Health check: http://localhost:8000/health

Or test with curl:
```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d "{\"text\": \"Implemented caching to reduce API latency by 40%\"}"
```

## Integration with Angular

1. Make sure the API is running on `http://localhost:8000`
2. Start your Angular dev server: `npm start` (from the root directory)
3. Navigate to the Resume page
4. Click "Show Analyzer" to use the AI bullet analysis feature

## Troubleshooting

### Port already in use
If port 8000 is already in use, change it:
```bash
uvicorn app:app --host 0.0.0.0 --port 8001 --reload
```
Then update `src/app/services/resume-ai.service.ts` with the new port.

### Model file not found
Make sure you've run `train_model.py` first to generate `resume_strength_model.joblib`.

### CORS errors
The API is configured to allow requests from `localhost:4200` and `localhost:4000`. 
For production, update the `allow_origins` list in `app.py`.

### Import errors
Make sure all dependencies are installed:
```bash
pip install -r requirements.txt
```

