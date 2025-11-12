import React, { useState, useEffect } from 'react';
import type { AllAnalysisResponses, Tool, EvaluatorResponse, CuratorResponse, OptimizerResponse, PitchWriterResponse, FollowUpResponse, NeighborhoodsResponse, Submission, RemixABTestResponse, FeedbackSynthesizerResponse, LyricAnalyzerResponse } from '../types';
import { TargetIcon, ClipboardIcon, TelescopeIcon, RefreshIcon, CheckCircleIcon, AlertTriangleIcon, BarChartIcon, UserCheckIcon, SendIcon, InfoIcon, SpotifyIcon, UsersIcon, MessageSquareIcon, StarIcon, GitCompareArrowsIcon, ClipboardListIcon, SparklesIcon, PenSquareIcon } from './icons';
import { LoadingSpinner } from './LoadingSpinner';
import { useNotification } from '../App';

interface AnalysisDisplayProps {
  analysis: AllAnalysisResponses;
  tool: Tool;
  onReset: () => void;
  onRateReview?: (rating: number) => void;
  submission?: Submission | null;
  onCuratorClick?: (curatorName: string) => void;
}

const getAIEngineInfo = (tool: Tool): string => {
    const map: Record<Tool, string> = {
        'evaluator': "Powered by Gemini 2.5 Pro for deep creative and technical analysis.",
        'curator': "Powered by Gemini 2.5 Pro for nuanced, context-aware feedback generation.",
        'optimizer': "Powered by Gemini 2.5 Pro for complex campaign strategy and ROI prediction.",
        'pitchWriter': "Powered by Gemini Flash for fast and creative pitch generation.",
        'followUp': "Powered by Gemini Flash for strategic communication advice.",
        'neighborhoods': "Powered by Gemini 2.5 Pro to analyze sonic relationships and discover emerging scenes.",
        'scouting': "Powered by Gemini 2.5 Pro for advanced, criteria-based talent discovery.",
        'remixABTest': "Powered by Gemini Flash for quick, predictive analysis on track variations.",
        'feedbackSynthesizer': "Powered by Gemini Flash to efficiently summarize large amounts of text into actionable insights.",
        'lyricAnalyzer': "Powered by Gemini 2.5 Pro for deep literary and thematic analysis of lyrics.",
        'marketAnalysis': "Powered by Gemini 2.5 Pro with Google Search grounding for real-time market insights.",
        'dealMemo': "Powered by Gemini Flash for quickly drafting professional communications.",
    };
    return map[tool] || "Powered by Google AI";
};


const AnalysisCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, icon, children, className }) => (
  <div className={`bg-[var(--surface-primary)]/50 backdrop-blur-sm border border-[var(--border)] rounded-xl shadow-lg overflow-hidden ${className}`}>
    <div className="p-5 bg-[var(--surface-primary)]/80 flex items-center gap-4 border-b border-[var(--border)]">
      {icon}
      <h3 className="text-xl font-bold text-[var(--accent-primary)]">{title}</h3>
    </div>
    <div className="p-5 text-[var(--text-secondary)]">
      {children}
    </div>
  </div>
);

const ScoreCircle: React.FC<{ score: number, label: string, colorClass: string }> = ({ score, label, colorClass }) => {
    const circumference = 2 * Math.PI * 52;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative w-40 h-40 mx-auto">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle className="text-[var(--surface-secondary)]" strokeWidth="8" stroke="currentColor" fill="transparent" r="52" cx="60" cy="60" />
                <circle
                    className={`${colorClass} transition-all duration-1000 ease-out`}
                    strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={offset}
                    strokeLinecap="round" stroke="currentColor" fill="transparent" r="52" cx="60" cy="60" transform="rotate(-90 60 60)"
                />
            </svg>
            <div className={`absolute inset-0 flex flex-col items-center justify-center ${colorClass}`}>
                <span className="text-5xl font-bold">{score}</span>
                <span className="text-sm font-medium">{label}</span>
            </div>
        </div>
    );
};

const getScoreColor = (score: number) => score >= 75 ? 'text-[var(--positive)]' : score >= 50 ? 'text-[var(--warning)]' : 'text-[var(--negative)]';

