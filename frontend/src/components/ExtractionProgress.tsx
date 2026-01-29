'use client';

import { ExtractionStatus } from '@/types';

interface ExtractionProgressProps {
    status: ExtractionStatus;
}

const STAGES = [
    { id: 'crawling', label: 'Escaneando sitio web', icon: '🌐' },
    { id: 'analyzing_colors', label: 'Extrayendo colores', icon: '🎨' },
    { id: 'analyzing_fonts', label: 'Analizando tipografía', icon: '✒️' },
    { id: 'analyzing_tone', label: 'Detectando tono de marca', icon: '🎯' },
    { id: 'complete', label: '¡ADN extraído!', icon: '✨' }
];

export default function ExtractionProgress({ status }: ExtractionProgressProps) {
    const currentStageIndex = STAGES.findIndex(s => s.id === status.stage);

    return (
        <div className="w-full max-w-xl mx-auto animate-fadeIn">
            <div className="card card-glow p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center animate-pulse-glow">
                        <svg className="w-10 h-10 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Extrayendo ADN de Marca
                    </h2>
                    <p className="text-gray-400">{status.message}</p>
                </div>

                {/* Progress bar */}
                <div className="progress-bar mb-8">
                    <div
                        className="progress-fill"
                        style={{ width: `${status.progress}%` }}
                    />
                </div>

                {/* Stages list */}
                <div className="space-y-3">
                    {STAGES.map((stage, index) => {
                        const isComplete = index < currentStageIndex;
                        const isCurrent = index === currentStageIndex;
                        const isPending = index > currentStageIndex;

                        return (
                            <div
                                key={stage.id}
                                className={`step ${isCurrent ? 'active' : ''} ${isComplete ? 'completed' : ''}`}
                                style={{
                                    opacity: isPending ? 0.4 : 1,
                                    animationDelay: `${index * 100}ms`
                                }}
                            >
                                <div className="step-number">
                                    {isComplete ? (
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <span>{stage.icon}</span>
                                    )}
                                </div>
                                <span className={`font-medium ${isCurrent ? 'text-white' : isComplete ? 'text-green-400' : 'text-gray-500'}`}>
                                    {stage.label}
                                </span>
                                {isCurrent && (
                                    <div className="ml-auto">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Progress percentage */}
                <div className="text-center mt-6">
                    <span className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
                        {status.progress}%
                    </span>
                </div>
            </div>
        </div>
    );
}
