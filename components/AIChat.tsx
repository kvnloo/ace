import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';

type Props = {
  defaultOpen?: boolean;
};

const AIChat: React.FC<Props> = ({ defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: 'ACE is a public pretotype for a human-flourishing feedback loop. Ask about the digital twin, experts, sports, simulation, personalized learning, the campus, or what is actually live.',
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsgText = input.trim();
    setInput('');

    const newUserMsg: ChatMessage = { role: 'user', text: userMsgText };
    const newMessages = [...messages, newUserMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const { sendQueryToConcierge } = await import('../services/geminiService');
      const history = newMessages.map((m) => ({ role: m.role, parts: [{ text: m.text }] }));
      const responseText = await sendQueryToConcierge(history);
      setMessages((prev) => [...prev, { role: 'model', text: responseText }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 font-sans">
      {isOpen && (
        <div
          role="dialog"
          aria-label="ACE pretotype guide"
          className="ace-chat-panel ace-chat-enter glass-panel w-[calc(100vw-2rem)] max-w-[400px] h-[min(500px,calc(100dvh-7rem))] flex flex-col shadow-2xl mb-4 overflow-hidden border"
        >
          <div className="p-4 border-b border-white/10 bg-white/[0.03] flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-tennis-yellow" />
              <span className="ace-display font-medium tracking-[0.08em] uppercase text-white">ACE signal guide</span>
            </div>
            <button type="button" aria-label="Close ACE guide" onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef} aria-live="polite">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`ace-chat-message max-w-[86%] p-3 text-sm leading-relaxed ${msg.role === 'user' ? 'ace-chat-message-user' : 'ace-chat-message-model'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start" aria-label="ACE guide is responding">
                <div className="ace-chat-message ace-chat-message-model p-3"><Loader2 className="w-4 h-4 animate-spin text-tennis-yellow" /></div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/10 bg-black/20">
            <div className="flex gap-2">
              <label htmlFor="ace-guide-input" className="sr-only">Ask ACE</label>
              <input
                id="ace-guide-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') void handleSend(); }}
                placeholder="Ask about ACE..."
                className="min-w-0 flex-1 bg-transparent border-0 border-b border-white/20 px-1 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-tennis-yellow transition-colors"
              />
              <button
                type="button"
                aria-label="Send message"
                onClick={() => void handleSend()}
                disabled={isLoading || !input.trim()}
                className="ace-chat-send"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        aria-label={isOpen ? 'Close ACE guide' : 'Open ACE guide'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className={`ace-chat-button ${isOpen ? 'ace-chat-button-open' : ''}`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
};
export default AIChat;
