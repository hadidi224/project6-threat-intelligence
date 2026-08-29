from backend.services.risk_service import calculate_risk_level


test_scores = [
    (0.12, False),
    (-0.01, True),
    (-0.04, True),
    (-0.08, True),
    (-0.15, True),
]


print("Risk Interpretation Test")
print("=" * 40)

for score, is_anomaly in test_scores:
    risk = calculate_risk_level(score, is_anomaly)

    print(
        f"Score: {score:.4f} "
        f"-> Risk Level: {risk}"
    )