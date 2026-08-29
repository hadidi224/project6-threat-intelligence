from fastapi import APIRouter


router = APIRouter(
    prefix="/api",
    tags=["Threats"],
)


# Temporary in-memory threat storage
threat_history = []


@router.get("/threats")
def get_threats():
    """
    Return all detected threats.
    """
    return {
        "total": len(threat_history),
        "threats": threat_history,
    }


@router.get("/threats/stats")
def get_threat_stats():
    """
    Return threat statistics by risk level.
    """

    stats = {
        "total": len(threat_history),
        "normal": 0,
        "low": 0,
        "medium": 0,
        "high": 0,
        "critical": 0,
    }

    for threat in threat_history:
        risk = threat.get("risk_level", "").lower()

        if risk in stats:
            stats[risk] += 1

    return stats