import pandas as pd


def load_logs(file_path: str) -> pd.DataFrame:
    """
    Load network logs from a CSV file.
    """
    df = pd.read_csv(file_path)

    df["timestamp"] = pd.to_datetime(df["timestamp"])

    return df


def parse_logs(file_path: str) -> pd.DataFrame:
    """
    Load and validate network log data.
    """
    df = load_logs(file_path)

    required_columns = [
        "timestamp",
        "source_ip",
        "destination_ip",
        "event_type",
        "action",
        "port",
        "status",
        "failed_login_attempts",
        "request_frequency",
    ]

    missing_columns = [
        column for column in required_columns
        if column not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Missing required columns: {missing_columns}"
        )

    return df


if __name__ == "__main__":
    file_path = "data/network_logs.csv"

    logs = parse_logs(file_path)

    print("Logs loaded successfully!")
    print(f"Number of records: {len(logs)}")
    print("\nColumns:")
    print(logs.columns.tolist())

    print("\nFirst 5 records:")
    print(logs.head())
