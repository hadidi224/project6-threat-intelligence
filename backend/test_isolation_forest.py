from pathlib import Path

import joblib

from backend.services.log_parser import parse_logs
from backend.services.feature_engineering import create_features


# Get backend directory
BASE_DIR = Path(__file__).resolve().parent

# Define paths
DATA_PATH = BASE_DIR.parent / "data" / "network_logs.csv"
MODEL_PATH = BASE_DIR / "models" / "isolation_forest.joblib"


# Load logs
logs = parse_logs(DATA_PATH)

# Create features
features = create_features(logs)

# Load trained model
model = joblib.load(MODEL_PATH)

# Generate predictions
predictions = model.predict(features)

# Generate anomaly scores
scores = model.decision_function(features)


print("Isolation Forest Test")
print("=" * 50)

for index, (prediction, score) in enumerate(
    zip(predictions, scores)
):
    if prediction == -1:
        classification = "Anomaly"
    else:
        classification = "Normal"

    print(
        f"Row {index}: "
        f"{classification} | "
        f"Anomaly Score: {score:.4f}"
    )

print("=" * 50)

print(f"Total records: {len(features)}")
print(f"Anomalies detected: {(predictions == -1).sum()}")
print(f"Normal records: {(predictions == 1).sum()}")