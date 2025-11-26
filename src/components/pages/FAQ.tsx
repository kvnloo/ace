import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, HelpCircle, Users, Building, Cpu, Shield } from 'lucide-react';

type Category = 'all' | 'membership' | 'facilities' | 'technology' | 'health';

interface FAQItem {
  id: string;
  category: Category;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  // MEMBERSHIP
  {
    id: 'mem-1',
    category: 'membership',
    question: 'What membership tiers are available?',
    answer: 'We offer three membership tiers: Foundation ($299/month) with basic biometric tracking and community access, Optimization ($999/month) with advanced biomarkers and AI coaching, and Elite ($2,999/month) with full facility simulation and personalized nutrition delivery.',
  },
  {
    id: 'mem-2',
    category: 'membership',
    question: 'How do I join the waitlist?',
    answer: 'Click the "JOIN WAITING LIST" button in the navigation menu or on our homepage. You\'ll be asked to provide your contact information and preferred membership tier. Early waitlist members receive priority access and exclusive launch benefits.',
  },
  {
    id: 'mem-3',
    category: 'membership',
    question: 'When will the facility open?',
    answer: 'LawnTech Dynamics is currently in the planning and development phase. We expect to break ground within 18-24 months and open to members approximately 12 months after construction begins. Waitlist members will receive regular updates on our progress.',
  },
  {
    id: 'mem-4',
    category: 'membership',
    question: 'Can I tour the facility before joining?',
    answer: 'While the physical facility is under construction, we offer virtual tours using our digital twin technology. This allows you to explore the courts, performance labs, and amenities in an immersive 3D environment. Contact us to schedule your virtual tour.',
  },
  {
    id: 'mem-5',
    category: 'membership',
    question: 'Can I switch membership tiers later?',
    answer: 'Yes, you can upgrade or downgrade your membership tier at any time. Changes take effect at the start of your next billing cycle. Our team will help you transition smoothly and ensure you have access to all features of your new tier.',
  },

  // FACILITIES
  {
    id: 'fac-1',
    category: 'facilities',
    question: 'How many courts are available?',
    answer: 'The facility features multiple court types: Tennis courts with grass, clay, hard, and wood surfaces, 8 dedicated Pickleball courts, 16 Badminton courts, and 4 optional Squash courts. All courts are equipped with AI coaching and performance tracking technology.',
  },
  {
    id: 'fac-2',
    category: 'facilities',
    question: 'What court surfaces do you offer?',
    answer: 'Our tennis courts feature four surfaces: grass (with modular 60-minute swap system), clay, hard court, and wood. Each surface is maintained to professional tournament standards with our robotic maintenance systems.',
  },
  {
    id: 'fac-3',
    category: 'facilities',
    question: 'What are the operating hours?',
    answer: 'The facility operates 24/7 for Elite members. Optimization members have access from 5:00 AM to 11:00 PM daily. Foundation members can access the facility from 6:00 AM to 10:00 PM. All members can book courts through our smart scheduling system.',
  },
  {
    id: 'fac-4',
    category: 'facilities',
    question: 'Is parking available?',
    answer: 'Yes, we provide ample parking with reserved spaces for members. The parking facility includes EV charging stations and is integrated with our biometric entry system for seamless access.',
  },
  {
    id: 'fac-5',
    category: 'facilities',
    question: 'Are locker rooms available?',
    answer: 'All membership tiers include access to premium locker rooms with secure storage, showers, and changing facilities. Elite members receive private locker suites with additional amenities.',
  },

  // TECHNOLOGY
  {
    id: 'tech-1',
    category: 'technology',
    question: 'What is the digital twin system?',
    answer: 'Our digital twin is a virtual replica of the entire facility and your performance data. It simulates training scenarios, predicts outcomes, and allows you to test strategies before implementing them in real life. The system updates in real-time based on your actual performance.',
  },
  {
    id: 'tech-2',
    category: 'technology',
    question: 'How does AI coaching work?',
    answer: 'AI coaching uses computer vision cameras to track your movements, analyze biomechanics, and provide real-time feedback. The system identifies technique issues, suggests corrections, and creates personalized training plans based on 247+ daily research studies.',
  },
  {
    id: 'tech-3',
    category: 'technology',
    question: 'What biomarkers do you track?',
    answer: 'We track 147 biomarkers daily including HRV (heart rate variability), glucose levels via continuous monitoring, sleep architecture, VO₂ max, methylation pathways, inflammation markers, and cognitive performance metrics. All data is analyzed by AI to optimize your protocols.',
  },
  {
    id: 'tech-4',
    category: 'technology',
    question: 'Is my health data secure?',
    answer: 'Absolutely. All health data is encrypted end-to-end, stored in HIPAA-compliant systems, and never shared without your explicit consent. You maintain full ownership and control of your data with the ability to export or delete it at any time.',
  },
  {
    id: 'tech-5',
    category: 'technology',
    question: 'Can I access my performance data on mobile?',
    answer: 'Yes, our mobile app provides full access to your performance metrics, training schedules, biomarker trends, and AI recommendations. You can review session summaries, track progress, and communicate with coaches from anywhere.',
  },

