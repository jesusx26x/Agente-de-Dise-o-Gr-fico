'use client';

import { useState, useCallback } from 'react';
import { LogoAsset } from '@/types';

interface LogoUploadProps {
    currentLogo: LogoAsset | null;
    onUpload: (file: File, position: LogoAsset['position'], size: LogoAsset['size']) => void;
    isUploading: boolean;
}

const POSITIONS: { value: LogoAsset['position']; label: string; icon: string }[] = [
    { value: 'top-left', label: 'Superior Izq.', icon: '↖' },
    { value: 'top-right', label: 'Superior Der.', icon: '↗' },
    { value: 'bottom-left', label: 'Inferior Izq.', icon: '↙' },
    { value: 'bottom-right', label: 'Inferior Der.', icon: '↘' },
    { value: 'center', label: 'Centro', icon: '◎' }
];

const SIZES: { value: LogoAsset['size']; label: string }[] = [
    { value: 'small', label: 'Pequeño' },
    { value: 'medium', label: 'Mediano' },
    { value: 'large', label: 'Grande' }
];

export default function LogoUpload({ currentLogo, onUpload, isUploading }: LogoUploadProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogo?.url || null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [position, setPosition] = useState<LogoAsset['position']>('bottom-right');
    const [size, setSize] = useState<LogoAsset['size']>('medium');
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleFile(file);
        }
    }, []);

    const handleFile = (file: File) => {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    };

    const handleSubmit = () => {
        if (selectedFile) {
            onUpload(selectedFile, position, size);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto animate-fadeIn">
            <div className="card p-8">
                <h2 className="text-2xl font-bold text-white mb-2 text-center">
                    📌 Configura tu Logo
                </h2>
                <p className="text-gray-400 text-center mb-8">
                    Tu logo aparecerá automáticamente en todas las imágenes y videos generados
                </p>

                {/* Upload Zone */}
                <div
                    className={`upload-zone mb-8 ${isDragOver ? 'dragover' : ''} ${previewUrl ? 'has-file' : ''}`}
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onClick={() => document.getElementById('logo-input')?.click()}
                >
                    <input
                        id="logo-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFile(file);
                        }}
                    />

                    {previewUrl ? (
                        <div className="flex flex-col items-center gap-4">
                            <img
                                src={previewUrl}
                                alt="Logo preview"
                                className="max-w-[200px] max-h-[100px] object-contain"
                            />
                            <span className="text-green-400 text-sm font-medium">
                                ✓ Logo cargado - Haz clic para cambiar
                            </span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <span className="text-white font-medium">Arrastra tu logo aquí</span>
                                <span className="text-gray-500 block text-sm">o haz clic para seleccionar</span>
                            </div>
                            <span className="text-gray-600 text-xs">PNG, SVG o JPG (max. 5MB)</span>
                        </div>
                    )}
                </div>

                {/* Position Selector */}
                <div className="mb-6">
                    <label className="input-label">Posición del Logo</label>
                    <div className="grid grid-cols-5 gap-2">
                        {POSITIONS.map((pos) => (
                            <button
                                key={pos.value}
                                onClick={() => setPosition(pos.value)}
                                className={`p-3 rounded-xl text-center transition-all ${position === pos.value
                                        ? 'bg-indigo-500 text-white'
                                        : 'bg-[var(--surface-light)] text-gray-400 hover:bg-[var(--surface)]'
                                    }`}
                            >
                                <span className="text-xl block mb-1">{pos.icon}</span>
                                <span className="text-xs">{pos.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Size Selector */}
                <div className="mb-8">
                    <label className="input-label">Tamaño del Logo</label>
                    <div className="grid grid-cols-3 gap-4">
                        {SIZES.map((s) => (
                            <button
                                key={s.value}
                                onClick={() => setSize(s.value)}
                                className={`py-3 px-4 rounded-xl font-medium transition-all ${size === s.value
                                        ? 'bg-indigo-500 text-white'
                                        : 'bg-[var(--surface-light)] text-gray-400 hover:bg-[var(--surface)]'
                                    }`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Preview Mockup */}
                {previewUrl && (
                    <div className="mb-8">
                        <label className="input-label">Vista Previa</label>
                        <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden">
                            <div className="absolute inset-4 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center">
                                <span className="text-gray-600">Tu contenido aquí</span>
                            </div>
                            <img
                                src={previewUrl}
                                alt="Logo position preview"
                                className={`absolute object-contain ${size === 'small' ? 'w-12 h-12' : size === 'medium' ? 'w-20 h-20' : 'w-28 h-28'
                                    } ${position === 'top-left' ? 'top-4 left-4' :
                                        position === 'top-right' ? 'top-4 right-4' :
                                            position === 'bottom-left' ? 'bottom-4 left-4' :
                                                position === 'bottom-right' ? 'bottom-4 right-4' :
                                                    'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                                    }`}
                            />
                        </div>
                    </div>
                )}

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={!selectedFile || isUploading}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isUploading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Subiendo...
                        </span>
                    ) : (
                        'Confirmar Logo →'
                    )}
                </button>
            </div>
        </div>
    );
}
