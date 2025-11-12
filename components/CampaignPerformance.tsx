import React, { useState } from 'react';
import type { Submission, CampaignPerformanceData } from '../types';
import { getPerformanceReport } from '../services/mockData';
import { BarChartIcon, CheckCircleIcon, TelescopeIcon } from './icons';
import { ImpactReport } from './ImpactReport';

// Using a simplified version of mockSubmissions for this component
const mockCampaigns: Submission[] = [
    { id: 'sub1', artist_name: 'Luna Bloom', track_title: 'Neon Tides', genre: 'Synthwave', mood: 'Nostalgic, Driving', pitch: "", status: 'reviewed', aiFitScore: 88, description: '', loudness: '', energy: 0, valence: 0, performanceDataId: 'perf1' },
    { id: 'sub2', artist_name: 'Sol', track_title: 'Morning Mist', genre: 'Lofi Hip-Hop', mood: 'Chill, Reflective', pitch: "", status: 'reviewed', aiFitScore: 75, description: '', loudness: '', energy: 0, valence: 0, performanceDataId: 'perf2' },
    { id: 'sub3', artist_name: 'The Fuse', track_title: 'Riot', genre: 'Indie Rock', mood: 'Energetic, Raw', pitch: "", status: 'pending', aiFitScore: 62, description: '', loudness: '', energy: 0, valence: 0 },
];

export const CampaignPerformance: React.FC = () => {
    const [campaigns] = useState<Submission[]>(mockCampaigns);
    const [selectedReport, setSelectedReport] = useState<CampaignPerformanceData | null>(null);

    const handleViewReport = (performanceId?: string) => {
        if (performanceId) {
            const report = getPerformanceReport(performanceId);
            if(report) setSelectedReport(report);
        }
    };
    
    return (
        <div className="space-y-6 animate-fade-in">
             {selectedReport && <ImpactReport report={selectedReport} onClose={() => setSelectedReport(null)} />}
            <div>
                <h3 className="text-lg font-semibold text-[var(--accent-primary-hover)] mb-4 flex items-center gap-2">
                    <BarChartIcon className="w-5 h-5"/>
                    Campaign Performance
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">Track the real-world impact of your submissions. Our Verified Impact Engine monitors stream uplift, listener growth, and more.</p>
            </div>
            <div className="space-y-4">
                {campaigns.map(campaign => (
                    <div key={campaign.id} className="w-full text-left p-4 bg-[var(--surface-primary)]/50 rounded-lg border border-[var(--border)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex-grow">
                            <p className="font-bold text-lg text-[var(--text-primary)]">{campaign.track_title}</p>
                            <p className="text-sm text-[var(--text-secondary)]">{campaign.artist_name} - <span className="font-medium text-[var(--text-primary)]/80">{campaign.genre}</span></p>
                        </div>
                        <div className="w-full md:w-auto flex items-center gap-4">
                             <div className={`text-sm font-medium flex items-center gap-2 px-3 py-1 rounded-full ${campaign.status === 'reviewed' ? 'bg-green-500/10 text-green-300' : 'bg-yellow-500/10 text-yellow-300'}`}>
                                <div className={`w-2 h-2 rounded-full ${campaign.status === 'reviewed' ? 'bg-[var(--positive)]' : 'bg-[var(--warning)]'}`}></div>
                                {campaign.status === 'reviewed' ? 'Complete' : 'Pending'}
                            </div>
                            <button
                                onClick={() => handleViewReport(campaign.performanceDataId)}
                                disabled={!campaign.performanceDataId}
                                className="px-4 py-2 bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] text-white font-semibold rounded-md text-sm transition-colors disabled:bg-[var(--surface-tertiary)] disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <TelescopeIcon className="w-4 h-4" />
                                View Impact
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}