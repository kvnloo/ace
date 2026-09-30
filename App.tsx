import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { View, FeatureData } from './types';
import NavBar from './components/NavBar';
const PascalFacility = React.lazy(() => import('./components/PascalFacility'));
const AIChat = React.lazy(() => import('./components/AIChat'));
const Specifications = React.lazy(() => import('./components/Specifications'));
import AtlasLanding, { AtlasProduct } from './components/AtlasLanding';
import { campusNested, product } from './landing/public.ts';

type TransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [selectedFeature, setSelectedFeature] = useState<FeatureData | null>(null);

  useEffect(() => {
    document.documentElement.dataset.aceView = currentView.toLowerCase();
    if (currentView !== View.FACILITY_DEMO) {
      setSelectedFeature(null);
    }
  }, [currentView]);

  const navigate = React.useCallback((nextView: View) => {
    if (nextView === currentView) {
      window.__ACE_LENIS__?.scrollTo(0, { immediate: false });
      return;
    }

    const update = () => {
      setCurrentView(nextView);
      setSelectedFeature(null);
      requestAnimationFrame(() => {
        if (window.__ACE_LENIS__) {
          window.__ACE_LENIS__.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo({ top: 0, left: 0 });
        }
      });
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const doc = document as TransitionDocument;
    if (!reduced && doc.startViewTransition) {
      doc.startViewTransition(update);
    } else {
      update();
    }
  }, [currentView]);

  const pageVariants = {
    initial: { opacity: 0, y: 8 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: -6, transition: { duration: 0.16 } },
  };

  return (
    <div className="min-h-[100dvh] bg-[#050806] text-white selection:bg-tennis-yellow selection:text-tennis-dark font-sans">
      <NavBar currentView={currentView} onChangeView={navigate} />

      <main className="relative w-full min-h-[100dvh] pt-[72px] overflow-x-hidden">
        <AnimatePresence mode="wait">
          {currentView === View.HOME && (
            <motion.div
              key="home"
              initial="initial"
              animate="enter"
              exit="exit"
              variants={pageVariants}
              className="min-h-[calc(100dvh-72px)]"
            >
              <AtlasLanding onChangeView={navigate} />
            </motion.div>
          )}

          {currentView === View.SPECIFICATIONS && (
            <motion.div
              key="specs"
              initial="initial"
              animate="enter"
              exit="exit"
              variants={pageVariants}
              className="min-h-[calc(100dvh-72px)]"
            >
              <Suspense
                fallback={
                  <div className="w-full min-h-[calc(100dvh-72px)] bg-[#050806] grid place-items-center">
                    <div className="ace-kicker">LOADING SPEC MATRIX</div>
                  </div>
                }
              >
                <Specifications />
              </Suspense>
            </motion.div>
          )}

          {currentView === View.FACILITY_DEMO && (
            <motion.div
              key="demo"
              initial="initial"
              animate="enter"
              exit="exit"
              variants={pageVariants}
              className="ace-campus-shell w-full h-[calc(100dvh-72px)] relative overflow-hidden"
            >
              <div className="absolute inset-0 z-0">
                <Suspense
                  fallback={
                    <div className="w-full h-full bg-[#050806] grid place-items-center">
                      <div className="ace-kicker">LOADING CAMPUS TWIN</div>
                    </div>
                  }
                >
                  <PascalFacility onFeatureSelect={setSelectedFeature} />
                </Suspense>
              </div>

              <div className="ace-campus-copy hidden md:block" data-ace-reveal data-ace-section="Campus">
                <span className="ace-stamp" data-stamp="VISION">VISION · PRETOTYPE</span>
                <h2>{campusNested.title}</h2>
                <p>{campusNested.body}</p>
              </div>

              <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-end">
                <AnimatePresence>
                  {selectedFeature && (
                    <motion.article
                      initial={{ opacity: 0, y: 26, scale: 0.985 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 16, scale: 0.985 }}
                      className="ace-feature-card"
                    >
                      <div className="ace-feature-card-top">
                        <span className="ace-feature-card-icon" aria-hidden="true">{selectedFeature.icon}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedFeature(null)}
                          className="ace-feature-close"
                        >
                          Close
                        </button>
                      </div>
                      <h3>{selectedFeature.title}</h3>
                      <p>{selectedFeature.description}</p>
                      <button
                        type="button"
                        onClick={() => navigate(View.SPECIFICATIONS)}
                        className="ace-action-primary"
                      >
                        View facility context
                      </button>
                    </motion.article>
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
              className="ace-page min-h-[calc(100dvh-72px)] px-4 sm:px-6"
            >
              <AtlasProduct onChangeView={navigate} />
            </motion.div>
          )}

          {currentView === View.INVEST && (
            <motion.div
              key="invest"
              initial="initial"
              animate="enter"
              exit="exit"
              variants={pageVariants}
              className="ace-page min-h-[calc(100dvh-72px)]"
            >
              <div className="ace-contact-page" data-ace-reveal data-ace-section="Contact">
                <header className="ace-contact-head">
                  <div>
                    <p className="ace-kicker">MOCK · DOES NOT SUBMIT</p>
                    <h1>
                      Join <span>{product.name}.</span>
                    </h1>
                  </div>
                  <p>
                    Tell us where your work intersects the loop. This public pretotype does not transmit or store the form yet; the interface is here to make the intended collaboration surface concrete.
                  </p>
                </header>

                <div className="ace-contact-layout">
                  <aside className="ace-contact-context">
                    <span className="ace-stamp" data-stamp="VISION">HUMANS ARE INFRASTRUCTURE</span>
                    <h2>Bring a problem worth measuring.</h2>
                    <p>
                      ACE is most interesting when a real goal, a real expert, a falsifiable hypothesis, and a repeatable measurement can share the same loop.
                    </p>
                    <div className="ace-chip-grid">
                      <span className="ace-chip">ATHLETE</span>
                      <span className="ace-chip">COACH</span>
                      <span className="ace-chip">CLINICIAN</span>
                      <span className="ace-chip">RESEARCHER</span>
                      <span className="ace-chip">ENGINEER</span>
                      <span className="ace-chip">PARTNER</span>
                    </div>
                  </aside>

                  <form className="ace-contact-form" onSubmit={(e) => e.preventDefault()} aria-label="ACE interest form mock">
                    <div className="ace-form-grid">
                      <div className="ace-field">
                        <label htmlFor="ace-name" className="ace-label">Full name</label>
                        <input id="ace-name" type="text" className="ace-input" placeholder="Jane Doe" />
                      </div>
                      <div className="ace-field">
                        <label htmlFor="ace-email" className="ace-label">Email</label>
                        <input id="ace-email" type="email" className="ace-input" placeholder="jane@example.com" />
                      </div>
                    </div>

                    <div className="ace-field">
                      <label htmlFor="ace-interest" className="ace-label">Role / interest</label>
                      <select id="ace-interest" className="ace-select" defaultValue="Founding Member">
                        <option>Founding Member</option>
                        <option>Coach / Clinician / Researcher</option>
                        <option>Technology Partner</option>
                        <option>Potential Investor</option>
                      </select>
                    </div>

                    <div className="ace-field">
                      <label htmlFor="ace-message" className="ace-label">What would you want ACE to help you improve?</label>
                      <textarea id="ace-message" className="ace-textarea" placeholder="A skill, plateau, research question, facility idea..." />
                    </div>

                    <button type="button" className="ace-disabled-cta" aria-disabled="true">
                      Waitlist integration planned
                    </button>

                    <div className="ace-contact-meta">
                      <span>PRETOTYPE / NO SUBMISSION</span>
                      <span>NO MEDICAL OR PERFORMANCE CLAIM IMPLIED</span>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Suspense fallback={null}><AIChat /></Suspense>
    </div>
  );
};

export default App;
