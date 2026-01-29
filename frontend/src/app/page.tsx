'use client';

import { useState, useEffect } from 'react';
import {
  UrlInput,
  ExtractionProgress,
  BrandDNACard,
  LogoUpload,
  GenerationForm,
  ContentGallery
} from '@/components';
import {
  BrandDNA,
  ExtractionStatus,
  GeneratedContent,
  GenerationStep,
  DownloadFormat,
  LogoAsset
} from '@/types';
import { downloadContent } from '@/lib/api';

// Mock data for demo
const MOCK_BRAND: BrandDNA = {
  id: 'demo-1',
  name: 'TechVenture',
  websiteUrl: 'https://techventure.com',
  colors: {
    primary: '#6366f1',
    secondary: '#ec4899',
    accent: '#06b6d4',
    background: '#0f172a',
    text: '#f8fafc'
  },
  typography: {
    headingFont: 'Space Grotesk',
    bodyFont: 'Inter',
    headingWeight: '700',
    bodyWeight: '400'
  },
  logo: null,
  tone: 'Profesional e Innovador',
  keywords: ['tecnología', 'innovación', 'startup', 'digital', 'futuro'],
  industry: 'Tecnología',
  extractedAt: new Date().toISOString()
};

const MOCK_CONTENT: GeneratedContent[] = [
  {
    id: '1',
    type: 'image',
    platform: 'instagram_post',
    url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300',
    prompt: 'Promoción de lanzamiento con estilo tech futurista',
    createdAt: new Date().toISOString(),
    brandId: 'demo-1',
    downloadFormats: []
  },
  {
    id: '2',
    type: 'image',
    platform: 'facebook',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300',
    prompt: 'Banner corporativo con datos y métricas',
    createdAt: new Date().toISOString(),
    brandId: 'demo-1',
    downloadFormats: []
  }
];

