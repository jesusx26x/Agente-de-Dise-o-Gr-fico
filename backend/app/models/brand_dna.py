"""
Brand DNA Model Schemas
Defines the structure for storing and processing brand identity
"""

from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List
from datetime import datetime
from enum import Enum


class EmotionType(str, Enum):
    """Brand emotional tone types"""
    PROFESSIONAL = "profesional"
    FRIENDLY = "amigable"
    AUTHORITATIVE = "autoritativo"
    EMPATHETIC = "empatico"
    ENTHUSIASTIC = "entusiasta"
    SERIOUS = "serio"
    PLAYFUL = "jugueton"


class VectorCromatico(BaseModel):
    """Color palette extracted from brand"""
    primary: str = Field(..., description="Primary brand color (hex)")
    secondary: str = Field(..., description="Secondary brand color (hex)")
    accent: str = Field(default="#000000", description="Accent color (hex)")
    background: str = Field(default="#FFFFFF", description="Background color (hex)")
    text_on_primary: str = Field(default="#FFFFFF", description="Text color on primary")


class VectorTipografico(BaseModel):
    """Typography extracted from brand"""
    headings: str = Field(..., description="Font family for headings")
    body: str = Field(..., description="Font family for body text")
    google_fonts_available: bool = Field(default=True)
    fallback_headings: str = Field(default="sans-serif")
    fallback_body: str = Field(default="sans-serif")


class VectorSemantico(BaseModel):
    """Voice and tone analysis"""
    formalidad: float = Field(..., ge=0, le=1, description="Formality level 0-1")
    emocion: EmotionType = Field(..., description="Primary emotional tone")
    longitud_sentencia: str = Field(default="concisa", description="Sentence style")
    vocabulario: List[str] = Field(default=[], description="Key brand vocabulary")
    system_prompt: str = Field(..., description="Generated system prompt for copywriting")


class VectorVisual(BaseModel):
    """Visual style analysis"""
    estilo_fotografico: str = Field(..., description="Photography style description")
    referencia_imagenes_urls: List[str] = Field(default=[], description="Reference image URLs")
    ip_adapter_embedding_id: Optional[str] = Field(None, description="IP-Adapter embedding ID")


class LogoAsset(BaseModel):
    """Logo configuration for brand"""
    logo_url: str = Field(..., description="URL to stored logo file")
    logo_format: str = Field(default="png", description="Logo format: svg, png, jpg")
    has_transparency: bool = Field(default=True, description="Whether logo has transparency")
    preferred_position: str = Field(default="bottom-right", description="Default position in images")
    min_size_percent: float = Field(default=0.08, description="Minimum logo size as % of image")
    max_size_percent: float = Field(default=0.15, description="Maximum logo size as % of image")
    padding_percent: float = Field(default=0.03, description="Padding from edge as % of image")


class BrandDNA(BaseModel):
    """Complete Brand DNA representation"""
    id: Optional[str] = None
    user_id: str
    brand_name: str
    website_url: HttpUrl
    
    # Core DNA vectors
    vector_cromatico: VectorCromatico
    vector_tipografico: VectorTipografico
    vector_semantico: VectorSemantico
    vector_visual: VectorVisual
    
    # Logo - MANDATORY for all generated content
    logo: LogoAsset
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    extraction_version: str = Field(default="1.0.0")
    is_verified: bool = Field(default=False, description="User verified the DNA")


class BrandDNACreateRequest(BaseModel):
    """Request to initiate brand DNA extraction"""
    website_url: HttpUrl
    brand_name: Optional[str] = None


class BrandDNAUpdateRequest(BaseModel):
    """Request to update brand DNA (user adjustments)"""
    vector_cromatico: Optional[VectorCromatico] = None
    vector_tipografico: Optional[VectorTipografico] = None
    vector_semantico: Optional[VectorSemantico] = None
    logo_position: Optional[str] = None
    is_verified: bool = False


class BrandDNAResponse(BaseModel):
    """Response with brand DNA details"""
    id: str
    brand_name: str
    website_url: str
    vector_cromatico: VectorCromatico
    vector_tipografico: VectorTipografico
    vector_semantico: VectorSemantico
    vector_visual: VectorVisual
    logo: Optional[LogoAsset] = None
    is_verified: bool
    created_at: datetime
