import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
import pickle
import os

# Load updated dataset
DATA_PATH = "classifier_router_agent/training_data_v2.csv"
df = pd.read_csv(DATA_PATH)

# Drop rows with missing content or category
df.dropna(subset=["content", "category"], inplace=True)

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    df["content"], df["category"], test_size=0.2, random_state=42, stratify=df["category"]
)

# Create pipeline with TF-IDF and Logistic Regression
pipeline = make_pipeline(
    TfidfVectorizer(max_features=5000),
    LogisticRegression(max_iter=1000)
)

# Train model
pipeline.fit(X_train, y_train)

# Evaluate
score = pipeline.score(X_test, y_test)
print(f"Model accuracy: {score:.2f}")

# Save vectorizer and model
os.makedirs("classifier_router_agent", exist_ok=True)
with open("classifier_router_agent/model.pkl", "wb") as f:
    pickle.dump(pipeline.named_steps["logisticregression"], f)
with open("classifier_router_agent/vectorizer.pkl", "wb") as f:
    pickle.dump(pipeline.named_steps["tfidfvectorizer"], f)

print("Training complete. Model and vectorizer saved.")
