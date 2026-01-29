'use client';

import { useState } from 'react';
import { PLATFORMS, Platform } from '@/types';

interface GenerationFormProps {
    onGenerate: (platform: string, prompt: string, type: 'image' | 'video') => void;
    isGenerating: boolean;
}

export default function GenerationForm({ onGenerate, isGenerating }: GenerationFormProps) {
    const [selectedPlatform, setSelectedPlatform] = useState<Platform>(PLATFORMS[0]);
    const [prompt, setPrompt] = useState('');
    const [contentType, setContentType] = useState<'image' | 'video'>('image');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim()) {
            onGenerate(selectedPlatform.id, prompt, contentType);
        }
    };

    const promptSuggestions = [
        'Promoción de descuento del 50% para el Black Friday',
        'Anuncio de nuevo producto innovador',
        'Mensaje inspiracional para emprendedores',
        'Testimonio de cliente satisfecho'
    ];

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="card p-8">
                <h2 className="text-2xl font-bold text-white mb-2 text-center">
                    ✨ Genera Contenido
                </h2>
                <p className="text-gray-400 text-center mb-8">
                    Tu logo se incluirá automáticamente en todo el contenido
                </p>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Content Type Toggle */}
                    <div className="flex justify-center gap-4 p-1 bg-[var(--surface-light)] rounded-xl w-fit mx-auto">
                        <button
                            type="button"
                            onClick={() => setContentType('image')}
                            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${contentType === 'image'
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <span>🖼️</span> Imagen
                        </button>
                        <button
                            type="button"
                            onClick={() => setContentType('video')}
                            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${contentType === 'video'
                                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <span>🎬</span> Video
                        </button>
                    </div>

                    {/* Platform Selection */}
                    <div>
                        <label className="input-label">Plataforma</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {PLATFORMS.map((platform) => (
                                <button
                                    key={platform.id}
                                    type="button"
                                    onClick={() => setSelectedPlatform(platform)}
                                    className={`p-4 rounded-xl text-center transition-all ${selectedPlatform.id === platform.id
                                            ? 'bg-indigo-500/20 border-2 border-indigo-500 text-white'
                                            : 'bg-[var(--surface-light)] border-2 border-transparent text-gray-400 hover:border-gray-600'
                                        }`}
                                >
                                    <span className="text-2xl block mb-2">{platform.icon}</span>
                                    <span className="font-medium text-sm">{platform.name}</span>
                                    <span className="block text-xs text-gray-500 mt-1">{platform.aspectRatio}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Prompt Input */}
                    <div>
                        <label className="input-label">Describe tu contenido</label>
                        <div className="relative">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Ej: Una imagen promocional para el lanzamiento de nuestro nuevo producto con colores vibrantes y estilo moderno..."
                                className="input min-h-[140px] resize-none"
                                rows={4}
                            />
                            <div className="absolute bottom-3 right-3 text-gray-500 text-sm">
                                {prompt.length}/500
                            </div>
                        </div>
                    </div>

                    {/* Prompt Suggestions */}
                    <div>
                        <label className="input-label">Sugerencias</label>
                        <div className="flex flex-wrap gap-2">
                            {promptSuggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setPrompt(suggestion)}
                                    className="px-3 py-2 text-sm rounded-lg bg-[var(--surface-light)] text-gray-400 hover:text-white hover:bg-[var(--surface)] transition-all"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="glass-light rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-400 text-sm">Vista previa del formato</span>
                            <span className="text-indigo-400 text-sm font-medium">
                                {selectedPlatform.dimensions.width} × {selectedPlatform.dimensions.height}px
                            </span>
                        </div>
                        <div
                            className="mx-auto bg-[var(--surface)] rounded-xl flex items-center justify-center relative overflow-hidden"
                            style={{
                                aspectRatio: selectedPlatform.aspectRatio.replace(':', '/'),
                                maxWidth: '300px'
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-pink-500/10" />
                            <span className="text-gray-600 z-10">
                                {selectedPlatform.icon} {selectedPlatform.name}
                            </span>
                            {/* Logo indicator */}
                            <div className="absolute bottom-2 right-2 w-8 h-8 rounded bg-white/10 flex items-center justify-center">
                                <span className="text-xs text-gray-500">Logo</span>
                            </div>
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button
                        type="submit"
                        disabled={!prompt.trim() || isGenerating}
                        className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <span className="flex items-center justify-center gap-3">
                                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Generando {contentType === 'video' ? 'video' : 'imagen'}...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <span>Generar {contentType === 'video' ? 'Video' : 'Imagen'}</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
