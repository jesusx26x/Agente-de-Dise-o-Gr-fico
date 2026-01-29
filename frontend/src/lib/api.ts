// API Client for Marketing AI Platform

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function extractBrandDNA(url: string) {
    const response = await fetch(`${API_BASE_URL}/api/brand-dna/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
    });

    if (!response.ok) {
        throw new Error('Failed to extract brand DNA');
    }

    return response.json();
}

export async function uploadLogo(file: File, brandId: string) {
    const formData = new FormData();
    formData.append('logo', file);
    formData.append('brand_id', brandId);

    const response = await fetch(`${API_BASE_URL}/api/brand-dna/logo`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Failed to upload logo');
    }

    return response.json();
}

export async function generateImage(brandId: string, platform: string, prompt: string) {
    const response = await fetch(`${API_BASE_URL}/api/generation/image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand_id: brandId, platform, prompt })
    });

    if (!response.ok) {
        throw new Error('Failed to generate image');
    }

    return response.json();
}

export async function generateVideo(brandId: string, prompt: string, duration: number = 5) {
    const response = await fetch(`${API_BASE_URL}/api/generation/video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand_id: brandId, prompt, duration_seconds: duration })
    });

    if (!response.ok) {
        throw new Error('Failed to generate video');
    }

    return response.json();
}

export async function getDownloadUrl(contentId: string, format: string, quality: string) {
    const response = await fetch(
        `${API_BASE_URL}/api/generation/download/${contentId}?format=${format}&quality=${quality}`
    );

    if (!response.ok) {
        throw new Error('Failed to get download URL');
    }

    return response.json();
}

export async function downloadContent(url: string, filename: string) {
    const response = await fetch(url);
    const blob = await response.blob();

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}
