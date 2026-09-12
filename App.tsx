
import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { View, FeatureData } from './types';
import NavBar from './components/NavBar';
const PascalFacility = React.lazy(() => import('./components/PascalFacility'));
import AIChat from './components/AIChat';
import Specifications from './components/Specifications';
import { 
  Zap, 
  Cpu, 
  Sprout, 
  ArrowRight,
  Layers,
  Wind,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [selectedFeature, setSelectedFeature] = useState<FeatureData | null>(null);

  // Reset selected feature when leaving demo view
  useEffect(() => {
    if (currentView !== View.FACILITY_DEMO) {
      setSelectedFeature(null);
    }
  }, [currentView]);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-tennis-yellow selection:text-tennis-dark font-sans">
      <NavBar currentView={currentView} onChangeView={setCurrentView} />

      <main className="relative w-full h-screen pt-20 overflow-hidden">
        <AnimatePresence mode="wait">
          
          {/* HOME VIEW */}
          {currentView === View.HOME && (
            <motion.div 
              key="home"
              initial="initial"
              animate="enter"
              exit="exit"
              variants={pageVariants}
              className="h-full overflow-y-auto custom-scrollbar pb-20"
            >
              {/* Hero Section */}
              <div className="relative h-[90vh] flex items-center justify-center px-6 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1622163642998-1ea36b1dde3b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                
                <div className="relative z-10 max-w-4xl text-center">
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-tennis-yellow/30 bg-tennis-yellow/10 text-tennis-yellow text-sm font-medium mb-6"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Naperville spec · public 3D pretotype</span>
                  </motion.div>
                  
                  <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-6 leading-tight"
                  >
                    GRASS. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-tennis-yellow to-white">AUTONOMOUS.</span> <br />
                    PERFECTION.
                  </motion.h1>

                  <motion.p 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
                  >
                    Indoor grass courts with a third-floor lab that grows the surface.
                    The 3D map is a sketch of the Naperville origin spec — not a live twin.
                  </motion.p>

                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                  >
                    <button 
                      onClick={() => setCurrentView(View.FACILITY_DEMO)}
                      className="px-8 py-4 bg-tennis-yellow text-tennis-dark font-bold rounded-full hover:bg-white transition-all flex items-center gap-2 group"
                    >
                      Explore 3D Demo
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={() => setCurrentView(View.AMENITIES)}
                      className="px-8 py-4 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-all backdrop-blur-sm"
                    >
                      View Amenities
                    </button>
                  </motion.div>
                </div>
              </div>

              {/* Statistics Teaser */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-6 py-20 border-t border-white/10">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] font-mono tracking-widest text-tennis-yellow/80">SPEC</span>
                  <h3 className="text-2xl font-bold mb-2 mt-3">24 tennis courts</h3>
                  <p className="text-gray-400">Hard, clay, grass, and wood on the ground floor. Counts from the origin spec — not an even 6/6/6/6 split unless the spec says so.</p>
                </div>
                <div className="p-6 rounded-2xl bg-[#0c0d0b] border border-tennis-yellow/40">
                  <span className="text-[10px] font-mono tracking-widest text-tennis-yellow">PLANNED</span>
                  <h3 className="text-2xl font-bold mb-2 mt-3">Grass lab</h3>
                  <p className="text-gray-400">Third floor grows modular turf: <span className="text-white">500 m² per section</span> in the origin. Section count is unspecified. Fast swap is a goal, not a receipt.</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] font-mono tracking-widest text-white/50">MOCK</span>
                  <h3 className="text-2xl font-bold mb-2 mt-3">Ops overlay</h3>
                  <p className="text-gray-400">Biomechanics HUD and 60 FPS numbers are theater on this demo. The court is the product; chrome stays thin.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* SPECIFICATIONS VIEW */}
          {currentView === View.SPECIFICATIONS && (
             <motion.div 
              key="specs"
              initial="initial"
              animate="enter"
              exit="exit"
              variants={pageVariants}
              className="h-full overflow-y-auto custom-scrollbar pb-20"
            >
              <Specifications />
            </motion.div>
          )}

          {/* 3D FACILITY DEMO */}
          {currentView === View.FACILITY_DEMO && (
            <motion.div 
              key="demo"
              initial="initial"
              animate="enter"
              exit="exit"
              variants={pageVariants}
              className="w-full h-full relative bg-gradient-to-b from-slate-900 to-black"
            >
              <div className="absolute inset-0 z-0">
                <Suspense fallback={<div className="w-full h-full bg-[#0c0d0b]" />}>
                  <PascalFacility onFeatureSelect={setSelectedFeature} />
                </Suspense>
              </div>
              
              {/* HUD Layer */}
              <div className="absolute inset-0 z-10 pointer-events-none p-6 flex flex-col justify-between">
                <div className="mt-12">
                   <h2 className="text-3xl font-bold text-white drop-shadow-lg">Facility sketch</h2>
                   <p className="text-white/70 text-sm max-w-md drop-shadow-md mt-2">
                     Naperville origin · Pascal nodes · 24 tennis · third-floor grass lab<br/>
                     Envelope 140×120 m is inferred. HUD is MOCK. CSS court if WebGL is blank.
                   </p>
                </div>

                {/* Selected Feature Info Card */}
                <AnimatePresence>
                  {selectedFeature && (
                    <motion.div 
                      initial={{ opacity: 0, y: 50, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.9 }}
                      className="pointer-events-auto self-end md:self-start md:max-w-sm w-full bg-slate-900/90 backdrop-blur-xl border border-tennis-yellow/30 p-6 rounded-2xl shadow-2xl"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-full bg-tennis-yellow/20 flex items-center justify-center text-2xl">
                          {selectedFeature.icon}
                        </div>
                        <button 
                          onClick={() => setSelectedFeature(null)}
                          className="text-white/50 hover:text-white text-sm uppercase tracking-wider font-bold"
                        >
                          Close
                        </button>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{selectedFeature.title}</h3>
                      <p className="text-gray-300 leading-relaxed mb-4">{selectedFeature.description}</p>
                      <button 
                        onClick={() => setCurrentView(View.SPECIFICATIONS)}
                        className="w-full py-3 bg-tennis-yellow text-tennis-dark font-bold rounded-lg hover:bg-white transition-colors"
                      >
                        View Full Specs
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* AMENITIES VIEW */}
          {currentView === View.AMENITIES && (
            <motion.div 
              key="amenities"
              initial="initial"
              animate="enter"
              exit="exit"
              variants={pageVariants}
              className="h-full overflow-y-auto custom-scrollbar pb-20 px-6"
            >
              <div className="max-w-7xl mx-auto pt-10">
                <h2 className="text-4xl font-bold mb-12 border-b border-white/10 pb-6">Facility Amenities</h2>
                
                <div className="space-y-24">
                  
                  {/* 1. Vertical Grass Lab */}
                  <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-6">
                      <div className="w-16 h-16 rounded-2xl bg-green-900/30 flex items-center justify-center text-tennis-yellow">
                        <Sprout className="w-8 h-8" />
                      </div>
                      <h3 className="text-3xl font-bold">Level 3: Grass lab</h3>
                      <p className="text-gray-400 text-lg leading-relaxed">
                        Origin spec: <span className="text-white">500 m² per section</span> on the third floor. How many sections is not specified — an earlier page inferred four (2,000 m²). Hydroponics and patch transport are <span className="text-tennis-yellow font-mono text-sm">PLANNED</span>. Fast turf swap is a pretotype goal, not a measured 60-minute receipt.
                      </p>
                      <ul className="space-y-3 text-gray-300">
                        <li className="flex items-center gap-2"><div className="w-2 h-2 bg-tennis-yellow rounded-full"/> 500 m² per section (origin)</li>
                        <li className="flex items-center gap-2"><div className="w-2 h-2 bg-tennis-yellow rounded-full"/> Patch transport — PLANNED</li>
                        <li className="flex items-center gap-2"><div className="w-2 h-2 bg-tennis-yellow rounded-full"/> Courts below inherit the crop, not a painted texture</li>
                      </ul>
                    </div>
                    <div className="flex-1 h-[400px] rounded-3xl overflow-hidden relative group border border-tennis-yellow/20 bg-gradient-to-br from-[#1a3d24] via-[#243d28] to-[#0c0d0b]">
                       <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent 0, transparent 18px, rgba(199,237,36,0.08) 18px, rgba(199,237,36,0.08) 20px), repeating-linear-gradient(0deg, transparent 0, transparent 18px, rgba(199,237,36,0.06) 18px, rgba(199,237,36,0.06) 20px)' }} />
                       <div className="absolute inset-0 flex items-center justify-center">
                         <span className="px-4 py-2 bg-black/50 backdrop-blur-md rounded-lg border border-white/10 text-sm font-mono text-tennis-yellow">PLANNED · GRASS LAB</span>
                       </div>
                    </div>
                  </div>

                  {/* 2. The Racquet Ecosystem */}
                  <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                    <div className="flex-1 space-y-6">
                       <div className="w-16 h-16 rounded-2xl bg-blue-900/30 flex items-center justify-center text-blue-400">
                        <Layers className="w-8 h-8" />
                      </div>
                      <h3 className="text-3xl font-bold">Multi-Sport Ecosystem</h3>
                      <p className="text-gray-400 text-lg leading-relaxed">
                        Spanning the Ground, 1st, and 2nd floors, we offer a comprehensive racquet experience. 
                        From the high-speed action of Badminton and Table Tennis on the Mezzanine to the social atmosphere of Pickleball and the historic elegance of Real Tennis on the upper deck.
                      </p>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="p-4 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <span className="block font-bold text-white mb-1">Ground Floor</span>
                            <span className="text-gray-400 text-xs">24 Tennis Courts (Hard, Clay, Grass, Wood)</span>
                          </div>
                          <div className="p-4 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <span className="block font-bold text-white mb-1">First Floor</span>
                            <span className="text-gray-400 text-xs">16 Badminton, 4 Squash, 16 Table Tennis</span>
                          </div>
                          <div className="p-4 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-colors md:col-span-2">
                            <span className="block font-bold text-white mb-1">Second Floor</span>
                            <span className="text-gray-400 text-xs">8 Pickleball Courts, 1 Real Tennis Court</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex-1 h-[400px] rounded-3xl overflow-hidden relative group border border-white/10 bg-gradient-to-br from-[#36573a] via-[#243028] to-[#0c0d0b]">
                        <div className="absolute inset-[12%] border border-white/20 rounded-sm" />
                        <div className="absolute inset-0 flex items-center justify-center">
                         <span className="px-4 py-2 bg-black/50 backdrop-blur-md rounded-lg border border-white/10 text-sm font-mono text-white/80">MOCK · COURT SKETCH</span>
                       </div>
                    </div>
                  </div>

                  {/* 3. Ops overlay — PLANNED, not a live BMS */}
                  <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-6">
                       <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center text-tennis-yellow">
                        <Cpu className="w-8 h-8" />
                      </div>
                      <h3 className="text-3xl font-bold">Ops overlay</h3>
                      <p className="text-gray-400 text-lg leading-relaxed">
                        BMS, drones, and biometric doors are <span className="text-tennis-yellow font-mono text-sm">PLANNED</span> theater on this pretotype. This Pages site does not run a facility. The court is the product; ops chrome stays thin.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
                            <Wind className="w-5 h-5 text-tennis-yellow" />
                            <div>
                                <h4 className="font-bold text-white">Climate loop</h4>
                                <p className="text-xs text-gray-400">PLANNED — solar + HVAC language</p>
                            </div>
                        </div>
                         <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-tennis-yellow" />
                            <div>
                                <h4 className="font-bold text-white">Access overlay</h4>
                                <p className="text-xs text-gray-400">MOCK — not a wired door stack</p>
                            </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 h-[400px] rounded-3xl overflow-hidden relative group border border-white/10 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#0c0d0b]">
                       <div className="absolute inset-[14%] border border-dashed border-white/15 rounded-xl" />
                       <div className="absolute inset-0 flex items-center justify-center">
                         <span className="px-4 py-2 bg-black/50 backdrop-blur-md rounded-lg border border-white/10 text-sm font-mono text-white/80">PLANNED · OPS OVERLAY</span>
                       </div>
                    </div>
                  </div>

                   {/* 4. Pro shop — origin; recovery chrome is MOCK */}
                  <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                    <div className="flex-1 space-y-6">
                       <div className="w-16 h-16 rounded-2xl bg-orange-900/30 flex items-center justify-center text-orange-400">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                      <h3 className="text-3xl font-bold">Pro shop</h3>
                      <p className="text-gray-400 text-lg leading-relaxed">
                        Origin spec includes a ground-floor pro shop and lockers. Sensor-managed bathrooms and automated emergency dispatch are <span className="text-orange-300 font-mono text-sm">MOCK</span>. The court is the product; member chrome stays thin.
                      </p>
                       <ul className="space-y-3 text-gray-300">
                        <li className="flex items-center gap-2"><div className="w-2 h-2 bg-orange-400 rounded-full"/> Pro shop — origin</li>
                        <li className="flex items-center gap-2"><div className="w-2 h-2 bg-orange-400 rounded-full"/> Lockers — origin</li>
                        <li className="flex items-center gap-2"><div className="w-2 h-2 bg-orange-400 rounded-full"/> App booking — MOCK</li>
                      </ul>
                    </div>
                    <div className="flex-1 h-[400px] rounded-3xl overflow-hidden relative group border border-white/10 bg-gradient-to-br from-[#3f2a1c] via-[#1c1410] to-[#0c0d0b]">
                       <div className="absolute inset-[18%] border border-white/15 rounded-sm" />
                       <div className="absolute inset-0 flex items-center justify-center">
                         <span className="px-4 py-2 bg-black/50 backdrop-blur-md rounded-lg border border-white/10 text-sm font-mono text-white/80">ORIGIN · PRO SHOP</span>
                       </div>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          )}

          {/* INVEST VIEW */}
          {currentView === View.INVEST && (
             <motion.div 
              key="invest"
              initial="initial"
              animate="enter"
              exit="exit"
              variants={pageVariants}
              className="h-full overflow-y-auto custom-scrollbar pb-20 flex items-center justify-center px-6"
            >
                <div className="max-w-2xl w-full bg-slate-900/50 border border-white/10 p-8 md:p-12 rounded-3xl backdrop-blur-xl">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Join the pretotype</h2>
                        <p className="text-gray-400">Origin spec is Naperville. This form does not submit (MOCK). Other cities named here are a pitch, not a second facility spec.</p>
                    </div>

                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-300">Full Name</label>
                                <input type="text" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-tennis-yellow transition-colors" placeholder="Jane Doe" />
                             </div>
                             <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-300">Email Address</label>
                                <input type="email" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-tennis-yellow transition-colors" placeholder="jane@example.com" />
                             </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300">Interest Level</label>
                            <select className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-tennis-yellow transition-colors text-gray-300">
                                <option>Potential Investor</option>
                                <option>Founding Member</option>
                                <option>Technology Partner</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                             <label className="text-sm font-bold text-gray-300">Message</label>
                             <textarea className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-tennis-yellow transition-colors h-32" placeholder="Tell us about yourself..."></textarea>
                        </div>
                        
                        <button className="w-full bg-tennis-yellow text-tennis-dark font-bold text-lg py-4 rounded-xl hover:bg-white transition-all">
                            Request Pitch Deck
                        </button>
                    </form>
                </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Global Elements */}
      <AIChat />
    </div>
  );
};

export default App;