const ArtistEvaluatorReport: React.FC<{data: EvaluatorResponse}> = ({ data }) => (
    <div className="space-y-8">
        <div className="bg-[var(--surface-primary)]/50 border border-[var(--border)] rounded-xl shadow-lg p-6 text-center">
            <ScoreCircle score={data.readiness_score} label="Readiness" colorClass={getScoreColor(data.readiness_score)} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AnalysisCard title="Strengths" icon={<CheckCircleIcon className="w-6 h-6 text-[var(--positive)]"/>}>
                <ul className="space-y-3">{data.strengths.map((item, i) => <li key={i} className="flex items-start gap-3 text-[var(--positive)]/90"><CheckCircleIcon className="w-5 h-5 flex-shrink-0 mt-1" /> {item}</li>)}</ul>
            </AnalysisCard>
            <AnalysisCard title="Weaknesses" icon={<AlertTriangleIcon className="w-6 h-6 text-[var(--warning)]"/>}>
                 <ul className="space-y-3">{data.weaknesses.map((item, i) => <li key={i} className="flex items-start gap-3 text-[var(--warning)]/90"><AlertTriangleIcon className="w-5 h-5 flex-shrink-0 mt-1" /> {item}</li>)}</ul>
            </AnalysisCard>
        </div>
        <AnalysisCard title="Improvement Recommendations" icon={<TelescopeIcon className="w-6 h-6 text-[var(--accent-primary)]" />}>
            <ul className="space-y-3 list-disc list-inside">{data.improvement_recommendations.map((item, i) => <li key={i}>{item}</li>)}</ul>
        </AnalysisCard>
        <AnalysisCard title="Ideal Curator Profile" icon={<TargetIcon className="w-6 h-6 text-[var(--accent-primary)]" />}>
            <p>{data.ideal_curator_profile}</p>
        </AnalysisCard>
    </div>
);

const ArtistFeedbackSimulator: React.FC<{ onRate: (rating: number) => void; rating?: number }> = ({ onRate, rating }) => {
    const [hoverRating, setHoverRating] = useState(0);

    if (rating) {
        return (
            <div className="text-center p-4 bg-green-900/50 border border-green-700 rounded-lg">
                <p className="font-semibold text-green-300">Thank you for your feedback!</p>
                <p className="text-sm text-green-400">Your rating helps us reward helpful curators.</p>
            </div>
        );
    }
    
    return (
        <div className="text-center">
            <h4 className="text-lg font-semibold text-[var(--accent-primary-hover)] mb-2">Rate This Review's Helpfulness</h4>
            <div className="flex justify-center items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => onRate(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none"
                    >
                        <StarIcon className={`w-8 h-8 transition-colors ${(hoverRating || rating || 0) >= star ? 'text-[var(--warning)]' : 'text-[var(--surface-tertiary)]'}`} />
                    </button>
                ))}
            </div>
        </div>
    );
};

const AIQualityCheck: React.FC<{ score: number }> = ({ score }) => {
    const [isValidating, setIsValidating] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsValidating(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    if (isValidating) {
        return (
            <div className="flex items-center justify-center gap-2 text-[var(--accent-primary)] animate-pulse">
                <div className="w-5 h-5"><LoadingSpinner /></div>
                <span>Validating review quality...</span>
            </div>
        )
    }

    return (
         <div className="text-center">
             <p className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}<span className="text-xl">/100</span></p>
             <p className="text-sm text-[var(--text-secondary)] mt-1">AI Quality Score</p>
             <p className="text-xs text-[var(--text-tertiary)] mt-1">Helpful, specific, and constructive.</p>
         </div>
    );
};


