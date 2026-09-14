
import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { View, FeatureData } from './types';
import NavBar from './components/NavBar';
const PascalFacility = React.lazy(() => import('./components/PascalFacility'));
import AIChat from './components/AIChat';
import Specifications from './components/Specifications';
import AtlasLanding, { AtlasProduct } from './components/AtlasLanding';
import { campusNested, product } from './landing/public.ts';

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
              <AtlasLanding onChangeView={setCurrentView} />
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
                   <h2 className="text-3xl font-bold text-white drop-shadow-lg">{campusNested.title}</h2>
                   <p className="text-white/70 text-sm max-w-md drop-shadow-md mt-2">
                     {campusNested.body}<br/>
                     HUD is MOCK. CSS sketch if WebGL is blank. Not the {product.name} live twin.
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
              <AtlasProduct onChangeView={setCurrentView} />
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
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Join {product.name}</h2>
                        <p className="text-gray-400">Public pretotype landing for ATLAS — soil to cell. This form does not submit (MOCK).</p>
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
