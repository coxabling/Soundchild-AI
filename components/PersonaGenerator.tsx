
import React, { useState } from 'react';
import { runPersonaGenerator } from '../services/geminiService';
import type { PersonaGeneratorResponse, PersonaGeneratorFormData } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { SparklesIcon, Users2Icon } from './icons';
import { useApiKey, useNotification } from '../App';

// Mock data representing the curator's profile
const mockCuratorData: PersonaGeneratorFormData = {
    curator_genres: ['Synthwave', 'Lofi Hip-Hop', 'Indie Rock', 'Retrowave'],
    curator_accepted_tracks: [
        { genre: 'Synthwave', mood: 'Nostalgic' },
        { genre: 'Lofi Hip-Hop', mood: 'Chill' },
        { genre: 'Indie Rock', mood: 'Energetic' },
        { genre: 'Synthwave', mood: 'Driving' },
    ],
};

export const PersonaGenerator: React.FC = () => {
    const [result, setResult] = useState<PersonaGeneratorResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { addNotification } = useNotification();
    const { resetKeySelection } = useApiKey();
    
    const handleGenerate = async () => {
        setIsLoading(true);
        setResult(null);
        try {
            const response = await runPersonaGenerator(mockCuratorData);
            setResult(response);
            addNotification({ message: 'Audience personas generated!', type: 'success' });
        } catch (error) {
            if (error instanceof Error && error.message.includes("Requested entity was not found")) {
                resetKeySelection();
            }
            addNotification({ message: error instanceof Error ? error.message : 'An unknown error occurred.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
             <div>
                <h3 className="text-lg font-semibold text-[var(--accent-primary-hover)] mb-4 flex items-center gap-2">
                    <Users2Icon className="w-5 h-5"/>
                    Audience Persona Generator
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">Understand your listeners on a deeper level. The AI will analyze your accepted tracks and genre preferences to generate detailed audience personas.</p>
            </div>
            
            {!result && (
                <div className="text-center p-8 bg-[var(--surface-primary)]/50 rounded-lg border border-[var(--border)]">
                    <button onClick={handleGenerate} disabled={isLoading} className="inline-flex items-center gap-3 px-8 py-3 bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg disabled:opacity-50">
                         {isLoading ? <><LoadingSpinner/> Generating...</> : <><SparklesIcon className="w-6 h-6"/> Generate My Audience Personas</>}
                    </button>
                </div>
            )}
            
            {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {result.personas.map((persona, index) => (
                        <div key={index} className="bg-[var(--surface-primary)]/50 p-6 rounded-lg border border-[var(--border)] space-y-4">
                            <h4 className="text-xl font-bold text-[var(--accent-primary)]">{persona.name}</h4>
                            <div>
                                <h5 className="font-semibold text-[var(--text-primary)] text-sm mb-1">Demographics</h5>
                                <p className="text-sm text-[var(--text-secondary)]">{persona.demographics}</p>
                            </div>
                            <div>
                                <h5 className="font-semibold text-[var(--text-primary)] text-sm mb-1">Listening Habits</h5>
                                <p className="text-sm text-[var(--text-secondary)]">{persona.listening_habits}</p>
                            </div>
                             <div>
                                <h5 className="font-semibold text-[var(--text-primary)] text-sm mb-1">Other Interests</h5>
                                <p className="text-sm text-[var(--text-secondary)]">{persona.other_interests}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
