
import React, { useState, useMemo } from 'react';
import type { GenreTrend, UnsignedArtist, ScoutingFormData, ScoutingResponse, ArtistProfileData, MarketAnalysisFormData, MarketAnalysisResponse, DealMemoFormData, DealMemoResponse } from '../types';
import { useApiKey, useNotification } from '../App';
import { runScoutingAssistant, runMarketAnalysis, runDealMemo } from '../services/geminiService';
import { BarChartIcon, CheckCircleIcon, TelescopeIcon, Globe2Icon, HandshakeIcon, LinkIcon, AlertTriangleIcon } from './icons';
import { LoadingSpinner } from './LoadingSpinner';
import { getArtistProfile } from '../services/mockData';
import { ArtistProfile } from './ArtistProfile';

const mockTrends: GenreTrend[] = [
    { genre: 'Hyperpop', growth: 45 },
    { genre: 'Afro-Soul', growth: 32 },
    { genre: 'Synthwave', growth: 18 },
    { genre: 'Phonk', growth: 65 },
    { genre: 'Indie Sleaze', growth: -5 },
];

const HeatmapBar: React.FC<{ trend: GenreTrend }> = ({ trend }) => {
    const width = Math.abs(trend.growth);
    const color = trend.growth > 0 ? 'bg-[var(--positive)]' : 'bg-[var(--negative)]';
    return (
        <div className="flex items-center gap-4">
            <span className="w-28 text-sm text-[var(--text-secondary)] font-medium">{trend.genre}</span>
            <div className="flex-1 bg-[var(--surface-secondary)]/50 rounded-full h-4">
                <div 
                    className={`${color} h-4 rounded-full transition-all duration-500`}
                    style={{ width: `${width}%`}}
                />
            </div>
            <span className={`w-12 text-sm font-semibold ${trend.growth > 0 ? 'text-[var(--positive)]' : 'text-[var(--negative)]'}`}>
                {trend.growth > 0 ? '+' : ''}{trend.growth}%
            </span>
        </div>
    );
};

const ArtistCard: React.FC<{ artist: UnsignedArtist, onViewProfile: (name: string) => void }> = ({ artist, onViewProfile }) => {
    const { addNotification } = useNotification();
    const handleContact = () => {
        addNotification({ message: `Contact request sent to ${artist.name}!`, type: 'success' });
    };

    return (
        <div className="bg-[var(--surface-primary)]/50 border border-[var(--border)] rounded-lg p-4 space-y-3 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start">
                    <div>
                         <button onClick={() => onViewProfile(artist.name)} className="text-lg font-bold text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors text-left">{artist.name}</button>
                        <p className="text-sm text-[var(--accent-primary)]">{artist.genre} - {artist.location}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-[var(--text-primary)]">{artist.monthly_listeners.toLocaleString()}</p>
                        <p className="text-xs text-[var(--text-secondary)]">listeners/mo</p>
                    </div>
                </div>
                <p className="text-sm text-[var(--text-secondary)] italic mt-2">"{artist.reason_for_selection}"</p>
            </div>
            <button
                onClick={handleContact}
                className="w-full mt-2 px-4 py-2 bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] text-white font-semibold rounded-md text-sm transition-colors"
            >
                Contact Artist
            </button>
        </div>
    );
}

