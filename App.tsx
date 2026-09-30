import React, { useState, useEffect, Suspense } from 'react';
import { View, FeatureData } from './types';
import NavBar from './components/NavBar';
import DeferredGuide from './components/DeferredGuide';
import ContactExperience from './components/ContactExperience';
const CampusExperience = React.lazy(() => import('./components/CampusExperience'));
const Specifications = React.lazy(() => import('./components/Specifications'));
import AtlasLanding from './components/AtlasLanding';
const AtlasProduct = React.lazy(() => import('./components/AtlasProduct'));
import { campusNested } from './landing/public.ts';

type TransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [selectedFeature, setSelectedFeature] = useState<FeatureData | null>(null);

  useEffect(() => {
    document.documentElement.dataset.aceView = currentView.toLowerCase();
    if (currentView !== View.FACILITY_DEMO) setSelectedFeature(null);
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
        if (window.__ACE_LENIS__) window.__ACE_LENIS__.scrollTo(0, { immediate: true });
        else window.scrollTo({ top: 0, left: 0 });
      });
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const doc = document as TransitionDocument;
    if (!reduced && doc.startViewTransition) doc.startViewTransition(update);
    else update();
  }, [currentView]);

  return (
    <div className="min-h-[100dvh] bg-[#050806] text-white selection:bg-tennis-yellow selection:text-tennis-dark font-sans">
      <a className="ace-skip-link" href="#ace-main">Skip to content</a>
      <NavBar currentView={currentView} onChangeView={navigate} />

      <main id="ace-main" className="relative w-full min-h-[100dvh] pt-[72px] overflow-x-hidden">
        {currentView === View.HOME && (
          <div className="ace-route-enter min-h-[calc(100dvh-72px)]">
            <AtlasLanding onChangeView={navigate} />
          </div>
        )}

        {currentView === View.SPECIFICATIONS && (
          <div className="ace-route-enter min-h-[calc(100dvh-72px)]">
            <Suspense fallback={<div className="w-full min-h-[calc(100dvh-72px)] bg-[#050806] grid place-items-center"><div className="ace-kicker">LOADING SPEC MATRIX</div></div>}>
              <Specifications />
            </Suspense>
          </div>
        )}

        {currentView === View.FACILITY_DEMO && (
          <div className="ace-route-enter ace-campus-shell w-full h-[calc(100dvh-72px)] relative overflow-hidden">
            <div className="absolute inset-0 z-0">
              <Suspense fallback={<div className="w-full h-full bg-[#050806] grid place-items-center"><div className="ace-kicker">LOADING CAMPUS SHELL</div></div>}>
                <CampusExperience onFeatureSelect={setSelectedFeature} />
              </Suspense>
            </div>

            <div className="ace-campus-copy hidden md:block" data-ace-reveal data-ace-section="Campus">
              <span className="ace-stamp" data-stamp="VISION">VISION · PRETOTYPE</span>
              <h2>{campusNested.title}</h2>
              <p>{campusNested.body}</p>
            </div>

            <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-end">
              {selectedFeature && (
                <article className="ace-feature-card ace-feature-card-enter">
                  <div className="ace-feature-card-top">
                    <span className="ace-feature-card-marker" aria-hidden="true"><span /></span>
                    <button type="button" onClick={() => setSelectedFeature(null)} className="ace-feature-close">Close</button>
                  </div>
                  <h3>{selectedFeature.title}</h3>
                  <p>{selectedFeature.description}</p>
                  <button type="button" onClick={() => navigate(View.SPECIFICATIONS)} className="ace-action-primary">View facility context</button>
                </article>
              )}
            </div>
          </div>
        )}

        {currentView === View.AMENITIES && (
          <div className="ace-route-enter ace-page min-h-[calc(100dvh-72px)] px-4 sm:px-6">
            <Suspense fallback={<div className="min-h-[70vh] grid place-items-center"><div className="ace-kicker">LOADING SYSTEM MAP</div></div>}><AtlasProduct onChangeView={navigate} /></Suspense>
          </div>
        )}

        {currentView === View.INVEST && (
          <div className="ace-route-enter ace-page min-h-[calc(100dvh-72px)]">
            <ContactExperience />
          </div>
        )}
      </main>

      <DeferredGuide />
    </div>
  );
};
export default App;