const CuratorAssistantReport: React.FC<{
    data: CuratorResponse;
    submission?: Submission | null;
    onRateReview?: (rating: number) => void;
}> = ({ data, submission, onRateReview }) => {
    const { addNotification } = useNotification();
    const decisionColor = data.decision === 'accept' ? 'text-[var(--positive)]' : data.decision === 'pass' ? 'text-[var(--negative)]' : 'text-[var(--warning)]';
    const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');

    const handleSync = () => {
        setSyncStatus('syncing');
        setTimeout(() => {
            setSyncStatus('synced');
            addNotification({ message: 'Track synced to Spotify playlist!', type: 'success' });
        }, 1500);
    };

    const renderSyncButton = () => {
        if (syncStatus === 'syncing') {
            return (
                <button disabled className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-[var(--surface-tertiary)] text-[var(--text-primary)] font-semibold rounded-lg text-sm cursor-not-allowed">
                     <div className="w-5 h-5"><LoadingSpinner /></div>
                    Syncing...
                </button>
            )
        }
        if (syncStatus === 'synced') {
             return (
                <button disabled className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-[var(--positive)] text-white font-semibold rounded-lg text-sm">
                    <CheckCircleIcon className="w-5 h-5" />
                    Synced!
                </button>
             )
        }
        return (
            <button 
                onClick={handleSync}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#1DB954] hover:bg-[#1ED760] text-white font-semibold rounded-lg transition-colors text-sm"
            >
                <SpotifyIcon className="w-5 h-5" />
                Sync to Spotify Playlist
            </button>
        );
    }

    return (
        <div className="space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[var(--surface-primary)]/50 border border-[var(--border)] rounded-xl shadow-lg p-6 text-center flex flex-col justify-center items-center">
                     <p className="text-lg text-[var(--text-secondary)] mb-2">Recommended Decision</p>
                    <p className={`text-5xl font-bold capitalize ${decisionColor}`}>{data.decision}</p>
                    {data.decision === 'accept' && renderSyncButton()}
                </div>
                <div className="bg-[var(--surface-primary)]/50 border border-[var(--border)] rounded-xl shadow-lg p-6 text-center">
                    <ScoreCircle score={data.fit_score} label="Fit Score" colorClass={getScoreColor(data.fit_score)} />
                </div>
            </div>
             <AnalysisCard title="Fit Reason" icon={<UserCheckIcon className="w-6 h-6 text-[var(--accent-primary)]" />}>
                <p className="italic">"{data.fit_reason}"</p>
            </AnalysisCard>
            <AnalysisCard title="Review for Artist" icon={<ClipboardIcon className="w-6 h-6 text-[var(--accent-primary)]" />}>
                <p className="whitespace-pre-wrap">{data.review_for_artist}</p>
            </AnalysisCard>
            <AnalysisCard title="Social Media Caption" icon={<ClipboardIcon className="w-6 h-6 text-[var(--accent-primary)]" />}>
                <p className="whitespace-pre-wrap font-mono bg-[var(--background-secondary)]/50 p-4 rounded-md">{data.social_caption}</p>
            </AnalysisCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AnalysisCard title="AI Quality Check" icon={<SparklesIcon className="w-6 h-6 text-[var(--accent-primary)]" />}>
                    <AIQualityCheck score={data.review_quality_score} />
                </AnalysisCard>
                {onRateReview && (
                    <AnalysisCard title="Artist Feedback" icon={<StarIcon className="w-6 h-6 text-[var(--warning)]" />}>
                        <ArtistFeedbackSimulator onRate={onRateReview} rating={submission?.reviewHelpfulness} />
                    </AnalysisCard>
                )}
            </div>
        </div>
    );
};

