import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left hover:text-tennis-yellow transition-colors"
      >
        <span className="text-lg font-bold pr-8">{question}</span>
        <ChevronDown
          className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-gray-300 pb-6 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "What membership tiers are available?",
      answer: "We offer three membership tiers: Essential ($199/month), Performance ($399/month), and Elite ($799/month). Each tier includes access to different facilities, AI coaching features, and health optimization services."
    },
    {
      question: "How does the AI coaching work?",
      answer: "Our AI coaching system uses computer vision and biomechanics analysis to provide real-time feedback on your technique. RGB and depth cameras track your movements, analyzing 147+ biomarkers to give personalized recommendations for improvement."
    },
    {
      question: "What sports are available?",
      answer: "We offer facilities for tennis, pickleball, badminton, and squash. Each sport has dedicated courts with specialized surfaces, including our innovative indoor grass courts."
    },
    {
      question: "Can I book courts in advance?",
      answer: "Yes! Members can book courts up to 7 days in advance through our mobile app or website. Court availability and booking windows depend on your membership tier."
    },
    {
      question: "What is the APEX Performance program?",
      answer: "APEX is our comprehensive health optimization program that tracks 147 biomarkers daily. It includes personalized nutrition from our vertical farm, AI-driven training protocols, and Blueprint-style longevity optimization."
    },
    {
      question: "How does the vertical farm work?",
      answer: "Our on-site vertical farm grows personalized nutrition using 95% less water than traditional farming. Crops are optimized based on your genetic profile and nutritional needs, delivered fresh to the cafe daily."
    },
    {
      question: "Is the facility autonomous?",
      answer: "Yes! Our facility uses a digital twin control system with 1000+ IoT sensors, multi-agent scheduling, and robotic maintenance. This allows for 24/7 operation with minimal staff."
    },
    {
      question: "What are the cancellation policies?",
      answer: "Court bookings can be cancelled up to 4 hours in advance for a full refund. Membership cancellations require 30 days notice. First-time members get a 30-day money-back guarantee."
    },
    {
      question: "Do you offer day passes or guest access?",
      answer: "Yes! Day passes are available for $49, and members can bring guests for $29 per visit. Guest access is limited based on facility capacity."
    },
    {
      question: "When will the facility open?",
      answer: "Our pilot facility in Austin, Texas is scheduled to open in Q4 2025. We're currently accepting founding member applications with special early-bird pricing."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Frequently Asked <span className="text-tennis-yellow">Questions</span>
          </h1>
          <p className="text-xl text-gray-300">
            Everything you need to know about LawnTech Dynamics
          </p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-tennis-yellow/10 to-transparent border border-tennis-yellow/30">
          <h2 className="text-2xl font-bold mb-2">Still have questions?</h2>
          <p className="text-gray-300 mb-6">
            Our team is here to help. Reach out and we'll get back to you within 24 hours.
          </p>
          <button className="bg-tennis-yellow text-tennis-dark font-bold px-6 py-3 rounded-full hover:bg-white transition-all">
            Contact Support
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default FAQ;