  // HEALTH & SAFETY
  {
    id: 'health-1',
    category: 'health',
    question: 'What recovery services are offered?',
    answer: 'The Recovery Suite includes hyperbaric oxygen therapy, whole-body cryotherapy (-110°C chamber), red light therapy, compression therapy, and advanced sleep optimization. Our protocols improve sleep efficiency to 94% average with +22% REM and +31% deep sleep.',
  },
  {
    id: 'health-2',
    category: 'health',
    question: 'How does the vertical farm work?',
    answer: 'Our on-site vertical farm uses controlled environment agriculture with 95% less water, 100% renewable energy, and zero pesticides. LED spectrum lighting optimizes phytonutrient content. Crops are personalized based on your genetic variants (MTHFR, APOE) and delivered just-in-time.',
  },
  {
    id: 'health-3',
    category: 'health',
    question: 'Are the facilities accessible?',
    answer: 'Yes, all areas of the facility are fully ADA compliant with wheelchair-accessible courts, elevators, and adaptive equipment available. Our staff is trained to support members with diverse accessibility needs.',
  },
  {
    id: 'health-4',
    category: 'health',
    question: 'What safety protocols are in place?',
    answer: 'Safety is paramount. We have on-site medical staff, automated emergency response systems, AED units throughout the facility, and comprehensive insurance coverage. All equipment undergoes regular safety inspections and maintenance.',
  },
  {
    id: 'health-5',
    category: 'health',
    question: 'Do you offer nutrition consultations?',
    answer: 'Yes, all members receive personalized nutrition planning based on biomarker analysis. Elite members get one-on-one consultations with our nutrition experts and custom meal delivery from our vertical farm. Optimization members receive automated meal recommendations and supplement protocols.',
  },
];

const categoryConfig = {
  all: { label: 'All FAQs', icon: HelpCircle, color: 'text-tennis-yellow' },
  membership: { label: 'Membership', icon: Users, color: 'text-blue-400' },
  facilities: { label: 'Facilities', icon: Building, color: 'text-green-400' },
  technology: { label: 'Technology', icon: Cpu, color: 'text-purple-400' },
  health: { label: 'Health & Safety', icon: Shield, color: 'text-red-400' },
};

const FAQ: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredFAQs = useMemo(() => {
    let filtered = faqData;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        faq =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Frequently Asked <span className="text-tennis-yellow">Questions</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-200 max-w-3xl mx-auto mb-8"
        >
          Find answers to common questions about membership, facilities, technology, and health services
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto relative"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search FAQs by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-400 focus:outline-none focus:border-tennis-yellow/50 focus:bg-white/10 transition-all"
          />
        </motion.div>
      </div>

      {/* Category Tabs */}
      <div className="mb-12">
        <div className="flex flex-wrap justify-center gap-4">
          {(Object.keys(categoryConfig) as Category[]).map((category) => {
            const config = categoryConfig[category];
            const Icon = config.icon;
            const isActive = selectedCategory === category;

            return (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  isActive
                    ? 'bg-tennis-yellow text-slate-900'
                    : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{config.label}</span>
                {!isActive && (
                  <span className="ml-1 text-sm text-gray-400">
                    ({faqData.filter(f => category === 'all' || f.category === category).length})
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* FAQ Items */}
      <div className="max-w-4xl mx-auto space-y-4">
        {filteredFAQs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <HelpCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-400">No FAQs found matching your search.</p>
            <p className="text-sm text-gray-500 mt-2">Try a different keyword or category.</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredFAQs.map((faq, index) => {
              const isExpanded = expandedId === faq.id;
              const categoryColor = categoryConfig[faq.category].color;

              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white/5 border rounded-2xl overflow-hidden transition-all ${
                    isExpanded
                      ? 'border-tennis-yellow/40 bg-white/10'
                      : 'border-white/10 hover:border-white/20 hover:bg-white/7'
                  }`}
                >
                  <button
                    onClick={() => toggleExpand(faq.id)}
                    className="w-full px-6 py-5 flex items-start gap-4 text-left transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">
                        {faq.question}
                      </h3>
                      <span className={`text-xs font-semibold uppercase tracking-wider ${categoryColor}`}>
                        {categoryConfig[faq.category].label}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown
                        className={`w-6 h-6 transition-colors ${
                          isExpanded ? 'text-tennis-yellow' : 'text-gray-400'
                        }`}
                      />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 pt-2 border-t border-white/10">
                          <p className="text-gray-200 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Contact CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-16 text-center"
      >
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-200 mb-6">
            Our team is here to help. Reach out and we'll get back to you within 24 hours.
          </p>
          <button className="bg-tennis-yellow text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-tennis-yellow/90 transition-all">
            Contact Support
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default FAQ;
