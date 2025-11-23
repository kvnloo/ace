
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { View, FeatureData } from './types';
import NavBar from './components/NavBar';
import ThreeSceneWrapper from './components/ThreeSceneWrapper';
import AIChat from './components/AIChat';
import Specifications from './components/Specifications';
import Amenities from './components/Amenities';
import ThreeSceneDiagnostic from './components/ThreeSceneDiagnostic';
import DebugLogger from './components/DebugLogger';
import CourtNavigationUI from './components/CourtNavigationUI';
import LoadingScreen from './components/loading/LoadingScreen';
import { useLoading } from './components/loading/LoadingProvider';
import {
  Zap,
  Activity,
  Camera,
  Cpu,
  Sprout,
  Users,
  ArrowRight,
  PlayCircle,
  Layers,
  Wind,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [selectedFeature, setSelectedFeature] = useState<FeatureData | null>(null);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [shouldShowLoading, setShouldShowLoading] = useState(false);
  const { isLoading } = useLoading();

  // Synchronize view with URL
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/court')) {
      setCurrentView(View.FACILITY_DEMO);
    } else if (path.includes('/specs')) {
      setCurrentView(View.SPECIFICATIONS);
    } else if (path.includes('/amenities')) {
      setCurrentView(View.AMENITIES);
    } else if (path.includes('/invest')) {
      setCurrentView(View.INVEST);
    }
  }, []);

  // Update URL when view changes
  useEffect(() => {
    let path = '/';
    switch (currentView) {
      case View.FACILITY_DEMO:
        path = '/court';
        break;
      case View.SPECIFICATIONS:
        path = '/specs';
        break;
      case View.AMENITIES:
        path = '/amenities';
        break;
      case View.INVEST:
        path = '/invest';
        break;
      default:
        path = '/';
    }
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  }, [currentView]);

  // Reset selected feature when leaving demo view
  useEffect(() => {
    if (currentView !== View.FACILITY_DEMO) {
      setSelectedFeature(null);
    }
  }, [currentView]);

  // Show loading screen only when entering court view
  useEffect(() => {
    if (currentView === View.FACILITY_DEMO && !loadingComplete) {
      setShouldShowLoading(true);
    } else {
      setShouldShowLoading(false);
    }
  }, [currentView, loadingComplete]);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-tennis-yellow selection:text-tennis-dark font-sans">
      {/* Loading Screen - Only show when entering court view */}
      <AnimatePresence>
        {shouldShowLoading && !loadingComplete && (
          <LoadingScreen
            onComplete={() => setLoadingComplete(true)}
            minimumDisplayTime={2000}
            showFPSMonitor={true}
          />
        )}
      </AnimatePresence>

      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-tennis-yellow focus:text-tennis-dark focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold">
        Skip to main content
      </a>
      <NavBar currentView={currentView} onChangeView={setCurrentView} />

      <main id="main-content" className="relative w-full h-screen pt-20 overflow-hidden">
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
              <section aria-label="Hero" className="relative h-[90vh] flex items-center justify-center px-6 overflow-hidden">
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
                    <span>The Future of Racket Sports & Human Performance</span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-6 leading-tight"
                  >
                    AUTONOMOUS. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-tennis-yellow to-white">INTEGRATED.</span> <br />
                    OPTIMIZED.
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-gray-100 mb-10 max-w-2xl mx-auto leading-relaxed"
                  >
                    The world's first autonomous racket sports and health optimization facility with integrated vertical farming,
                    AI coaching, and performance tracking across 147 biomarkers.
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
                      aria-label="Navigate to 3D facility demo"
                    >
                      Explore 3D Demo
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={() => setCurrentView(View.AMENITIES)}
                      className="px-8 py-4 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-all backdrop-blur-sm"
                      aria-label="View facility amenities and features"
                    >
                      View Amenities
                    </button>
                  </motion.div>
                </div>
              </section>

              {/* 4-Pillar Feature Showcase */}
              <section aria-label="Features" className="max-w-7xl mx-auto px-6 py-20 border-t border-white/10">
                <div className="mb-16 text-center">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4">Integrated <span className="text-tennis-yellow">Platform</span></h2>
                  <p className="text-xl text-gray-200 max-w-2xl mx-auto">Four pillars of autonomous optimization working together</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {/* Multi-Sport Excellence */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <Activity className="w-10 h-10 text-green-400 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Multi-Sport Excellence</h3>
                    <p className="text-gray-200 mb-4">Tennis, Pickleball, Badminton, Squash with computer vision coaching and real-time biomechanics analysis</p>
                    <ul className="space-y-2 text-sm text-gray-100">
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-tennis-yellow" />
                        <span>RGB + depth cameras</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-tennis-yellow" />
                        <span>Multi-surface courts</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-tennis-yellow" />
                        <span>Indoor grass courts (first of its kind)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-tennis-yellow" />
                        <span>AI coaching feedback</span>
                      </li>
                    </ul>
                  </div>

                  {/* APEX Performance */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <Users className="w-10 h-10 text-red-400 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">APEX Performance</h3>
                    <p className="text-gray-200 mb-4">147 biomarkers tracked daily with AI-driven protocols and Blueprint-style health optimization</p>
                    <ul className="space-y-2 text-sm text-gray-100">
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-tennis-yellow" />
                        <span>VO₂ Max +28% avg</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-tennis-yellow" />
                        <span>Sleep efficiency 94%</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-tennis-yellow" />
                        <span>247+ studies/day</span>
                      </li>
                    </ul>
                  </div>

                  {/* Vertical Farm */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <Sprout className="w-10 h-10 text-emerald-400 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Vertical Farm</h3>
                    <p className="text-gray-200 mb-4">Personalized nutrition grown on-site with 95% water efficiency and zero pesticides</p>
                    <ul className="space-y-2 text-sm text-gray-100">
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-tennis-yellow" />
                        <span>100% renewable energy</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-tennis-yellow" />
                        <span>Genetic-optimized crops</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-tennis-yellow" />
                        <span>Farm-to-table delivery</span>
                      </li>
                    </ul>
                  </div>

                  {/* Autonomous Operations */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <Cpu className="w-10 h-10 text-indigo-400 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Autonomous Operations</h3>
                    <p className="text-gray-200 mb-4">Digital twin control with multi-agent scheduling, biometric access, and smart energy management</p>
                    <ul className="space-y-2 text-sm text-gray-100">
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-tennis-yellow" />
                        <span>1000+ IoT sensors</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-tennis-yellow" />
                        <span>Unity/Three.js twin</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-tennis-yellow" />
                        <span>Robotic maintenance</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>
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
              <ThreeSceneDiagnostic />
              <div className="absolute inset-0 z-0">
                <ThreeSceneWrapper onFeatureSelect={setSelectedFeature} />
              {/* Court Navigation and Visualization Controls */}
              <CourtNavigationUI />

              </div>

              {/* HUD Layer */}
              <div className="absolute inset-0 z-10 pointer-events-none p-6 flex flex-col justify-between">
                <div className="mt-12">
                  <h2 className="text-3xl font-bold text-white drop-shadow-lg">Facility Interactive Map</h2>
                  <p className="text-white/90 text-sm max-w-md drop-shadow-md mt-2">
                    24 Courts • Vertical Farm • Performance Gym <br />
                    Rotate the view to explore the entire complex.
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
                          className="text-white/80 hover:text-white text-sm uppercase tracking-wider font-bold"
                        >
                          Close
                        </button>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{selectedFeature.title}</h3>
                      <p className="text-gray-100 leading-relaxed mb-4">{selectedFeature.description}</p>
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
              className="h-full overflow-y-auto custom-scrollbar pb-20"
            >
              <Amenities />
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
                  <h2 className="text-3xl md:text-5xl font-bold mb-4">Join the Revolution</h2>
                  <p className="text-gray-200">We are raising Series A funding to build the pilot facility in Austin, Texas.</p>
                </div>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-100">Full Name</label>
                      <input type="text" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-tennis-yellow transition-colors" placeholder="Jane Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-100">Email Address</label>
                      <input type="email" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-tennis-yellow transition-colors" placeholder="jane@example.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-100">Interest Level</label>
                    <select className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-tennis-yellow transition-colors text-gray-100">
                      <option>Potential Investor</option>
                      <option>Founding Member</option>
                      <option>Technology Partner</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-100">Message</label>
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
      {/* <DebugLogger enabled={true} showPerformance={true} /> */}
    </div>
  );
};

export default App;
