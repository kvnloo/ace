import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
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
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
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
      const history = newMessages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));
      const responseText = await sendQueryToConcierge(history);
      setMessages((prev) => [...prev, { role: 'model', text: responseText }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-label="ACE pretotype guide"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="glass-panel w-[calc(100vw-2rem)] max-w-[400px] h-[min(500px,calc(100dvh-7rem))] rounded-2xl flex flex-col shadow-2xl mb-4 overflow-hidden border border-white/10 bg-slate-900/90"
          >
            <div className="p-4 border-b border-white/10 bg-tennis-green/20 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-tennis-yellow" />
                <span className="font-semibold text-white">ACE pretotype guide</span>
              </div>
              <button
                type="button"
                aria-label="Close ACE guide"
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef} aria-live="polite">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[86%] p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-tennis-green text-white rounded-br-none'
                        : 'bg-white/10 text-white/90 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start" aria-label="ACE guide is responding">
                  <div className="bg-white/10 p-3 rounded-2xl rounded-bl-none">
                    <Loader2 className="w-4 h-4 animate-spin text-tennis-yellow" />
                  </div>
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void handleSend();
                  }}
                  placeholder="Ask about ACE..."
                  className="min-w-0 flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-tennis-yellow transition-colors"
                />
                <button
                  type="button"
                  aria-label="Send message"
                  onClick={() => void handleSend()}
                  disabled={isLoading || !input.trim()}
                  className="bg-tennis-yellow text-tennis-dark p-2 rounded-lg hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        aria-label={isOpen ? 'Close ACE guide' : 'Open ACE guide'}
        aria-expanded={isOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors ${
          isOpen ? 'bg-white text-tennis-dark' : 'bg-tennis-yellow text-tennis-dark'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};

export default AIChat;