export default function Home() {
  const [step, setStep] = useState<GenerationStep>('url');
  const [extractionStatus, setExtractionStatus] = useState<ExtractionStatus>({
    stage: 'idle',
    progress: 0,
    message: ''
  });
  const [brand, setBrand] = useState<BrandDNA | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

  // Simulate extraction process
  const handleExtract = async (url: string) => {
    setIsExtracting(true);
    setStep('extracting');

    const stages: { stage: ExtractionStatus['stage']; message: string; progress: number }[] = [
      { stage: 'crawling', message: 'Escaneando páginas del sitio...', progress: 20 },
      { stage: 'analyzing_colors', message: 'Extrayendo paleta de colores...', progress: 40 },
      { stage: 'analyzing_fonts', message: 'Identificando tipografías...', progress: 60 },
      { stage: 'analyzing_tone', message: 'Analizando tono de comunicación...', progress: 80 },
      { stage: 'complete', message: '¡ADN de marca extraído!', progress: 100 }
    ];

    for (const s of stages) {
      setExtractionStatus(s);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Use mock data for demo
    setBrand({ ...MOCK_BRAND, websiteUrl: url });
    setIsExtracting(false);
    setStep('confirm');
  };

  const handleConfirmBrand = () => {
    setStep('logo');
  };

  const handleLogoUpload = (file: File, position: LogoAsset['position'], size: LogoAsset['size']) => {
    if (brand) {
      const logoUrl = URL.createObjectURL(file);
      setBrand({
        ...brand,
        logo: {
          id: 'logo-1',
          url: logoUrl,
          position,
          size,
          opacity: 1
        }
      });
      setStep('generate');
    }
  };

  const handleGenerate = async (platform: string, prompt: string, type: 'image' | 'video') => {
    setIsGenerating(true);

    // Simulate generation
    await new Promise(resolve => setTimeout(resolve, 3000));

    const newContent: GeneratedContent = {
      id: Date.now().toString(),
      type,
      platform: platform as any,
      url: MOCK_CONTENT[0].url,
      thumbnailUrl: MOCK_CONTENT[0].thumbnailUrl,
      prompt,
      createdAt: new Date().toISOString(),
      brandId: brand?.id || '',
      downloadFormats: []
    };

    setGeneratedContent(prev => [newContent, ...prev]);
    setIsGenerating(false);
    setStep('gallery');
  };

  const handleDownload = async (item: GeneratedContent, format: DownloadFormat) => {
    // For demo, download the image directly
    const filename = `${item.platform}_${Date.now()}.${format.format}`;
    await downloadContent(item.url, filename);
  };

  const renderNavigation = () => {
    const steps = [
      { id: 'url', label: 'URL', icon: '🌐' },
      { id: 'confirm', label: 'ADN', icon: '🧬' },
      { id: 'logo', label: 'Logo', icon: '📌' },
      { id: 'generate', label: 'Crear', icon: '✨' },
      { id: 'gallery', label: 'Galería', icon: '🖼️' }
    ];

    const currentIndex = steps.findIndex(s => s.id === step);

    return (
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <span className="text-xl font-bold text-white">
                Marketing<span className="text-indigo-400">AI</span>
              </span>
            </div>

            {/* Steps */}
            <div className="hidden md:flex items-center gap-1">
              {steps.map((s, index) => {
                const isActive = s.id === step;
                const isCompleted = index < currentIndex;
                const isClickable = isCompleted || s.id === 'gallery';

                return (
                  <button
                    key={s.id}
                    onClick={() => isClickable && setStep(s.id as GenerationStep)}
                    disabled={!isClickable}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isActive
                      ? 'bg-indigo-500/20 text-indigo-400'
                      : isCompleted
                        ? 'text-green-400 hover:bg-white/5'
                        : 'text-gray-500'
                      } ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                  >
                    <span>{s.icon}</span>
                    <span className="text-sm font-medium">{s.label}</span>
                    {isCompleted && <span className="text-green-400">✓</span>}
                  </button>
                );
              })}
            </div>

            {/* User menu placeholder */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center">
              <span className="text-white text-sm">U</span>
            </div>
          </div>
        </div>
      </nav>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--background)] relative">
      {/* Background effects */}
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-radial pointer-events-none" />

      {/* Navigation */}
      {renderNavigation()}

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">

          {/* URL Input Step */}
          {step === 'url' && (
            <div className="min-h-[70vh] flex flex-col items-center justify-center">
              <div className="text-center mb-12 animate-fadeIn">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                  Crea contenido que
                  <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    refleja tu marca
                  </span>
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                  Extrae el ADN de tu empresa y genera imágenes y videos únicos
                  con tu logo incluido automáticamente
                </p>
              </div>

              <UrlInput
                onSubmit={handleExtract}
                isLoading={isExtracting}
              />

              {/* Features */}
              <div className="grid md:grid-cols-3 gap-6 mt-16 w-full max-w-4xl animate-fadeIn" style={{ animationDelay: '200ms' }}>
                {[
                  { icon: '🧬', title: 'Extracción de ADN', desc: 'Analizamos tu sitio web automáticamente' },
                  { icon: '🎨', title: 'Contenido Único', desc: 'Imágenes y videos con tu estilo de marca' },
                  { icon: '📥', title: 'Descarga HD', desc: 'Múltiples formatos y calidades' }
                ].map((feature, i) => (
                  <div key={i} className="card card-glow text-center">
                    <span className="text-3xl mb-3 block">{feature.icon}</span>
                    <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extracting Step */}
          {step === 'extracting' && (
            <div className="min-h-[70vh] flex items-center justify-center">
              <ExtractionProgress status={extractionStatus} />
            </div>
          )}

          {/* Confirm Brand Step */}
          {step === 'confirm' && brand && (
            <div className="py-8">
              <BrandDNACard
                brand={brand}
                onConfirm={handleConfirmBrand}
              />
            </div>
          )}

          {/* Logo Upload Step */}
          {step === 'logo' && (
            <div className="min-h-[70vh] flex items-center justify-center py-8">
              <LogoUpload
                currentLogo={brand?.logo || null}
                onUpload={handleLogoUpload}
                isUploading={false}
              />
            </div>
          )}

          {/* Generation Step */}
          {step === 'generate' && (
            <div className="py-8">
              <GenerationForm
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            </div>
          )}

          {/* Gallery Step */}
          {step === 'gallery' && (
            <div className="py-8">
              <ContentGallery
                items={generatedContent.length > 0 ? generatedContent : MOCK_CONTENT}
                onDownload={handleDownload}
              />

              {/* Generate more button */}
              <div className="text-center mt-8">
                <button
                  onClick={() => setStep('generate')}
                  className="btn-primary"
                >
                  + Generar Más Contenido
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-500 text-sm">
            © 2026 MarketingAI Platform. Todos los derechos reservados.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Términos</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacidad</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
