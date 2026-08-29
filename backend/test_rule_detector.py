from backend.services.log_parser import parse_logs
from backend.services.rule_detector import detect_rule_based_threat


# Load network logs
logs = parse_logs("data/network_logs.csv")

print("Testing Rule-Based Detector...\n")

# Check every log entry
for index, row in logs.iterrows():
    result = detect_rule_based_threat(row)

    if result["is_threat"]:
        print(f"Threat detected at row {index}")
        print(f"Classification: {result['classification']}")
        print(f"Reasons: {result['reasons']}")
        print("-" * 50)