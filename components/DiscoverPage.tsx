import React from 'react';
import { getSoundNeighborhoods } from '../services/mockData';
import type { SoundNeighborhood } from '../types';
import { MusicNoteIcon, TelescopeIcon } from './icons';

const NeighborhoodCard: React.FC<{ neighborhood: SoundNeighborhood }> = ({ neighborhood }) => (
    <div className="bg-[var(--surface-primary)]/50 border border-[var(--border)] rounded-lg overflow-hidden group">
        <div className="relative h-48">
            <img src={neighborhood.coverArtUrl} alt={neighborhood.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-primary)] via-[var(--surface-primary)]/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
                 <h3 className="text-2xl font-bold text-[var(--text-primary)]">{neighborhood.name}</h3>
                 <div className="flex flex-wrap gap-2 mt-2">
                    {neighborhood.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-[var(--accent-secondary)]/50 text-[var(--accent-primary-hover)] text-xs font-medium rounded-full backdrop-blur-sm">{tag}</span>
                    ))}
                </div>
            </div>
        </div>
        <div className="p-4">
            <p className="text-sm text-[var(--text-secondary)] mb-4 h-20">{neighborhood.description}</p>
            <div>
                 <h4 className="font-semibold text-[var(--accent-primary-hover)] mb-2 text-sm">Trending Tracks</h4>
                <div className="space-y-2">
                    {neighborhood.trendingTracks.map(track => (
                        <div key={track.title} className="flex items-center gap-3 text-sm">
                            <MusicNoteIcon className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0" />
                            <div>
                                <span className="font-medium text-[var(--text-primary)]">{track.title}</span>
                                <span className="text-[var(--text-secondary)]"> - {track.artist}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export const DiscoverPage: React.FC = () => {
    const neighborhoods = getSoundNeighborhoods();

    return (
        <div className="animate-fade-in max-w-6xl mx-auto">
            <section className="text-center mb-16">
                 <h1 className="text-5xl md:text-6xl font-extrabold text-[var(--text-primary)] tracking-tighter flex items-center justify-center gap-4">
                   <TelescopeIcon className="w-12 h-12 text-[var(--accent-primary)]"/> Sound Neighborhoods
                </h1>
                <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                    Explore emerging scenes and discover new sounds curated by Soundchild's AI. Each neighborhood represents a unique cluster of related artists and vibes.
                </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {neighborhoods.map(neighborhood => (
                    <NeighborhoodCard key={neighborhood.name} neighborhood={neighborhood} />
                ))}
            </div>
        </div>
    );
};