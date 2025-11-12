import React from 'react';
import { mockSubscriptionPlans } from '../services/mockData';
import type { SubscriptionPlan } from '../types';
import { CheckCircleIcon, CrownIcon, SparklesIcon, XIcon } from './icons';

interface SubscriptionModalProps {
    onClose: () => void;
}

const PlanCard: React.FC<{ plan: SubscriptionPlan }> = ({ plan }) => (
    <div className={`
        p-6 rounded-xl border-2 w-full
        ${plan.isFeatured 
            ? 'bg-[var(--accent-secondary)]/20 border-[var(--accent-primary)]' 
            : 'bg-[var(--surface-primary)]/50 border-[var(--border)]'}
    `}>
        <div className="text-center">
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2 flex items-center justify-center gap-2">
                {plan.isFeatured ? <CrownIcon className="w-6 h-6 text-[var(--warning)]" /> : <SparklesIcon className="w-6 h-6 text-[var(--accent-primary)]" />}
                {plan.name}
            </h3>
            <p className="text-4xl font-extrabold text-[var(--text-primary)] mb-1">
                ${plan.price}
                <span className="text-base font-medium text-[var(--text-secondary)]">/mo</span>
            </p>
             <p className="text-sm text-[var(--text-tertiary)] mb-6 h-4">
                {plan.isFeatured ? 'Most Popular' : ''}
            </p>
        </div>
        <ul className="space-y-3 mb-8">
            {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-[var(--positive)] flex-shrink-0 mt-1" />
                    <span className="text-[var(--text-secondary)]">{feature}</span>
                </li>
            ))}
        </ul>
        <button className={`
            w-full py-3 font-bold rounded-lg transition-all transform hover:scale-105
            ${plan.isFeatured 
                ? 'bg-[var(--accent-primary)] hover:brightness-110 text-white' 
                : 'bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] text-[var(--accent-primary-hover)]'}
        `}>
            Choose Plan
        </button>
    </div>
);

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-[var(--background)]/80 backdrop-blur-lg z-40 animate-fade-in overflow-y-auto flex items-center justify-center p-4">
            <div className="relative bg-[var(--surface-primary)]/80 border border-[var(--border)] rounded-2xl shadow-2xl max-w-5xl w-full">
                <button onClick={onClose} className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors z-50">
                    <XIcon className="w-6 h-6" />
                </button>
                <div className="p-6 md:p-10">
                    <div className="text-center mb-10">
                         <h2 className="text-4xl font-extrabold text-[var(--text-primary)]">Unlock Your Potential</h2>
                        <p className="text-lg text-[var(--text-secondary)] mt-2 max-w-2xl mx-auto">Choose the plan that fits your journey. Get access to advanced AI tools and maximize your music's reach.</p>
                    </div>
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
                        {mockSubscriptionPlans.map(plan => (
                           <PlanCard key={plan.name} plan={plan} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};