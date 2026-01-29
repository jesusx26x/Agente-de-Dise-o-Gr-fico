'use client';

import { useState } from 'react';
import { GeneratedContent, DownloadFormat } from '@/types';

interface ContentGalleryProps {
    items: GeneratedContent[];
    onDownload: (item: GeneratedContent, format: DownloadFormat) => void;
}

export default function ContentGallery({ items, onDownload }: ContentGalleryProps) {
    const [selectedItem, setSelectedItem] = useState<GeneratedContent | null>(null);
    const [showDownloadModal, setShowDownloadModal] = useState(false);

    const handleDownloadClick = (item: GeneratedContent) => {
        setSelectedItem(item);
        setShowDownloadModal(true);
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white">Tu Contenido Generado</h2>
                    <p className="text-gray-400 mt-1">{items.length} elementos creados</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn-secondary text-sm">
                        Filtrar
                    </button>
                    <button className="btn-primary text-sm">
                        + Generar Nuevo
                    </button>
                </div>
            </div>

            {/* Gallery Grid */}
            {items.length > 0 ? (
                <div className="gallery-grid">
                    {items.map((item) => (
                        <div key={item.id} className="gallery-item group">
                            {item.type === 'video' ? (
                                <video
                                    src={item.url}
                                    poster={item.thumbnailUrl}
                                    className="w-full h-full object-cover"
                                    muted
                                    loop
                                    onMouseEnter={(e) => e.currentTarget.play()}
                                    onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                                />
                            ) : (
                                <img
                                    src={item.url}
                                    alt={item.prompt}
                                    className="w-full h-full object-cover"
                                />
                            )}

                            {/* Type badge */}
                            <div className="absolute top-3 left-3 z-10">
                                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${item.type === 'video'
                                        ? 'bg-pink-500/80 text-white'
                                        : 'bg-indigo-500/80 text-white'
                                    }`}>
                                    {item.type === 'video' ? '🎬 Video' : '🖼️ Imagen'}
                                </span>
                            </div>

                            {/* Platform badge */}
                            <div className="absolute top-3 right-3 z-10">
                                <span className="px-2 py-1 rounded-lg bg-black/50 text-white text-xs">
                                    {item.platform.replace('_', ' ')}
                                </span>
                            </div>

                            {/* Overlay with actions */}
                            <div className="gallery-overlay">
                                <p className="text-white text-sm mb-3 line-clamp-2">{item.prompt}</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleDownloadClick(item)}
                                        className="download-btn download-btn-hd flex-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Descargar HD
                                    </button>
                                    <button className="download-btn download-btn-format">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--surface-light)] flex items-center justify-center">
                        <span className="text-4xl">🎨</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                        Aún no has generado contenido
                    </h3>
                    <p className="text-gray-400 mb-6">
                        Comienza creando tu primera imagen o video
                    </p>
                    <button className="btn-primary">
                        Crear Primer Contenido
                    </button>
                </div>
            )}

            {/* Download Modal */}
            {showDownloadModal && selectedItem && (
                <DownloadModal
                    item={selectedItem}
                    onClose={() => setShowDownloadModal(false)}
                    onDownload={onDownload}
                />
            )}
        </div>
    );
}

// Download Modal Component
interface DownloadModalProps {
    item: GeneratedContent;
    onClose: () => void;
    onDownload: (item: GeneratedContent, format: DownloadFormat) => void;
}

function DownloadModal({ item, onClose, onDownload }: DownloadModalProps) {
    const isVideo = item.type === 'video';

    const imageFormats: DownloadFormat[] = [
        { format: 'png', quality: 'hd', url: '', size: '~2.5 MB' },
        { format: 'png', quality: '4k', url: '', size: '~8 MB' },
        { format: 'jpg', quality: 'hd', url: '', size: '~800 KB' },
        { format: 'webp', quality: 'hd', url: '', size: '~400 KB' },
        { format: 'pdf', quality: 'hd', url: '', size: '~3 MB' }
    ];

    const videoFormats: DownloadFormat[] = [
        { format: 'mp4', quality: 'hd', url: '', size: '~15 MB' },
        { format: 'mp4', quality: '4k', url: '', size: '~50 MB' },
        { format: 'mov', quality: 'hd', url: '', size: '~25 MB' },
        { format: 'webm', quality: 'hd', url: '', size: '~10 MB' }
    ];

    const formats = isVideo ? videoFormats : imageFormats;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative glass rounded-2xl p-6 w-full max-w-md animate-scaleIn">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h3 className="text-xl font-bold text-white mb-2">
                    Descargar {isVideo ? 'Video' : 'Imagen'}
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                    Selecciona formato y calidad HD
                </p>

                {/* Preview */}
                <div className="relative aspect-video rounded-xl overflow-hidden mb-6 bg-[var(--surface-light)]">
                    {isVideo ? (
                        <video src={item.url} className="w-full h-full object-cover" muted loop autoPlay />
                    ) : (
                        <img src={item.url} alt="" className="w-full h-full object-cover" />
                    )}
                </div>

                {/* Format Options */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {formats.map((format, index) => (
                        <button
                            key={index}
                            onClick={() => onDownload(item, format)}
                            className="w-full flex items-center justify-between p-4 rounded-xl bg-[var(--surface-light)] hover:bg-[var(--surface)] transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${format.quality === '4k'
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                                        : 'bg-indigo-500/30'
                                    }`}>
                                    <span className="text-white font-bold text-xs uppercase">
                                        {format.format}
                                    </span>
                                </div>
                                <div className="text-left">
                                    <span className="text-white font-medium block">
                                        {format.format.toUpperCase()} - {format.quality.toUpperCase()}
                                    </span>
                                    <span className="text-gray-500 text-sm">{format.size}</span>
                                </div>
                            </div>
                            <svg
                                className="w-5 h-5 text-gray-500 group-hover:text-indigo-400 transition-colors"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                        </button>
                    ))}
                </div>

                {/* Quick Download HD */}
                <button
                    onClick={() => onDownload(item, formats[0])}
                    className="btn-primary w-full mt-4"
                >
                    <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Descarga Rápida HD
                    </span>
                </button>
            </div>
        </div>
    );
}
