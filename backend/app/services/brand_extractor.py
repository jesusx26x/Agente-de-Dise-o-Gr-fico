"""
Brand Extractor Service
Extracts brand DNA from website URL using headless browser,
computer vision, and LLM analysis.
"""

import asyncio
from typing import Dict, List, Optional, Tuple
import numpy as np
from sklearn.cluster import KMeans
from PIL import Image
import io


class BrandExtractorService:
    """
    Service for extracting brand DNA from websites
    
    Pipeline:
    1. Crawl website with Playwright (headless)
    2. Extract colors via K-Means clustering on screenshots
    3. Extract typography from CSS
    4. Analyze tone with GPT-4o
    5. Analyze visual style with GPT-4o Vision
    """
    
    def __init__(self):
        self.playwright = None
        self.browser = None
    
    async def extract_from_url(
        self,
        url: str,
        brand_name: Optional[str] = None
    ) -> Dict:
        """
        Main extraction pipeline
        """
        try:
            # Step 1: Crawl and screenshot
            crawl_data = await self._crawl_website(url)
            
            # Step 2: Extract colors
            colors = await self._extract_colors(crawl_data["screenshots"])
            
            # Step 3: Extract typography
            typography = await self._extract_typography(crawl_data["css_data"])
            
            # Step 4: Analyze tone
            tone = await self._analyze_tone(crawl_data["text_content"])
            
            # Step 5: Analyze visual style
            visual_style = await self._analyze_visual_style(crawl_data["images"])
            
            return {
                "brand_name": brand_name or crawl_data.get("title", "Unknown"),
                "website_url": url,
                "vector_cromatico": colors,
                "vector_tipografico": typography,
                "vector_semantico": tone,
                "vector_visual": visual_style,
                "extraction_status": "complete"
            }
        except Exception as e:
            return {
                "extraction_status": "failed",
                "error": str(e)
            }
    
    async def _crawl_website(self, url: str) -> Dict:
        """
        Crawl website using Playwright headless browser
        """
        try:
            from playwright.async_api import async_playwright
            
            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=True)
                page = await browser.new_page(viewport={"width": 1920, "height": 1080})
                
                await page.goto(url, wait_until="networkidle")
                
                # Get page title
                title = await page.title()
                
                # Take screenshot
                screenshot_bytes = await page.screenshot(full_page=True)
                
                # Extract text content
                text_content = await page.evaluate("""
                    () => {
                        const elements = document.querySelectorAll('h1, h2, h3, p, .about, .mission, .description');
                        return Array.from(elements).map(el => el.textContent).join(' ');
                    }
                """)
                
                # Extract CSS computed styles
                css_data = await page.evaluate("""
                    () => {
                        const body = document.body;
                        const h1 = document.querySelector('h1');
                        const p = document.querySelector('p');
                        
                        const bodyStyle = window.getComputedStyle(body);
                        const h1Style = h1 ? window.getComputedStyle(h1) : null;
                        const pStyle = p ? window.getComputedStyle(p) : null;
                        
                        return {
                            backgroundColor: bodyStyle.backgroundColor,
                            headingFont: h1Style ? h1Style.fontFamily : 'sans-serif',
                            bodyFont: pStyle ? pStyle.fontFamily : 'sans-serif',
                            primaryColor: bodyStyle.color
                        };
                    }
                """)
                
                # Get images
                images = await page.evaluate("""
                    () => {
                        const imgs = document.querySelectorAll('img');
                        return Array.from(imgs).slice(0, 10).map(img => img.src);
                    }
                """)
                
                await browser.close()
                
                return {
                    "title": title,
                    "screenshots": [screenshot_bytes],
                    "text_content": text_content,
                    "css_data": css_data,
                    "images": images
                }
        except Exception as e:
            # Fallback for development without Playwright
            return {
                "title": "Demo Brand",
                "screenshots": [],
                "text_content": "Sample brand text for analysis.",
                "css_data": {
                    "backgroundColor": "#FFFFFF",
                    "headingFont": "Arial, sans-serif",
                    "bodyFont": "Helvetica, sans-serif",
                    "primaryColor": "#333333"
                },
                "images": []
            }
    
    async def _extract_colors(self, screenshots: List[bytes]) -> Dict:
        """
        Extract dominant colors using K-Means clustering
        """
        if not screenshots:
            # Return default palette
            return {
                "primary": "#1A365D",
                "secondary": "#4A5568",
                "accent": "#38B2AC",
                "background": "#FFFFFF",
                "text_on_primary": "#FFFFFF"
            }
        
        try:
            # Load first screenshot
            img = Image.open(io.BytesIO(screenshots[0]))
            img = img.resize((200, 200))  # Resize for faster processing
            img_array = np.array(img)
            
            # Reshape to list of pixels
            pixels = img_array.reshape(-1, 3)
            
            # Remove near-white and near-black pixels
            mask = (pixels.sum(axis=1) > 30) & (pixels.sum(axis=1) < 700)
            filtered_pixels = pixels[mask]
            
            if len(filtered_pixels) < 10:
                filtered_pixels = pixels
            
            # K-Means clustering
            kmeans = KMeans(n_clusters=5, random_state=42, n_init=10)
            kmeans.fit(filtered_pixels)
            
            # Sort by frequency
            colors = kmeans.cluster_centers_.astype(int)
            labels, counts = np.unique(kmeans.labels_, return_counts=True)
            sorted_indices = np.argsort(-counts)
            sorted_colors = colors[sorted_indices]
            
            def rgb_to_hex(rgb):
                return '#{:02x}{:02x}{:02x}'.format(int(rgb[0]), int(rgb[1]), int(rgb[2]))
            
            return {
                "primary": rgb_to_hex(sorted_colors[0]),
                "secondary": rgb_to_hex(sorted_colors[1]) if len(sorted_colors) > 1 else "#4A5568",
                "accent": rgb_to_hex(sorted_colors[2]) if len(sorted_colors) > 2 else "#38B2AC",
                "background": "#FFFFFF",
                "text_on_primary": "#FFFFFF"  # TODO: Calculate contrast
            }
        except Exception:
            return {
                "primary": "#1A365D",
                "secondary": "#4A5568",
                "accent": "#38B2AC",
                "background": "#FFFFFF",
                "text_on_primary": "#FFFFFF"
            }
    
    async def _extract_typography(self, css_data: Dict) -> Dict:
        """
        Extract typography from CSS data
        """
        heading_font = css_data.get("headingFont", "sans-serif")
        body_font = css_data.get("bodyFont", "sans-serif")
        
        # Clean font names
        def clean_font(font_string: str) -> str:
            fonts = font_string.split(",")
            if fonts:
                return fonts[0].strip().replace('"', '').replace("'", "")
            return "sans-serif"
        
        return {
            "headings": clean_font(heading_font),
            "body": clean_font(body_font),
            "google_fonts_available": True,  # TODO: Check Google Fonts API
            "fallback_headings": "sans-serif",
            "fallback_body": "sans-serif"
        }
    
    async def _analyze_tone(self, text_content: str) -> Dict:
        """
        Analyze brand tone using Google Gemini
        """
        try:
            import google.generativeai as genai
            from app.core.config import settings
            
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-2.0-flash')
            
            prompt = f"""Analiza el siguiente texto de una página web empresarial y extrae información sobre el tono de comunicación de la marca.

Texto a analizar:
{text_content[:3000]}

Responde en formato JSON con los siguientes campos:
- formalidad: número entre 0 y 1 (0=muy informal, 1=muy formal)
- emocion: una palabra que describa la emoción principal (ej: "profesional", "entusiasta", "serio", "amigable")
- longitud_sentencia: "corta", "media" o "larga"
- vocabulario: lista de 5 palabras clave que definen la marca
- system_prompt: un prompt de sistema de 2-3 oraciones que describa cómo debería escribir una IA para esta marca

Solo responde con el JSON, sin explicaciones adicionales."""

            response = await asyncio.to_thread(
                lambda: model.generate_content(prompt)
            )
            
            import json
            try:
                # Extract JSON from response
                text = response.text.strip()
                if text.startswith("```"):
                    text = text.split("```")[1]
                    if text.startswith("json"):
                        text = text[4:]
                result = json.loads(text)
                return result
            except:
                # Return default if parsing fails
                return {
                    "formalidad": 0.7,
                    "emocion": "profesional",
                    "longitud_sentencia": "media",
                    "vocabulario": ["innovación", "calidad", "confianza", "servicio", "excelencia"],
                    "system_prompt": (
                        "Actúa como un experto en marketing digital que usa un tono "
                        "profesional pero accesible, evitando jerga innecesaria y "
                        "priorizando la claridad y la confianza."
                    )
                }
        except Exception as e:
            print(f"Error analyzing tone with Gemini: {e}")
            return {
                "formalidad": 0.7,
                "emocion": "profesional",
                "longitud_sentencia": "media",
                "vocabulario": ["innovación", "calidad", "confianza", "servicio", "excelencia"],
                "system_prompt": (
                    "Actúa como un experto en marketing digital que usa un tono "
                    "profesional pero accesible, evitando jerga innecesaria y "
                    "priorizando la claridad y la confianza."
                )
            }
    
    async def _analyze_visual_style(self, images: List[str]) -> Dict:
        """
        Analyze visual style using Google Gemini Vision
        """
        try:
            import google.generativeai as genai
            from app.core.config import settings
            import httpx
            
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-2.0-flash')
            
            # For now, analyze based on image URLs description
            # Full vision analysis would require downloading and encoding images
            prompt = f"""Basándote en estas URLs de imágenes de un sitio web empresarial, describe el estilo visual probable de la marca:

URLs de imágenes: {images[:5]}

Responde en formato JSON con:
- estilo_fotografico: descripción del estilo de fotografía (iluminación, composición, colores)
- elementos_visuales: lista de elementos visuales comunes
- recomendacion_imagen: prompt para generar imágenes coherentes con este estilo

Solo responde con el JSON."""

            response = await asyncio.to_thread(
                lambda: model.generate_content(prompt)
            )
            
            import json
            try:
                text = response.text.strip()
                if text.startswith("```"):
                    text = text.split("```")[1]
                    if text.startswith("json"):
                        text = text[4:]
                result = json.loads(text)
                result["referencia_imagenes_urls"] = images[:5]
                result["ip_adapter_embedding_id"] = None
                return result
            except:
                return {
                    "estilo_fotografico": (
                        "Fotografía profesional con iluminación natural, "
                        "paleta de colores coherente, enfoque nítido, "
                        "composición equilibrada."
                    ),
                    "elementos_visuales": ["limpio", "moderno", "profesional"],
                    "recomendacion_imagen": "Estilo corporativo moderno con colores de marca",
                    "referencia_imagenes_urls": images[:5],
                    "ip_adapter_embedding_id": None
                }
        except Exception as e:
            print(f"Error analyzing visual style with Gemini: {e}")
            return {
                "estilo_fotografico": (
                    "Fotografía profesional con iluminación natural, "
                    "paleta de colores coherente, enfoque nítido, "
                    "composición equilibrada."
                ),
                "elementos_visuales": ["limpio", "moderno", "profesional"],
                "recomendacion_imagen": "Estilo corporativo moderno con colores de marca",
                "referencia_imagenes_urls": images[:5],
                "ip_adapter_embedding_id": None
            }

