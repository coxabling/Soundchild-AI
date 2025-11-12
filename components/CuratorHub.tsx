
import React, { useState } from 'react';
import { MusicUploadForm } from './MusicUploadForm';
import { AnalysisDisplay } from './AnalysisDisplay';
import { LoadingSpinner } from './LoadingSpinner';
import type { Submission, AllAnalysisResponses, AllFormData, CuratorFormData, CuratorResponse, CuratorEarnings, WalletData, ArtistProfileData, Conversation } from '../types';
import { runCuratorAssistant } from '../services/geminiService';
import { DollarSignIcon, InboxIcon, TelescopeIcon, ListMusicIcon, Users2Icon } from './icons';
import { Wallet } from './Wallet';
import { getArtistProfile, getConversations } from '../services/mockData';
import { ArtistProfile } from './ArtistProfile';
import { Messaging } from './Messaging';
import { PlaylistAssistant } from './PlaylistAssistant';
import { PersonaGenerator } from './PersonaGenerator';

const mockSubmissions: Submission[] = [
    { id: 'sub1', artist_name: 'Luna Bloom', track_title: 'Neon Tides', genre: 'Synthwave', mood: 'Nostalgic, Driving', pitch: "Hey! My new track 'Neon Tides' is a throwback to classic 80s synthwave with a modern twist. Think Kavinsky meets The Midnight. Hope you enjoy the ride!", status: 'reviewed', aiFitScore: 88, description: 'An 80s inspired synthwave track with driving basslines and dreamy pads.', loudness: '-8', energy: 0.8, valence: 0.6, performanceDataId: 'perf1' },
    { id: 'sub2', artist_name: 'Sol', track_title: 'Morning Mist', genre: 'Lofi Hip-Hop', mood: 'Chill, Reflective', pitch: "Hey, here's my latest lofi beat, 'Morning Mist'. It's super chill, perfect for a study or relax playlist. Let me know what you think.", status: 'reviewed', aiFitScore: 75, description: 'A calming lofi hip-hop track with vinyl crackle and a soothing piano melody.', loudness: '-12', energy: 0.3, valence: 0.4, performanceDataId: 'perf2' },
    { id: 'sub3', artist_name: 'The Fuse', track_title: 'Riot', genre: 'Indie Rock', mood: 'Energetic, Raw', pitch: 'Our new single "Riot" is a high-energy indie rock anthem. If you like bands like The Strokes or Arctic Monkeys, this should be right up your alley.', status: 'pending', aiFitScore: 62, description: 'A garage rock track with fuzzy guitars and powerful vocals.', loudness: '-6', energy: 0.9, valence: 0.7 },
];

const mockEarnings: CuratorEarnings = {
    total: 342.50,
    reputationScore: 92,
    streakBonus: 1.15, // 15% bonus
    breakdown: {
        base: 220.00,
        qualityBonus: 75.50,
        performanceBonus: 40.00,
        tips: 7.00
    }
};

const mockCuratorWallet: WalletData = {
    balance: mockEarnings.total,
    credits: 0,
    transactions: [
        { id: 't1', type: 'payout', description: "Payout for 'Neon Tides' review", amount: 2.50, date: '203-10-26' },
        { id: 't2', type: 'bonus', description: "Helpful feedback bonus", amount: 1.00, date: '203-10-26' },
        { id: 't3', type: 'payout', description: "Payout for 'Morning Mist' review", amount: 2.00, date: '203-10-25' },
        { id: 't4', type: 'withdrawal', description: 'Withdrawal to Bank Account', amount: -150.00, date: '203-10-24' },
        { id: 't5', type: 'tip', description: "Tip from artist 'Sol'", amount: 5.00, date: '203-10-23' },
    ]
}

const getScoreColor = (score: number) => score >= 75 ? 'text-[var(--positive)]' : score >= 50 ? 'text-[var(--warning)]' : 'text-[var(--negative)]';

