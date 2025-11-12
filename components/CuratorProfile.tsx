import React from 'react';
import type { CuratorProfileData } from '../types';
import { AwardIcon, LinkIcon, MessageSquareIcon, ShareIcon, ShieldCheckIcon, StarIcon, TelescopeIcon, UserCheckIcon, XIcon } from './icons';
import { useNotification } from '../App';

interface CuratorProfileProps {
    profile: CuratorProfileData;
    onClose: () => void;
    onMessage: (curatorName: string) => void;
}

const StatPill: React.FC<{ label: string; value: string | number; unit?: string; color?: string }> = ({ label, value, unit, color = 'text-[var(--text-primary)]' }) => (
    <div className="text-center p-3 bg-[var(--surface-secondary)]/50 rounded-lg">
        <p className={`text-3xl font-bold ${color}`}>{value}<span className="text-xl">{unit}</span></p>
        <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">{label}</p>
    </div>
);

const BadgeDisplay: React.FC<{ badge: { name: string, description: string } }> = ({ badge }) => (
    <div className="group relative text-center p-3 bg-[var(--surface-secondary)]/50 rounded-lg flex flex-col items-center justify-center">
        <AwardIcon className="w-8 h-8 text-[var(--warning)] mb-2" />
        <p className="text-sm font-semibold text-[var(--text-primary)]">{badge.name}</p>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--text-secondary)] text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            {badge.description}
        </div>
    </div>
);


export const CuratorProfile: React.FC<CuratorProfileProps> = ({ profile, onClose, onMessage }) => {
    const { addNotification } = useNotification();
    
    const handleShare = () => {
        const publicUrl = `https://soundchild.ai/curator/${profile.id}`;
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
                            <p className="text-lg text-[var(--accent-primary)] italic">"{profile.tagline}"</p>
                        </div>
                         <div className="flex flex-col gap-2 flex-shrink-0">
                            <button
                                onClick={() => onMessage(profile.name)}
                                className="w-full px-6 py-3 bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] text-white font-bold rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                               <MessageSquareIcon className="w-5 h-5"/> Message Curator
                            </button>
                            <button 
                                onClick={handleShare}
                                className="w-full px-6 py-2 bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] text-[var(--text-primary)] font-semibold rounded-lg transition-all text-sm flex items-center justify-center gap-2">
                               <ShareIcon className="w-4 h-4"/> Share Profile
                            </button>
                        </div>
                    </div>

                     {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 p-4 bg-[var(--surface-primary)]/30">
                        <StatPill label="Acceptance Rate" value={profile.acceptanceRate} unit="%" color="text-[var(--positive)]" />
                        <StatPill label="Avg. Response" value={profile.avgResponseTime} />
                        <StatPill label="Reputation" value={profile.reputation} unit="%" color="text-[var(--warning)]" />
                    </div>

                    <div className="p-6 md:p-8 space-y-8">
                        {/* Bio */}
                        <div>
                            <h3 className="text-xl font-bold text-[var(--accent-primary-hover)] mb-3">About</h3>
                            <p className="text-[var(--text-secondary)] leading-relaxed">{profile.bio}</p>
                        </div>

                         {/* Badges */}
                        {profile.badges && profile.badges.length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold text-[var(--accent-primary-hover)] mb-4">Badges</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {profile.badges.map(badge => <BadgeDisplay key={badge.name} badge={badge} />)}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             {/* Genres */}
                            <div>
                                <h3 className="text-xl font-bold text-[var(--accent-primary-hover)] mb-4 flex items-center gap-2"><UserCheckIcon className="w-6 h-6"/> Specializes In</h3>
                                <div className="flex flex-wrap gap-2">
                                    {profile.genres.map(genre => (
                                        <span key={genre} className="px-3 py-1 bg-[var(--surface-secondary)] text-[var(--accent-primary)] text-sm font-medium rounded-full">{genre}</span>
                                    ))}
                                </div>
                            </div>
                            {/* Vibes */}
                            <div>
                                <h3 className="text-xl font-bold text-[var(--accent-primary-hover)] mb-4 flex items-center gap-2"><TelescopeIcon className="w-6 h-6"/> Preferred Vibe</h3>
                                 <div className="flex flex-wrap gap-2">
                                    {profile.vibes.map(vibe => (
                                        <span key={vibe} className="px-3 py-1 bg-[var(--surface-secondary)] text-[var(--text-secondary)] text-sm font-medium rounded-full">{vibe}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Verified Playlists */}
                        <div>
                            <h3 className="text-xl font-bold text-[var(--accent-primary-hover)] mb-4 flex items-center gap-2">
                                <ShieldCheckIcon className="w-6 h-6 text-[var(--positive)]" />
                                Verified Playlists
                            </h3>
                            <div className="space-y-3">
                                {profile.verifiedPlaylists.map(playlist => (
                                    <a href={playlist.url} target="_blank" rel="noopener noreferrer" key={playlist.name} className="flex items-center justify-between p-3 bg-[var(--surface-secondary)]/50 hover:bg-[var(--surface-secondary)]/80 rounded-lg transition-colors group">
                                        <div>
                                            <p className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">{playlist.name}</p>
                                            <p className="text-sm text-[var(--text-secondary)]">{playlist.followers.toLocaleString()} followers</p>
                                        </div>
                                        <LinkIcon className="w-5 h-5 text-[var(--text-tertiary)] group-hover:text-[var(--accent-primary)] transition-colors" />
                                    </a>
                                ))}
                            </div>
                        </div>


                         {/* Recent Reviews */}
                        <div>
                            <h3 className="text-xl font-bold text-[var(--accent-primary-hover)] mb-4">Recent Feedback</h3>
                            <div className="space-y-4">
                                {profile.recentReviews.map((review, index) => (
                                    <div key={index} className="p-4 bg-[var(--surface-secondary)]/50 rounded-lg border-l-4 border-[var(--accent-primary)]">
                                        <div className="flex justify-between items-start">
                                            <p className="text-[var(--text-secondary)] italic flex-grow pr-4">"{review.snippet}"</p>
                                            <div className="group relative flex-shrink-0">
                                                <ShieldCheckIcon className="w-5 h-5 text-[var(--positive)]/70 cursor-pointer" />
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max p-2 bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--text-secondary)] text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                   Review logged on-chain for transparency.
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-right text-sm text-[var(--text-secondary)] mt-2">- on "{review.track}" by {review.artist}</p>
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