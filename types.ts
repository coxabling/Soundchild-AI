export type Tool = 'evaluator' | 'curator' | 'optimizer' | 'pitchWriter' | 'followUp' | 'neighborhoods' | 'scouting' | 'remixABTest' | 'feedbackSynthesizer' | 'lyricAnalyzer' | 'marketAnalysis' | 'dealMemo';
export type Hub = 'artist' | 'curator' | 'label';
export type Theme = 'light' | 'dark';

// Notifications
export interface NotificationMessage {
  id: number;
  message: string;
  type: 'success' | 'error';
}

// Monetization
export interface SubscriptionPlan {
  name: string;
  price: string;
  features: string[];
  isFeatured?: boolean;
}

export interface CreditPack {
    id: string;
    credits: number;
    price: number;
    bonus?: string;
}

// Wallet & Transactions
export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'fee' | 'payout' | 'bonus' | 'tip' | 'credit_purchase' | 'credit_spend';
  description: string;
  amount: number;
  date: string;
}

export interface WalletData {
  balance: number;
  credits: number;
  transactions: Transaction[];
}

// Messaging System
export interface Badge {
    name: string;
    description: string;
    icon: 'award' | 'clock' | 'target';
}

export interface Message {
    id: string;
    sender: 'artist' | 'curator' | 'system' | 'me';
    text: string;
    timestamp: string;
    isRead: boolean;
}

export interface Conversation {
    id: string;
    participantId: string;
    participantName: string;
    participantImageUrl: string;
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
    messages: Message[];
}

// AI Career Advisor
export interface ChatMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}


// Mock Data Structures
export interface TrackMetadata {
    artist_name: string;
    track_title: string;
    genre: string;
    isrc: string;
}

export interface CampaignPerformanceData {
    id: string;
    curatorName: string;
    placementDate: string;
    streamUplift: number; // percentage
    listenerGrowth: number;
    saveRate: number; // percentage
    roi: number; // multiplier
}

export interface Submission {
  id: string;
  artist_name: string;
  track_title: string;
  genre: string;
  mood: string;
  pitch: string;
  description: string;
  loudness: string;
  energy: number;
  valence: number;
  status: 'pending' | 'reviewed';
  aiFitScore: number;
  reviewHelpfulness?: number;
  performanceDataId?: string; // Link to performance report
}

export interface ArtistAnalytics {
  submissionsSent: number;
  acceptanceRate: number;
  avgFitScore: number;
}

export interface SpotifyAnalytics {
  streams: number;
  listeners: number;
  saves: number;
  playlistAdds: number;
}

export interface CuratorEarnings {
  total: number;
  reputationScore: number; 
  streakBonus: number; // New field for FairPay model
  breakdown: {
    base: number;
    qualityBonus: number; // Renamed from feedbackBonus
    performanceBonus: number; // Renamed from placementBonus
    tips: number;
  }
}

// Data for Curator Discovery List
export interface CuratorListData {
    id: string;
    name: string;
    type: string;
    presentation: string;
    country: string;
    job: string;
    website: string;
    imageUrl: string;
}

// Profile Page Data
export interface ArtistProfileData {
    id: string;
    name: string;
    genre: string;
    location: string;
    bio: string;
    imageUrl: string;
    monthlyListeners: number;
    saves: number;
    socials: {
        spotify: string;
        instagram: string;
        twitter: string;
    };
    topTracks: { title: string; streams: number }[];
}

export interface CuratorProfileData {
    id: string;
    name: string;
    tagline: string;
    bio: string;
    imageUrl: string;
    acceptanceRate: number;
    avgResponseTime: string;
    reputation: number;
    genres: string[];
    vibes: string[];
    recentReviews: { track: string; artist: string; snippet: string; }[];
    verifiedPlaylists: { name: string; followers: number; url: string; }[];
    badges: Badge[];
}

// Sound Discover Page
export interface SoundNeighborhood {
    name: string;
    description: string;
    tags: string[];
    coverArtUrl: string;
    trendingTracks: { artist: string; title: string }[];
}


// Data for Label Hub UI
export interface GenreTrend {
    genre: string;
    growth: number; // percentage
}

export interface UnsignedArtist {
    name: string;
    genre: string;
    location: string;
    monthly_listeners: number;
    reason_for_selection: string;
}

// Module 1: Artist Evaluator
export interface EvaluatorFormData {
  artist_name: string;
  track_title: string;
  genre: string;
  mood: string;
  bpm: string;
  loudness: string;
  dynamic_range: string;
  energy: number;
  valence: number;
  description: string;
  goal: string;
  context: string;
  file: File | null;
}

export interface EvaluatorResponse {
  readiness_score: number;
  strengths: string[];
  weaknesses: string[];
  improvement_recommendations: string[];
  ideal_curator_profile: string;
  confidence_level: number;
}

// Module 2: Curator Assistant
export interface CuratorFormData {
  curator_name: string;
  curator_genres: string;
  curator_audience: string;
  artist_name: string;
  track_title: string;
  genre: string;
  mood: string;
  description: string;
  loudness: string;
  energy: number;
  valence: number;
  pitch: string;
  file: File | null;
}

