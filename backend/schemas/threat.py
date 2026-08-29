from datetime import datetime

from pydantic import BaseModel, Field


class ThreatRequest(BaseModel):
    timestamp: datetime
    source_ip: str
    destination_ip: str
    event_type: str
    action: str
    port: int = Field(ge=1, le=65535)
    status: str
    failed_login_attempts: int = Field(ge=0)
    request_frequency: int = Field(ge=0)


class ThreatResponse(BaseModel):
    classification: str
    anomaly_score: float
    risk_level: str
    rule_based_detection: dict