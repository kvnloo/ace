import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Brain, Droplets, Sun, Wind, Zap, Heart, TrendingUp, Leaf, Camera, Users } from 'lucide-react';

const Amenities: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-16 text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          Facility <span className="text-tennis-yellow">Amenities</span>
        </h2>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Comprehensive member experience from racket sports to performance optimization, recovery, and personalized nutrition
        </p>
      </div>

      {/* 1. Multi-Sport Complex */}
      <div className="mb-24">
        <div className="mb-12 flex items-center gap-4">
          <div className="p-4 bg-green-900/30 rounded-2xl">
            <Activity className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-3xl font-bold">Multi-Sport Complex</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
            <h4 className="text-xl font-bold mb-6 text-tennis-yellow">Tennis Courts</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Surface Types</span>
                <span className="text-white font-mono font-bold">Grass, Clay, Hard, Wood</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Court Dimensions</span>
                <span className="text-white font-mono font-bold">23.77m × 10.97m</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Modular Grass System</span>
                <span className="text-white font-mono font-bold">60-min swap</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Computer Vision</span>
                <span className="text-white font-mono font-bold">RGB + Depth cameras</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Analytics</span>
                <span className="text-white font-mono font-bold">Real-time biomechanics</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
            <h4 className="text-xl font-bold mb-6 text-blue-400">Pickleball Courts</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Total Courts</span>
                <span className="text-white font-mono font-bold">8 dedicated</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Court Dimensions</span>
                <span className="text-white font-mono font-bold">13.41m × 6.10m</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Surface Type</span>
                <span className="text-white font-mono font-bold">Shock-absorbent synthetic</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Lighting</span>
                <span className="text-white font-mono font-bold">LED high-bay</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Location</span>
                <span className="text-white font-mono font-bold">Level 2</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
            <h4 className="text-xl font-bold mb-6 text-purple-400">Badminton Courts</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Total Courts</span>
                <span className="text-white font-mono font-bold">16 courts</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Court Dimensions</span>
                <span className="text-white font-mono font-bold">13.40m × 6.10m</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Net Height</span>
                <span className="text-white font-mono font-bold">1.55m</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Surface Type</span>
                <span className="text-white font-mono font-bold">Shock-absorbent</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Location</span>
                <span className="text-white font-mono font-bold">Level 1</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
            <h4 className="text-xl font-bold mb-6 text-orange-400">Squash Courts (Optional)</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Total Courts</span>
                <span className="text-white font-mono font-bold">4 courts</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Court Dimensions</span>
                <span className="text-white font-mono font-bold">9.75m × 6.40m</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Wall Material</span>
                <span className="text-white font-mono font-bold">Hardwood panels</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Glass Back Wall</span>
                <span className="text-white font-mono font-bold">Spectator viewing</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Location</span>
                <span className="text-white font-mono font-bold">Level 1</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Camera className="w-6 h-6 text-tennis-yellow" />
            <h4 className="text-xl font-bold">AI Coaching & Analytics</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h5 className="font-bold text-white mb-3 text-sm">Computer Vision Tracking</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                  <span>Ball trajectory analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                  <span>Player movement heatmaps</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                  <span>Shot type classification</span>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-white mb-3 text-sm">Biomechanics Analysis</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                  <span>Serve motion capture</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                  <span>Injury risk prediction</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                  <span>Form correction alerts</span>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-white mb-3 text-sm">Performance Reports</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                  <span>Post-session summaries</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                  <span>Progression tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                  <span>Training plan adjustments</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 2. APEX Performance Center */}
      <div className="mb-24">
        <div className="mb-12 flex items-center gap-4">
          <div className="p-4 bg-red-900/30 rounded-2xl">
            <Brain className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-3xl font-bold">APEX Performance Optimization Center</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
          {/* Biometric Assessment */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <Heart className="w-6 h-6 text-red-400" />
              <h4 className="text-lg font-bold">Biometric Assessment Lab</h4>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Biomarkers Tracked</span>
                <span className="text-white font-mono font-bold">147 daily</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">HRV Analysis</span>
                <span className="text-white font-mono font-bold">Real-time</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Glucose Monitoring</span>
                <span className="text-white font-mono font-bold">Continuous CGM</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Sleep Analysis</span>
                <span className="text-white font-mono font-bold">Architecture tracking</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Methylation Pathways</span>
                <span className="text-white font-mono font-bold">Active monitoring</span>
              </li>
            </ul>
          </div>

          {/* Movement Optimization */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <Activity className="w-6 h-6 text-green-400" />
              <h4 className="text-lg font-bold">Movement Studio</h4>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">VO₂ Max Increase</span>
                <span className="text-white font-mono font-bold">+28% avg</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">HRV Improvement</span>
                <span className="text-white font-mono font-bold">+12% avg</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Recovery Time</span>
                <span className="text-white font-mono font-bold">-34% reduction</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Strength Gains</span>
                <span className="text-white font-mono font-bold">+15-25%</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">AI Protocols</span>
                <span className="text-white font-mono font-bold">Adaptive training</span>
              </li>
            </ul>
          </div>

          {/* Nutrition Kitchen */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <Droplets className="w-6 h-6 text-blue-400" />
              <h4 className="text-lg font-bold">Nutrition Kitchen</h4>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Glucose Variability</span>
                <span className="text-white font-mono font-bold">-47% reduction</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Insulin Sensitivity</span>
                <span className="text-white font-mono font-bold">+38% improvement</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Nutraceuticals</span>
                <span className="text-white font-mono font-bold">47+ targeted</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Meal Timing</span>
                <span className="text-white font-mono font-bold">CGM-optimized</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Microbiome Support</span>
                <span className="text-white font-mono font-bold">Personalized</span>
              </li>
            </ul>
          </div>

          {/* Cognitive Enhancement */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <Brain className="w-6 h-6 text-purple-400" />
              <h4 className="text-lg font-bold">Cognitive Lab</h4>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Focus Duration</span>
                <span className="text-white font-mono font-bold">+41%</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Reaction Time</span>
                <span className="text-white font-mono font-bold">-23%</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Memory Consolidation</span>
                <span className="text-white font-mono font-bold">+35%</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">EEG Training</span>
                <span className="text-white font-mono font-bold">Flow state</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Nootropic Stack</span>
                <span className="text-white font-mono font-bold">Personalized</span>
              </li>
            </ul>
          </div>

          {/* Recovery Suite */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <Sun className="w-6 h-6 text-yellow-400" />
              <h4 className="text-lg font-bold">Recovery Suite</h4>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Sleep Efficiency</span>
                <span className="text-white font-mono font-bold">94% avg</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">REM Sleep</span>
                <span className="text-white font-mono font-bold">+22%</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Deep Sleep</span>
                <span className="text-white font-mono font-bold">+31%</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Hyperbaric Oxygen</span>
                <span className="text-white font-mono font-bold">Available</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Cryotherapy</span>
                <span className="text-white font-mono font-bold">-110°C chamber</span>
              </li>
            </ul>
          </div>

          {/* Research Integration */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
              <h4 className="text-lg font-bold">Research Center</h4>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Studies Analyzed</span>
                <span className="text-white font-mono font-bold">247+ daily</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Meta-Analysis</span>
                <span className="text-white font-mono font-bold">Automated</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Protocol Updates</span>
                <span className="text-white font-mono font-bold">Real-time</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Evidence Quality</span>
                <span className="text-white font-mono font-bold">AI scoring</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Safety Evaluation</span>
                <span className="text-white font-mono font-bold">Continuous</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Vertical Farm */}
      <div className="mb-24">
        <div className="mb-12 flex items-center gap-4">
          <div className="p-4 bg-emerald-900/30 rounded-2xl">
            <Leaf className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-3xl font-bold">Vertical Farm Integration</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
            <h4 className="text-xl font-bold mb-6 text-emerald-400">Controlled Environment Agriculture</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-400">Water Efficiency</span>
                    <span className="text-white font-mono font-bold">95% reduction</span>
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-400">Energy Source</span>
                    <span className="text-white font-mono font-bold">100% renewable</span>
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-400">Pesticide Use</span>
                    <span className="text-white font-mono font-bold">Zero tolerance</span>
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-400">LED Spectrum</span>
                    <span className="text-white font-mono font-bold">Phytonutrient optimized</span>
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-400">Carbon Impact</span>
                    <span className="text-white font-mono font-bold">Negative operations</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
            <h4 className="text-xl font-bold mb-6 text-emerald-400">Personalization Engine</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <span className="text-gray-400">Genetic variant accommodation (MTHFR, APOE)</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <span className="text-gray-400">Microbiome support cultivation</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <span className="text-gray-400">Anti-inflammatory compound emphasis</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <span className="text-gray-400">Methylation support crops (folate-rich greens)</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <span className="text-gray-400">Just-in-time delivery scheduling</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4. Autonomous Features */}
      <div className="mb-24">
        <div className="mb-12 flex items-center gap-4">
          <div className="p-4 bg-indigo-900/30 rounded-2xl">
            <Zap className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-3xl font-bold">Autonomous Operations</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
            <Wind className="w-8 h-8 text-purple-400 mb-4" />
            <h4 className="font-bold text-white mb-2">Smart HVAC</h4>
            <p className="text-sm text-gray-400">AI climate control with occupancy sensing and energy optimization</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
            <Users className="w-8 h-8 text-blue-400 mb-4" />
            <h4 className="font-bold text-white mb-2">Biometric Entry</h4>
            <p className="text-sm text-gray-400">Seamless access with fingerprint + NFC badge authentication</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
            <Activity className="w-8 h-8 text-green-400 mb-4" />
            <h4 className="font-bold text-white mb-2">Smart Scheduling</h4>
            <p className="text-sm text-gray-400">AI allocation of courts and facilities based on preferences</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
            <Leaf className="w-8 h-8 text-emerald-400 mb-4" />
            <h4 className="font-bold text-white mb-2">Robotic Maintenance</h4>
            <p className="text-sm text-gray-400">Automated grass swaps in 60 minutes, court cleaning robots</p>
          </div>
        </div>
      </div>

      {/* 5. Membership Tiers */}
      <div className="mb-24">
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Membership <span className="text-tennis-yellow">Tiers</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Choose your level of performance optimization
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Foundation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="bg-white/5 border border-gray-500/20 hover:border-gray-500/40 rounded-3xl p-8 hover:bg-white/10 transition-all relative flex flex-col h-full"
          >
            <div className="mb-6 pb-6 border-b border-white/10">
              <h3 className="text-2xl font-bold mb-2">Foundation</h3>
              <div className="text-3xl font-bold text-tennis-yellow">$299/month</div>
            </div>

            <ul className="space-y-4">
              {[
                "Basic biometric tracking",
                "Standard protocol generation",
                "Community access",
                "Monthly health reports",
                "Email support"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-tennis-yellow/10 border border-tennis-yellow/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-tennis-yellow" />
                  </div>
                  <span className="text-gray-400">{feature}</span>
                </li>
              ))}
            </ul>

            <button className="mt-auto w-full py-3 px-6 rounded-xl font-bold transition-all bg-white/5 border border-white/10 text-white hover:bg-white/10 pt-8">
              Get Started
            </button>
          </motion.div>

          {/* Optimization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 border border-tennis-yellow/20 hover:border-tennis-yellow/40 rounded-3xl p-8 hover:bg-white/10 transition-all relative flex flex-col h-full"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-tennis-yellow text-slate-950 px-4 py-1 rounded-full text-sm font-bold">
              MOST POPULAR
            </div>

            <div className="mb-6 pb-6 border-b border-white/10">
              <h3 className="text-2xl font-bold mb-2">Optimization</h3>
              <div className="text-3xl font-bold text-tennis-yellow">$999/month</div>
            </div>

            <ul className="space-y-4">
              {[
                "Advanced biomarker analysis (147 markers)",
                "Personalized AI coaching",
                "Digital twin access",
                "Research integration (247+ studies/day)",
                "Priority support",
                "Personalized nutrition planning"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-tennis-yellow/10 border border-tennis-yellow/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-tennis-yellow" />
                  </div>
                  <span className="text-gray-400">{feature}</span>
                </li>
              ))}
            </ul>

            <button className="mt-auto w-full py-3 px-6 rounded-xl font-bold transition-all bg-tennis-yellow text-slate-950 hover:bg-tennis-yellow/90 pt-8">
              Get Started
            </button>
          </motion.div>

          {/* Elite */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 border border-purple-500/20 hover:border-purple-500/40 rounded-3xl p-8 hover:bg-white/10 transition-all relative flex flex-col h-full"
          >
            <div className="mb-6 pb-6 border-b border-white/10">
              <h3 className="text-2xl font-bold mb-2">Elite</h3>
              <div className="text-3xl font-bold text-tennis-yellow">$2,999/month</div>
            </div>

            <ul className="space-y-4">
              {[
                "Full facility simulation",
                "Personalized nutrition delivery",
                "1-on-1 expert consultations",
                "Custom research analysis",
                "White-glove onboarding",
                "24/7 priority access"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-tennis-yellow/10 border border-tennis-yellow/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-tennis-yellow" />
                  </div>
                  <span className="text-gray-400">{feature}</span>
                </li>
              ))}
            </ul>

            <button className="mt-auto w-full py-3 px-6 rounded-xl font-bold transition-all bg-white/5 border border-white/10 text-white hover:bg-white/10 pt-8">
              Get Started
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Amenities;
