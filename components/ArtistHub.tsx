
import React, { useState } from 'react';
import { MusicUploadForm } from './MusicUploadForm';
import { AnalysisDisplay } from './AnalysisDisplay';
import { LoadingSpinner } from './LoadingSpinner';
import { BarChartIcon, ClipboardListIcon, GitCompareArrowsIcon, InboxIcon, MessageSquareIcon, MusicNoteIcon, SendIcon, SpotifyIcon, TelescopeIcon, WalletIcon, CrownIcon, PenSquareIcon, MessageCircleIcon, UsersIcon } from './icons';
import type { AllAnalysisResponses, AllFormData, Tool, ArtistAnalytics, SpotifyAnalytics, NeighborhoodsFormData, WalletData, CuratorProfileData, Submission, Conversation, LyricAnalyzerFormData } from '../types';
import { runArtistEvaluation, runCampaignOptimization, runPitchWriter, runSmartFollowUp, runSoundNeighborhoods, runRemixABTest, runFeedbackSynthesizer, runLyricAnalyzer } from '../services/geminiService';
import { Wallet } from './Wallet';
import { useNotification } from '../App';
import { getCuratorProfile, getConversations } from '../services/mockData';
import { CuratorProfile } from './CuratorProfile';
import { CampaignPerformance } from './CampaignPerformance';
import { SubscriptionModal } from './SubscriptionModal';
import { Messaging } from './Messaging';
import { CareerAdvisor } from './CareerAdvisor';
import { CuratorDiscovery } from './CuratorDiscovery';

const mockAnalytics: ArtistAnalytics = {
    submissionsSent: 24,
    acceptanceRate: 18.5,
    avgFitScore: 72,
};

const mockSpotifyAnalytics: SpotifyAnalytics = {
    streams: 124530,
    listeners: 45880,
    saves: 8320,
    playlistAdds: 127,
};

const mockArtistWallet: WalletData = {
    balance: 75.50,
    credits: 10,
    transactions: [
        { id: 't1', type: 'deposit', description: 'Credit Card Deposit', amount: 50.00, date: '2023-10-26' },
        { id: 't2', type: 'credit_spend', description: "Campaign: 'Neon Tides'", amount: -5, date: '2023-10-25' },
        { id: 't3', type: 'credit_spend', description: "Evaluation: 'Morning Mist'", amount: -1, date: '2023-10-24' },
        { id: 't4', type: 'credit_purchase', description: '20 Credit Pack', amount: -20.00, date: '2023-10-22' },
    ]
}

const AnalyticsCard: React.FC<{ value: string | number; label: string; unit?: string }> = ({ value, label, unit }) => (
    <div className="bg-[var(--surface-primary)]/50 p-4 rounded-lg text-center border border-[var(--border)]">
        <p className="text-4xl font-bold text-[var(--accent-primary)]">{value}<span className="text-2xl">{unit}</span></p>
        <p className="text-sm text-[var(--text-secondary)] mt-1">{label}</p>
    </div>
);

const AnalyticsChart: React.FC<{ data: ArtistAnalytics }> = ({ data }) => {
    const chartData = [
        { label: 'Submissions', value: data.submissionsSent, max: 50 },
        { label: 'Accept %', value: data.acceptanceRate, max: 100 },
        { label: 'Fit Score', value: data.avgFitScore, max: 100 },
    ];

    return (
        <div className="bg-[var(--surface-primary)]/50 p-4 rounded-lg border border-[var(--border)] flex justify-around items-end h-40">
            {chartData.map(item => (
                <div key={item.label} className="text-center w-1/4 flex flex-col items-center justify-end h-full">
                    <div className="w-8 bg-[var(--surface-secondary)] rounded-t-md flex-grow flex items-end">
                        <div 
                            className="w-full bg-[var(--accent-primary)] rounded-t-md transition-all duration-500"
                            style={{ height: `${(item.value / item.max) * 100}%` }}
                        />
                    </div>
                    <p className="text-sm font-bold text-[var(--text-primary)] mt-2">{item.value}{item.label.includes('%') ? '%' : ''}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{item.label}</p>
                </div>
            ))}
        </div>
    );
};

