from pathlib import Path

import joblib

from backend.services.feature_engineering import create_features
from backend.services.risk_service import calculate_risk_level
from backend.services.rule_detector import detect_rule_based_threat


BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "isolation_forest.joblib"


# Load the trained model once
model = joblib.load(MODEL_PATH)


def detect_threat(log_data):
    """
    Run the complete threat detection pipeline.
    """

    # Rule-based detection
    rule_result = detect_rule_based_threat(log_data)

    # Convert log into a DataFrame
    import pandas as pd

    log_df = pd.DataFrame([log_data])

    # Create ML features
    features = create_features(log_df)

    # Isolation Forest prediction
    prediction = model.predict(features)[0]

    # Anomaly score
    anomaly_score = model.decision_function(features)[0]

    # Risk level
    risk_level = calculate_risk_level(
        prediction,
        anomaly_score,
    )

    # AI classification
    if prediction == -1:
        classification = "Suspicious Activity"
    else:
        classification = "Normal Activity"

    return {
        "classification": classification,
        "anomaly_score": round(float(anomaly_score), 4),
        "risk_level": risk_level,
        "rule_based_detection": rule_result,
    }