import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Loader2 } from 'lucide-react';
import { sendQueryToConcierge } from '../services/geminiService';
import { ChatMessage } from '../types';

/**
 * AI-powered chat interface for facility inquiries
 *
 * @remarks
 * Floating chat widget providing conversational access to facility information via
 * Google Gemini AI. Features include:
 * - Expandable chat panel with smooth animations
 * - Real-time message streaming
 * - Auto-scrolling message history
 * - Loading states with spinner indicator
 * - Glass-morphism design matching app aesthetic
 *
 * **Architecture:**
 * - UI: Framer Motion for animations, Lucide icons for consistent iconography
 * - AI Backend: Google Gemini API via sendQueryToConcierge service
 * - State: Local React state for messages, input, loading status
 * - Conversation: Full history sent to API for context-aware responses
 *
 * **User Flow:**
 * 1. User clicks floating button (bottom-right corner)
 * 2. Chat panel expands with welcome message from AI concierge
 * 3. User types query and sends (Enter key or Send button)
 * 4. Message appears immediately (optimistic UI update)
 * 5. Loading spinner shows while AI processes request
 * 6. AI response streams into chat with auto-scroll
 *
 * **Message Format:**
 * Messages use ChatMessage type with role ('user' | 'model') and text content.
 * Conversation history maintains context across multiple exchanges.
 *
 * **Styling:**
 * - Fixed positioning at bottom-right (z-index 50)
 * - 350-400px wide panel with 500px height
 * - User messages: Tennis green background, right-aligned
 * - AI messages: White/10 background, left-aligned
 * - Glass panel with backdrop blur and border effects
 *
 * **Performance:**
 * - Auto-scroll implemented via useEffect + ref
 * - Optimistic UI updates for instant user feedback
 * - Loading state prevents duplicate submissions
 *
 * @example
 * ```tsx
 * import AIChat from './components/AIChat';
 *
 * function App() {
 *   return (
 *     <div>
 *       <YourContent />
 *       <AIChat />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * Typical conversation flow:
 * ```
 * User: "Tell me about the autonomous grass courts"
 * AI: "Our facility features revolutionary autonomous grass management..."
 *
 * User: "What surfaces are available?"
 * AI: "We offer 24 courts with 4 surface types: hard, clay, grass, and wood..."
 * ```
 *
 * @see {@link sendQueryToConcierge} for AI integration details
 * @see {@link ChatMessage} for message data structure
 */
const AIChat: React.FC = () => {
  /** Controls chat panel visibility (expanded/collapsed) */
  const [isOpen, setIsOpen] = useState(false);

  /** Current user input text in message field */
  const [input, setInput] = useState('');

  /** Loading state during AI response generation */
  const [isLoading, setIsLoading] = useState(false);

  /** Full conversation history (user + AI messages) */
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Welcome to LawnTech Dynamics. I'm your AI Concierge. Ask me about our autonomous grass courts or replacement modular grids." }
  ]);

  /** Ref for message container to enable auto-scroll */
  const scrollRef = useRef<HTMLDivElement>(null);

  /**
   * Auto-scroll to bottom when new messages arrive
   */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  /**
   * Handles message submission to AI backend
   *
   * @remarks
   * Process flow:
   * 1. Validates non-empty input
   * 2. Clears input field immediately
   * 3. Adds user message to UI (optimistic update)
   * 4. Converts history to Gemini API format
   * 5. Calls sendQueryToConcierge with full context
   * 6. Appends AI response to messages
   * 7. Clears loading state
   *
   * @internal
   */
  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsgText = input;
    setInput('');
    
    const newUserMsg: ChatMessage = { role: 'user', text: userMsgText };
    
    // Optimistic update of UI
    const newMessages = [...messages, newUserMsg];
    setMessages(newMessages);
    setIsLoading(true);

    // Prepare history for API (converting to SDK format)
    const history = newMessages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await sendQueryToConcierge(history);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="glass-panel w-[350px] sm:w-[400px] h-[500px] rounded-2xl flex flex-col shadow-2xl mb-4 overflow-hidden border border-white/10 bg-slate-900/90"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-tennis-green/20 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-tennis-yellow" />
                <span className="font-semibold text-white">Facility AI Concierge</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
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
                <div className="flex justify-start">
                  <div className="bg-white/10 p-3 rounded-2xl rounded-bl-none">
                    <Loader2 className="w-4 h-4 animate-spin text-tennis-yellow" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-black/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about the grass tech..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-tennis-yellow transition-colors"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading}
                  className="bg-tennis-yellow text-tennis-dark p-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors ${isOpen ? 'bg-white text-tennis-dark' : 'bg-tennis-yellow text-tennis-dark'}`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};

export default AIChat;