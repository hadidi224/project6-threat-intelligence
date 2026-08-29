from fastapi import APIRouter

from backend.schemas.threat import ThreatRequest, ThreatResponse
from backend.services.detection_service import detect_threat
from backend.routes.threats import threat_history
from backend.websocket_manager import broadcast_threat


router = APIRouter(
    prefix="/api",
    tags=["Detection"],
)


@router.post("/detect", response_model=ThreatResponse)
async def detect(request: ThreatRequest):
    result = detect_threat(request.model_dump())

    stored_result = {
        **result,
        "timestamp": request.timestamp.isoformat(),
        "source_ip": request.source_ip,
        "destination_ip": request.destination_ip,
        "event_type": request.event_type,
        "action": request.action,
        "port": request.port,
        "status": request.status,
        "failed_login_attempts": request.failed_login_attempts,
        "request_frequency": request.request_frequency,
    }

    threat_history.append(stored_result)

    await broadcast_threat(stored_result)

    return result