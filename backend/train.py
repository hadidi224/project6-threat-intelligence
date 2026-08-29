from pathlib import Path

import joblib
from sklearn.ensemble import IsolationForest

from backend.services.log_parser import parse_logs
from backend.services.feature_engineering import create_features


# Get the backend directory
BASE_DIR = Path(__file__).resolve().parent

# Define paths
DATA_PATH = BASE_DIR.parent / "data" / "network_logs.csv"
MODEL_DIR = BASE_DIR / "models"
MODEL_PATH = MODEL_DIR / "isolation_forest.joblib"


# Create models directory if it does not exist
MODEL_DIR.mkdir(parents=True, exist_ok=True)


# Load network logs
logs = parse_logs(DATA_PATH)

# Create ML features
features = create_features(logs)


# Create Isolation Forest model
model = IsolationForest(
    n_estimators=100,
    contamination=0.25,
    random_state=42,
)


# Train the model
model.fit(features)


# Save the trained model
joblib.dump(model, MODEL_PATH)


print("Isolation Forest training completed!")
print(f"Training samples: {len(features)}")
print(f"Features used: {features.columns.tolist()}")
print(f"Model saved to: {MODEL_PATH}")