const ScoutingTab: React.FC = () => {
    const [filters, setFilters] = useState<ScoutingFormData>({
        genre: 'Synthwave',
        mood: 'Nostalgic',
        min_growth_velocity: 15,
        max_monthly_listeners: 50000,
    });
    const [results, setResults] = useState<ScoutingResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [viewingProfile, setViewingProfile] = useState<ArtistProfileData | null>(null);
    const { addNotification } = useNotification();
    const { resetKeySelection } = useApiKey();

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };
    
    const handleScout = async () => {
        setIsLoading(true);
        setError(null);
        setResults(null);
        try {
            const response = await runScoutingAssistant(filters);
            setResults(response);
            addNotification({ message: 'AI scouting complete!', type: 'success' });
        } catch (err) {
            if (err instanceof Error && err.message.includes("Requested entity was not found")) {
                resetKeySelection();
            }
            const errorMessage = err instanceof Error ? `Scouting failed: ${err.message}` : 'An unknown error occurred.';
            setError(errorMessage);
            addNotification({ message: errorMessage, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleViewArtistProfile = (name: string) => {
        const profile = getArtistProfile(name) || {
            id: name.toLowerCase().replace(/\s+/g, '-'),
            name,
            genre: filters.genre,
            location: 'Unknown',
            bio: 'A promising new artist discovered by Soundchild AI.',
            imageUrl: `https://i.pravatar.cc/150?u=${name.replace(/\s+/g, '-')}`,
            monthlyListeners: Math.floor(Math.random() * filters.max_monthly_listeners),
            saves: Math.floor(Math.random() * 5000),
            socials: { spotify: '#', instagram: '#', twitter: '#' },
            topTracks: [{ title: 'Discovered Gem', streams: Math.floor(Math.random() * 100000) }],
        };
        setViewingProfile(profile);
    };

    if (viewingProfile) {
        return <ArtistProfile profile={viewingProfile} onClose={() => setViewingProfile(null)} onMessage={(artistName) => addNotification({ message: `Message functionality for ${artistName} from the Label Hub is a premium feature.`, type: 'success'})} />;
    }
    
    return (
        <div className="space-y-8">
             <div className="p-4 bg-[var(--surface-primary)]/50 rounded-lg border border-[var(--border)] grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="genre" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Target Genre</label>
                    <input id="genre" value={filters.genre} onChange={handleFilterChange} className="w-full bg-[var(--surface-secondary)] p-2 rounded-md"/>
                </div>
                 <div>
                    <label htmlFor="mood" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Desired Mood</label>
                    <input id="mood" value={filters.mood} onChange={handleFilterChange} className="w-full bg-[var(--surface-secondary)] p-2 rounded-md"/>
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="max_monthly_listeners" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Max Monthly Listeners: {Number(filters.max_monthly_listeners).toLocaleString()}</label>
                    <input type="range" id="max_monthly_listeners" min="1000" max="100000" step="1000" value={filters.max_monthly_listeners} onChange={handleFilterChange} className="w-full accent-[var(--accent-primary)]"/>
                </div>
                <div className="md:col-span-2">
                    <button onClick={handleScout} disabled={isLoading} className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading ? <><LoadingSpinner/> Scouting...</> : 'Scout for Talent'}
                    </button>
                </div>
            </div>
            {results && (
                <div className="animate-fade-in">
                     <div className="p-4 bg-[var(--surface-primary)]/50 rounded-lg border border-[var(--border)] mb-6">
                        <h4 className="font-bold text-[var(--text-primary)]">Market Insight</h4>
                        <p className="text-sm text-[var(--text-secondary)] mt-1">{results.market_insight}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {results.recommended_artists.map(artist => <ArtistCard key={artist.name} artist={artist} onViewProfile={handleViewArtistProfile} />)}
                    </div>
                </div>
            )}
        </div>
    )
}

const MarketAnalysisReport: React.FC<{
    analysis: MarketAnalysisResponse;
    query: MarketAnalysisFormData;
}> = ({ analysis, query }) => {
    const sections = useMemo(() => {
        const parts = analysis.analysis_text.split(/###\s(.+)/).filter(part => part && part.trim() !== '');
        const structuredSections: { title: string; content: string }[] = [];
        for (let i = 0; i < parts.length; i += 2) {
            if (parts[i] && parts[i + 1]) {
                structuredSections.push({
                    title: parts[i].trim(),
                    content: parts[i + 1].trim(),
                });
            } else if (parts[i] && structuredSections.length === 0) {
                structuredSections.push({ title: "Market Overview", content: parts[i].trim() });
            }
        }
        return structuredSections;
    }, [analysis.analysis_text]);

    const renderContent = (content: string) => (
        <div className="text-sm text-[var(--text-secondary)] space-y-2">
            {content.split('\n').map((line, i) => {
                if (line.trim().startsWith('- ')) {
                    return <p key={i} className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[var(--accent-primary)]">{line.trim().substring(2)}</p>;
                }
                if (line.trim() === '') return null;
                return <p key={i}>{line}</p>;
            })}
        </div>
    );

    return (
        <div className="animate-fade-in space-y-6">
            <h3 className="text-2xl font-bold text-center text-[var(--text-primary)]">Market Analysis Report: <span className="text-[var(--accent-primary)]">{query.genre} in {query.location}</span></h3>
            
            <div className="space-y-6">
                {sections.length > 0 ? sections.map(section => (
                    <div key={section.title} className="bg-[var(--surface-primary)]/50 border border-[var(--border)] rounded-lg p-5">
                         <h4 className="text-lg font-semibold text-[var(--accent-primary-hover)] mb-3">{section.title}</h4>
                         {renderContent(section.content)}
                    </div>
                )) : (
                    <div className="bg-[var(--surface-primary)]/50 border border-[var(--border)] rounded-lg p-5">
                        <h4 className="text-lg font-semibold text-[var(--accent-primary-hover)] mb-3">Analysis</h4>
                        {renderContent(analysis.analysis_text)}
                    </div>
                )}
            </div>

            {analysis.sources.length > 0 && (
                <div className="bg-[var(--surface-primary)]/50 border border-[var(--border)] rounded-lg p-5">
                    <h4 className="text-lg font-semibold text-[var(--accent-primary-hover)] mb-3">Data Sources from Google Search</h4>
                    <ul className="space-y-2">
                        {analysis.sources.map((source, i) => (
                            <li key={i}>
                                <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--accent-primary)] hover:underline flex items-center gap-2 group">
                                   <LinkIcon className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--accent-primary)] transition-colors" /> 
                                   <span className="truncate">{source.title || (source.uri && new URL(source.uri).hostname)}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const MarketAnalysisTab: React.FC = () => {
    const [formData, setFormData] = useState<MarketAnalysisFormData>({ genre: 'Afro-Soul', location: 'Berlin' });
    const [result, setResult] = useState<MarketAnalysisResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { addNotification } = useNotification();
    const { resetKeySelection } = useApiKey();

    const handleAnalyze = async () => {
        setIsLoading(true);
        setResult(null);
        try {
            const response = await runMarketAnalysis(formData);
            setResult(response);
            addNotification({ message: 'Market analysis complete!', type: 'success' });
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
        <div className="space-y-8">
            <div className="p-4 bg-[var(--surface-primary)]/50 rounded-lg border border-[var(--border)] grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="md:col-span-1">
                    <label htmlFor="genre" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Target Genre</label>
                    <input id="genre" value={formData.genre} onChange={e => setFormData(p => ({ ...p, genre: e.target.value }))} className="w-full bg-[var(--surface-secondary)] p-2 rounded-md"/>
                </div>
                 <div className="md:col-span-1">
                    <label htmlFor="location" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Location</label>
                    <input id="location" value={formData.location} onChange={e => setFormData(p => ({ ...p, location: e.target.value }))} className="w-full bg-[var(--surface-secondary)] p-2 rounded-md"/>
                </div>
                 <div className="md:col-span-1 flex items-end">
                    <button onClick={handleAnalyze} disabled={isLoading} className="w-full flex justify-center items-center gap-2 py-2.5 px-4 bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] text-white font-semibold rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading ? <><LoadingSpinner/> Analyzing...</> : 'Analyze Market'}
                    </button>
                </div>
            </div>
            {isLoading && <div className="text-center p-8"><LoadingSpinner/></div>}
            {result && (
                 <MarketAnalysisReport analysis={result} query={formData} />
            )}
        </div>
    )
}

const DealMemoTab: React.FC = () => {
    const [formData, setFormData] = useState<DealMemoFormData>({ artist_name: 'Luna Bloom', deal_type: 'single_track_license', key_terms: '50% master royalty split, $500 advance, 2-year term.' });
    const [result, setResult] = useState<DealMemoResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { addNotification } = useNotification();
    const { resetKeySelection } = useApiKey();
    
    const handleDraft = async () => {
        setIsLoading(true);
        setResult(null);
        try {
            const response = await runDealMemo(formData);
            setResult(response);
            addNotification({ message: 'Deal memo drafted!', type: 'success' });
        } catch (error) {
            if (error instanceof Error && error.message.includes("Requested entity was not found")) {
                resetKeySelection();
            }
            addNotification({ message: error instanceof Error ? error.message : 'An unknown error occurred.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    }
    
    return (
        <div className="space-y-8">
            <div className="p-4 bg-[var(--surface-primary)]/50 rounded-lg border border-[var(--border)] grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="artist_name" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Artist Name</label>
                    <input id="artist_name" value={formData.artist_name} onChange={e => setFormData(p => ({ ...p, artist_name: e.target.value }))} className="w-full bg-[var(--surface-secondary)] p-2 rounded-md"/>
                </div>
                 <div>
                    <label htmlFor="deal_type" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Deal Type</label>
                    <select id="deal_type" value={formData.deal_type} onChange={e => setFormData(p => ({ ...p, deal_type: e.target.value as any }))} className="w-full bg-[var(--surface-secondary)] p-2 rounded-md">
                        <option value="single_track_license">Single Track License</option>
                        <option value="ep_deal">EP Deal</option>
                        <option value="development_deal">Development Deal</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                     <label htmlFor="key_terms" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Key Terms</label>
                    <textarea id="key_terms" value={formData.key_terms} onChange={e => setFormData(p => ({...p, key_terms: e.target.value}))} rows={3} className="w-full bg-[var(--surface-secondary)] p-2 rounded-md"/>
                </div>
                <div className="md:col-span-2">
                    <button onClick={handleDraft} disabled={isLoading} className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] text-white font-semibold rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading ? <><LoadingSpinner/> Drafting...</> : 'Draft Memo'}
                    </button>
                </div>
            </div>
             {isLoading && <div className="text-center p-8"><LoadingSpinner/></div>}
             {result && (
                <div className="animate-fade-in space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
                        <AlertTriangleIcon className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                        <div>
                            <h5 className="font-bold text-yellow-300">Disclaimer</h5>
                            <p className="text-sm text-yellow-400/80">This AI-generated draft is for informational purposes only and does not constitute legal advice or a binding agreement. Always consult with a legal professional before signing any contract.</p>
                        </div>
                    </div>
                    <div className="p-6 bg-[var(--surface-primary)]/50 rounded-lg border border-[var(--border)]">
                        <h4 className="text-xl font-bold text-[var(--accent-primary-hover)] mb-4">Drafted Deal Memo</h4>
                        <textarea readOnly value={result.memo_text} rows={12} className="w-full bg-[var(--background-secondary)]/50 font-mono text-sm p-4 rounded-md text-[var(--text-secondary)] border border-[var(--border-secondary)]"/>
                    </div>
                </div>
             )}
        </div>
    )
}

const GenreTrendsTab: React.FC = () => (
    <div className="space-y-6 animate-fade-in">
        <div>
            <h3 className="text-lg font-semibold text-[var(--accent-primary-hover)] mb-4 flex items-center gap-2">
                <BarChartIcon className="w-5 h-5"/>
                Trend Heatmap
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
                Track genre velocity across the platform. This heatmap shows the month-over-month growth or decline of emerging and established genres, helping you spot the next big sound.
            </p>
        </div>
        <div className="space-y-3 p-4 bg-[var(--surface-primary)]/50 rounded-lg border border-[var(--border)]">
            {mockTrends.sort((a,b) => b.growth - a.growth).map(trend => <HeatmapBar key={trend.genre} trend={trend} />)}
        </div>
    </div>
);


export const LabelHub: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<'scouting' | 'trends' | 'market' | 'memo'>('scouting');

    const renderContent = () => {
        switch (activeTab) {
            case 'scouting': return <ScoutingTab />;
            case 'trends': return <GenreTrendsTab />;
            case 'market': return <MarketAnalysisTab />;
            case 'memo': return <DealMemoTab />;
            default: return null;
        }
    };

    return (
         <div className="bg-[var(--surface-primary)]/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl border border-[var(--border)] animate-fade-in space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold text-[var(--text-primary)]">Label & A&R Dashboard</h2>
                    <p className="text-[var(--text-secondary)]">Your AI-powered talent discovery portal.</p>
                </div>
                <button onClick={onBack} className="text-sm text-[var(--accent-primary)] hover:underline flex-shrink-0">Back to Hubs</button>
            </div>

            <div className="border-b border-[var(--border)]">
                 <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button onClick={() => setActiveTab('scouting')} className={`${activeTab === 'scouting' ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-secondary)]'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}>
                        <TelescopeIcon className="w-5 h-5" /> Scouting
                    </button>
                     <button onClick={() => setActiveTab('market')} className={`${activeTab === 'market' ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-secondary)]'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}>
                        <Globe2Icon className="w-5 h-5" /> Market Analysis
                    </button>
                     <button onClick={() => setActiveTab('memo')} className={`${activeTab === 'memo' ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-secondary)]'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}>
                        <HandshakeIcon className="w-5 h-5" /> Deal Memo
                    </button>
                     <button onClick={() => setActiveTab('trends')} className={`${activeTab === 'trends' ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-secondary)]'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}>
                        <BarChartIcon className="w-5 h-5" /> Trend Heatmap
                    </button>
                </nav>
            </div>

            {renderContent()}

        </div>
    );
};
