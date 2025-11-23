import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Loader2, AlertCircle } from 'lucide-react';
import { sendQueryToConcierge } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { validateChatInput, RateLimiter } from '../utils/validation';

/**
 * AIChat Component - Intelligent conversational assistant for facility information
 *
 * A floating chat widget that provides an AI-powered concierge service to answer
 * questions about the LawnTech Dynamics facility. Features include:
 *
 * - Toggleable chat window with smooth animations (Framer Motion)
 * - Real-time message display with user/model message differentiation
 * - Auto-scrolling to latest messages
 * - Loading indicators for AI responses
 * - Integration with Google Gemini API via geminiService
 * - Responsive design for mobile and desktop
 * - Enter key support for quick message sending
 *
 * The chat maintains conversation history and sends the full history to the API
 * for context-aware responses about the facility.
 *
 * @component
 * @example
 * ```tsx
 * // Simple usage - renders as a floating chat widget
 * <AIChat />
 * ```
 *
 * @example
 * ```tsx
 * // Typically placed in your main layout
 * return (
 *   <main>
 *     <YourContent />
 *     <AIChat />
 *   </main>
 * );
 * ```
 *
 * @returns {React.ReactElement} A floating chat widget with toggle button
 */
const AIChat: React.FC = () => {
  /** Controls whether the chat window is open or closed */
  const [isOpen, setIsOpen] = useState(false);

  /** Current user input text in the chat input field */
  const [input, setInput] = useState('');

  /** Loading state while waiting for AI response */
  const [isLoading, setIsLoading] = useState(false);

  /** Input validation error message */
  const [inputError, setInputError] = useState<string>('');

  /** Array of chat messages (user and model) in conversation history */
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Welcome to LawnTech Dynamics. I'm your AI Concierge. Ask me about our autonomous grass courts or replacement modular grids.",
    },
  ]);

  /** Reference to messages container for auto-scroll functionality */
  const scrollRef = useRef<HTMLDivElement>(null);

  /** Rate limiter to prevent spam (1 second cooldown) */
  const rateLimiterRef = useRef(new RateLimiter(1000));

  /**
   * Effect Hook: Auto-scroll to latest message
   * Scrolls the message container to the bottom whenever new messages arrive
   */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  /**
   * Handler for sending messages to the AI
   * - Validates and sanitizes input
   * - Checks rate limiting to prevent spam
   * - Adds user message to chat optimistically
   * - Calls geminiService API with full conversation history
   * - Updates UI with AI response
   * - Handles loading states and errors for smooth UX
   */
  const handleSend = async () => {
    // Clear any previous errors
    setInputError('');

    // Check rate limiting
    if (!rateLimiterRef.current.canSubmit()) {
      const remaining = Math.ceil(
        rateLimiterRef.current.getRemainingCooldown() / 1000
      );
      setInputError(`Please wait ${remaining}s before sending another message`);
      return;
    }

    // Validate and sanitize input
    const validationResult = validateChatInput(input);

    if (!validationResult.success) {
      setInputError(validationResult.error);
      return;
    }

    const sanitizedInput = validationResult.data;
    setInput('');

    const newUserMsg: ChatMessage = { role: 'user', text: sanitizedInput };

    // Optimistic update of UI - show user message immediately
    const newMessages = [...messages, newUserMsg];
    setMessages(newMessages);
    setIsLoading(true);

    // Record submission for rate limiting
    rateLimiterRef.current.recordSubmission();

    try {
      // Prepare history for API (converting to SDK format)
      const history = newMessages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      const responseText = await sendQueryToConcierge(history);

      setMessages((prev) => [...prev, { role: 'model', text: responseText }]);
    } catch (_error) {
      // Handle API errors gracefully
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: 'Sorry, I encountered an error processing your request. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside className="fixed bottom-6 right-6 z-50 font-sans" aria-label="AI Chat Assistant">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="glass-panel w-[350px] sm:w-[400px] h-[500px] rounded-2xl flex flex-col shadow-2xl mb-4 overflow-hidden border border-white/10 bg-slate-900/90"
            role="dialog"
            aria-labelledby="chat-title"
            aria-describedby="chat-description"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-tennis-green/20 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-tennis-yellow" aria-hidden="true" />
                <span id="chat-title" className="font-semibold text-white">
                  Facility AI Concierge
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white"
                aria-label="Close AI chat"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div id="chat-description" className="sr-only">
              Chat with the AI concierge to learn about LawnTech Dynamics facility features
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-4"
              ref={scrollRef}
              role="log"
              aria-live="polite"
              aria-atomic="false"
              aria-label="Chat messages"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-tennis-green text-white rounded-br-none'
                        : 'bg-white/10 text-white/90 rounded-bl-none'
                    }`}
                    role={msg.role === 'user' ? 'status' : 'article'}
                    aria-label={msg.role === 'user' ? 'Your message' : 'AI response'}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start" role="status" aria-label="AI is typing">
                  <div className="bg-white/10 p-3 rounded-2xl rounded-bl-none">
                    <Loader2 className="w-4 h-4 animate-spin text-tennis-yellow" aria-hidden="true" />
                    <span className="sr-only">AI is processing your message</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-black/20">
              {/* Error Message */}
              <AnimatePresence>
                {inputError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-2 flex items-center gap-2 text-red-400 text-xs"
                    role="alert"
                  >
                    <AlertCircle className="w-3 h-3" aria-hidden="true" />
                    <span>{inputError}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
              >
                <label htmlFor="chat-input" className="sr-only">
                  Type your message about the facility
                </label>
                <input
                  id="chat-input"
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    // Clear error when user starts typing
                    if (inputError) setInputError('');
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about the grass tech..."
                  className={`flex-1 bg-white/5 border rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none transition-colors ${
                    inputError
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-white/10 focus:border-tennis-yellow'
                  }`}
                  aria-describedby="chat-help"
                  aria-invalid={!!inputError}
                  disabled={isLoading}
                />
                <div id="chat-help" className="sr-only">
                  Press Enter or click send button to submit your message
                </div>
                <button
                  type="submit"
                  onClick={handleSend}
                  disabled={isLoading}
                  className="bg-tennis-yellow text-tennis-dark p-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message to AI concierge"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors ${isOpen ? 'bg-white text-tennis-dark' : 'bg-tennis-yellow text-tennis-dark'}`}
        aria-label={isOpen ? 'Close AI chat assistant' : 'Open AI chat assistant'}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        {isOpen ? (
          <X className="w-6 h-6" aria-hidden="true" />
        ) : (
          <MessageSquare className="w-6 h-6" aria-hidden="true" />
        )}
      </motion.button>
    </aside>
  );
};

export default AIChat;
