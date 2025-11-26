import React from 'react';
import { motion } from 'framer-motion';
import {
  Leaf,
  Droplets,
  Sun,
  Zap,
  Wind,
  Sprout,
  Recycle,
  TrendingDown,
  Battery,
  Trees,
  CloudRain,
  Building2,
  Award,
  Globe
} from 'lucide-react';

const Sustainability: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-400 text-sm font-medium mb-6"
        >
          <Globe className="w-4 h-4" />
          <span>Carbon-Negative by Design</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Environmental <span className="text-emerald-400">Commitment</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-200 max-w-3xl mx-auto"
        >
          Building the future of sports facilities with zero environmental compromise through integrated renewable systems,
          vertical farming, and circular economy principles
        </motion.p>
      </div>

      {/* Key Metrics Banner */}
      <div className="mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-400/20 rounded-3xl p-8 hover:border-blue-400/40 transition-all"
          >
            <Droplets className="w-10 h-10 text-blue-400 mb-4" />
            <div className="text-4xl font-bold text-white mb-2">95%</div>
            <div className="text-sm text-gray-200">Water Efficiency</div>
            <div className="text-xs text-gray-300 mt-2">vs traditional farming</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-tennis-yellow/20 to-yellow-700/20 border border-tennis-yellow/30 rounded-3xl p-8 hover:border-tennis-yellow/50 transition-all"
          >
            <Sun className="w-10 h-10 text-tennis-yellow mb-4" />
            <div className="text-4xl font-bold text-white mb-2">100%</div>
            <div className="text-sm text-gray-200">Renewable Energy</div>
            <div className="text-xs text-gray-300 mt-2">Solar + battery storage</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 border border-emerald-400/20 rounded-3xl p-8 hover:border-emerald-400/40 transition-all"
          >
            <Leaf className="w-10 h-10 text-emerald-400 mb-4" />
            <div className="text-4xl font-bold text-white mb-2">Zero</div>
            <div className="text-sm text-gray-200">Pesticides</div>
            <div className="text-xs text-gray-300 mt-2">Controlled environment</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-400/20 rounded-3xl p-8 hover:border-green-400/40 transition-all"
          >
            <TrendingDown className="w-10 h-10 text-green-400 mb-4" />
            <div className="text-4xl font-bold text-white mb-2">Carbon-</div>
            <div className="text-sm text-gray-200">Negative Operations</div>
            <div className="text-xs text-gray-300 mt-2">Net carbon removal</div>
          </motion.div>
        </div>
      </div>

      {/* Vertical Farm Section */}
      <div className="mb-24">
        <div className="mb-12 flex items-center gap-4">
          <div className="p-4 bg-emerald-900/30 rounded-2xl">
            <Sprout className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-3xl font-bold">Vertical Farm Integration</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
            <h4 className="text-xl font-bold mb-6 text-emerald-400">Farm Architecture</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-200">Hydroponic Towers</span>
                <span className="text-white font-mono font-bold">16 units</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-200">Growth Tiers per Tower</span>
                <span className="text-white font-mono font-bold">8 levels</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-200">Plant Capacity</span>
                <span className="text-white font-mono font-bold">1000+ plants</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-200">LED Grow Lights</span>
                <span className="text-white font-mono font-bold">Nutrition optimized</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-200">Harvest Frequency</span>
                <span className="text-white font-mono font-bold">Continuous rotation</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
            <h4 className="text-xl font-bold mb-6 text-emerald-400">Farm-to-Table Benefits</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-200">Delivery Time</span>
                    <span className="text-white font-mono font-bold">Minutes, not days</span>
                  </div>
                  <p className="text-xs text-gray-300">Harvested fresh when ordered</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-200">Personalized Crops</span>
                    <span className="text-white font-mono font-bold">DNA-matched</span>
                  </div>
                  <p className="text-xs text-gray-300">Optimized for genetic variants (MTHFR, APOE)</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-200">Nutrient Density</span>
                    <span className="text-white font-mono font-bold">Maximum potency</span>
                  </div>
                  <p className="text-xs text-gray-300">Spectrum-optimized LED lighting</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-200">Zero Transport</span>
                    <span className="text-white font-mono font-bold">On-site cultivation</span>
                  </div>
                  <p className="text-xs text-gray-300">Eliminates food miles entirely</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Solar Integration */}
      <div className="mb-24">
        <div className="mb-12 flex items-center gap-4">
          <div className="p-4 bg-yellow-900/30 rounded-2xl">
            <Sun className="w-8 h-8 text-tennis-yellow" />
          </div>
          <h3 className="text-3xl font-bold">Solar Integration</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <Sun className="w-6 h-6 text-tennis-yellow" />
              <h4 className="text-lg font-bold">Rooftop Arrays</h4>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-200">Solar Capacity</span>
                <span className="text-white font-mono font-bold">250 kW peak</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-200">Panel Type</span>
                <span className="text-white font-mono font-bold">Bifacial modules</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-200">Coverage Area</span>
                <span className="text-white font-mono font-bold">1,800 m²</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-200">Efficiency</span>
                <span className="text-white font-mono font-bold">22.5%</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <Battery className="w-6 h-6 text-blue-400" />
              <h4 className="text-lg font-bold">Energy Storage</h4>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-200">Battery Capacity</span>
                <span className="text-white font-mono font-bold">500 kWh</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-200">Technology</span>
                <span className="text-white font-mono font-bold">LiFePO₄</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-200">Backup Duration</span>
                <span className="text-white font-mono font-bold">8+ hours</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-200">Cycle Life</span>
                <span className="text-white font-mono font-bold">10,000+ cycles</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <Zap className="w-6 h-6 text-green-400" />
              <h4 className="text-lg font-bold">Generation Stats</h4>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-200">Annual Production</span>
                <span className="text-white font-mono font-bold">350 MWh</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-200">Self-Sufficiency</span>
                <span className="text-white font-mono font-bold">100%</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-200">Excess to Grid</span>
                <span className="text-white font-mono font-bold">85 MWh/year</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-200">CO₂ Offset</span>
                <span className="text-white font-mono font-bold">175 tons/year</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Water Management */}
      <div className="mb-24">
        <div className="mb-12 flex items-center gap-4">
          <div className="p-4 bg-blue-900/30 rounded-2xl">
            <Droplets className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-3xl font-bold">Water Management</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <Recycle className="w-6 h-6 text-blue-400" />
              <h4 className="text-lg font-bold">Closed-Loop System</h4>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-200">Nutrient Cycling</span>
                    <span className="text-white font-mono font-bold">100% recirculation</span>
                  </div>
                  <p className="text-xs text-gray-300">Zero nutrient waste, continuous monitoring</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-200">Water Reduction</span>
                    <span className="text-white font-mono font-bold">95% vs traditional</span>
                  </div>
                  <p className="text-xs text-gray-300">Precise delivery eliminates runoff</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-200">Filtration</span>
                    <span className="text-white font-mono font-bold">Multi-stage UV</span>
                  </div>
                  <p className="text-xs text-gray-300">Pathogen elimination without chemicals</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <CloudRain className="w-6 h-6 text-blue-400" />
              <h4 className="text-lg font-bold">Rainwater Harvesting</h4>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-200">Collection Area</span>
                <span className="text-white font-mono font-bold">3,500 m² roof</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-200">Storage Capacity</span>
                <span className="text-white font-mono font-bold">150,000 L</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-200">Annual Capture</span>
                <span className="text-white font-mono font-bold">2.1M liters</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-200">Use Cases</span>
                <span className="text-white font-mono font-bold">Irrigation + toilets</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Green Building Features */}
      <div className="mb-24">
        <div className="mb-12 flex items-center gap-4">
          <div className="p-4 bg-green-900/30 rounded-2xl">
            <Building2 className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-3xl font-bold">Green Building Features</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
            <Trees className="w-8 h-8 text-green-400 mb-4" />
            <h4 className="font-bold text-white mb-2">Green Wall Facades</h4>
            <p className="text-sm text-gray-200 mb-3">Living plant walls for air purification and thermal insulation</p>
            <ul className="space-y-1 text-xs text-gray-300">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-tennis-yellow" />
                <span>800 m² coverage</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-tennis-yellow" />
                <span>Native species mix</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-tennis-yellow" />
                <span>Automated irrigation</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
            <Wind className="w-8 h-8 text-cyan-400 mb-4" />
            <h4 className="font-bold text-white mb-2">Natural Ventilation</h4>
            <p className="text-sm text-gray-200 mb-3">Passive cooling design reducing HVAC load by 40%</p>
            <ul className="space-y-1 text-xs text-gray-300">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-tennis-yellow" />
                <span>Stack effect design</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-tennis-yellow" />
                <span>Operable windows</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-tennis-yellow" />
                <span>Smart louvers</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
            <Leaf className="w-8 h-8 text-emerald-400 mb-4" />
            <h4 className="font-bold text-white mb-2">Sustainable Materials</h4>
            <p className="text-sm text-gray-200 mb-3">Recycled and low-carbon materials throughout</p>
            <ul className="space-y-1 text-xs text-gray-300">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-tennis-yellow" />
                <span>Recycled steel frames</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-tennis-yellow" />
                <span>FSC-certified wood</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-tennis-yellow" />
                <span>Low-VOC finishes</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
            <Award className="w-8 h-8 text-tennis-yellow mb-4" />
            <h4 className="font-bold text-white mb-2">LEED Certification</h4>
            <p className="text-sm text-gray-200 mb-3">Targeting LEED Platinum certification</p>
            <ul className="space-y-1 text-xs text-gray-300">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-tennis-yellow" />
                <span>Energy efficiency</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-tennis-yellow" />
                <span>Water conservation</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-tennis-yellow" />
                <span>Indoor air quality</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Circular Economy */}
      <div className="mb-24">
        <div className="mb-12 flex items-center gap-4">
          <div className="p-4 bg-purple-900/30 rounded-2xl">
            <Recycle className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-3xl font-bold">Circular Economy</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
            <h4 className="text-xl font-bold mb-6 text-purple-400">Waste Reduction</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-200">Diversion Rate</span>
                    <span className="text-white font-mono font-bold">90%+ from landfill</span>
                  </div>
                  <p className="text-xs text-gray-300">Comprehensive recycling and composting</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-200">Single-Use Plastics</span>
                    <span className="text-white font-mono font-bold">Zero tolerance</span>
                  </div>
                  <p className="text-xs text-gray-300">Biodegradable alternatives only</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-200">Smart Bins</span>
                    <span className="text-white font-mono font-bold">AI-powered sorting</span>
                  </div>
                  <p className="text-xs text-gray-300">Automated contamination detection</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
            <h4 className="text-xl font-bold mb-6 text-purple-400">Composting Programs</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-200">On-Site Composting</span>
                <span className="text-white font-mono font-bold">All organic waste</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-200">Processing Capacity</span>
                <span className="text-white font-mono font-bold">500 kg/week</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-200">Cycle Time</span>
                <span className="text-white font-mono font-bold">3-4 weeks</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-200">Use</span>
                <span className="text-white font-mono font-bold">Farm nutrients</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
            <h4 className="text-xl font-bold mb-6 text-purple-400">Equipment Lifecycle</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <span className="text-gray-200">Repair-first maintenance philosophy</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <span className="text-gray-200">Equipment refurbishment and resale programs</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <span className="text-gray-200">Modular design for component replacement</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <span className="text-gray-200">Partnership with recycling specialists</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Environmental Impact Summary */}
      <div className="bg-gradient-to-br from-emerald-900/20 to-green-900/20 border border-emerald-400/20 rounded-3xl p-12 text-center">
        <Globe className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
        <h3 className="text-3xl font-bold mb-4">Building a <span className="text-emerald-400">Sustainable Future</span></h3>
        <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
          Our commitment to environmental stewardship goes beyond compliance. We're creating a blueprint for the next generation
          of sports facilities where performance optimization and planetary health work hand in hand.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div>
            <div className="text-3xl font-bold text-emerald-400 mb-2">175 tons</div>
            <div className="text-sm text-gray-200">CO₂ offset annually</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-400 mb-2">2.1M liters</div>
            <div className="text-sm text-gray-200">Rainwater harvested yearly</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-tennis-yellow mb-2">100%</div>
            <div className="text-sm text-gray-200">Renewable energy powered</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sustainability;
