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

  useEffect(() => {
    if (currentView !== View.FACILITY_DEMO) {
      setSelectedFeature(null);
    }
  }, [currentView]);

  const pageVariants = {
    initial: { opacity: 0, y: 16 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: -12, transition: { duration: 0.25 } },
  };

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-white selection:bg-tennis-yellow selection:text-tennis-dark font-sans">
      <NavBar currentView={currentView} onChangeView={setCurrentView} />

      <main className="relative w-full h-[100dvh] pt-[73px] overflow-hidden">
        <AnimatePresence mode="wait">

          {currentView === View.HOME && (
            <motion.div
              key="home"
              initial="initial"
              animate="enter"
              exit="exit"
              variants={pageVariants}
              className="h-full overflow-y-auto custom-scrollbar"
            >
              <AtlasLanding onChangeView={setCurrentView} />
            </motion.div>
          )}

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

          {currentView === View.FACILITY_DEMO && (
            <motion.div
              key="demo"
              initial="initial"
              animate="enter"
              exit="exit"
              variants={pageVariants}
              className="w-full h-full relative bg-gradient-to-b from-slate-900 to-black overflow-hidden"
            >
              <div className="absolute inset-0 z-0">
                <Suspense
                  fallback={
                    <div className="w-full h-full bg-[#0c0d0b] flex items-center justify-center text-white/40 font-mono text-xs tracking-widest">
                      LOADING CAMPUS SKETCH
                    </div>
                  }
                >
                  <PascalFacility onFeatureSelect={setSelectedFeature} />
                </Suspense>
              </div>

              <div className="absolute inset-0 z-10 pointer-events-none p-4 sm:p-6 flex flex-col justify-between">
                <div className="hidden md:block mt-4 max-w-lg">
                  <span className="text-[10px] font-mono tracking-[0.25em] text-tennis-yellow">VISION · PRETOTYPE</span>
                  <h2 className="text-3xl font-bold text-white drop-shadow-lg mt-2">{campusNested.title}</h2>
                  <p className="text-white/60 text-sm drop-shadow-md mt-2">
                    {campusNested.body}
                  </p>
                </div>

                <AnimatePresence>
                  {selectedFeature && (
                    <motion.div
                      initial={{ opacity: 0, y: 30, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.97 }}
                      className="pointer-events-auto self-end md:self-start md:max-w-sm w-full max-w-[calc(100vw-2rem)] bg-slate-950/90 backdrop-blur-xl border border-tennis-yellow/30 p-5 sm:p-6 rounded-2xl shadow-2xl mb-3 sm:mb-0"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-full bg-tennis-yellow/20 flex items-center justify-center text-2xl">
                          {selectedFeature.icon}
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedFeature(null)}
                          className="text-white/50 hover:text-white text-xs uppercase tracking-wider font-bold px-2 py-1 rounded-md"
                        >
                          Close
                        </button>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{selectedFeature.title}</h3>
                      <p className="text-gray-300 leading-relaxed mb-4">{selectedFeature.description}</p>
                      <button
                        type="button"
                        onClick={() => setCurrentView(View.SPECIFICATIONS)}
                        className="w-full py-3 bg-tennis-yellow text-tennis-dark font-bold rounded-lg hover:bg-white transition-colors"
                      >
                        View facility context
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {currentView === View.AMENITIES && (
            <motion.div
              key="amenities"
              initial="initial"
              animate="enter"
              exit="exit"
              variants={pageVariants}
              className="h-full overflow-y-auto custom-scrollbar pb-20 px-5 sm:px-6"
            >
              <AtlasProduct onChangeView={setCurrentView} />
            </motion.div>
          )}

          {currentView === View.INVEST && (
            <motion.div
              key="invest"
              initial="initial"
              animate="enter"
              exit="exit"
              variants={pageVariants}
              className="h-full overflow-y-auto custom-scrollbar pb-20 flex items-center justify-center px-5 sm:px-6"
            >
              <div className="max-w-2xl w-full bg-slate-900/60 border border-white/10 p-6 sm:p-8 md:p-12 rounded-3xl backdrop-blur-xl my-8">
                <div className="text-center mb-10">
                  <span className="text-[10px] font-mono tracking-[0.25em] text-orange-300">MOCK · DOES NOT SUBMIT</span>
                  <h2 className="text-3xl md:text-5xl font-bold mb-4 mt-3">Join {product.name}</h2>
                  <p className="text-gray-400">
                    Tell us which part of the ACE feedback loop matters to you. This public pretotype does not send or store this form yet.
                  </p>
                </div>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()} aria-label="ACE interest form mock">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="ace-name" className="text-sm font-bold text-gray-300">Full Name</label>
                      <input id="ace-name" type="text" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-tennis-yellow transition-colors" placeholder="Jane Doe" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="ace-email" className="text-sm font-bold text-gray-300">Email Address</label>
                      <input id="ace-email" type="email" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-tennis-yellow transition-colors" placeholder="jane@example.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="ace-interest" className="text-sm font-bold text-gray-300">Interest</label>
                    <select id="ace-interest" className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-tennis-yellow transition-colors text-gray-300">
                      <option>Founding Member</option>
                      <option>Coach / Clinician / Researcher</option>
                      <option>Technology Partner</option>
                      <option>Potential Investor</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="ace-message" className="text-sm font-bold text-gray-300">What would you want ACE to help you improve?</label>
                    <textarea id="ace-message" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-tennis-yellow transition-colors h-32 resize-y" placeholder="A skill, plateau, research question, facility idea..." />
                  </div>

                  <button
                    type="button"
                    className="w-full border border-tennis-yellow/50 text-tennis-yellow font-bold text-lg py-4 rounded-xl cursor-not-allowed opacity-70"
                    aria-disabled="true"
                  >
                    Waitlist integration planned
                  </button>
                </form>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <AIChat />
    </div>
  );
};

export default App;
