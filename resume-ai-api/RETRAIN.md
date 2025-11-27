# How to Retrain the Model with Updated Data

## Quick Steps

1. **Add your new data to `bullets.csv`**
   - Make sure the format is: `text,label`
   - Labels must be: `weak`, `medium`, or `strong`
   - Example:
     ```csv
     text,label
     "Your new bullet point here",strong
     "Another example",medium
     ```

2. **Navigate to the API directory**
   ```bash
   cd resume-ai-api
   ```

3. **Activate your virtual environment** (if using one)
   ```bash
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

4. **Run the training script**
   ```bash
   python train_model.py
   ```

   This will:
   - Load all data from `bullets.csv` (including your new entries)
   - Train a new model on the complete dataset
   - Save it as `resume_strength_model.joblib` (overwrites the old one)
   - Show you accuracy metrics and example predictions

5. **Restart the API server** (if it's running)
   - Stop the current server (Ctrl+C)
   - Start it again:
     ```bash
     python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
     ```

## What Happens During Training

1. **Data Loading**: Reads all rows from `bullets.csv`
2. **Data Splitting**: 80% for training, 20% for testing
3. **Feature Extraction**: Converts text to TF-IDF vectors
4. **Model Training**: Trains Logistic Regression classifier
5. **Evaluation**: Tests on held-out data and prints metrics
6. **Saving**: Overwrites `resume_strength_model.joblib` with new model

## Tips for Better Model Performance

- **More data = Better model**: Add as many examples as possible
- **Balance your classes**: Try to have roughly equal numbers of weak/medium/strong examples
- **Quality over quantity**: Well-labeled examples are better than many poor ones
- **Check accuracy**: After training, review the accuracy score - aim for >80%

## Verifying the Update

After retraining, test with:
```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{"text": "Your test bullet point here"}'
```

Or use the Angular app's AI Labs page to test interactively.

