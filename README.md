# Marketing AI Platform 🚀

Plataforma de Marketing Digital con IA Generativa - Agente de Diseño Gráfico Autónomo

## Características Principales

- 🎨 **Extracción de ADN de Marca**: Analiza cualquier sitio web y extrae colores, tipografía, tono y estilo visual
- 🖼️ **Generación de Imágenes**: Crea imágenes on-brand con FLUX.1 y consistencia de estilo
- 🎬 **Generación de Videos**: Videos animados con Runway Gen-3 / Luma Dream Machine
- 📱 **Multi-Canal**: Optimizado para LinkedIn, Instagram y Facebook
- ✅ **Logo Automático**: TODAS las imágenes y videos incluyen el logo de la marca

## Estructura del Proyecto

```
marketing-ai-platform/
├── backend/                 # FastAPI Backend
│   ├── app/
│   │   ├── main.py         # Entry point
│   │   ├── core/           # Configuración
│   │   ├── models/         # Pydantic schemas
│   │   ├── api/            # Endpoints
│   │   └── services/       # Lógica de negocio
│   ├── requirements.txt
│   └── .env.example
└── frontend/               # Next.js Frontend (próximo)
```

## Instalación

### Backend

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
playwright install chromium
cp .env.example .env
# Editar .env con tus API keys
uvicorn app.main:app --reload
```

### Variables de Entorno Requeridas

- `OPENAI_API_KEY`: Para análisis de tono y copy
- `REPLICATE_API_TOKEN`: Para generación de imágenes (FLUX.1)
- `SUPABASE_URL` / `SUPABASE_KEY`: Base de datos
- `RUNWAY_API_KEY`: Para generación de video

## API Endpoints

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/brand/extract` | POST | Extrae ADN de una URL |
| `/api/brand/{id}/logo` | POST | Sube logo de marca |
| `/api/generate/image` | POST | Genera imagen con logo |
| `/api/generate/video` | POST | Genera video con watermark |
| `/api/generate/copy` | POST | Genera copy on-brand |

## Logo Integration

> ⚠️ **IMPORTANTE**: Todas las imágenes y videos generados incluyen automáticamente el logo del cliente.

El logo se configura al crear el Brand DNA:
- Posición preferida (bottom-right por defecto)
- Tamaño como porcentaje de la imagen
- Transparencia para watermark de video

## Tech Stack

- **Backend**: FastAPI, LangGraph, Playwright
- **AI**: GPT-4o, FLUX.1, Runway Gen-3
- **Storage**: Supabase, Cloudflare R2
- **Frontend**: Next.js 14 (próximo)

## Roadmap

- [x] Fase 1: Extracción ADN + Generación Imágenes
- [ ] Fase 2: Multi-Canal + Copy + Video Básico
- [ ] Fase 3: Automatización de Campañas

## License

MIT
