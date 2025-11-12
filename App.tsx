
import React, { useState, createContext, useContext, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ArtistHub } from './components/ArtistHub';
import { CuratorHub } from './components/CuratorHub';
import { LabelHub } from './components/LabelHub';
import { Notification } from './components/Notification';
import { MusicNoteIcon, UserCheckIcon, BriefcaseIcon } from './components/icons';
import type { Hub, NotificationMessage, Theme } from './types';
import { LandingPage } from './components/LandingPage';
import { DiscoverPage } from './components/DiscoverPage';
import { LoadingSpinner } from './components/LoadingSpinner';

// --- Notification Context ---
type NotificationContextType = {
  addNotification: (message: Omit<NotificationMessage, 'id'>) => void;
};
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};
const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<NotificationMessage[]>([]);
  const addNotification = useCallback((message: Omit<NotificationMessage, 'id'>) => {
    const id = Date.now();
    setMessages(prev => [...prev, { ...message, id }]);
    setTimeout(() => removeNotification(id), 5000);
  }, []);
  const removeNotification = useCallback((id: number) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  }, []);
  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2 w-full max-w-sm">
        {messages.map(msg => (
          <Notification key={msg.id} message={msg} onClose={() => removeNotification(msg.id)} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

// --- ApiKey Context ---
type ApiKeyContextType = {
  resetKeySelection: () => void;
};
const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);
export const useApiKey = () => {
    const context = useContext(ApiKeyContext);
    if (!context) throw new Error('useApiKey must be used within an ApiKeyProvider');
    return context;
};

const ApiKeyProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [isKeySelected, setIsKeySelected] = useState<boolean | null>(null);

    const checkKey = useCallback(async () => {
        try {
            // @ts-ignore
            const hasKey = await window.aistudio.hasSelectedApiKey();
            setIsKeySelected(hasKey);
        } catch (e) {
            console.error("Error checking for API key:", e);
            setIsKeySelected(false);
        }
    }, []);

    useEffect(() => {
        checkKey();
    }, [checkKey]);
    
    const resetKeySelection = useCallback(() => {
        setIsKeySelected(false);
    }, []);

    const handleSelectKey = async () => {
        try {
            // @ts-ignore
            await window.aistudio.openSelectKey();
            setIsKeySelected(true);
        } catch (e) {
            console.error("Error opening select key dialog:", e);
        }
    };
    
    if (isKeySelected === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
                <LoadingSpinner />
            </div>
        );
    }

    if (!isKeySelected) {
        return (
             <div className="min-h-screen flex items-center justify-center text-center p-4 bg-[var(--background)]" style={{
                backgroundImage: 'radial-gradient(at 0% 0%, var(--background-gradient-start) 0, transparent 50%), radial-gradient(at 98% 1%, var(--background-gradient-end) 0, transparent 50%)'
             }}>
                 <div className="bg-[var(--surface-primary)]/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-[var(--border)] max-w-lg">
                    <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mb-4">API Key Required</h2>
                    <p className="text-[var(--text-secondary)] mb-6">
                        To use Soundchild.ai, you need to select a Google AI Studio API key. Your key is stored securely and is only used for the duration of your session.
                    </p>
                    <button
                        onClick={handleSelectKey}
                        className="w-full px-8 py-3 bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] text-white font-bold rounded-full text-lg transition-all transform hover:scale-105 shadow-lg"
                    >
                        Select API Key
                    </button>
                    <p className="text-xs text-[var(--text-tertiary)] mt-4">
                        For more information on API keys and billing, please visit the{' '}
                        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-primary)] hover:underline">
                            billing documentation
                        </a>.
                    </p>
                </div>
            </div>
        );
    }
    
    return (
        <ApiKeyContext.Provider value={{ resetKeySelection }}>
            {children}
        </ApiKeyContext.Provider>
    );
};


