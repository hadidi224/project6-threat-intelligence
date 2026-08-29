import pandas as pd


FEATURE_COLUMNS = [
    "failed_login_attempts",
    "request_frequency",
    "port",
    "hour",
    "is_failed",
    "is_login",
]


def create_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Convert parsed network logs into numerical ML features.
    """
    features = pd.DataFrame(index=df.index)

    # Direct numerical features
    features["failed_login_attempts"] = df["failed_login_attempts"]
    features["request_frequency"] = df["request_frequency"]
    features["port"] = df["port"]

    # Extract hour from timestamp
    features["hour"] = df["timestamp"].dt.hour

    # Convert categorical values to numerical indicators
    features["is_failed"] = (
        df["status"].str.lower() == "failed"
    ).astype(int)

    features["is_login"] = (
        df["event_type"].str.lower() == "login"
    ).astype(int)

    return features[FEATURE_COLUMNS]


if __name__ == "__main__":
    from log_parser import parse_logs

    logs = parse_logs("data/network_logs.csv")

    features = create_features(logs)

    print("Feature engineering completed!")
    print(f"\nFeature shape: {features.shape}")

    print("\nFeatures:")
    print(features.head(10))

    print("\nFeature columns:")
    print(features.columns.tolist())
