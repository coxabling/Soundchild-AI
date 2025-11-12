
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import type { ChatMessage } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { SendIcon, SparklesIcon, BarChartIcon, LightbulbIcon } from './icons';
import { useApiKey } from '../App';

const systemInstruction = `You are Soundchild Career Advisor — a professional A&R and artist career strategist. Your goal is to provide actionable, data-driven, and encouraging advice to artists. You have context on their past campaigns, track evaluations, and performance data. Use this knowledge to offer personalized guidance on what to produce next, which curators to target, how to improve their brand, and how to navigate the music industry. Always be supportive and focus on strategic growth.`;

const proactiveInsights = [
  {
    icon: <BarChartIcon className="w-6 h-6 text-green-400" />,
    text: "Your track 'Neon Tides' is gaining traction in the 'Dreamwave' neighborhood. Consider pitching to these three thematically-aligned curators next.",
    cta: "View Curators",
  },
  {
    icon: <LightbulbIcon className="w-6 h-6 text-yellow-400" />,
    text: "Based on your recent track evaluations, focusing on improving your vocal mix clarity could significantly boost your readiness scores.",
    cta: "Learn More",
  },
];

const InsightCard: React.FC<{ insight: typeof proactiveInsights[0] }> = ({ insight }) => (
    <div className="bg-sky-900/30 border border-sky-700/50 rounded-lg p-3 flex items-center gap-3 text-sm">
        <div className="flex-shrink-0">{insight.icon}</div>
        <p className="flex-grow text-sky-200">{insight.text}</p>
        <button className="flex-shrink-0 text-sky-300 font-bold hover:underline text-xs">{insight.cta}</button>
    </div>
);


export const CareerAdvisor: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [input, setInput] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);
    const { resetKeySelection } = useApiKey();

    useEffect(() => {
        const initChat = () => {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const newChat = ai.chats.create({
                model: 'gemini-2.5-pro',
                config: {
                    systemInstruction: systemInstruction,
                },
                history: [],
            });
            setChat(newChat);
            setMessages([
                {
                    role: 'model',
                    parts: [{ text: "Hello! I'm your personal AI A&R Advisor. How can I help you with your music career today? Feel free to ask me anything from 'What kind of track should I produce next?' to 'Which curators should I target based on my last release?'" }],
                }
            ]);
        };
        initChat();
    }, []);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !chat || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            const stream = await chat.sendMessageStream({ message: input });
            
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]);

            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { role: 'model', parts: [{ text: modelResponse }] };
                    return newMessages;
                });
            }
        } catch (err) {
            if (err instanceof Error && err.message.includes("Requested entity was not found")) {
                resetKeySelection();
            }
            const errorMessage = "Sorry, I encountered an error. Please try again.";
            setError(errorMessage);
            setMessages(prev => [...prev, { role: 'model', parts: [{ text: errorMessage }] }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[70vh] bg-[var(--surface-primary)]/40 rounded-lg border border-[var(--border)] overflow-hidden animate-fade-in">
            <div className="p-4 border-b border-[var(--border)] flex items-center gap-3">
                 <SparklesIcon className="w-6 h-6 text-[var(--accent-primary)]"/>
                 <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">AI Career Advisor</h3>
                    <p className="text-sm text-[var(--text-secondary)]">Your persistent A&R co-pilot</p>
                </div>
            </div>
            <div className="p-4 border-b border-[var(--border)]">
                <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">Proactive Insights</h4>
                <div className="space-y-2">
                    {proactiveInsights.map((insight, i) => <InsightCard key={i} insight={insight} />)}
                </div>
            </div>
            <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                 {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                       {msg.role === 'model' && index > 0 && <SparklesIcon className="w-6 h-6 text-[var(--accent-primary)] flex-shrink-0 mb-1" />}
                       <div className={`max-w-xl p-3 rounded-2xl ${msg.role === 'user' ? 'bg-[var(--accent-secondary)] text-white rounded-br-none' : 'bg-[var(--surface-secondary)] text-[var(--text-primary)] rounded-bl-none'}`}>
                           <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.parts[0].text}</p>
                       </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="p-3 bg-[var(--surface-secondary)] rounded-2xl rounded-bl-none">
                            <LoadingSpinner />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
             <form onSubmit={handleSendMessage} className="p-4 border-t border-[var(--border)]">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask your advisor a question..."
                        className="w-full bg-[var(--surface-secondary)] p-3 pr-12 rounded-full text-[var(--text-primary)] border border-[var(--border-secondary)] focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)]"
                        disabled={isLoading}
                    />
                    <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] rounded-full text-white transition-colors disabled:bg-slate-600" disabled={!input.trim() || isLoading}>
                        <SendIcon className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
};
