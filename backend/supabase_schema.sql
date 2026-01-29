-- =============================================
-- Marketing AI Platform - Supabase Schema
-- =============================================
-- Copia este archivo completo en el SQL Editor de Supabase
-- y ejecuta con "Run" o Ctrl+Enter

-- Habilitar UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLA: users (perfiles de usuario)
-- =============================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- TABLA: brands (ADN de marca)
-- =============================================
CREATE TABLE IF NOT EXISTS public.brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    website_url TEXT,
    
    -- Colores (JSON)
    colors JSONB DEFAULT '{
        "primary": "#6366f1",
        "secondary": "#ec4899",
        "accent": "#06b6d4",
        "background": "#ffffff",
        "text": "#1a1a2e"
    }'::jsonb,
    
    -- Tipografía (JSON)
    typography JSONB DEFAULT '{
        "headingFont": "Inter",
        "bodyFont": "Inter",
        "headingWeight": "700",
        "bodyWeight": "400"
    }'::jsonb,
    
    -- Logo
    logo_url TEXT,
    logo_position TEXT DEFAULT 'bottom-right',
    logo_size TEXT DEFAULT 'medium',
    logo_opacity DECIMAL DEFAULT 1.0,
    
    -- Análisis de tono
    tone TEXT DEFAULT 'profesional',
    keywords TEXT[] DEFAULT ARRAY['innovación', 'calidad'],
    industry TEXT,
    
    -- Vectores semánticos (para búsqueda)
    tone_analysis JSONB,
    visual_analysis JSONB,
    
    -- Metadatos
    extraction_status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_brands_updated_at
    BEFORE UPDATE ON public.brands
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Índice para búsqueda por usuario
CREATE INDEX idx_brands_user_id ON public.brands(user_id);

-- =============================================
-- TABLA: generated_content (imágenes y videos)
-- =============================================
CREATE TABLE IF NOT EXISTS public.generated_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Tipo y plataforma
    content_type TEXT NOT NULL CHECK (content_type IN ('image', 'video')),
    platform TEXT NOT NULL CHECK (platform IN ('instagram_post', 'instagram_story', 'facebook', 'linkedin')),
    
    -- URLs del contenido
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    
    -- Generación
    prompt TEXT,
    generation_params JSONB,
    
    -- Formatos de descarga disponibles
    download_formats JSONB DEFAULT '[]'::jsonb,
    
    -- Metadatos
    file_size_bytes BIGINT,
    width INTEGER,
    height INTEGER,
    duration_seconds INTEGER, -- Solo para videos
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_content_brand_id ON public.generated_content(brand_id);
CREATE INDEX idx_content_user_id ON public.generated_content(user_id);
CREATE INDEX idx_content_type ON public.generated_content(content_type);

-- =============================================
-- TABLA: campaigns (para fase futura)
-- =============================================
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'active', 'completed', 'paused')),
    
    -- Plataformas objetivo
    target_platforms TEXT[] DEFAULT ARRAY['instagram', 'facebook'],
    
    -- Programación
    scheduled_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_campaigns_updated_at
    BEFORE UPDATE ON public.campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- STORAGE: Bucket para logos y contenido
-- =============================================
-- Nota: Ejecuta estos comandos en una query separada

-- Crear bucket para logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Crear bucket para contenido generado
INSERT INTO storage.buckets (id, name, public)
VALUES ('generated-content', 'generated-content', true)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Políticas para users
CREATE POLICY "Users can view own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

-- Políticas para brands
CREATE POLICY "Users can view own brands"
    ON public.brands FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create brands"
    ON public.brands FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own brands"
    ON public.brands FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own brands"
    ON public.brands FOR DELETE
    USING (auth.uid() = user_id);

-- Políticas para generated_content
CREATE POLICY "Users can view own content"
    ON public.generated_content FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create content"
    ON public.generated_content FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own content"
    ON public.generated_content FOR DELETE
    USING (auth.uid() = user_id);

-- Políticas para campaigns
CREATE POLICY "Users can view own campaigns"
    ON public.campaigns FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own campaigns"
    ON public.campaigns FOR ALL
    USING (auth.uid() = user_id);

-- =============================================
-- Políticas de Storage
-- =============================================

-- Política para logos bucket
CREATE POLICY "Users can upload logos"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'logos' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view logos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'logos');

-- Política para generated-content bucket
CREATE POLICY "Users can upload generated content"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'generated-content' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view generated content"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'generated-content');

-- =============================================
-- ¡LISTO! Tu base de datos está configurada.
-- =============================================
