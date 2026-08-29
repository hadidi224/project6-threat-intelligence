def calculate_risk_level(anomaly_score: float, is_anomaly: bool) -> str:
    """
    Convert Isolation Forest output into an application-level risk level.
    """

    if not is_anomaly:
        return "Normal"

    if anomaly_score >= -0.02:
        return "Low"

    if anomaly_score >= -0.06:
        return "Medium"

    if anomaly_score >= -0.10:
        return "High"

    return "Critical"