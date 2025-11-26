import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Droplet, Sun, Recycle, Wind, Battery } from 'lucide-react';

const Sustainability: React.FC = () => {
  const initiatives = [
    {
      icon: <Sun className="w-8 h-8" />,
      title: "100% Renewable Energy",
      description: "Solar panels and wind turbines generate all our electricity, with battery storage for 24/7 operation.",
      impact: "Zero carbon emissions"
    },
    {
      icon: <Droplet className="w-8 h-8" />,
      title: "Water Conservation",
      description: "Our vertical farm uses 95% less water than traditional farming through hydroponic systems and rainwater harvesting.",
      impact: "500,000 gallons saved annually"
    },
    {
      icon: <Recycle className="w-8 h-8" />,
      title: "Zero Waste Operations",
      description: "Comprehensive recycling and composting programs with closed-loop systems for all organic materials.",
      impact: "99% waste diversion rate"
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Vertical Farming",
      description: "On-site food production with zero pesticides, eliminating transportation emissions and supporting local ecosystems.",
      impact: "80% food sourced on-site"
    },
    {
      icon: <Wind className="w-8 h-8" />,
      title: "Carbon Sequestration",
      description: "Native plant landscaping and rooftop gardens actively remove CO₂ from the atmosphere.",
      impact: "50 tons CO₂ offset yearly"
    },
    {
      icon: <Battery className="w-8 h-8" />,
      title: "Smart Grid Integration",
      description: "Intelligent energy management system optimizes consumption and feeds excess power back to the grid.",
      impact: "30% grid contribution"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Sustainability <span className="text-tennis-yellow">First</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Building the future of sports facilities while protecting the planet for future generations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {initiatives.map((initiative, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-400/20 flex items-center justify-center text-emerald-400 mb-4">
                {initiative.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{initiative.title}</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">{initiative.description}</p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tennis-yellow/20 text-tennis-yellow text-sm font-bold">
                {initiative.impact}
              </div>
            </motion.div>
          ))}
        </div>

        <section className="border-t border-white/10 pt-20 mb-20">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Commitments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-emerald-400/10 to-transparent border border-emerald-400/30">
              <h3 className="text-2xl font-bold mb-4">By 2026</h3>
              <ul className="space-y-3 text-gray-300">
                <li>✓ Carbon neutral operations</li>
                <li>✓ Zero single-use plastics</li>
                <li>✓ 100% sustainable food sourcing</li>
                <li>✓ LEED Platinum certification</li>
              </ul>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-tennis-yellow/10 to-transparent border border-tennis-yellow/30">
              <h3 className="text-2xl font-bold mb-4">By 2030</h3>
              <ul className="space-y-3 text-gray-300">
                <li>✓ Carbon negative facility</li>
                <li>✓ Net-positive water usage</li>
                <li>✓ 100% circular economy</li>
                <li>✓ Zero environmental impact</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Every member contributes to a more sustainable future. Together, we're proving that world-class facilities can operate in harmony with nature.
          </p>
          <button className="bg-emerald-400 text-white font-bold px-8 py-4 rounded-full hover:bg-emerald-500 transition-all">
            Learn More About Our Impact
          </button>
        </section>
      </motion.div>
    </div>
  );
};

export default Sustainability;
