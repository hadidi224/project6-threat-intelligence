from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes.detection import router as detection_router
from backend.routes.threats import router as threats_router


app = FastAPI(
    title="Threat Intelligence Dashboard API",
    description="AI-powered network threat detection API",
    version="1.0.0",
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# API routers
app.include_router(detection_router)
app.include_router(threats_router)


@app.get("/")
def root():
    return {
        "message": "Threat Intelligence Dashboard API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }