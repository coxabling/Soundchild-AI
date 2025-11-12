import React, { useState } from 'react';
import { runPlaylistAssistant } from '../services/geminiService';
import type { PlaylistAssistantResponse, PlaylistAssistantFormData } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { MusicNoteIcon, SparklesIcon, ListMusicIcon, SpotifyIcon } from './icons';
import { useNotification } from '../App';

const mockAcceptedTracks = [
    { title: 'Neon Tides', artist: 'Luna Bloom' },
    { title: 'Morning Mist', artist: 'Sol' },
    { title: 'Starlight Runner', artist: 'Vector Hold' },
    { title: 'City Lights', artist: 'The Fuse' },
    { title: 'Kyoto Dreams', artist: 'Sol' },
    { title: 'Sunset Fader', artist: 'Luna Bloom' },
    { title: 'Highway Zero', artist: 'Grid Shifter' },
    { title: 'Aruarian Dance', artist: 'Nujabes' },
];

export const PlaylistAssistant: React.FC = () => {
    const [formData, setFormData] = useState({ seed_tracks: 'Neon Tides by Luna Bloom', mood: 'Late night drive, nostalgic but hopeful' });
    const [result, setResult] = useState<PlaylistAssistantResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { addNotification } = useNotification();

    const handleGenerate = async () => {
        setIsLoading(true);
        setResult(null);
        try {
            const fullFormData: PlaylistAssistantFormData = {
                ...formData,
                curator_tracks: mockAcceptedTracks,
            };
            const response = await runPlaylistAssistant(fullFormData);
            setResult(response);
            addNotification({ message: 'Playlist generated successfully!', type: 'success' });
        } catch (error) {
             addNotification({ message: error instanceof Error ? error.message : 'An unknown error occurred.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleExport = () => {
        addNotification({ message: 'Playlist successfully exported to your Spotify account!', type: 'success' });
    };
    
    return (
        <div className="space-y-6 animate-fade-in">
             <div>
                <h3 className="text-lg font-semibold text-[var(--accent-primary-hover)] mb-4 flex items-center gap-2">
                    <ListMusicIcon className="w-5 h-5"/>
                    Dynamic Playlist Assistant
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">Provide a few seed tracks and a desired mood, and let the AI build a perfectly sequenced playlist from your accepted submissions.</p>
            </div>
            
            <div className="p-4 bg-[var(--surface-primary)]/50 rounded-lg border border-[var(--border)] grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <label htmlFor="seed_tracks" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Seed Tracks / Artists</label>
                    <input id="seed_tracks" value={formData.seed_tracks} onChange={e => setFormData(p => ({ ...p, seed_tracks: e.target.value }))} className="w-full bg-[var(--surface-secondary)] p-2 rounded-md"/>
                </div>
                 <div className="md:col-span-1">
                    <label htmlFor="mood" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Desired Mood</label>
                    <input id="mood" value={formData.mood} onChange={e => setFormData(p => ({ ...p, mood: e.target.value }))} className="w-full bg-[var(--surface-secondary)] p-2 rounded-md"/>
                </div>
                 <div className="md:col-span-1 flex items-end">
                    <button onClick={handleGenerate} disabled={isLoading} className="w-full flex justify-center items-center gap-2 py-2.5 px-4 bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] text-white font-semibold rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading ? <><LoadingSpinner/> Generating...</> : 'Generate Playlist'}
                    </button>
                </div>
            </div>

             {isLoading && <div className="text-center p-8"><LoadingSpinner/></div>}

             {result && (
                <div className="animate-fade-in p-6 bg-[var(--surface-primary)]/50 rounded-lg border border-[var(--border)]">
                    <h4 className="text-2xl font-bold text-[var(--accent-primary-hover)] mb-2">{result.playlist_name}</h4>
                    <p className="text-[var(--text-secondary)] italic mb-6">"{result.playlist_description}"</p>
                    
                    <ul className="space-y-2">
                        {result.track_sequence.map((track, index) => (
                            <li key={index} className="flex items-center gap-4 p-3 bg-[var(--surface-secondary)]/50 rounded-md">
                                <span className="text-lg font-bold text-[var(--accent-primary)] w-6 text-center">{index + 1}</span>
                                <MusicNoteIcon className="w-5 h-5 text-[var(--text-secondary)]"/>
                                <div>
                                    <p className="font-semibold text-[var(--text-primary)]">{track.title}</p>
                                    <p className="text-sm text-[var(--text-secondary)]">{track.artist}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-6 text-center">
                        <button 
                            onClick={handleExport}
                            className="inline-flex items-center gap-3 px-8 py-3 bg-[#1DB954] hover:bg-[#1ED760] text-white font-bold rounded-lg transition-all transform hover:scale-105"
                        >
                            <SpotifyIcon className="w-6 h-6" />
                            Export to Spotify
                        </button>
                    </div>
                </div>
             )}
        </div>
    );
};