const CampaignOptimizerReport: React.FC<{data: OptimizerResponse; onCuratorClick?: (name: string) => void}> = ({ data, onCuratorClick }) => (
    <div className="space-y-8">
         <AnalysisCard title="Strategy Summary" icon={<TelescopeIcon className="w-6 h-6 text-[var(--accent-primary)]" />}>
            <p>{data.strategy_summary}</p>
            <div className="mt-4 pt-4 border-t border-[var(--border)] text-center">
                <p className="text-[var(--text-secondary)]">Predicted ROI Multiplier</p>
                <p className="text-3xl font-bold text-[var(--positive)]">{data.predicted_roi_multiplier}x</p>
            </div>
        </AnalysisCard>

        <AnalysisCard title="Recommended Curators" icon={<TargetIcon className="w-6 h-6 text-[var(--accent-primary)]" />}>
            <div className="space-y-6">
                {data.recommended_curators.map((c, i) => (
                    <div key={i} className="p-4 bg-[var(--background-secondary)]/50 rounded-lg border border-[var(--border-secondary)]">
                         <div className="flex justify-between items-start mb-2">
                             <button onClick={() => onCuratorClick && onCuratorClick(c.curator_name)} className="font-bold text-lg text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors text-left">
                                {c.curator_name}
                             </button>
                             <span className="text-sm font-medium text-[var(--text-primary)]/80 bg-[var(--surface-secondary)] px-2 py-0.5 rounded flex-shrink-0">{c.predicted_acceptance_rate}% Acceptance</span>
                         </div>
                        <div className="w-full bg-[var(--surface-secondary)] rounded-full h-1.5 mb-3"><div className="bg-[var(--accent-primary)] h-1.5 rounded-full" style={{width: `${c.predicted_acceptance_rate}%`}}></div></div>
                        <div className="group relative flex items-center gap-2">
                             <p className="text-sm text-[var(--text-secondary)]"><strong>Impact:</strong> {c.expected_impact}</p>
                             <InfoIcon className="w-4 h-4 text-[var(--text-tertiary)] cursor-pointer"/>
                             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-[var(--background-secondary)] border border-[var(--border-secondary)] text-[var(--text-secondary)] text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                <span className="font-bold text-[var(--accent-primary)]">AI Reasoning:</span> High match based on genre, mood, and past performance of similar tracks on this curator's playlists.
                             </div>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] mt-1"><strong>Est. Cost:</strong> {c.estimated_cost} Credits</p>
                    </div>
                ))}
            </div>
        </AnalysisCard>
        
        <AnalysisCard title="Budget Allocation" icon={<BarChartIcon className="w-6 h-6 text-[var(--accent-primary)]" />}>
            <p className="mb-4 text-lg">Total Budget: <span className="font-bold text-[var(--accent-primary-hover)]">{data.budget_allocation.total_budget} Credits</span></p>
            <ul className="space-y-2">
                {data.budget_allocation.distribution.map((d, i) => (
                    <li key={i} className="flex justify-between p-2 bg-[var(--background-secondary)]/50 rounded-md">
                        <button onClick={() => onCuratorClick && onCuratorClick(d.curator_name)} className="hover:text-[var(--accent-primary)] transition-colors">{d.curator_name}</button>
                        <span className="font-mono text-[var(--accent-primary-hover)]">{d.allocation_amount} Credits</span>
                    </li>
                ))}
            </ul>
        </AnalysisCard>

        <AnalysisCard title="Recommended Timing" icon={<ClipboardIcon className="w-6 h-6 text-[var(--accent-primary)]" />}>
            <p>{data.recommended_timing}</p>
        </AnalysisCard>
    </div>
);

const PitchWriterReport: React.FC<{data: PitchWriterResponse}> = ({ data }) => {
    const { addNotification } = useNotification();
    const handleCopy = () => {
        navigator.clipboard.writeText(data.generated_pitch);
        addNotification({ message: 'Pitch copied to clipboard!', type: 'success' });
    };

    return (
        <AnalysisCard title="Generated Pitch" icon={<SendIcon className="w-6 h-6 text-[var(--accent-primary)]" />}>
            <p className="whitespace-pre-wrap font-mono bg-[var(--background-secondary)]/50 p-4 rounded-md text-[var(--accent-primary-hover)]">{data.generated_pitch}</p>
            <button 
                onClick={handleCopy}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] text-[var(--text-primary)] font-semibold rounded-lg transition-colors text-sm"
            >
                <ClipboardIcon className="w-4 h-4" />
                Copy Pitch
            </button>
        </AnalysisCard>
    );
}

const SmartFollowUpReport: React.FC<{data: FollowUpResponse}> = ({ data }) => {
    const { addNotification } = useNotification();
    const handleCopy = () => {
        navigator.clipboard.writeText(data.follow_up_suggestion);
        addNotification({ message: 'Message copied to clipboard!', type: 'success' });
    };

    return (
        <div className="space-y-8">
            <AnalysisCard title="Suggested Follow-Up Message" icon={<MessageSquareIcon className="w-6 h-6 text-[var(--accent-primary)]" />}>
                <p className="whitespace-pre-wrap font-mono bg-[var(--background-secondary)]/50 p-4 rounded-md text-[var(--accent-primary-hover)]">{data.follow_up_suggestion}</p>
                 <button 
                    onClick={handleCopy}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] text-[var(--text-primary)] font-semibold rounded-lg transition-colors text-sm"
                >
                    <ClipboardIcon className="w-4 h-4" />
                    Copy Message
                </button>
            </AnalysisCard>
             <AnalysisCard title="Next Step Advice" icon={<TelescopeIcon className="w-6 h-6 text-[var(--accent-primary)]" />}>
                <p>{data.next_step_advice}</p>
            </AnalysisCard>
             <AnalysisCard title="Suggested Timing" icon={<ClipboardIcon className="w-6 h-6 text-[var(--accent-primary)]" />}>
                <p>{data.suggested_timing}</p>
            </AnalysisCard>
        </div>
    );
}

