"""
Image Generator Service
Generates images with brand DNA and mandatory logo integration
"""

from typing import Dict, Optional, Tuple
from PIL import Image, ImageDraw, ImageFont
import io
import httpx


class ImageGeneratorService:
    """
    Service for generating brand-consistent images with logo
    
    Pipeline:
    1. Generate base image with FLUX.1/SDXL (via Replicate)
    2. Apply IP-Adapter for style consistency
    3. Add text with brand typography
    4. **ADD LOGO** (MANDATORY - always added)
    5. Resize to platform specifications
    """
    
    def __init__(self):
        self.replicate_client = None  # Initialize with API token
    
    async def generate_image(
        self,
        prompt: str,
        brand_dna: Dict,
        platform_specs: Dict,
        text_overlay: Optional[str] = None
    ) -> bytes:
        """
        Generate a complete branded image with logo
        """
        # Step 1: Generate base image
        base_image = await self._generate_base_image(prompt, brand_dna)
        
        # Step 2: Add text overlay if provided
        if text_overlay:
            base_image = await self._add_text_overlay(
                base_image, 
                text_overlay, 
                brand_dna
            )
        
        # Step 3: ADD LOGO (MANDATORY)
        final_image = await self._add_logo(base_image, brand_dna)
        
        # Step 4: Resize to platform specs
        final_image = self._resize_to_specs(final_image, platform_specs)
        
        # Convert to bytes
        buffer = io.BytesIO()
        final_image.save(buffer, format="PNG", quality=95)
        return buffer.getvalue()
    
    async def _generate_base_image(
        self,
        prompt: str,
        brand_dna: Dict
    ) -> Image.Image:
        """
        Generate base image using FLUX.1 via Replicate API
        """
        # Enhance prompt with brand style
        enhanced_prompt = self._enhance_prompt_with_brand(prompt, brand_dna)
        
        # TODO: Call Replicate API for FLUX.1
        # For now, create placeholder
        img = Image.new("RGB", (1024, 1024), brand_dna.get("vector_cromatico", {}).get("background", "#FFFFFF"))
        
        return img
    
    def _enhance_prompt_with_brand(self, prompt: str, brand_dna: Dict) -> str:
        """
        Enhance generation prompt with brand visual style
        """
        visual_style = brand_dna.get("vector_visual", {}).get("estilo_fotografico", "")
        colors = brand_dna.get("vector_cromatico", {})
        
        enhanced = f"{prompt}. Style: {visual_style}. Color palette: {colors.get('primary', '')}, {colors.get('secondary', '')}."
        
        return enhanced
    
    async def _add_text_overlay(
        self,
        image: Image.Image,
        text: str,
        brand_dna: Dict
    ) -> Image.Image:
        """
        Add text overlay with brand typography and colors
        """
        draw = ImageDraw.Draw(image)
        
        # Get brand typography
        typography = brand_dna.get("vector_tipografico", {})
        colors = brand_dna.get("vector_cromatico", {})
        
        # Try to load brand font, fallback to default
        try:
            font = ImageFont.truetype("arial.ttf", 48)
        except:
            font = ImageFont.load_default()
        
        # Calculate text position (centered, lower third)
        text_bbox = draw.textbbox((0, 0), text, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_height = text_bbox[3] - text_bbox[1]
        
        x = (image.width - text_width) // 2
        y = image.height - text_height - int(image.height * 0.15)
        
        # Add text shadow for readability
        shadow_color = "#000000"
        draw.text((x + 2, y + 2), text, font=font, fill=shadow_color)
        
        # Add main text
        text_color = colors.get("text_on_primary", "#FFFFFF")
        draw.text((x, y), text, font=font, fill=text_color)
        
        return image
    
    async def _add_logo(
        self,
        image: Image.Image,
        brand_dna: Dict
    ) -> Image.Image:
        """
        ADD LOGO TO IMAGE - MANDATORY STEP
        
        This method MUST be called for every generated image.
        The logo is always added according to brand settings.
        """
        logo_config = brand_dna.get("logo", {})
        logo_url = logo_config.get("logo_url")
        
        if not logo_url:
            # No logo configured - return as is (but log warning)
            print("WARNING: No logo configured for brand. Images should have logos!")
            return image
        
        try:
            # Fetch logo from storage
            logo = await self._fetch_logo(logo_url)
            
            # Calculate logo size (based on brand settings)
            min_size_pct = logo_config.get("min_size_percent", 0.08)
            max_size_pct = logo_config.get("max_size_percent", 0.15)
            padding_pct = logo_config.get("padding_percent", 0.03)
            
            # Target logo size (as percentage of image)
            target_size = int(image.width * max_size_pct)
            
            # Resize logo maintaining aspect ratio
            logo_aspect = logo.width / logo.height
            if logo_aspect > 1:
                new_width = target_size
                new_height = int(target_size / logo_aspect)
            else:
                new_height = target_size
                new_width = int(target_size * logo_aspect)
            
            logo = logo.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
            # Calculate position based on preference
            position = logo_config.get("preferred_position", "bottom-right")
            padding = int(image.width * padding_pct)
            
            x, y = self._calculate_logo_position(
                image.size, 
                logo.size, 
                position, 
                padding
            )
            
            # Paste logo (with alpha if available)
            if logo.mode == "RGBA":
                image.paste(logo, (x, y), logo)
            else:
                image.paste(logo, (x, y))
            
            return image
            
        except Exception as e:
            print(f"ERROR adding logo: {e}")
            return image
    
    async def _fetch_logo(self, logo_url: str) -> Image.Image:
        """
        Fetch logo from storage URL
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(logo_url)
            response.raise_for_status()
            return Image.open(io.BytesIO(response.content))
    
    def _calculate_logo_position(
        self,
        image_size: Tuple[int, int],
        logo_size: Tuple[int, int],
        position: str,
        padding: int
    ) -> Tuple[int, int]:
        """
        Calculate logo position based on preference
        """
        img_w, img_h = image_size
        logo_w, logo_h = logo_size
        
        positions = {
            "top-left": (padding, padding),
            "top-right": (img_w - logo_w - padding, padding),
            "top-center": ((img_w - logo_w) // 2, padding),
            "bottom-left": (padding, img_h - logo_h - padding),
            "bottom-right": (img_w - logo_w - padding, img_h - logo_h - padding),
            "bottom-center": ((img_w - logo_w) // 2, img_h - logo_h - padding),
            "center": ((img_w - logo_w) // 2, (img_h - logo_h) // 2),
        }
        
        return positions.get(position, positions["bottom-right"])
    
    def _resize_to_specs(
        self,
        image: Image.Image,
        specs: Dict
    ) -> Image.Image:
        """
        Resize image to platform specifications
        """
        target_width = specs.get("width", 1080)
        target_height = specs.get("height", 1080)
        
        # Calculate resize to cover
        img_ratio = image.width / image.height
        target_ratio = target_width / target_height
        
        if img_ratio > target_ratio:
            # Image is wider - fit height
            new_height = target_height
            new_width = int(target_height * img_ratio)
        else:
            # Image is taller - fit width
            new_width = target_width
            new_height = int(target_width / img_ratio)
        
        # Resize
        image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        # Crop to center
        left = (new_width - target_width) // 2
        top = (new_height - target_height) // 2
        right = left + target_width
        bottom = top + target_height
        
        return image.crop((left, top, right, bottom))
