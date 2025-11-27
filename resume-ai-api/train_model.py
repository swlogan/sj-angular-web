"""
Training script for resume bullet strength prediction model.
Uses TF-IDF vectorization with Logistic Regression.
"""

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
import pandas as pd
import os

# Load training data
df = pd.read_csv("bullets.csv")

# Prepare features and labels
X = df["text"]
y = df["label"]  # Expected labels: 'weak', 'medium', 'strong' or similar

# Split data for validation
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Create pipeline with TF-IDF and Logistic Regression
model = Pipeline([
    ("tfidf", TfidfVectorizer(
        max_features=5000,
        ngram_range=(1, 2),  # Unigrams and bigrams
        min_df=2,
        max_df=0.95
    )),
    ("clf", LogisticRegression(
        max_iter=1000,
        random_state=42,
        class_weight='balanced'  # Handle imbalanced classes
    ))
])

# Train the model
print("Training model...")
model.fit(X_train, y_train)

# Evaluate on test set
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"\nTest Accuracy: {accuracy:.4f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# Save the trained model
model_path = "resume_strength_model.joblib"
joblib.dump(model, model_path)
print(f"\nModel saved to {model_path}")

# Print some example predictions
print("\nExample predictions:")
sample_texts = [
    "Implemented caching to reduce API latency by 40%",
    "Worked on a project",
    "Led a team of 5 engineers to deliver a microservices architecture"
]
for text in sample_texts:
    pred = model.predict([text])[0]
    proba = model.predict_proba([text])[0]
    conf = max(proba)
    print(f"  '{text}' -> {pred} (confidence: {conf:.2f})")