const SoundNeighborhoodsReport: React.FC<{data: NeighborhoodsResponse}> = ({ data }) => (
    <div className="space-y-8">
        <AnalysisCard title="Your Sound Neighborhood" icon={<TelescopeIcon className="w-6 h-6 text-[var(--accent-primary)]" />}>
            <p className="italic">"{data.emerging_scene_description}"</p>
        </AnalysisCard>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <AnalysisCard title="Similar Artists" icon={<UsersIcon className="w-6 h-6 text-[var(--accent-primary)]" />}>
                <div className="space-y-4">
                    {data.similar_artists.map((a, i) => (
                        <div key={i} className="p-3 bg-[var(--background-secondary)]/50 rounded-lg">
                            <h4 className="font-bold text-[var(--text-primary)]">{a.name}</h4>
                            <p className="text-sm text-[var(--text-secondary)]">{a.reason}</p>
                        </div>
                    ))}
                </div>
            </AnalysisCard>
            <AnalysisCard title="Recommended Curators" icon={<UserCheckIcon className="w-6 h-6 text-[var(--accent-primary)]" />}>
                 <div className="space-y-4">
                    {data.recommended_curators.map((c, i) => (
                        <div key={i} className="p-3 bg-[var(--background-secondary)]/50 rounded-lg">
                            <h4 className="font-bold text-[var(--text-primary)]">{c.name}</h4>
                            <p className="text-sm text-[var(--text-secondary)]">{c.reason}</p>
                        </div>
                    ))}
                </div>
            </AnalysisCard>
        </div>
    </div>
);

const LyricAnalyzerReport: React.FC<{data: LyricAnalyzerResponse}> = ({ data }) => (
    <div className="space-y-8">
        <AnalysisCard title="Key Themes" icon={<TelescopeIcon className="w-6 h-6 text-[var(--accent-primary)]"/>}>
            <div className="flex flex-wrap gap-2">
                {data.key_themes.map((theme, i) => (
                    <span key={i} className="px-3 py-1 bg-[var(--surface-secondary)] text-[var(--accent-primary)] text-sm font-medium rounded-full">{theme}</span>
                ))}
            </div>
        </AnalysisCard>
        <AnalysisCard title="Emotional Arc" icon={<BarChartIcon className="w-6 h-6 text-[var(--accent-primary)]"/>}>
            <p className="italic">"{data.emotional_arc}"</p>
        </AnalysisCard>
        <AnalysisCard title="Suggestions" icon={<PenSquareIcon className="w-6 h-6 text-[var(--accent-primary)]" />}>
            <ul className="space-y-3 list-disc list-inside">{data.suggestions.map((item, i) => <li key={i}>{item}</li>)}</ul>
        </AnalysisCard>
    </div>
);

