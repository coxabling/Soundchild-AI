import React from 'react';
import type { ArtistProfileData } from '../types';
import { InstagramIcon, MessageSquareIcon, MusicNoteIcon, SpotifyIcon, TwitterIcon, XIcon, ShareIcon } from './icons';
import { useNotification } from '../App';

interface ArtistProfileProps {
    profile: ArtistProfileData;
    onClose: () => void;
    onMessage: (artistName: string) => void;
}

const StatPill: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="text-center">
        <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
        <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">{label}</p>
    </div>
);

export const ArtistProfile: React.FC<ArtistProfileProps> = ({ profile, onClose, onMessage }) => {
    const { addNotification } = useNotification();

    const handleShare = () => {
        const publicUrl = `https://soundchild.ai/artist/${profile.id}`;
        navigator.clipboard.writeText(publicUrl);
        addNotification({ message: 'Public profile URL copied to clipboard!', type: 'success' });
    };

    return (
        <div className="fixed inset-0 bg-[var(--background)]/80 backdrop-blur-lg z-30 animate-fade-in overflow-y-auto">
            <div className="relative max-w-4xl mx-auto my-8 md:my-12">
                <button onClick={onClose} className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors z-40">
                    <XIcon className="w-8 h-8" />
                </button>

                <div className="bg-[var(--surface-primary)]/50 border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 border-b border-[var(--border)]">
                        <img src={profile.imageUrl} alt={profile.name} className="w-32 h-32 rounded-full border-4 border-[var(--border-secondary)] object-cover" />
                        <div className="text-center md:text-left flex-grow">
                            <h2 className="text-4xl font-extrabold text-[var(--text-primary)]">{profile.name}</h2>
                            <p className="text-lg text-[var(--accent-primary)]">{profile.genre} from {profile.location}</p>
                            <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
                                <a href={profile.socials.spotify} target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-green-500 transition-colors"><SpotifyIcon className="w-6 h-6" /></a>
                                <a href={profile.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-pink-500 transition-colors"><InstagramIcon className="w-6 h-6" /></a>
                                <a href={profile.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-sky-500 transition-colors"><TwitterIcon className="w-6 h-6" /></a>
                            </div>
                        </div>
                         <div className="flex flex-col gap-2 flex-shrink-0">
                            <button 
                                onClick={() => onMessage(profile.name)}
                                className="w-full px-6 py-3 bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] text-white font-bold rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                               <MessageSquareIcon className="w-5 h-5"/> Message
                            </button>
                             <button 
                                onClick={handleShare}
                                className="w-full px-6 py-2 bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] text-[var(--text-primary)] font-semibold rounded-lg transition-all text-sm flex items-center justify-center gap-2">
                               <ShareIcon className="w-4 h-4"/> Share Profile
                            </button>
                         </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 divide-x divide-[var(--border)] bg-[var(--surface-primary)]/30">
                        <StatPill label="Monthly Listeners" value={profile.monthlyListeners.toLocaleString()} />
                        <StatPill label="Saves" value={profile.saves.toLocaleString()} />
                    </div>

                    <div className="p-6 md:p-8 space-y-8">
                         {/* Bio */}
                        <div>
                            <h3 className="text-xl font-bold text-[var(--accent-primary-hover)] mb-3">Biography</h3>
                            <p className="text-[var(--text-secondary)] leading-relaxed">{profile.bio}</p>
                        </div>

                         {/* Top Tracks */}
                        <div>
                            <h3 className="text-xl font-bold text-[var(--accent-primary-hover)] mb-4">Top Tracks</h3>
                            <div className="space-y-3">
                                {profile.topTracks.map((track, index) => (
                                    <div key={track.title} className="flex items-center p-3 bg-[var(--surface-secondary)]/50 rounded-lg">
                                        <div className="flex items-center gap-4 flex-grow">
                                            <span className="text-[var(--text-secondary)] font-bold">{index + 1}</span>
                                            <MusicNoteIcon className="w-5 h-5 text-[var(--accent-primary)]" />
                                            <p className="font-semibold text-[var(--text-primary)]">{track.title}</p>
                                        </div>
                                        <p className="text-sm text-[var(--text-secondary)]">{track.streams.toLocaleString()} streams</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="text-center pt-4">
                            <button onClick={onClose} className="px-8 py-3 bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] text-[var(--text-primary)] font-semibold rounded-lg transition-colors">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};