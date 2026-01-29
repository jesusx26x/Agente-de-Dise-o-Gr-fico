'use client';

import { useState } from 'react';

interface UrlInputProps {
    onSubmit: (url: string) => void;
    isLoading: boolean;
}

export default function UrlInput({ onSubmit, isLoading }: UrlInputProps) {
    const [url, setUrl] = useState('');
    const [isValid, setIsValid] = useState(true);

    const validateUrl = (value: string) => {
        if (!value) return true;
        try {
            new URL(value.startsWith('http') ? value : `https://${value}`);
            return true;
        } catch {
            return false;
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        const fullUrl = url.startsWith('http') ? url : `https://${url}`;
        if (validateUrl(fullUrl)) {
            onSubmit(fullUrl);
        } else {
            setIsValid(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
            <div className="relative">
                {/* Glow effect behind input */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-30" />

                <div className="relative glass rounded-2xl p-2">
                    <div className="flex items-center gap-3">
                        {/* Globe icon */}
                        <div className="pl-4 text-indigo-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                                />
                            </svg>
                        </div>

                        <input
                            type="text"
                            value={url}
                            onChange={(e) => {
                                setUrl(e.target.value);
                                setIsValid(true);
                            }}
                            placeholder="Ingresa la URL de tu empresa..."
                            className={`flex-1 bg-transparent border-none outline-none text-lg text-white placeholder:text-gray-500 py-4 ${!isValid ? 'text-red-400' : ''
                                }`}
                            disabled={isLoading}
                        />

                        <button
                            type="submit"
                            disabled={!url || isLoading}
                            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Analizando...</span>
                                </>
                            ) : (
                                <>
                                    <span>Extraer ADN</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {!isValid && (
                <p className="text-red-400 text-sm mt-2 text-center animate-fadeIn">
                    Por favor ingresa una URL válida
                </p>
            )}

            {/* Example URLs */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
                <span className="text-gray-500 text-sm">Ejemplos:</span>
                {['apple.com', 'spotify.com', 'airbnb.com'].map((example) => (
                    <button
                        key={example}
                        type="button"
                        onClick={() => setUrl(example)}
                        className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                        {example}
                    </button>
                ))}
            </div>
        </form>
    );
}