const SpotifyAnalyticsDisplay: React.FC = () => (
    <div>
        <h3 className="text-lg font-semibold text-[var(--accent-primary-hover)] mb-4 flex items-center gap-2">
            <SpotifyIcon className="w-6 h-6 text-[#1DB954]" />
            Spotify for Artists Snapshot
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AnalyticsCard value={mockSpotifyAnalytics.streams.toLocaleString()} label="Total Streams" />
            <AnalyticsCard value={mockSpotifyAnalytics.listeners.toLocaleString()} label="Listeners" />
            <AnalyticsCard value={mockSpotifyAnalytics.saves.toLocaleString()} label="Saves" />
            <AnalyticsCard value={mockSpotifyAnalytics.playlistAdds.toLocaleString()} label="Playlist Adds" />
        </div>
    </div>
);

const ArtistDashboard: React.FC<{
    onToolSelect: (tool: Tool) => void;
    onExploreSound: () => void;
    onUpgradeClick: () => void;
}> = ({ onToolSelect, onExploreSound, onUpgradeClick }) => {
    const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
    const { addNotification } = useNotification();

    const handleSpotifyConnect = () => {
        setIsSpotifyConnected(true);
        addNotification({ message: 'Spotify account connected successfully!', type: 'success' });
    };

    return (
        <div className="space-y-8">
             <div>
                <h3 className="text-lg font-semibold text-[var(--accent-primary-hover)] mb-4">Performance Snapshot</h3>
                <AnalyticsChart data={mockAnalytics} />
            </div>

            {isSpotifyConnected ? (
                <SpotifyAnalyticsDisplay />
            ) : (
                <div className="bg-[var(--surface-primary)]/50 p-6 rounded-lg border border-[var(--border)] text-center">
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Connect Your Spotify Account</h3>
                    <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">Integrate with Spotify for Artists to see detailed analytics and unlock powerful features for your release campaigns.</p>
                    <button 
                        onClick={handleSpotifyConnect}
                        className="inline-flex items-center gap-3 px-8 py-3 bg-[#1DB954] hover:bg-[#1ED760] text-white font-bold rounded-full transition-all transform hover:scale-105"
                    >
                        <SpotifyIcon className="w-6 h-6" />
                        Connect to Spotify
                    </button>
                </div>
            )}

            <div>
                 <h3 className="text-lg font-semibold text-[var(--accent-primary-hover)] mb-4">AI Toolkit</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button onClick={() => onToolSelect('evaluator')} className="group p-4 text-center bg-[var(--surface-primary)]/50 hover:bg-[var(--surface-secondary)]/80 rounded-lg border border-[var(--border)] hover:border-[var(--accent-primary)] transition-all transform hover:-translate-y-1">
                        <MusicNoteIcon className="w-8 h-8 text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] mx-auto mb-3 transition-colors" />
                        <h4 className="font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Evaluate Track</h4>
                    </button>
                     <button onClick={() => onToolSelect('pitchWriter')} className="group p-4 text-center bg-[var(--surface-primary)]/50 hover:bg-[var(--surface-secondary)]/80 rounded-lg border border-[var(--border)] hover:border-[var(--accent-primary)] transition-all transform hover:-translate-y-1">
                        <SendIcon className="w-8 h-8 text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] mx-auto mb-3 transition-colors" />
                        <h4 className="font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">AI Pitch Writer</h4>
                    </button>
                    <button onClick={() => onToolSelect('optimizer')} className="group p-4 text-center bg-[var(--surface-primary)]/50 hover:bg-[var(--surface-secondary)]/80 rounded-lg border border-[var(--border)] hover:border-[var(--accent-primary)] transition-all transform hover:-translate-y-1">
                        <BarChartIcon className="w-8 h-8 text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] mx-auto mb-3 transition-colors" />
                        <h4 className="font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Optimize Campaign</h4>
                    </button>
                    <button onClick={() => onToolSelect('followUp')} className="group p-4 text-center bg-[var(--surface-primary)]/50 hover:bg-[var(--surface-secondary)]/80 rounded-lg border border-[var(--border)] hover:border-[var(--accent-primary)] transition-all transform hover:-translate-y-1">
                        <MessageSquareIcon className="w-8 h-8 text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] mx-auto mb-3 transition-colors" />
                        <h4 className="font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Smart Follow-Up</h4>
                    </button>
                     <button onClick={() => onToolSelect('lyricAnalyzer')} className="group p-4 text-center bg-[var(--surface-primary)]/50 hover:bg-[var(--surface-secondary)]/80 rounded-lg border border-[var(--border)] hover:border-[var(--accent-primary)] transition-all transform hover:-translate-y-1">
                        <PenSquareIcon className="w-8 h-8 text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] mx-auto mb-3 transition-colors" />
                        <h4 className="font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Lyric Analyzer</h4>
                    </button>
                    <button onClick={() => onToolSelect('remixABTest')} className="group p-4 text-center bg-[var(--surface-primary)]/50 hover:bg-[var(--surface-secondary)]/80 rounded-lg border border-[var(--border)] hover:border-[var(--accent-primary)] transition-all transform hover:-translate-y-1">
                        <GitCompareArrowsIcon className="w-8 h-8 text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] mx-auto mb-3 transition-colors" />
                        <h4 className="font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">A/B Test Remix</h4>
                    </button>
                     <button onClick={() => onToolSelect('feedbackSynthesizer')} className="group p-4 text-center bg-[var(--surface-primary)]/50 hover:bg-[var(--surface-secondary)]/80 rounded-lg border border-[var(--border)] hover:border-[var(--accent-primary)] transition-all transform hover:-translate-y-1">
                        <ClipboardListIcon className="w-8 h-8 text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] mx-auto mb-3 transition-colors" />
                        <h4 className="font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">AI Report Card</h4>
                    </button>
                </div>
            </div>
             <div>
                <h3 className="text-lg font-semibold text-[var(--accent-primary-hover)] mb-4">Discovery Zone</h3>
                 <div className="bg-[var(--surface-primary)]/50 p-6 rounded-lg border border-[var(--border)] text-center">
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Find Your Sound Neighborhood</h3>
                    <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">Discover similar artists and the curators who support them to find your place in the ecosystem.</p>
                    <button 
                        onClick={onExploreSound}
                        className="inline-flex items-center gap-3 px-8 py-3 bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg"
                    >
                        <TelescopeIcon className="w-6 h-6" />
                        Explore Your Sound
                    </button>
                </div>
            </div>
             <div className="text-center mt-8">
                 <button onClick={onUpgradeClick} className="inline-flex items-center gap-2 text-[var(--warning)] hover:brightness-110 font-semibold transition-all">
                     <CrownIcon className="w-5 h-5"/>
                     Upgrade to Pro for more insights
                 </button>
            </div>
        </div>
    );
};


