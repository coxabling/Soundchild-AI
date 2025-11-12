
import React from 'react';
import { MoonIcon, SoundwaveIcon, SunIcon } from './icons';
import { useTheme } from '../App';

type HeaderProps = {
    view: 'landing' | 'discover' | 'app';
    onNavigate: (view: 'landing' | 'discover' | 'app') => void;
};

export const Header: React.FC<HeaderProps> = ({ view, onNavigate }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-[var(--surface-primary)]/70 backdrop-blur-sm border-b border-[var(--border)] sticky top-0 z-20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <button onClick={() => onNavigate('landing')} className="flex items-center gap-3">
            <SoundwaveIcon className="w-8 h-8 text-[var(--accent-primary)]" />
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                Soundchild<span className="text-[var(--accent-primary)]">.ai</span>
            </h1>
        </button>
        <nav className="flex items-center gap-4 md:gap-6">
            <button 
                onClick={() => onNavigate('discover')}
                className={`hidden md:block text-sm font-medium transition-colors ${view === 'discover' ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
                Discover
            </button>
            {view === 'app' ? (
                 <button 
                    onClick={() => onNavigate('landing')}
                    className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                    Logout (Home)
                </button>
            ) : (
                <button 
                    onClick={() => onNavigate('app')}
                    className="px-5 py-2 bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] text-white font-semibold rounded-full text-sm transition-colors transform hover:scale-105"
                >
                    Launch App
                </button>
            )}
            <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] transition-colors"
                aria-label="Toggle theme"
            >
                {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
        </nav>
      </div>
    </header>
  );
};