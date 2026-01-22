"""
Brand DNA API Routes
Handles brand DNA extraction and management
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Optional
import uuid

from app.models.brand_dna import (
    BrandDNA,
    BrandDNACreateRequest,
    BrandDNAUpdateRequest,
    BrandDNAResponse,
    LogoAsset
)
from app.services.brand_extractor import BrandExtractorService
from app.services.storage import StorageService

router = APIRouter()
brand_extractor = BrandExtractorService()
storage_service = StorageService()


@router.post("/extract", response_model=dict)
async def extract_brand_dna(request: BrandDNACreateRequest):
    """
    Extract brand DNA from a website URL
    
    This initiates the brand extraction pipeline:
    1. Crawl website with headless browser
    2. Extract colors (K-Means clustering)
    3. Extract typography
    4. Analyze tone with LLM
    5. Analyze visual style with VLM
    """
    try:
        # Generate a job ID for tracking
        job_id = str(uuid.uuid4())
        
        # Start extraction (async in production)
        result = await brand_extractor.extract_from_url(
            url=str(request.website_url),
            brand_name=request.brand_name
        )
        
        return {
            "job_id": job_id,
            "status": "processing",
            "message": "Brand DNA extraction started",
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{brand_id}/logo")
async def upload_brand_logo(
    brand_id: str,
    file: UploadFile = File(...),
    position: str = Form(default="bottom-right")
):
    """
    Upload a logo for the brand
    
    The logo will be added to ALL generated images and videos.
    Supported formats: PNG (with transparency), SVG, JPG
    """
    # Validate file type
    allowed_types = ["image/png", "image/svg+xml", "image/jpeg"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {allowed_types}"
        )
    
    try:
        # Upload to storage
        logo_url = await storage_service.upload_logo(
            file=file,
            brand_id=brand_id
        )
        
        # Create logo asset config
        logo_asset = LogoAsset(
            logo_url=logo_url,
            logo_format=file.filename.split(".")[-1].lower(),
            has_transparency=file.content_type == "image/png",
            preferred_position=position
        )
        
        # TODO: Update brand DNA in database with logo
        
        return {
            "status": "success",
            "message": "Logo uploaded successfully",
            "logo": logo_asset.model_dump()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{brand_id}", response_model=BrandDNAResponse)
async def get_brand_dna(brand_id: str):
    """Get brand DNA by ID"""
    # TODO: Fetch from database
    raise HTTPException(status_code=404, detail="Brand not found")


@router.patch("/{brand_id}")
async def update_brand_dna(brand_id: str, request: BrandDNAUpdateRequest):
    """
    Update brand DNA (user adjustments)
    
    Allows users to fine-tune the extracted DNA
    """
    # TODO: Update in database
    return {
        "status": "success",
        "message": "Brand DNA updated",
        "brand_id": brand_id
    }


@router.post("/{brand_id}/verify")
async def verify_brand_dna(brand_id: str):
    """
    Mark brand DNA as verified by user
    
    After verification, the brand can be used for content generation
    """
    # TODO: Update is_verified in database
    return {
        "status": "success",
        "message": "Brand DNA verified",
        "brand_id": brand_id
    }
