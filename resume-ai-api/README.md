# Resume Bullet Strength Prediction API

A machine learning API for predicting the strength of resume bullet points using TF-IDF vectorization and Logistic Regression.

## Setup

1. **Create a virtual environment** (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies**:
```bash
pip install -r requirements.txt
```

3. **Train the model**:
```bash
python train_model.py
```

This will:
- Load training data from `bullets.csv`
- Train a TF-IDF + Logistic Regression model
- Save the model to `resume_strength_model.joblib`
- Print evaluation metrics and example predictions

4. **Start the API server**:
```bash
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

### GET `/`
Returns API information and available endpoints.

### GET `/health`
Health check endpoint.

### POST `/predict`
Predict the strength of a single resume bullet point.

**Request:**
```json
{
  "text": "Implemented caching to reduce API latency by 40%"
}
```

**Response:**
```json
{
  "label": "strong",
  "confidence": 0.95
}
```

### POST `/predict/batch`
Predict the strength of multiple resume bullet points at once.

**Request:**
```json
[
  {"text": "Implemented caching to reduce API latency by 40%"},
  {"text": "Worked on a project"}
]
```

**Response:**
```json
{
  "predictions": [
    {
      "text": "Implemented caching to reduce API latency by 40%",
      "label": "strong",
      "confidence": 0.95
    },
    {
      "text": "Worked on a project",
      "label": "weak",
      "confidence": 0.88
    }
  ]
}
```

## Training Data

The model is trained on `bullets.csv` which contains resume bullet points labeled as:
- `weak`: Generic or low-impact statements
- `medium`: Moderate impact statements
- `strong`: High-impact, quantifiable, or impressive statements

You can expand this dataset with your own labeled examples to improve model accuracy.

## Model Details

- **Vectorization**: TF-IDF with unigrams and bigrams
- **Classifier**: Logistic Regression with balanced class weights
- **Features**: Up to 5000 most important features
- **Evaluation**: Model performance is printed during training

## Integration with Angular

The API includes CORS middleware configured to allow requests from:
- `http://localhost:4200` (Angular dev server)
- `http://localhost:4000` (Alternative Angular port)

For production, update the `allow_origins` list in `app.py` with your actual domain.

## Testing

Test the API using curl:

```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{"text": "Implemented caching to reduce API latency by 40%"}'
```

Or use the interactive API docs at `http://localhost:8000/docs` (Swagger UI).


