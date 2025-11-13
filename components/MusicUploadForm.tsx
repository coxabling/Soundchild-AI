
import React, { useState } from 'react';
import type { Tool, AllFormData, EvaluatorFormData, CuratorFormData, OptimizerFormData, PitchWriterFormData, FollowUpFormData, RemixABTestFormData, FeedbackSynthesizerFormData, LyricAnalyzerFormData, MarketAnalysisFormData } from '../types';
import { getTrackByISRC } from '../services/mockData';
import { UploadCloudIcon } from './icons';
import { useNotification } from '../App';

interface MusicUploadFormProps {
  activeTool: Tool;
  onSubmit: (formData: AllFormData, tool: Tool) => void;
  onBack: () => void;
  initialData?: Partial<CuratorFormData>;
}

const ISRCImportModal: React.FC<{
    onClose: () => void;
    onImport: (data: Omit<EvaluatorFormData, 'file' | 'bpm' | 'loudness' | 'dynamic_range' | 'energy' | 'valence' | 'description' | 'goal' | 'context'>) => void;
}> = ({ onClose, onImport }) => {
    const [isrc, setIsrc] = useState('');
    const { addNotification } = useNotification();

    const handleImport = () => {
        const trackData = getTrackByISRC(isrc);
        if (trackData) {
            onImport(trackData);
            addNotification({ message: 'Track metadata imported successfully!', type: 'success' });
            onClose();
        } else {
            addNotification({ message: 'ISRC not found. Please check the code.', type: 'error' });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-30 p-4" onClick={onClose}>
            <div className="bg-[var(--surface-primary)] border border-[var(--border)] rounded-xl max-w-sm w-full p-6 space-y-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold text-[var(--accent-primary)]">Import via ISRC</h3>
                <p className="text-[var(--text-secondary)] text-sm">Enter your track's ISRC to auto-fill metadata. (Hint: try <span className="font-mono text-[var(--accent-primary)]">US-S1Z-23-00001</span>)</p>
                <div>
                    <label htmlFor="isrc" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">ISRC Code</label>
                    <input
                        type="text"
                        id="isrc"
                        value={isrc}
                        onChange={(e) => setIsrc(e.target.value)}
                        placeholder="e.g., US-S1Z-23-00001"
                        className="w-full bg-[var(--background-secondary)] p-2 rounded-md text-[var(--text-primary)] border border-[var(--border-secondary)] focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)]"
                    />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <button onClick={onClose} className="px-4 py-2 text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] rounded-md transition-colors">Cancel</button>
                    <button onClick={handleImport} disabled={!isrc} className="px-4 py-2 bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] text-white font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        Import
                    </button>
                </div>
            </div>
        </div>
    );
};


const FormSection: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
    <div className="border-t border-[var(--border)] pt-6">
        <h3 className="text-lg font-semibold text-[var(--accent-primary-hover)] mb-4">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {children}
        </div>
    </div>
);

const FullWidthField: React.FC<{children: React.ReactNode}> = ({children}) => (
    <div className="md:col-span-2">{children}</div>
)

const FileUpload: React.FC<{fileName: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = ({ fileName, onChange }) => (
     <div className="border-t border-[var(--border)] pt-8">
      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Audio File (MP3, WAV) - Optional</label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[var(--border-secondary)] border-dashed rounded-md">
        <div className="space-y-1 text-center">
          <svg className="mx-auto h-12 w-12 text-[var(--text-tertiary)]" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <div className="flex text-sm text-[var(--text-secondary)]">
            <label htmlFor="file-upload" className="relative cursor-pointer bg-[var(--surface-primary)] rounded-md font-medium text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-[var(--surface-primary)] focus-within:ring-sky-500">
              <span>Upload a file</span>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="audio/*" onChange={onChange} />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-[var(--text-tertiary)]">{fileName}</p>
        </div>
      </div>
    </div>
);

const toolConfig = {
    evaluator: { title: "Artist Evaluator", description: "Analyze your track's technical quality, creative potential, and market fit for submission readiness." },
    curator: { title: "Curator Assistant", description: "Get AI-powered feedback on a submission from a curator's perspective to speed up your workflow." },
    optimizer: { title: "Campaign Optimizer", description: "Plan your release with data-driven curator rankings and budget recommendations." },
    pitchWriter: { title: "AI Pitch Writer", description: "Generate a personalized and persuasive pitch for your track in seconds." },
    followUp: { title: "AI Smart Follow-Up", description: "Get strategic advice on how to respond to curator feedback and build relationships." },
    neighborhoods: { title: "Sound Neighborhoods", description: "Discover similar artists and curators to find your niche." },
    remixABTest: { title: "A/B Test Remix Feedback", description: "Get predictive feedback on which version of your track will perform better." },
    feedbackSynthesizer: { title: "AI Report Card", description: "Summarize all your campaign feedback into one actionable report." },
    lyricAnalyzer: { title: "Lyric & Theme Analyzer", description: "Get expert AI feedback on your lyrics' thematic depth, storytelling, and emotional arc." },
    marketAnalysis: { title: "Market Opportunity Analysis", description: "Scout a genre and region for key opportunities, venues, and artists." },
    dealMemo: { title: '"First Contact" Draft Assistant', description: "Generate a preliminary, friendly deal memo to start a conversation with a new artist." },
}

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className={`w-full bg-[var(--surface-secondary)] p-2 rounded-md text-[var(--text-primary)] border border-[var(--border-secondary)] focus:ring-1 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] transition ${props.className || ''}`} />
);

const FormTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea {...props} className={`w-full bg-[var(--surface-secondary)] p-2 rounded-md text-[var(--text-primary)] border border-[var(--border-secondary)] focus:ring-1 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] transition ${props.className || ''}`} />
);

export const MusicUploadForm: React.FC<MusicUploadFormProps> = ({ activeTool, onSubmit, onBack, initialData }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('No file chosen');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  
  const [evaluatorData, setEvaluatorData] = useState<Omit<EvaluatorFormData, 'file'>>({ artist_name: '', track_title: '', genre: '', mood: '', bpm: '120', loudness: '-9', dynamic_range: '8', energy: 0.7, valence: 0.5, description: '', goal: '', context: 'Final Master'});
  const [curatorData, setCuratorData] = useState<Omit<CuratorFormData, 'file'>>({ curator_name: '', curator_genres: '', curator_audience: '', artist_name: '', track_title: '', genre: '', mood: '', description: '', loudness: '-9', energy: 0.7, valence: 0.5, pitch: '', ...initialData });
  const [optimizerData, setOptimizerData] = useState<Omit<OptimizerFormData, 'file'>>({ artist_name: '', track_title: '', genre: '', mood: '', goals: '', budget: '500', curator_profiles: '', past_results: ''});
  const [pitchWriterData, setPitchWriterData] = useState<PitchWriterFormData>({ artist_name: '', track_title: '', curator_name: '', mood: '', genre: '', pitch_tone: 'professional'});
  const [followUpData, setFollowUpData] = useState<FollowUpFormData>({ artist_name: '', track_title: '', curator_name: '', curator_feedback: '', original_goal: ''});
  const [lyricData, setLyricData] = useState<LyricAnalyzerFormData>({ lyrics: '' });
  const [remixData, setRemixData] = useState<RemixABTestFormData>({ track_title: '', target_audience: '', version_a_description: '', version_b_description: '' });
  const [synthesizerData, setSynthesizerData] = useState<FeedbackSynthesizerFormData>({ track_title: '', curator_feedbacks: '[\n  {\n    "curator": "IndieVibes",\n    "feedback": "Love the energy, but the vocals feel a bit buried in the mix."\n  },\n  {\n    "curator": "ChillWave Radio",\n    "feedback": "Great composition! The main synth line is very catchy. Could be a bit shorter for our playlist."\n  }\n]' });
  const [marketAnalysisData, setMarketAnalysisData] = useState<MarketAnalysisFormData>({ genre: 'Synthwave', location: 'Berlin' });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let formData: AllFormData;
    switch(activeTool) {
        case 'evaluator': formData = { ...evaluatorData, file }; break;
        case 'curator': formData = { ...curatorData, file }; break;
        case 'optimizer': formData = { ...optimizerData, file }; break;
        case 'pitchWriter': formData = pitchWriterData; break;
        case 'followUp': formData = followUpData; break;
        case 'lyricAnalyzer': formData = lyricData; break;
        case 'remixABTest': formData = remixData; break;
        case 'feedbackSynthesizer': formData = synthesizerData; break;
        case 'marketAnalysis': formData = marketAnalysisData; break;
        case 'neighborhoods': formData = { artist_name: '', track_title: '', genre: '', mood: '' }; break; // This tool has a simpler trigger
        default: return;
    }
    onSubmit(formData, activeTool);
  };
  
  const renderFormFields = () => {
    switch(activeTool) {
        case 'evaluator':
            const handleEvalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setEvaluatorData(prev => ({...prev, [e.target.id]: e.target.value }));
            const handleEvalSlider = (e: React.ChangeEvent<HTMLInputElement>) => setEvaluatorData(prev => ({...prev, [e.target.id]: parseFloat(e.target.value) }));
            const handleImport = (importedData: any) => {
                setEvaluatorData(prev => ({...prev, ...importedData}));
            };
            return (
                <>
                    {isImportModalOpen && <ISRCImportModal onClose={() => setIsImportModalOpen(false)} onImport={handleImport} />}
                    <div className="flex justify-end -mb-4">
                        <button type="button" onClick={() => setIsImportModalOpen(true)} className="flex items-center gap-2 text-sm text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] font-semibold transition-colors">
                           <UploadCloudIcon className="w-5 h-5"/> Import via ISRC
                        </button>
                    </div>
                    <FormSection title="Track Details">
                        <FormInput id="artist_name" placeholder="Artist Name" value={evaluatorData.artist_name} onChange={handleEvalChange} required />
                        <FormInput id="track_title" placeholder="Track Title" value={evaluatorData.track_title} onChange={handleEvalChange} required />
                        <FormInput id="genre" placeholder="Genre" value={evaluatorData.genre} onChange={handleEvalChange} required />
                        <FormInput id="mood" placeholder="Mood" onChange={handleEvalChange} required />
                        <FormInput type="number" id="bpm" placeholder="BPM" onChange={handleEvalChange} value={evaluatorData.bpm} required />
                        <FormInput id="context" placeholder="Context (e.g. Final Master)" onChange={handleEvalChange} value={evaluatorData.context} required />
                    </FormSection>
                    <FormSection title="Audio Features">
                        <FormInput id="loudness" placeholder="Loudness (LUFS)" onChange={handleEvalChange} value={evaluatorData.loudness} required />
                        <FormInput id="dynamic_range" placeholder="Dynamic Range" onChange={handleEvalChange} value={evaluatorData.dynamic_range} required />
                        <FullWidthField><label className="text-sm text-[var(--text-secondary)]">Energy: {evaluatorData.energy.toFixed(2)}</label><input type="range" id="energy" min="0" max="1" step="0.01" value={evaluatorData.energy} onChange={handleEvalSlider} className="w-full accent-[var(--accent-primary)]"/></FullWidthField>
                        <FullWidthField><label className="text-sm text-[var(--text-secondary)]">Valence: {evaluatorData.valence.toFixed(2)}</label><input type="range" id="valence" min="0" max="1" step="0.01" value={evaluatorData.valence} onChange={handleEvalSlider} className="w-full accent-[var(--accent-primary)]"/></FullWidthField>
                    </FormSection>
                    <FormSection title="Strategy">
                         <FullWidthField><FormTextarea id="description" placeholder="Track Description" rows={3} onChange={handleEvalChange} required /></FullWidthField>
                         <FullWidthField><FormInput id="goal" placeholder="Artist Goal" onChange={handleEvalChange} required /></FullWidthField>
                    </FormSection>
                </>
            );
        case 'curator':
             const handleCuratorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setCuratorData(prev => ({...prev, [e.target.id]: e.target.value }));
             const handleCuratorSlider = (e: React.ChangeEvent<HTMLInputElement>) => setCuratorData(prev => ({...prev, [e.target.id]: parseFloat(e.target.value) }));
            return (
                <>
                    <FormSection title="Curator Profile">
                        <FormInput id="curator_name" placeholder="Curator Name" value={curatorData.curator_name} onChange={handleCuratorChange} required />
                        <FormInput id="curator_genres" placeholder="Curator Genres (comma-separated)" value={curatorData.curator_genres} onChange={handleCuratorChange} required />
                        <FullWidthField><FormInput id="curator_audience" placeholder="Curator Audience Description" value={curatorData.curator_audience} onChange={handleCuratorChange} required /></FullWidthField>
                    </FormSection>
                     <FormSection title="Submission Details">
                        <FormInput id="artist_name" placeholder="Artist Name" value={curatorData.artist_name} onChange={handleCuratorChange} required />
                        <FormInput id="track_title" placeholder="Track Title" value={curatorData.track_title} onChange={handleCuratorChange} required />
                        <FormInput id="genre" placeholder="Genre" value={curatorData.genre} onChange={handleCuratorChange} required />
                        <FormInput id="mood" placeholder="Mood" value={curatorData.mood} onChange={handleCuratorChange} required />
                        <FormInput id="loudness" placeholder="Loudness (LUFS)" value={curatorData.loudness} onChange={handleCuratorChange} required />
                        <div />
                        <FullWidthField><label className="text-sm text-[var(--text-secondary)]">Energy: {curatorData.energy.toFixed(2)}</label><input type="range" id="energy" min="0" max="1" step="0.01" value={curatorData.energy} onChange={handleCuratorSlider} className="w-full accent-[var(--accent-primary)]"/></FullWidthField>
                        <FullWidthField><label className="text-sm text-[var(--text-secondary)]">Valence: {curatorData.valence.toFixed(2)}</label><input type="range" id="valence" min="0" max="1" step="0.01" value={curatorData.valence} onChange={handleCuratorSlider} className="w-full accent-[var(--accent-primary)]"/></FullWidthField>
                        <FullWidthField><FormTextarea id="description" placeholder="Track Description" value={curatorData.description} rows={3} onChange={handleCuratorChange} required /></FullWidthField>
                        <FullWidthField><FormTextarea id="pitch" placeholder="Artist Pitch" rows={3} value={curatorData.pitch} onChange={handleCuratorChange} required /></FullWidthField>
                    </FormSection>
                </>
            );
        case 'optimizer':
            const handleOptimizerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setOptimizerData(prev => ({...prev, [e.target.id]: e.target.value }));
            return (
                <>
                    <FormSection title="Campaign Details">
                        <FormInput id="artist_name" placeholder="Artist Name" onChange={handleOptimizerChange} required />
                        <FormInput id="track_title" placeholder="Track Title" onChange={handleOptimizerChange} required />
                         <FormInput id="genre" placeholder="Genre" onChange={handleOptimizerChange} required />
                        <FormInput id="mood" placeholder="Mood" onChange={handleOptimizerChange} required />
                         <FullWidthField><FormInput id="goals" placeholder="Artist Goals (e.g., playlist adds, exposure)" onChange={handleOptimizerChange} required /></FullWidthField>
                         <FullWidthField><label className="text-sm text-[var(--text-secondary)]">Budget (Credits)</label><FormInput type="number" id="budget" placeholder="Budget" onChange={handleOptimizerChange} value={optimizerData.budget} required /></FullWidthField>
                    </FormSection>
                    <FormSection title="Context Data (Optional)">
                        <FullWidthField><FormTextarea id="curator_profiles" placeholder="Available Curators (JSON format, optional)" rows={5} onChange={handleOptimizerChange} className="bg-[var(--background-secondary)]/50 font-mono text-sm"/></FullWidthField>
                        <FullWidthField><FormTextarea id="past_results" placeholder="Past Campaign Results (Optional)" rows={3} onChange={handleOptimizerChange} /></FullWidthField>
                    </FormSection>
                </>
            );
        case 'pitchWriter':
            const handlePitchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setPitchWriterData(prev => ({...prev, [e.target.id]: e.target.value }));
            return (
                <FormSection title="Pitch Details">
                    <FormInput id="artist_name" placeholder="Artist Name" onChange={handlePitchChange} required />
                    <FormInput id="track_title" placeholder="Track Title" onChange={handlePitchChange} required />
                    <FormInput id="curator_name" placeholder="Curator Name" onChange={handlePitchChange} required />
                    <div />
                    <FormInput id="genre" placeholder="Genre" onChange={handlePitchChange} required />
                    <FormInput id="mood" placeholder="Mood" onChange={handlePitchChange} required />
                    <FullWidthField>
                        <label htmlFor="pitch_tone" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Pitch Tone</label>
                        <select id="pitch_tone" value={pitchWriterData.pitch_tone} onChange={handlePitchChange} className="w-full bg-[var(--surface-secondary)] p-2 rounded-md text-[var(--text-primary)] border border-[var(--border-secondary)]">
                            <option value="professional">Professional</option>
                            <option value="casual">Casual</option>
                            <option value="enthusiastic">Enthusiastic</option>
                        </select>
                    </FullWidthField>
                </FormSection>
            );
        case 'followUp':
             const handleFollowUpChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFollowUpData(prev => ({...prev, [e.target.id]: e.target.value }));
            return (
                 <FormSection title="Follow-Up Details">
                    <FormInput id="artist_name" placeholder="Artist Name" onChange={handleFollowUpChange} required />
                    <FormInput id="track_title" placeholder="Track Title" onChange={handleFollowUpChange} required />
                    <FormInput id="curator_name" placeholder="Curator Name" onChange={handleFollowUpChange} required />
                    <FormInput id="original_goal" placeholder="Your Original Goal (e.g., playlisting)" onChange={handleFollowUpChange} required />
                    <FullWidthField>
                        <FormTextarea id="curator_feedback" placeholder="Paste the curator's feedback here..." rows={4} onChange={handleFollowUpChange} required />
                    </FullWidthField>
                </FormSection>
            );
        case 'lyricAnalyzer':
            const handleLyricChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setLyricData({ lyrics: e.target.value });
            return (
                 <FormSection title="Your Lyrics">
                    <FullWidthField>
                        <FormTextarea id="lyrics" placeholder="Paste your song lyrics here..." rows={15} value={lyricData.lyrics} onChange={handleLyricChange} required />
                    </FullWidthField>
                </FormSection>
            );
        case 'remixABTest':
            const handleRemixChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setRemixData(prev => ({...prev, [e.target.id]: e.target.value }));
            return (
                <>
                    <FormSection title="A/B Test Details">
                        <FormInput id="track_title" placeholder="Track Title" value={remixData.track_title} onChange={handleRemixChange} required />
                        <FormInput id="target_audience" placeholder="Target Audience" value={remixData.target_audience} onChange={handleRemixChange} required />
                    </FormSection>
                    <FormSection title="Versions">
                        <FullWidthField>
                            <label htmlFor="version_a_description" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Version A Description</label>
                            <FormTextarea id="version_a_description" placeholder="e.g., More bass-heavy, vocals slightly delayed" rows={3} value={remixData.version_a_description} onChange={handleRemixChange} required />
                        </FullWidthField>
                         <FullWidthField>
                            <label htmlFor="version_b_description" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Version B Description</label>
                            <FormTextarea id="version_b_description" placeholder="e.g., Brighter synths, vocals more up-front" rows={3} value={remixData.version_b_description} onChange={handleRemixChange} required />
                        </FullWidthField>
                    </FormSection>
                </>
            );
        case 'feedbackSynthesizer':
            const handleSynthChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setSynthesizerData(prev => ({...prev, [e.target.id]: e.target.value }));
            return (
                <FormSection title="Campaign Feedback">
                    <FormInput id="track_title" placeholder="Track Title" value={synthesizerData.track_title} onChange={handleSynthChange} required />
                    <FullWidthField>
                        <label htmlFor="curator_feedbacks" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Curator Feedbacks (JSON Array)</label>
                        <FormTextarea id="curator_feedbacks" rows={10} value={synthesizerData.curator_feedbacks} onChange={handleSynthChange} required className="bg-[var(--background-secondary)]/50 font-mono text-sm"/>
                    </FullWidthField>
                </FormSection>
            );
        case 'marketAnalysis':
            const handleMarketChange = (e: React.ChangeEvent<HTMLInputElement>) => setMarketAnalysisData(prev => ({ ...prev, [e.target.id]: e.target.value }));
            return (
                 <FormSection title="Market Details">
                    <FormInput id="genre" placeholder="Target Genre" value={marketAnalysisData.genre} onChange={handleMarketChange} required />
                    <FormInput id="location" placeholder="Target Location" value={marketAnalysisData.location} onChange={handleMarketChange} required />
                </FormSection>
            );
        default:
            return null;
    }
  }

  const isSimpleForm = ['pitchWriter', 'followUp', 'remixABTest', 'feedbackSynthesizer', 'lyricAnalyzer', 'marketAnalysis'].includes(activeTool);

  return (
    <div className="bg-[var(--surface-primary)]/50 p-6 md:p-8 rounded-2xl shadow-2xl border border-[var(--border)] animate-fade-in">
      <h2 className="text-3xl font-bold text-[var(--accent-primary)] mb-2">{toolConfig[activeTool].title}</h2>
      <p className="text-[var(--text-secondary)] mb-8">{toolConfig[activeTool].description}</p>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {renderFormFields()}
        {!isSimpleForm && <FileUpload fileName={fileName} onChange={handleFileChange} />}
        
        <div className="pt-2 flex items-center gap-4">
          <button 
            type="button" 
            onClick={onBack}
            className="w-auto text-center py-3 px-6 text-lg font-medium text-[var(--accent-primary)] hover:bg-[var(--accent-secondary)]/20 rounded-lg transition-colors"
          >
            Back
          </button>
          <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--surface-primary)] focus:ring-[var(--accent-primary)] transition-transform transform hover:scale-105" >
            {activeTool === 'pitchWriter' ? 'Generate Pitch' 
                : activeTool === 'followUp' ? 'Get Advice' 
                : activeTool === 'remixABTest' ? 'Get Prediction'
                : activeTool === 'feedbackSynthesizer' ? 'Generate Report'
                : 'Analyze'}
          </button>
        </div>
      </form>
    </div>
  );
};
