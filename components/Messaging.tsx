import React, { useState, useRef, useEffect } from 'react';
import type { Conversation, Message } from '../types';
import { InboxIcon, SendIcon } from './icons';

interface MessagingProps {
    conversations: Conversation[];
    setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
    activeConversationId: string | null;
    setActiveConversationId: (id: string | null) => void;
    userType: 'artist' | 'curator';
}

const ConversationListItem: React.FC<{
    convo: Conversation;
    isActive: boolean;
    onClick: () => void;
}> = ({ convo, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${
            isActive ? 'bg-[var(--accent-secondary)]/30' : 'hover:bg-[var(--surface-secondary)]/50'
        }`}
    >
        <img src={convo.participantImageUrl} alt={convo.participantName} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
        <div className="flex-grow overflow-hidden">
            <div className="flex justify-between items-center">
                <p className="font-bold text-[var(--text-primary)] truncate">{convo.participantName}</p>
                {convo.unreadCount > 0 && (
                    <span className="bg-[var(--accent-primary)] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0">
                        {convo.unreadCount}
                    </span>
                )}
            </div>
            <p className="text-sm text-[var(--text-secondary)] truncate">{convo.lastMessage}</p>
        </div>
    </button>
);

const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
    const isMe = message.sender === 'me';
    return (
        <div className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${isMe ? 'bg-[var(--accent-secondary)] text-white rounded-br-none' : 'bg-[var(--surface-secondary)] text-[var(--text-primary)] rounded-bl-none'}`}>
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 opacity-70 ${isMe ? 'text-sky-200' : 'text-[var(--text-secondary)]'}`}>{message.timestamp}</p>
            </div>
        </div>
    );
};

export const Messaging: React.FC<MessagingProps> = ({
    conversations,
    setConversations,
    activeConversationId,
    setActiveConversationId,
    userType,
}) => {
    const [newMessage, setNewMessage] = useState('');
    const activeConversation = conversations.find(c => c.id === activeConversationId);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeConversation?.messages]);

    useEffect(() => {
        if (!activeConversationId && conversations.length > 0) {
            setActiveConversationId(conversations[0].id);
        }
    }, [activeConversationId, conversations, setActiveConversationId]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversationId) return;

        const newMessageObj: Message = {
            id: `msg_${Date.now()}`,
            sender: 'me',
            text: newMessage.trim(),
            timestamp: 'Just now',
            isRead: true,
        };

        setConversations(prev =>
            prev.map(convo =>
                convo.id === activeConversationId
                    ? {
                        ...convo,
                        messages: [...convo.messages, newMessageObj],
                        lastMessage: newMessage.trim(),
                        timestamp: 'Just now',
                    }
                    : convo
            ).sort((a,b) => (a.id === activeConversationId ? -1 : b.id === activeConversationId ? 1 : 0))
        );
        setNewMessage('');
    };

    return (
        <div className="flex flex-col md:flex-row h-[70vh] bg-[var(--surface-primary)]/40 rounded-lg border border-[var(--border)] overflow-hidden">
            <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-[var(--border)] flex flex-col">
                <div className="p-4 border-b border-[var(--border)]">
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">Inbox</h3>
                </div>
                <div className="flex-grow p-2 space-y-1 overflow-y-auto">
                    {conversations.length > 0 ? (
                        conversations.map(convo => (
                            <ConversationListItem
                                key={convo.id}
                                convo={convo}
                                isActive={convo.id === activeConversationId}
                                onClick={() => setActiveConversationId(convo.id)}
                            />
                        ))
                    ) : (
                         <div className="text-center py-12 text-[var(--text-secondary)]">
                            <InboxIcon className="w-16 h-16 mx-auto text-[var(--border-secondary)] mb-4" />
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">Empty Inbox</h3>
                            <p className="text-sm">New conversations will appear here.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Active Conversation */}
            <div className="w-full md:w-2/3 flex flex-col bg-[var(--background-secondary)]/30">
                {activeConversation ? (
                    <>
                        <div className="p-4 border-b border-[var(--border)] flex items-center gap-3">
                             <img src={activeConversation.participantImageUrl} alt={activeConversation.participantName} className="w-10 h-10 rounded-full object-cover" />
                             <div>
                                <p className="font-bold text-[var(--text-primary)]">{activeConversation.participantName}</p>
                                <p className="text-sm text-[var(--text-secondary)]">Online</p>
                             </div>
                        </div>
                        <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                            {activeConversation.messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
                            <div ref={messagesEndRef} />
                        </div>
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-[var(--border)]">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="w-full bg-[var(--surface-secondary)] p-3 pr-12 rounded-full text-[var(--text-primary)] border border-[var(--border-secondary)] focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)]"
                                />
                                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] rounded-full text-white transition-colors disabled:bg-slate-600" disabled={!newMessage.trim()}>
                                    <SendIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-grow flex items-center justify-center text-[var(--text-tertiary)] text-center p-4">
                        <div>
                           <InboxIcon className="w-16 h-16 mx-auto text-[var(--border-secondary)] mb-4" />
                           <h3 className="text-lg font-bold text-[var(--text-primary)]">Select a Conversation</h3>
                           <p>Choose a conversation from the left panel to start messaging.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};