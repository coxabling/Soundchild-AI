import React from 'react';
import type { CampaignPerformanceData } from '../types';
import { BarChartIcon, CheckCircleIcon, SparklesIcon, XIcon } from './icons';

interface ImpactReportProps {
    report: CampaignPerformanceData;
    onClose: () => void;
}

const StatCard: React.FC<{ label: string; value: string; icon: React.ReactNode; }> = ({ label, value, icon }) => (
    <div className="bg-[var(--surface-secondary)]/50 p-4 rounded-lg text-center border border-[var(--border-secondary)]">
        <div className="flex justify-center items-center text-[var(--accent-primary)] mb-2">{icon}</div>
        <p className="text-3xl font-bold text-[var(--text-primary)]">{value}</p>
        <p className="text-sm text-[var(--text-secondary)] mt-1">{label}</p>
    </div>
);

export const ImpactReport: React.FC<ImpactReportProps> = ({ report, onClose }) => {
    return (
        <div className="fixed inset-0 bg-[var(--background)]/80 backdrop-blur-lg z-40 animate-fade-in overflow-y-auto flex items-center justify-center p-4">
            <div className="relative bg-[var(--surface-primary)]/80 border border-[var(--border)] rounded-2xl shadow-2xl max-w-2xl w-full">
                <button onClick={onClose} className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors z-50">
                    <XIcon className="w-6 h-6" />
                </button>

                <div className="p-6 md:p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-extrabold text-[var(--text-primary)] flex items-center justify-center gap-2">
                           <BarChartIcon className="w-8 h-8 text-[var(--accent-primary)]" /> Verified Impact Report
                        </h2>
                        <p className="text-[var(--text-secondary)] mt-2">
                            Placement by <span className="font-bold text-[var(--accent-primary)]">{report.curatorName}</span> on {report.placementDate}
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <StatCard label="Stream Uplift" value={`+${report.streamUplift}%`} icon={<div />} />
                        <StatCard label="New Listeners" value={`+${report.listenerGrowth.toLocaleString()}`} icon={<div />} />
                        <StatCard label="Save Rate" value={`${report.saveRate}%`} icon={<div />} />
                        <StatCard label="Campaign ROI" value={`${report.roi}x`} icon={<div />} />
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-[var(--accent-primary-hover)] mb-4 flex items-center gap-2">
                           <SparklesIcon className="w-5 h-5"/> AI Insight
                        </h3>
                        <div className="p-4 bg-[var(--surface-secondary)]/50 rounded-lg border-l-4 border-[var(--accent-primary)]">
                            <p className="text-[var(--text-secondary)]">
                                This placement performed <strong className="text-[var(--positive)]">above average</strong> for tracks in this genre. 
                                The high save rate indicates strong listener engagement. Consider re-pitching to {report.curatorName} for your next release.
                            </p>
                        </div>
                    </div>
                    
                    <div className="text-center mt-8">
                        <button onClick={onClose} className="px-8 py-2 bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] text-[var(--text-primary)] font-semibold rounded-lg transition-colors">
                            Close Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};