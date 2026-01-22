"""
Main FastAPI Application
Marketing AI Platform - Brand DNA Extraction & Content Generation
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.api import brand_dna, generation, health


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    print("🚀 Starting Marketing AI Platform...")
    yield
    # Shutdown
    print("👋 Shutting down...")


app = FastAPI(
    title="Marketing AI Platform",
    description="AI-powered brand DNA extraction and content generation",
    version="0.1.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, tags=["Health"])
app.include_router(brand_dna.router, prefix="/api/brand", tags=["Brand DNA"])
app.include_router(generation.router, prefix="/api/generate", tags=["Generation"])


@app.get("/")
async def root():
    return {
        "message": "Marketing AI Platform API",
        "version": "0.1.0",
        "docs": "/docs"
    }
