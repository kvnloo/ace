import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Layers, Droplets, Zap, Home, Server } from 'lucide-react';

/**
 * Specifications Component - Facility blueprints and technical specifications
 *
 * Displays comprehensive facility specifications across 5 major categories:
 * 1. Ground Floor: Tennis Arena
 * 2. Level 1: Racquet Sports
 * 3. Level 2: Social & Heritage Sports
 * 4. Level 3: Vertical Farming
 * 5. Autonomous Systems
 *
 * Features:
 * - Organized grid layout with responsive columns
 * - Icon-based category identification
 * - Animated card entrance (staggered delay per card)
 * - Item lists with checkmarks
 * - Professional styling with hover effects
 * - Mobile-responsive design
 *
 * This component is typically used on the /specifications view to provide
 * detailed information about what the LawnTech Dynamics facility contains.
 *
 * @component
 * @example
 * ```tsx
 * // Simple usage - renders full specifications page
 * <Specifications />
 * ```
 *
 * @example
 * ```tsx
 * // Typically used in a view component
 * return (
 *   <section className="min-h-screen bg-slate-950">
 *     <Specifications />
 *   </section>
 * );
 * ```
 *
 * @returns {React.ReactElement} Specifications grid layout with facility details
 */
const Specifications: React.FC = () => {
  /**
   * Specifications data structure
   * Array of category objects, each containing:
   * - category: Display name
   * - icon: React icon component
   * - items: Array of {label, value} specification items
   */
  const specs = [
    {
      category: 'Ground Floor: Tennis Arena',
      icon: <Home className="w-6 h-6 text-tennis-yellow" />,
      items: [
        { label: 'Hard Courts (DecoTurf)', value: '6 Courts' },
        { label: 'Clay Courts (Red Clay)', value: '6 Courts' },
        { label: 'Grass Courts (Organic)', value: '6 Courts' },
        { label: 'Wood Courts (Maple)', value: '6 Courts' },
        { label: 'Amenities', value: 'Pro Shop & Lockers' },
      ],
    },
    {
      category: 'Level 1: Racquet Sports',
      icon: <Zap className="w-6 h-6 text-blue-400" />,
      items: [
        { label: 'Badminton Courts', value: '16 Courts' },
        { label: 'Squash Courts', value: '4 Courts' },
        { label: 'Table Tennis', value: '16 Tables' },
        { label: 'Flooring', value: 'Shock-Absorbent Synthetic' },
      ],
    },
    {
      category: 'Level 2: Social & Heritage',
      icon: <Layers className="w-6 h-6 text-purple-400" />,
      items: [
        { label: 'Pickleball Courts', value: '8 Courts' },
        { label: 'Real Tennis Court', value: '1 Historic Court' },
        { label: 'Viewing Decks', value: '360° Glass Walkways' },
      ],
    },
    {
      category: 'Level 3: Vertical Farming',
      icon: <Droplets className="w-6 h-6 text-green-400" />,
      items: [
        { label: 'Farming Area', value: '4 x 500m² Sections' },
        { label: 'Technology', value: 'Auto-Hydroponics' },
        { label: 'Lighting', value: 'Full Spectrum LED' },
        { label: 'Robot Fleet', value: 'Patch Transporters' },
      ],
    },
    {
      category: 'Autonomous Systems',
      icon: <Server className="w-6 h-6 text-red-400" />,
      items: [
        { label: 'Access', value: 'Biometric / Mobile App' },
        { label: 'Monitoring', value: 'Drone & Lidar Fleet' },
        { label: 'Energy', value: 'Solar + Smart BMS' },
        { label: 'Irrigation', value: 'AI Predictive Water' },
      ],
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-12" aria-labelledby="specs-title">
      <header className="mb-16 text-center">
        <h1 id="specs-title" className="text-4xl md:text-6xl font-bold mb-6">
          Facility <span className="text-tennis-yellow">Blueprints</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          A four-story vertical integration of sport, agriculture, and technology.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {specs.map((category, idx) => (
          <motion.article
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors"
            aria-labelledby={`category-${idx}`}
          >
            <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-4">
              <div className="p-3 bg-slate-900 rounded-xl border border-white/10" aria-hidden="true">
                {category.icon}
              </div>
              <h2 id={`category-${idx}`} className="text-xl font-bold">
                {category.category}
              </h2>
            </div>

            <ul className="space-y-4" aria-label={`${category.category} specifications`}>
              {category.items.map((item, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0"
                >
                  <span className="text-gray-400 flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-white/20" aria-hidden="true" />
                    {item.label}
                  </span>
                  <span className="font-mono font-bold text-white text-sm">{item.value}</span>
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default Specifications;
