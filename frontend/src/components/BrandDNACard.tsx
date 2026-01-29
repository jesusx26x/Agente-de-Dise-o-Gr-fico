'use client';

import { BrandDNA } from '@/types';

interface BrandDNACardProps {
    brand: BrandDNA;
    onConfirm: () => void;
    onEdit?: () => void;
}

export default function BrandDNACard({ brand, onConfirm, onEdit }: BrandDNACardProps) {
    return (
        <div className="w-full max-w-4xl mx-auto animate-scaleIn">
            <div className="card p-0 overflow-hidden">
                {/* Header with gradient */}
                <div
                    className="p-8 relative"
                    style={{
                        background: `linear-gradient(135deg, ${brand.colors.primary}40 0%, ${brand.colors.secondary}40 100%)`
                    }}
                >
                    <div className="absolute inset-0 bg-grid opacity-30" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                            {brand.logo && (
                                <img
                                    src={brand.logo.url}
                                    alt={`${brand.name} logo`}
                                    className="w-16 h-16 object-contain bg-white rounded-xl p-2"
                                />
                            )}
                            <div>
                                <h2 className="text-3xl font-bold text-white">{brand.name}</h2>
                                <a
                                    href={brand.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-300 hover:text-white transition-colors text-sm"
                                >
                                    {brand.websiteUrl} ↗
                                </a>
                            </div>
                        </div>

                        {/* Industry & Tone */}
                        <div className="flex flex-wrap gap-2 mt-4">
                            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium">
                                {brand.industry}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm">
                                Tono: {brand.tone}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                    {/* Color Palette */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <span>🎨</span> Paleta de Colores
                        </h3>
                        <div className="flex gap-4">
                            {Object.entries(brand.colors).map(([name, color]) => (
                                <div key={name} className="text-center">
                                    <div
                                        className="w-16 h-16 rounded-xl shadow-lg mb-2 ring-2 ring-white/10 transition-transform hover:scale-110"
                                        style={{ backgroundColor: color }}
                                    />
                                    <span className="text-xs text-gray-400 capitalize">{name}</span>
                                    <span className="block text-xs font-mono text-gray-500">{color}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Typography */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <span>✒️</span> Tipografía
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="glass-light rounded-xl p-4">
                                <span className="text-sm text-gray-400 block mb-2">Encabezados</span>
                                <span
                                    className="text-2xl text-white"
                                    style={{ fontFamily: brand.typography.headingFont }}
                                >
                                    {brand.typography.headingFont}
                                </span>
                            </div>
                            <div className="glass-light rounded-xl p-4">
                                <span className="text-sm text-gray-400 block mb-2">Cuerpo</span>
                                <span
                                    className="text-lg text-white"
                                    style={{ fontFamily: brand.typography.bodyFont }}
                                >
                                    {brand.typography.bodyFont}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Keywords */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <span>🏷️</span> Palabras Clave
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {brand.keywords.map((keyword, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-medium border border-indigo-500/30"
                                >
                                    {keyword}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-white/5 flex justify-end gap-4">
                    {onEdit && (
                        <button onClick={onEdit} className="btn-secondary">
                            Editar
                        </button>
                    )}
                    <button onClick={onConfirm} className="btn-primary">
                        Confirmar ADN ✓
                    </button>
                </div>
            </div>
        </div>
    );
}