const RemixABTestReport: React.FC<{data: RemixABTestResponse}> = ({ data }) => {
    const winnerColor = data.predicted_winner === 'Version A' ? 'text-[var(--positive)]' : data.predicted_winner === 'Version B' ? 'text-[var(--accent-primary)]' : 'text-[var(--warning)]';
    return (
        <div className="space-y-8">
            <div className="text-center p-6 bg-[var(--surface-primary)]/50 rounded-lg border border-[var(--border)]">
                <p className="text-[var(--text-secondary)] text-sm">Predicted Winner</p>
                <p className={`text-5xl font-bold ${winnerColor}`}>{data.predicted_winner}</p>
                <p className="text-[var(--text-primary)]/90 mt-2 italic">"{data.winner_reasoning}"</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <AnalysisCard title="Version A Feedback" icon={<div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center font-bold text-green-300">A</div>}>
                    <p>{data.recommendations_for_a}</p>
                </AnalysisCard>
                <AnalysisCard title="Version B Feedback" icon={<div className="w-6 h-6 rounded-full bg-sky-500/20 flex items-center justify-center font-bold text-sky-300">B</div>}>
                    <p>{data.recommendations_for_b}</p>
                </AnalysisCard>
            </div>
        </div>
    );
};

const FeedbackSynthesizerReport: React.FC<{data: FeedbackSynthesizerResponse}> = ({ data }) => (
    <div className="space-y-8">
         <AnalysisCard title="Overall Verdict" icon={<ClipboardListIcon className="w-6 h-6 text-[var(--accent-primary)]"/>}>
            <p className="text-lg italic">"{data.overall_verdict}"</p>
        </AnalysisCard>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AnalysisCard title="Key Strengths" icon={<CheckCircleIcon className="w-6 h-6 text-[var(--positive)]"/>}>
                <ul className="space-y-3">{data.key_strengths.map((item, i) => <li key={i} className="flex items-start gap-3 text-[var(--positive)]/90"><CheckCircleIcon className="w-5 h-5 flex-shrink-0 mt-1" /> {item}</li>)}</ul>
            </AnalysisCard>
            <AnalysisCard title="Common Criticisms" icon={<AlertTriangleIcon className="w-6 h-6 text-[var(--warning)]"/>}>
                 <ul className="space-y-3">{data.common_criticisms.map((item, i) => <li key={i} className="flex items-start gap-3 text-[var(--warning)]/90"><AlertTriangleIcon className="w-5 h-5 flex-shrink-0 mt-1" /> {item}</li>)}</ul>
            </AnalysisCard>
        </div>
         <AnalysisCard title="Actionable Next Steps" icon={<TelescopeIcon className="w-6 h-6 text-[var(--accent-primary)]" />}>
            <ul className="space-y-3 list-disc list-inside">{data.actionable_next_steps.map((item, i) => <li key={i}>{item}</li>)}</ul>
        </AnalysisCard>
    </div>
);


const toolConfig: Record<Tool, { title: string }> = {
    evaluator: { title: "Artist Evaluation Report" },
    curator: { title: "Curator Assistant Report" },
    optimizer: { title: "Campaign Optimization Report" },
    pitchWriter: { title: "AI-Generated Pitch" },
    followUp: { title: "AI Smart Follow-Up Report" },
    neighborhoods: { title: "Sound Neighborhood Report" },
    scouting: { title: "A&R Scouting Report" },
    remixABTest: { title: "A/B Test Remix Report" },
    feedbackSynthesizer: { title: "AI Artist Report Card" },
    lyricAnalyzer: { title: "Lyric Analysis Report" },
    marketAnalysis: { title: "Market Analysis Report" },
    dealMemo: { title: "Draft Deal Memo" },
}

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis, tool, onReset, onRateReview, submission, onCuratorClick }) => {
  
  const renderReport = () => {
    switch(tool) {
        case 'evaluator': return <ArtistEvaluatorReport data={analysis as EvaluatorResponse} />;
        case 'curator': return <CuratorAssistantReport data={analysis as CuratorResponse} onRateReview={onRateReview} submission={submission} />;
        case 'optimizer': return <CampaignOptimizerReport data={analysis as OptimizerResponse} onCuratorClick={onCuratorClick} />;
        case 'pitchWriter': return <PitchWriterReport data={analysis as PitchWriterResponse} />;
        case 'followUp': return <SmartFollowUpReport data={analysis as FollowUpResponse} />;
        case 'neighborhoods': return <SoundNeighborhoodsReport data={analysis as NeighborhoodsResponse} />;
        case 'lyricAnalyzer': return <LyricAnalyzerReport data={analysis as LyricAnalyzerResponse} />;
        case 'remixABTest': return <RemixABTestReport data={analysis as RemixABTestResponse} />;
        case 'feedbackSynthesizer': return <FeedbackSynthesizerReport data={analysis as FeedbackSynthesizerResponse} />;
        default: return <p>Invalid report type.</p>;
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2">
            <h2 className="text-4xl font-extrabold text-[var(--text-primary)]">{toolConfig[tool].title}</h2>
            <div className="group relative">
                <InfoIcon className="w-5 h-5 text-[var(--text-tertiary)] cursor-pointer" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--text-secondary)] text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {getAIEngineInfo(tool)}
                </div>
            </div>
        </div>
        <p className="mt-2 text-lg text-[var(--text-secondary)]">A data-driven report from Soundchild.ai</p>
      </div>

      {renderReport()}
      
      <div className="text-center pt-6">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] text-[var(--text-primary)] font-semibold rounded-lg transition-colors"
          >
            <RefreshIcon className="w-5 h-5"/>
            Run New Analysis
          </button>
      </div>

    </div>
  );
};
