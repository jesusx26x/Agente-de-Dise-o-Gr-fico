// Brand DNA Types for Marketing AI Platform

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface Typography {
  headingFont: string;
  bodyFont: string;
  headingWeight: string;
  bodyWeight: string;
}

export interface LogoAsset {
  id: string;
  url: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  size: 'small' | 'medium' | 'large';
  opacity: number;
}

export interface BrandDNA {
  id: string;
  name: string;
  websiteUrl: string;
  colors: ColorPalette;
  typography: Typography;
  logo: LogoAsset | null;
  tone: string;
  keywords: string[];
  industry: string;
  extractedAt: string;
}

export interface GeneratedContent {
  id: string;
  type: 'image' | 'video';
  platform: 'instagram_post' | 'instagram_story' | 'facebook' | 'linkedin';
  url: string;
  thumbnailUrl: string;
  prompt: string;
  createdAt: string;
  brandId: string;
  downloadFormats: DownloadFormat[];
}

export interface DownloadFormat {
  format: 'png' | 'jpg' | 'webp' | 'pdf' | 'mp4' | 'mov' | 'webm';
  quality: 'standard' | 'hd' | '4k';
  url: string;
  size: string;
}

export interface Platform {
  id: string;
  name: string;
  icon: string;
  aspectRatio: string;
  dimensions: {
    width: number;
    height: number;
  };
}

export const PLATFORMS: Platform[] = [
  {
    id: 'instagram_post',
    name: 'Instagram Post',
    icon: '📸',
    aspectRatio: '1:1',
    dimensions: { width: 1080, height: 1080 }
  },
  {
    id: 'instagram_story',
    name: 'Instagram Story',
    icon: '📱',
    aspectRatio: '9:16',
    dimensions: { width: 1080, height: 1920 }
  },
  {
    id: 'facebook',
    name: 'Facebook Post',
    icon: '📘',
    aspectRatio: '1.91:1',
    dimensions: { width: 1200, height: 630 }
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Post',
    icon: '💼',
    aspectRatio: '1.91:1',
    dimensions: { width: 1200, height: 627 }
  }
];

export type GenerationStep = 'url' | 'extracting' | 'confirm' | 'logo' | 'generate' | 'gallery';

export interface ExtractionStatus {
  stage: 'idle' | 'crawling' | 'analyzing_colors' | 'analyzing_fonts' | 'analyzing_tone' | 'complete' | 'error';
  progress: number;
  message: string;
}