// --- Theme Context ---
type ThemeContextType = {
    theme: Theme;
    toggleTheme: () => void;
};
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
}
const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('soundchild-theme') as Theme) || 'dark');
    
    useEffect(() => {
        const root = window.document.documentElement;
        root.setAttribute('data-theme', theme);
        localStorage.setItem('soundchild-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
    };
    
    return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

const HubSelector: React.FC<{ onSelect: (hub: Hub) => void }> = ({ onSelect }) => (
    <div className="bg-[var(--surface-primary)]/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl border border-[var(--border)] text-center animate-fade-in">
        <h2 className="text-4xl font-extrabold text-[var(--text-primary)] mb-2">Welcome to Soundchild.ai</h2>
        <p className="text-lg text-[var(--accent-primary)] mb-8">Select your role to get started.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button onClick={() => onSelect('artist')} className="p-6 text-left bg-[var(--surface-secondary)]/50 hover:bg-[var(--surface-secondary)]/80 rounded-lg border border-[var(--border-secondary)] transition-all transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]">
                <MusicNoteIcon className="w-10 h-10 text-[var(--accent-primary)] mb-4" />
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Artist Hub</h3>
                <p className="text-[var(--text-secondary)] mt-2 text-sm">Analyze tracks, optimize campaigns, and get AI assistance for your release strategy.</p>
            </button>
            <button onClick={() => onSelect('curator')} className="p-6 text-left bg-[var(--surface-secondary)]/50 hover:bg-[var(--surface-secondary)]/80 rounded-lg border border-[var(--border-secondary)] transition-all transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]">
                <UserCheckIcon className="w-10 h-10 text-[var(--accent-primary)] mb-4" />
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Curator Hub</h3>
                <p className="text-[var(--text-secondary)] mt-2 text-sm">Streamline your workflow with an AI-powered submission queue and review assistant.</p>
            </button>
            <button onClick={() => onSelect('label')} className="p-6 text-left bg-[var(--surface-secondary)]/50 hover:bg-[var(--surface-secondary)]/80 rounded-lg border border-[var(--border-secondary)] transition-all transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]">
                <BriefcaseIcon className="w-10 h-10 text-[var(--accent-primary)] mb-4" />
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Label & A&R Hub</h3>
                <p className="text-[var(--text-secondary)] mt-2 text-sm">Discover unsigned talent and track emerging genre trends with our AI scouting tools.</p>
            </button>
        </div>
    </div>
);

type AppView = 'landing' | 'discover' | 'app';

const MainApp: React.FC<{ onBackToHubs: () => void }> = ({ onBackToHubs }) => {
  const [activeHub, setActiveHub] = useState<Hub | null>(() => (localStorage.getItem('soundchild-hub') as Hub) || null);
  
  useEffect(() => {
      if (activeHub) {
          localStorage.setItem('soundchild-hub', activeHub);
      } else {
          localStorage.removeItem('soundchild-hub');
      }
  }, [activeHub]);
  
  const handleBackToHubSelector = () => {
    setActiveHub(null);
    onBackToHubs();
  }

  const renderContent = () => {
    if (activeHub === 'artist') return <ArtistHub onBack={handleBackToHubSelector} />;
    if (activeHub === 'curator') return <CuratorHub onBack={handleBackToHubSelector} />;
    if (activeHub === 'label') return <LabelHub onBack={handleBackToHubSelector} />;
    return <HubSelector onSelect={setActiveHub} />;
  }

  return <div className="max-w-7xl mx-auto">{renderContent()}</div>;
};

const AppContent: React.FC = () => {
  const [appView, setAppView] = useState<AppView>('landing');
  
  const renderView = () => {
    switch(appView) {
        case 'landing':
            return <LandingPage onLaunchApp={() => setAppView('app')} onDiscover={() => setAppView('discover')} />;
        case 'discover':
            return <DiscoverPage />;
        case 'app':
            return <MainApp onBackToHubs={() => setAppView('landing')} />;
        default:
             return <LandingPage onLaunchApp={() => setAppView('app')} onDiscover={() => setAppView('discover')} />;
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-[var(--text-primary)] font-sans">
      <Header view={appView} onNavigate={setAppView} />
      <main className="container mx-auto px-4 py-8 md:py-12">
        {renderView()}
      </main>
      <footer className="text-center py-6 text-[var(--text-tertiary)] text-sm border-t border-[var(--border)] mt-12">
        <p>Soundchild.ai &copy; {new Date().getFullYear()} - An AI-Powered Music Ecosystem</p>
      </footer>
    </div>
  );
};

const App: React.FC = () => (
    <ThemeProvider>
        <NotificationProvider>
            <ApiKeyProvider>
                <AppContent />
            </ApiKeyProvider>
        </NotificationProvider>
    </ThemeProvider>
);

export default App;
