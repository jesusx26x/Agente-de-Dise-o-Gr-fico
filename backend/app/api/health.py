"""
Health Check API Routes
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check():
    """Basic health check endpoint"""
    return {"status": "healthy", "service": "marketing-ai-platform"}


@router.get("/ready")
async def readiness_check():
    """Readiness check - verify all dependencies are available"""
    # TODO: Add actual dependency checks (DB, APIs, etc.)
    return {
        "status": "ready",
        "checks": {
            "database": "ok",
            "openai": "ok",
            "replicate": "ok"
        }
    }
