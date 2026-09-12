import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Layers, Droplets, Zap, Home, Server } from 'lucide-react';

const Specifications: React.FC = () => {
  const specs = [
    {
      category: "Ground Floor: Tennis Arena",
      icon: <Home className="w-6 h-6 text-tennis-yellow" />,
      items: [
        { label: "Tennis courts", value: "24 (hard, clay, grass, wood)" },
        { label: "Split", value: "Not specified as 6/6/6/6" },
        { label: "Amenities", value: "Pro shop & lockers" }
      ]
    },
    {
      category: "Level 1: Racquet Sports",
      icon: <Zap className="w-6 h-6 text-blue-400" />,
      items: [
        { label: "Badminton Courts", value: "16 Courts" },
        { label: "Squash Courts", value: "4 Courts" },
        { label: "Table Tennis", value: "16 Tables" },
        { label: "Flooring", value: "Shock-Absorbent Synthetic" }
      ]
    },
    {
      category: "Level 2: Social & Heritage",
      icon: <Layers className="w-6 h-6 text-purple-400" />,
      items: [
        { label: "Pickleball Courts", value: "8 Courts" },
        { label: "Real Tennis Court", value: "1 Historic Court" },
        { label: "Viewing Decks", value: "360° Glass Walkways" }
      ]
    },
    {
      category: "Level 3: Vertical Farming",
      icon: <Droplets className="w-6 h-6 text-green-400" />,
      items: [
        { label: "Farming area", value: "500 m² per section (origin)" },
        { label: "Sections", value: "Unspecified (not 4×500 unless specced)" },
        { label: "Technology", value: "Hydroponics — PLANNED" },
        { label: "Patch transport", value: "PLANNED" }
      ]
    },
    {
      category: "Ops overlay (not live)",
      icon: <Server className="w-6 h-6 text-tennis-yellow" />,
      items: [
        { label: "Access", value: "PLANNED — app / biometric language" },
        { label: "Monitoring", value: "MOCK — drone / lidar overlay" },
        { label: "Energy", value: "PLANNED — solar + BMS language" },
        { label: "Irrigation", value: "PLANNED" }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Facility <span className="text-tennis-yellow">Blueprints</span></h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Naperville origin: four floors of sport with a grass lab on top. Numbers below match the spec; inferred theater is labeled.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {specs.map((category, idx) => (
                <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors"
                >
                    <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-4">
                        <div className="p-3 bg-slate-900 rounded-xl border border-white/10">
                            {category.icon}
                        </div>
                        <h3 className="text-xl font-bold">{category.category}</h3>
                    </div>
                    
                    <ul className="space-y-4">
                        {category.items.map((item, i) => (
                            <li key={i} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0">
                                <span className="text-gray-400 flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="w-4 h-4 text-white/20" />
                                    {item.label}
                                </span>
                                <span className="font-mono font-bold text-white text-sm">{item.value}</span>
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