const PreAnalysisModal: React.FC<{ submission: Submission; onContinue: () => void; onCancel: () => void; }> = ({ submission, onContinue, onCancel }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-20 animate-fade-in p-4">
        <div className="bg-[var(--surface-primary)] border border-[var(--border)] rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-2xl font-bold text-[var(--accent-primary)]">AI Pre-Analysis</h3>
            <div className="p-4 bg-[var(--background-secondary)] rounded-lg">
                <p className="font-bold text-lg text-[var(--text-primary)]">{submission.track_title}</p>
                <p className="text-sm text-[var(--text-secondary)]">{submission.artist_name} - <span className="font-medium text-[var(--text-primary)]/80">{submission.genre}</span></p>
            </div>
            <div className="text-sm text-[var(--text-primary)]/90 space-y-2">
                <p><strong className="text-[var(--accent-primary)]">Key Timestamp:</strong> 0:45 (Hook)</p>
                <p><strong className="text-[var(--accent-primary)]">Technical Note:</strong> Vocals slightly compressed, but mix is balanced.</p>
                <p><strong className="text-[var(--accent-primary)]">Artist Pitch Summary:</strong> Compares sound to Kavinsky and The Midnight.</p>
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <button onClick={onCancel} className="px-4 py-2 text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] rounded-md transition-colors">Cancel</button>
                <button onClick={onContinue} className="px-4 py-2 bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] text-white font-semibold rounded-md flex items-center gap-2 transition-colors">
                    <TelescopeIcon className="w-5 h-5" />
                    Start Full Review
                </button>
            </div>
        </div>
    </div>
);

