import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Brain, CheckCircle2, Cpu, Droplets, Home, Layers, Network, Server, Users, Zap } from 'lucide-react';
import { product } from '../landing/public.ts';

const Specifications: React.FC = () => {
  const specs = [
    {
      category: 'ACE system (PRETOTYPE / RESEARCH)',
      icon: <Network className="w-6 h-6 text-tennis-yellow" />,
      items: [
        { label: 'Objective', value: 'Human-defined goals, not one universal score' },
        { label: 'Loop', value: 'Observe → model → simulate → intervene → verify → learn' },
        { label: 'Twin', value: 'Evidence graph with provenance + uncertainty' },
        { label: 'Agents', value: 'Scoped support for humans, not unlimited authority' },
      ],
    },
    {
      category: 'Current proving ground',
      icon: <Activity className="w-6 h-6 text-cyan-300" />,
      items: [
        { label: 'Sport', value: 'Pickleball 2026 rules/profile work — RESEARCH' },
        { label: 'Kernel', value: 'Sport-blind transition protocol + seeded differential tapes' },
        { label: 'Physics', value: 'Backend-neutral WorldKernel / ball-physics bakeoff — RESEARCH' },
        { label: 'Learning', value: 'First athlete intervention-response loop — RESEARCH' },
      ],
    },
    {
      category: 'Human + expert network (VISION)',
      icon: <Users className="w-6 h-6 text-purple-300" />,
      items: [
        { label: 'Performance', value: 'Athletes + coaches + biomechanists + sports scientists' },
        { label: 'Care', value: 'PT + physicians + recovery specialists' },
        { label: 'Fuel', value: 'Nutritionists + food / farm experts' },
        { label: 'Research', value: 'Scientists + learning experts + engineers + peers' },
      ],
    },
    {
      category: 'Ground Floor: Tennis Arena',
      icon: <Home className="w-6 h-6 text-tennis-yellow" />,
      items: [
        { label: 'Tennis courts', value: '24 (hard, clay, grass, wood)' },
        { label: 'Split', value: 'Not specified as 6/6/6/6' },
        { label: 'Amenities', value: 'Pro shop & lockers' },
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
        { label: 'Viewing decks', value: 'Not in origin spec' },
      ],
    },
    {
      category: 'Level 3: Vertical Farming',
      icon: <Droplets className="w-6 h-6 text-green-400" />,
      items: [
        { label: 'Farming area', value: '500 m² per section (origin)' },
        { label: 'Sections', value: 'Unspecified (not 4×500 unless specced)' },
        { label: 'Technology', value: 'Hydroponics — PLANNED' },
        { label: 'Role in ACE', value: 'Nutrition / food research loop — VISION' },
      ],
    },
    {
      category: 'APEX human-performance campus (VISION)',
      icon: <Brain className="w-6 h-6 text-red-400" />,
      items: [
        { label: 'Labs', value: 'Biomechanics, cognition, movement, research, nutrition' },
        { label: 'Recovery', value: 'Physiotherapy + recovery suite' },
        { label: 'Training', value: 'Gym, pool, clubhouse — all sports' },
        { label: 'Dimensions', value: 'Inferred 30×30 m cells — not origin' },
      ],
    },
    {
      category: 'Digital twin trust boundary',
      icon: <Cpu className="w-6 h-6 text-tennis-yellow" />,
      items: [
        { label: '3D', value: 'Projection of authoritative state, not source of truth' },
        { label: 'Evidence', value: 'Observation / estimate / simulation / outcome stay distinct' },
        { label: 'Access', value: 'Purpose-scoped consent and expert authority — RESEARCH' },
        { label: 'This site', value: 'PRETOTYPE only; private live loops stay elsewhere' },
      ],
    },
    {
      category: 'Facility automation overlay',
      icon: <Server className="w-6 h-6 text-tennis-yellow" />,
      items: [
        { label: 'Booking / ops', value: 'Private Facility OS foundation — SHIPPED against demo/sim data' },
        { label: 'Monitoring', value: 'MOCK / research where not otherwise verified' },
        { label: 'Energy', value: 'PLANNED — solar + BMS language' },
        { label: 'Robotics', value: 'Private/prototype work; not represented as live on this Pages site' },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-16 text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          {product.name} <span className="text-tennis-yellow">System + Campus</span>
        </h2>
        <p className="text-xl text-gray-400 max-w-4xl mx-auto">
          The campus is infrastructure around a larger loop: understand a person, connect the right humans and tools, test an intervention, and learn from measured outcomes. Physical-program numbers below remain SPEC or VISION where noted.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {specs.map((category, idx) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-4">
              <div className="p-3 bg-slate-900 rounded-xl border border-white/10">{category.icon}</div>
              <h3 className="text-xl font-bold">{category.category}</h3>
            </div>

            <ul className="space-y-4">
              {category.items.map((item) => (
                <li key={item.label} className="border-b border-white/5 pb-3 last:border-0">
                  <span className="text-gray-400 flex items-center gap-2 text-sm mb-1">
                    <CheckCircle2 className="w-4 h-4 text-white/20 shrink-0" />
                    {item.label}
                  </span>
                  <span className="block pl-6 font-mono font-bold text-white text-sm leading-relaxed">{item.value}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Specifications;
