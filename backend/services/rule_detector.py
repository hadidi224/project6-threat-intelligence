import pandas as pd


def detect_rule_based_threat(row: pd.Series) -> dict:
    """
    Detect suspicious behavior using predefined security rules.
    """

    reasons = []

    # Rule 1: Too many failed login attempts
    if row["failed_login_attempts"] >= 10:
        reasons.append("High number of failed login attempts")

    # Rule 2: Very high request frequency
    if row["request_frequency"] >= 100:
        reasons.append("Abnormally high request frequency")

    # Rule 3: Failed login on SSH
    if (
        row["event_type"].lower() == "login"
        and row["status"].lower() == "failed"
        and row["port"] == 22
    ):
        reasons.append("Failed SSH login attempt")

    # Rule 4: Port scanning behavior
    if row["event_type"].lower() == "port_scan":
        reasons.append("Port scanning activity detected")

    if reasons:
        return {
            "is_threat": True,
            "classification": "Suspicious Activity",
            "reasons": reasons,
        }

    return {
        "is_threat": False,
        "classification": "Normal Activity",
        "reasons": [],
    }