export const ArtistHub: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [activeTool, setActiveTool] = useState<Tool | null>(null);
    const [analysis, setAnalysis] = useState<AllAnalysisResponses | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'advisor' | 'discoverCurators' | 'campaigns' | 'messages' | 'wallet'>('dashboard');
    const [walletData, setWalletData] = useState<WalletData>(mockArtistWallet);
    const [viewingProfile, setViewingProfile] = useState<CuratorProfileData | null>(null);
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const [conversations, setConversations] = useState<Conversation[]>(() => getConversations('artist'));
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    
    const handleFormSubmit = async (formData: AllFormData, tool: Tool) => {
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        try {
            let result;
            switch (tool) {
                case 'evaluator':
                    result = await runArtistEvaluation(formData as any);
                    break;
                case 'optimizer':
                    result = await runCampaignOptimization(formData as any);
                    break;
                case 'pitchWriter':
                    result = await runPitchWriter(formData as any);
                    break;
                case 'followUp':
                    result = await runSmartFollowUp(formData as any);
                    break;
                case 'lyricAnalyzer':
                    result = await runLyricAnalyzer(formData as LyricAnalyzerFormData);
                    break;
                case 'remixABTest':
                    result = await runRemixABTest(formData as any);
                    break;
                case 'feedbackSynthesizer':
                    result = await runFeedbackSynthesizer(formData as any);
                    break;
                case 'neighborhoods':
                    const neighborhoodFormData: NeighborhoodsFormData = { artist_name: 'Your Artist Name', track_title: 'Your Track Title', genre: 'Your Genre', mood: 'Your Mood' };
                    result = await runSoundNeighborhoods(neighborhoodFormData);
                    break;
                default:
                    throw new Error("Invalid tool selected");
            }
            setAnalysis(result);
            if(tool === 'neighborhoods') setActiveTool('neighborhoods');
        } catch (err) {
            setError(err instanceof Error ? `Analysis failed: ${err.message}` : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewCuratorProfile = (name: string) => {
        const profile = getCuratorProfile(name);
        if (profile) {
            setViewingProfile(profile);
        }
    };

    const handleMessageCurator = (curatorName: string) => {
        const profile = getCuratorProfile(curatorName);
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

    const handleResetToDashboard = () => {
        setAnalysis(null);
        setError(null);
        setIsLoading(false);
        setActiveTool(null);
        setActiveTab('dashboard');
    }
    
    if (viewingProfile) {
        return <CuratorProfile profile={viewingProfile} onClose={() => setViewingProfile(null)} onMessage={handleMessageCurator} />;
    }

    if (isLoading) {
      return (
        <div className="text-center bg-[var(--surface-primary)]/50 backdrop-blur-sm p-8 rounded-2xl border border-[var(--border)]">
           <div className="flex justify-center items-center mb-4">
              <LoadingSpinner />
            </div>
          <p className="text-lg text-[var(--accent-primary)] animate-pulse">Soundchild AI is working...</p>
          <p className="text-[var(--text-secondary)] mt-2">This may take a moment. We're running a deep analysis and generating your report.</p>
        </div>
      );
    }
    
    if (error) {
       return (
        <div className="text-center p-6 bg-red-900/50 border border-red-700 rounded-lg">
          <p className="font-bold text-red-400">An Error Occurred</p>
          <p className="mt-2 text-red-300">{error}</p>
          <button
            onClick={handleResetToDashboard}
            className="mt-4 px-6 py-2 bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] text-white font-semibold rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      );
    }

    if (analysis && activeTool) {
      return <AnalysisDisplay 
        analysis={analysis} 
        tool={activeTool} 
        onReset={handleResetToDashboard} 
        onCuratorClick={handleViewCuratorProfile}
      />;
    }

    if (activeTool) {
      return <MusicUploadForm activeTool={activeTool} onSubmit={handleFormSubmit} onBack={handleResetToDashboard} />;
    }

    return (
        <div className="bg-[var(--surface-primary)]/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl border border-[var(--border)] animate-fade-in">
            {isSubModalOpen && <SubscriptionModal onClose={() => setIsSubModalOpen(false)} />}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-[var(--text-primary)]">Artist Dashboard</h2>
                    <p className="text-[var(--text-secondary)]">Your AI-powered command center.</p>
                </div>
                <button onClick={onBack} className="text-sm text-[var(--accent-primary)] hover:underline flex-shrink-0">Back to Hubs</button>
            </div>

            <div className="border-b border-[var(--border)] mb-6">
                <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                     <button onClick={() => setActiveTab('dashboard')} className={`${activeTab === 'dashboard' ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-secondary)]'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                        Dashboard
                    </button>
                     <button onClick={() => setActiveTab('advisor')} className={`${activeTab === 'advisor' ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-secondary)]'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}>
                        <MessageCircleIcon className="w-5 h-5" /> AI Advisor
                    </button>
                     <button onClick={() => setActiveTab('discoverCurators')} className={`${activeTab === 'discoverCurators' ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-secondary)]'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}>
                        <UsersIcon className="w-5 h-5" /> Discover Curators
                    </button>
                     <button onClick={() => setActiveTab('campaigns')} className={`${activeTab === 'campaigns' ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-secondary)]'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                        Campaigns
                    </button>
                     <button onClick={() => setActiveTab('messages')} className={`${activeTab === 'messages' ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-secondary)]'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}>
                        <InboxIcon className="w-5 h-5" /> Messages
                    </button>
                     <button onClick={() => setActiveTab('wallet')} className={`${activeTab === 'wallet' ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-secondary)]'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}>
                        <WalletIcon className="w-5 h-5" /> Wallet
                    </button>
                </nav>
            </div>
            
            {activeTab === 'dashboard' && (
                <ArtistDashboard 
                    onToolSelect={setActiveTool} 
                    onExploreSound={() => handleFormSubmit({} as AllFormData, 'neighborhoods')}
                    onUpgradeClick={() => setIsSubModalOpen(true)}
                />
            )}
            {activeTab === 'advisor' && (
                <CareerAdvisor />
            )}
            {activeTab === 'discoverCurators' && (
                <CuratorDiscovery onViewProfile={handleViewCuratorProfile} />
            )}
            {activeTab === 'campaigns' && (
                <CampaignPerformance />
            )}
            {activeTab === 'messages' && (
                <Messaging 
                    conversations={conversations}
                    setConversations={setConversations}
                    activeConversationId={activeConversationId}
                    setActiveConversationId={setActiveConversationId}
                    userType="artist"
                />
            )}
            {activeTab === 'wallet' && (
                <Wallet 
                    walletData={walletData}
                    setWalletData={setWalletData}
                    userType="artist"
                />
            )}
        </div>
    );
};
