import React from 'react';
import { BarChartIcon, MusicNoteIcon, TelescopeIcon, UserCheckIcon, BriefcaseIcon } from './icons';

interface LandingPageProps {
    onLaunchApp: () => void;
    onDiscover: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; }> = ({ icon, title, description }) => (
    <div className="bg-[var(--surface-primary)]/50 p-6 rounded-lg border border-[var(--border)] text-left">
        <div className="flex items-center gap-4 mb-3">
            {icon}
            <h3 className="text-xl font-bold text-[var(--text-primary)]">{title}</h3>
        </div>
        <p className="text-[var(--text-secondary)] text-sm">{description}</p>
    </div>
);


export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp, onDiscover }) => {
    return (
        <div className="space-y-24 animate-fade-in">
            {/* Hero Section */}
            <section className="text-center max-w-3xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-extrabold text-[var(--text-primary)] tracking-tighter">
                    Where Music Meets <span className="text-[var(--accent-primary)]">Measured Discovery</span>
                </h1>
                <p className="mt-6 text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
                    Soundchild.ai is an AI-driven submission, discovery, and promotion platform connecting creators with curators, powered by Google AI.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={onLaunchApp}
                        className="w-full sm:w-auto px-10 py-4 bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] text-white font-bold rounded-full text-lg transition-all transform hover:scale-105 shadow-lg"
                    >
                        Launch App
                    </button>
                    <button
                         onClick={onDiscover}
                         className="w-full sm:w-auto px-10 py-4 bg-[var(--surface-secondary)]/50 hover:bg-[var(--surface-secondary)]/80 text-[var(--accent-primary-hover)] font-semibold rounded-full text-lg transition-colors border border-[var(--border-secondary)]"
                    >
                        Discover Music
                    </button>
                </div>
            </section>
            
            {/* For Who Section */}
            <section>
                <div className="text-center mb-12">
                     <h2 className="text-4xl font-extrabold text-[var(--text-primary)]">An Intelligent Ecosystem for Music</h2>
                     <p className="mt-4 text-lg text-[var(--text-secondary)]">Tools for every role in the industry.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<MusicNoteIcon className="w-8 h-8 text-[var(--accent-primary)]"/>}
                        title="For Artists"
                        description="Get instant track analysis, AI-powered pitch writing, and optimized campaign strategies to get your music heard by the right people."
                    />
                    <FeatureCard
                        icon={<UserCheckIcon className="w-8 h-8 text-[var(--accent-primary)]"/>}
                        title="For Curators"
                        description="Streamline your workflow with an AI-sorted submission queue, get pre-analyzed tracks, and earn fair compensation for your time and expertise."
                    />
                     <FeatureCard
                        icon={<BriefcaseIcon className="w-8 h-8 text-[var(--accent-primary)]"/>}
                        title="For Labels & A&R"
                        description="Discover the next wave of talent with AI-powered scouting tools, track emerging genre trends, and connect directly with promising artists."
                    />
                </div>
            </section>

             {/* How It Works Section */}
            <section>
                 <div className="text-center mb-12">
                     <h2 className="text-4xl font-extrabold text-[var(--text-primary)]">Powered by Intelligence</h2>
                     <p className="mt-4 text-lg text-[var(--text-secondary)]">Our core AI modules work together to create a smarter music economy.</p>
                </div>
                 <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-[var(--surface-primary)]/50 p-6 rounded-lg border border-[var(--border)] flex items-center gap-4">
                        <TelescopeIcon className="w-10 h-10 text-[var(--accent-primary)] flex-shrink-0"/>
                        <div>
                            <h4 className="font-bold text-[var(--text-primary)]">AI Music Intelligence</h4>
                            <p className="text-sm text-[var(--text-secondary)]">Gemini models auto-analyze songs for quality, mood, and audience match.</p>
                        </div>
                     </div>
                      <div className="bg-[var(--surface-primary)]/50 p-6 rounded-lg border border-[var(--border)] flex items-center gap-4">
                        <BarChartIcon className="w-10 h-10 text-[var(--accent-primary)] flex-shrink-0"/>
                        <div>
                            <h4 className="font-bold text-[var(--text-primary)]">Verified Impact Engine</h4>
                            <p className="text-sm text-[var(--text-secondary)]">Tracks song performance after placement to ensure fair, data-driven rewards.</p>
                        </div>
                     </div>
                 </div>
            </section>

             {/* Final CTA */}
            <section className="text-center max-w-2xl mx-auto">
                 <h2 className="text-4xl font-extrabold text-[var(--text-primary)]">Join the Future of Music Discovery</h2>
                <p className="mt-4 text-lg text-[var(--text-secondary)]">
                    Stop guessing. Start connecting. Launch Soundchild.ai and let our intelligent ecosystem amplify your music journey.
                </p>
                <div className="mt-8">
                    <button
                        onClick={onLaunchApp}
                        className="px-10 py-4 bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] text-white font-bold rounded-full text-lg transition-all transform hover:scale-105 shadow-lg"
                    >
                        Get Started
                    </button>
                </div>
            </section>
        </div>
    );
};