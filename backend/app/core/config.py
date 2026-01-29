"""
Application Configuration
"""

from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # App
    APP_ENV: str = "development"
    DEBUG: bool = True
    
    # Supabase
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    SUPABASE_SERVICE_KEY: str = ""
    
    # Google Gemini AI
    GEMINI_API_KEY: str = ""
    
    # Replicate (FLUX.1)
    REPLICATE_API_TOKEN: str = ""
    
    # Runway (Video)
    RUNWAY_API_KEY: str = ""
    
    # Pinecone
    PINECONE_API_KEY: str = ""
    PINECONE_ENVIRONMENT: str = ""
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]
    
    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