export interface CuratorResponse {
  fit_score: number;
  decision: "accept" | "pass" | "consider later";
  fit_reason: string;
  review_for_artist: string;
  social_caption: string;
  confidence_level: number;
  review_quality_score: number; // For AI Validation
}

// Module 3: Campaign Optimizer
export interface OptimizerFormData {
  artist_name: string;
  track_title: string;
  genre: string;
  mood: string;
  goals: string;
  budget: string;
  curator_profiles: string;
  past_results: string;
  file: File | null;
}

export interface OptimizerResponse {
  recommended_curators: {
    curator_name: string;
    predicted_acceptance_rate: number;
    estimated_cost: number;
    expected_impact: string;
  }[];
  budget_allocation: {
    total_budget: number;
    distribution: {
      curator_name: string;
      allocation_amount: number;
    }[];
  };
  recommended_timing: string;
  strategy_summary: string;
  predicted_roi_multiplier: number;
}

// Tool: Pitch Writer
export interface PitchWriterFormData {
  artist_name: string;
  track_title: string;
  curator_name: string;
  mood: string;
  genre: string;
  pitch_tone: 'professional' | 'casual' | 'enthusiastic';
}

export interface PitchWriterResponse {
  generated_pitch: string;
}

// Tool: Smart Follow-Up
export interface FollowUpFormData {
    artist_name: string;
    track_title: string;
    curator_name: string;
    curator_feedback: string;
    original_goal: string;
}

export interface FollowUpResponse {
    follow_up_suggestion: string;
    next_step_advice: string;
    suggested_timing: string;
}

// Tool: Sound Neighborhoods
export interface NeighborhoodsFormData {
    artist_name: string;
    track_title: string;
    genre: string;
    mood: string;
}
export interface NeighborhoodsResponse {
    similar_artists: { name: string; reason: string; }[];
    recommended_curators: { name: string; reason: string; }[];
    emerging_scene_description: string;
}

// Tool: Scouting Assistant (for Label Hub)
export interface ScoutingFormData {
    genre: string;
    mood: string;
    min_growth_velocity: number;
    max_monthly_listeners: number;
}

export interface ScoutingResponse {
    recommended_artists: UnsignedArtist[];
    market_insight: string;
}

// Tool: A/B Test Remix
export interface RemixABTestFormData {
    track_title: string;
    target_audience: string;
    version_a_description: string;
    version_b_description: string;
}

export interface RemixABTestResponse {
    predicted_winner: "Version A" | "Version B" | "Inconclusive";
    winner_reasoning: string;
    recommendations_for_a: string;
    recommendations_for_b: string;
}

// Tool: Feedback Synthesizer
export interface FeedbackSynthesizerFormData {
    track_title: string;
    curator_feedbacks: string; // JSON string of feedbacks
}

export interface FeedbackSynthesizerResponse {
    overall_verdict: string;
    key_strengths: string[];
    common_criticisms: string[];
    actionable_next_steps: string[];
}

// --- NEW FEATURES ---

// Tool: Lyric & Theme Analyzer
export interface LyricAnalyzerFormData {
    lyrics: string;
}
export interface LyricAnalyzerResponse {
    key_themes: string[];
    emotional_arc: string;
    suggestions: string[];
}

// Tool: Dynamic Playlist Assistant
export interface PlaylistAssistantFormData {
    seed_tracks: string;
    mood: string;
    curator_tracks: { title: string; artist: string }[];
}
export interface PlaylistAssistantResponse {
    playlist_name: string;
    playlist_description: string;
    track_sequence: { title: string; artist: string }[];
}

// Tool: Audience Persona Generator
export interface PersonaGeneratorFormData {
    curator_genres: string[];
    curator_accepted_tracks: { genre: string; mood: string }[];
}
export interface PersonaGeneratorResponse {
    personas: { name: string; demographics: string; listening_habits: string; other_interests: string; }[];
}

// Tool: Market Opportunity Analysis
export interface MarketAnalysisFormData {
    genre: string;
    location: string;
}
export interface MarketAnalysisResponse {
    analysis_text: string;
    sources: { uri: string; title: string }[];
}

// Tool: "First Contact" Draft Assistant
export interface DealMemoFormData {
    artist_name: string;
    key_terms: string;
    deal_type: 'single_track_license' | 'ep_deal' | 'development_deal';
}
export interface DealMemoResponse {
    memo_text: string;
}


// Union Types
export type AllFormData = EvaluatorFormData | CuratorFormData | OptimizerFormData | PitchWriterFormData | FollowUpFormData | NeighborhoodsFormData | ScoutingFormData | RemixABTestFormData | FeedbackSynthesizerFormData | LyricAnalyzerFormData;
export type AllAnalysisResponses = EvaluatorResponse | CuratorResponse | OptimizerResponse | PitchWriterResponse | FollowUpResponse | NeighborhoodsResponse | ScoutingResponse | RemixABTestResponse | FeedbackSynthesizerResponse | LyricAnalyzerResponse;