const EarningsChart: React.FC<{ breakdown: CuratorEarnings['breakdown'] }> = ({ breakdown }) => {
    // Fix: Calculate total by directly summing typed properties to avoid type inference issues with `reduce`.
    const total = breakdown.base + breakdown.qualityBonus + breakdown.performanceBonus + breakdown.tips;
    if (total === 0) return <div className="h-48 flex items-center justify-center text-[var(--text-tertiary)]">No earnings data yet.</div>;

    const data = [
        { label: 'Base', value: breakdown.base, color: 'var(--accent-primary)' },
        { label: 'Quality', value: breakdown.qualityBonus, color: 'var(--positive)' },
        { label: 'Performance', value: breakdown.performanceBonus, color: 'var(--warning)' },
        { label: 'Tips', value: breakdown.tips, color: '#a855f7' }, // Purple for tips
    ];

    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    let accumulatedOffset = 0;

    return (
        <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-48 h-48">
                <svg className="w-full h-full" viewBox="0 0 140 140">
                    {data.map((item, index) => {
                        const dasharray = (item.value / total) * circumference;
                        const strokeDashoffset = accumulatedOffset;
                        accumulatedOffset += dasharray;
                        return (
                             <circle
                                key={index}
                                className="transition-all duration-1000 ease-out"
                                strokeWidth="20" strokeDasharray={`${dasharray} ${circumference - dasharray}`} strokeDashoffset={-strokeDashoffset}
                                strokeLinecap="round" stroke={item.color} fill="transparent" r={radius} cx="70" cy="70" transform="rotate(-90 70 70)"
                            />
                        )
                    })}
                </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-[var(--text-primary)]">${total.toFixed(2)}</span>
                    <span className="text-sm text-[var(--text-secondary)]">Total</span>
                </div>
            </div>
            <div className="flex-1 w-full">
                <ul className="space-y-2">
                    {data.map(item => (
                        <li key={item.label} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-[var(--text-secondary)]">{item.label}</span>
                            </div>
                            <span className="font-bold text-[var(--text-primary)]">${item.value.toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const CuratorEarningsDisplay: React.FC<{
    earnings: CuratorEarnings, 
    walletData: WalletData, 
    setWalletData: React.Dispatch<React.SetStateAction<WalletData>>
}> = ({ earnings, walletData, setWalletData }) => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="p-6 bg-[var(--surface-primary)]/50 rounded-lg border border-[var(--border)]">
                <h4 className="text-lg font-semibold text-[var(--accent-primary-hover)] mb-4">FairPay™ Breakdown</h4>
                <EarningsChart breakdown={earnings.breakdown} />
            </div>
            <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-[var(--surface-primary)]/50 rounded-lg border border-[var(--border)] flex flex-col justify-center">
                    <p className="text-[var(--text-secondary)] text-sm">Reputation</p>
                    <p className={`text-5xl font-bold ${getScoreColor(earnings.reputationScore)}`}>{earnings.reputationScore}<span className="text-3xl">%</span></p>
                </div>
                <div className="text-center p-4 bg-[var(--surface-primary)]/50 rounded-lg border border-[var(--border)] flex flex-col justify-center">
                    <p className="text-[var(--text-secondary)] text-sm">Streak Bonus</p>
                    <p className="text-5xl font-bold text-[var(--accent-primary)]">{earnings.streakBonus}x</p>
                </div>
            </div>
        </div>
        <Wallet 
            walletData={walletData}
            setWalletData={setWalletData}
            userType="curator"
        />
    </div>
);


export const CuratorHub: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [submissions, setSubmissions] = useState(mockSubmissions);
    const [earnings, setEarnings] = useState(mockEarnings);
    const [walletData, setWalletData] = useState<WalletData>(mockCuratorWallet);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [preAnalysisSubmission, setPreAnalysisSubmission] = useState<Submission | null>(null);
    const [analysis, setAnalysis] = useState<CuratorResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'queue' | 'playlist' | 'audience' | 'messages' | 'earnings'>('queue');
    const [viewingProfile, setViewingProfile] = useState<ArtistProfileData | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>(() => getConversations('curator'));
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);


    const handleSelectSubmission = (submission: Submission) => {
        setPreAnalysisSubmission(submission);
    };
    
    const handleStartFullReview = () => {
        if(preAnalysisSubmission) {
            setSelectedSubmission(preAnalysisSubmission);
            setPreAnalysisSubmission(null);
            setAnalysis(null); 
            setError(null);
        }
    }

    const handleFormSubmit = async (formData: AllFormData) => {
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        try {
            const result = await runCuratorAssistant(formData as CuratorFormData);
            setAnalysis(result);
        } catch (err) {
            setError(err instanceof Error ? `Analysis failed: ${err.message}` : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleRateReview = (rating: number) => {
        if (!selectedSubmission) return;

        const updatedSubmissions = submissions.map(s => 
            s.id === selectedSubmission.id 
            ? { ...s, status: 'reviewed', reviewHelpfulness: rating } 
            : s
        );
        setSubmissions(updatedSubmissions);

        const ratedSubmissions = updatedSubmissions.filter(s => s.reviewHelpfulness !== undefined);
        if (ratedSubmissions.length > 0) {
            const totalRating = ratedSubmissions.reduce((acc, sub) => acc + (sub.reviewHelpfulness || 0), 0);
            const avgRating = totalRating / ratedSubmissions.length;
            const newReputationScore = Math.round((avgRating / 5) * 100);
            setEarnings(prev => ({...prev, reputationScore: newReputationScore }));
        }
    };

    const handleViewArtistProfile = (name: string) => {
        const profile = getArtistProfile(name);
        if (profile) {
            setViewingProfile(profile);
        }
    };
    
    const handleMessageArtist = (artistName: string) => {
        const profile = getArtistProfile(artistName);
        if (!profile) return;

        const existingConversation = conversations.find(c => c.participantId === profile.id);
        if (existingConversation) {
            setActiveConversationId(existingConversation.id);
        } else {
             const newConversation: Conversation = {
                id: `conv_${Date.now()}`,
                participantId: profile.id,
                participantName: profile.name,
                participantImageUrl: profile.imageUrl,
                lastMessage: 'Start a conversation...',
                timestamp: 'Just now',
                unreadCount: 0,
                messages: []
            };
            setConversations(prev => [newConversation, ...prev]);
            setActiveConversationId(newConversation.id);
        }
        setViewingProfile(null);
        setActiveTab('messages');
    };

    const handleReset = () => {
        setSelectedSubmission(null);
        setAnalysis(null);
        setError(null);
        setIsLoading(false);
    };

    if (viewingProfile) {
        return <ArtistProfile profile={viewingProfile} onClose={() => setViewingProfile(null)} onMessage={handleMessageArtist}/>;
    }

    if (selectedSubmission) {
        const initialData = {
            curator_name: "Curator Name", // Assume a logged-in curator
            curator_genres: "Synthwave, Lofi, Indie Rock",
            curator_audience: "Listeners of electronic, chill, and alternative music.",
            artist_name: selectedSubmission.artist_name,
            track_title: selectedSubmission.track_title,
            genre: selectedSubmission.genre,
            mood: selectedSubmission.mood,
            description: selectedSubmission.description,
            pitch: selectedSubmission.pitch,
            loudness: selectedSubmission.loudness,
            energy: selectedSubmission.energy,
            valence: selectedSubmission.valence,
        };

        return (
            <div>
                 {isLoading && (
                    <div className="text-center bg-[var(--surface-primary)]/50 backdrop-blur-sm p-8 rounded-2xl border border-[var(--border)]">
                        <div className="flex justify-center items-center mb-4"><LoadingSpinner /></div>
                        <p className="text-lg text-[var(--accent-primary)] animate-pulse">AI Assistant is reviewing...</p>
                    </div>
                )}
                {error && (
                    <div className="text-center p-6 bg-red-900/50 border border-red-700 rounded-lg">
                        <p className="font-bold text-red-400">An Error Occurred</p>
                        <p className="mt-2 text-red-300">{error}</p>
                        <button onClick={handleReset} className="mt-4 px-6 py-2 bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)]">Back to Queue</button>
                    </div>
                )}
                {!isLoading && !error && (
                    analysis 
                        ? <AnalysisDisplay 
                            analysis={analysis} 
                            tool="curator" 
                            onReset={handleReset} 
                            onRateReview={handleRateReview}
                            submission={submissions.find(s => s.id === selectedSubmission.id)}
                           />
                        : <MusicUploadForm activeTool="curator" onSubmit={handleFormSubmit} onBack={handleReset} initialData={initialData} />
                )}
            </div>
        );
    }
    
    return (
        <div className="bg-[var(--surface-primary)]/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl border border-[var(--border)] animate-fade-in">
            {preAnalysisSubmission && <PreAnalysisModal submission={preAnalysisSubmission} onContinue={handleStartFullReview} onCancel={() => setPreAnalysisSubmission(null)}/>}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-[var(--text-primary)]">Curator Dashboard</h2>
                    <p className="text-[var(--text-secondary)]">Your AI-Powered Curation Hub</p>
                </div>
                <button onClick={onBack} className="text-sm text-[var(--accent-primary)] hover:underline flex-shrink-0">Back to Hubs</button>
            </div>
            
            <div className="border-b border-[var(--border)] mb-6">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button onClick={() => setActiveTab('queue')} className={`${activeTab === 'queue' ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-secondary)]'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                        Submission Queue
                    </button>
                    <button onClick={() => setActiveTab('playlist')} className={`${activeTab === 'playlist' ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-secondary)]'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}>
                        <ListMusicIcon className="w-5 h-5" /> Playlist Assistant
                    </button>
                    <button onClick={() => setActiveTab('audience')} className={`${activeTab === 'audience' ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-secondary)]'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}>
                        <Users2Icon className="w-5 h-5" /> Audience Personas
                    </button>
                    <button onClick={() => setActiveTab('messages')} className={`${activeTab === 'messages' ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-secondary)]'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}>
                        <InboxIcon className="w-5 h-5" /> Messages
                    </button>
                     <button onClick={() => setActiveTab('earnings')} className={`${activeTab === 'earnings' ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-secondary)]'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}>
                        <DollarSignIcon className="w-5 h-5" /> My Earnings
                    </button>
                </nav>
            </div>

            {activeTab === 'queue' ? (
                 submissions.length > 0 ? (
                    <div className="space-y-4">
                        {submissions.map(sub => (
                            <div key={sub.id} className="w-full text-left p-4 bg-[var(--surface-secondary)]/30 rounded-lg border border-[var(--border)] flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4 flex-grow">
                                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${sub.status === 'pending' ? 'bg-[var(--accent-primary)] animate-pulse' : 'bg-[var(--surface-tertiary)]'}`}></div>
                                    <div>
                                        <button onClick={() => handleSelectSubmission(sub)} className="font-bold text-lg text-[var(--text-primary)] text-left hover:text-[var(--accent-primary)] transition-colors">{sub.track_title}</button>
                                        <div className="text-sm text-[var(--text-secondary)]">
                                            <button onClick={() => handleViewArtistProfile(sub.artist_name)} className="hover:underline">{sub.artist_name}</button>
                                            <span> - </span>
                                            <span className="font-medium text-[var(--text-primary)]/80">{sub.genre}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className={`font-bold text-xl ${getScoreColor(sub.aiFitScore)}`}>{sub.aiFitScore}</p>
                                    <p className="text-xs text-[var(--text-tertiary)]">AI Fit Score</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-[var(--text-secondary)]">
                        <InboxIcon className="w-16 h-16 mx-auto text-[var(--border-secondary)] mb-4" />
                        <h3 className="text-xl font-bold text-[var(--text-primary)]">All Caught Up!</h3>
                        <p>Your submission queue is empty. New tracks will appear here.</p>
                    </div>
                )
            ) : activeTab === 'playlist' ? (
                <PlaylistAssistant />
            ) : activeTab === 'audience' ? (
                <PersonaGenerator />
            ) : activeTab === 'messages' ? (
                <Messaging 
                    conversations={conversations}
                    setConversations={setConversations}
                    activeConversationId={activeConversationId}
                    setActiveConversationId={setActiveConversationId}
                    userType="curator"
                />
            ) : (
                <CuratorEarningsDisplay 
                    earnings={earnings} 
                    walletData={walletData} 
                    setWalletData={setWalletData} 
                />
            )}
        </div>
    );
};
