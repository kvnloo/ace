import React, { useState, useEffect, Suspense } from 'react';
import { View, FeatureData } from './types';
import NavBar from './components/NavBar';
import DeferredGuide from './components/DeferredGuide';
const CampusExperience = React.lazy(() => import('./components/CampusExperience'));
const Specifications = React.lazy(() => import('./components/Specifications'));
import AtlasLanding from './components/AtlasLanding';
const AtlasProduct = React.lazy(() => import('./components/AtlasProduct'));
import { campusNested, product } from './landing/public.ts';

type TransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [selectedFeature, setSelectedFeature] = useState<FeatureData | null>(null);\n  const [contactGoal, setContactGoal] = useState('');

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
    <div className="min-h-[100dvh] bg-[#071426] text-white selection:bg-tennis-yellow selection:text-tennis-dark font-sans">
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
            <Suspense fallback={<div className="w-full min-h-[calc(100dvh-72px)] bg-[#071426] grid place-items-center"><div className="ace-kicker">LOADING SPEC MATRIX</div></div>}>
              <Specifications />
            </Suspense>
          </div>
        )}

        {currentView === View.FACILITY_DEMO && (
          <div className="ace-route-enter ace-campus-shell w-full h-[calc(100dvh-72px)] relative overflow-hidden">
            <div className="absolute inset-0 z-0">
              <Suspense fallback={<div className="w-full h-full bg-[#071426] grid place-items-center"><div className="ace-kicker">LOADING CAMPUS SHELL</div></div>}>
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
            <div className="ace-contact-page" data-ace-reveal data-ace-section="Contact">
              <header className="ace-contact-head">
                <div><p className="ace-kicker">MOCK · DOES NOT SUBMIT</p><h1>Join <span>{product.name}.</span></h1></div>
                <p>Tell us where your work intersects the loop. This public pretotype does not transmit or store the form yet; the interface is here to make the intended collaboration surface concrete.</p>
              </header>

              <div className="ace-contact-layout">
                <aside className="ace-contact-context">
                  <span className="ace-stamp" data-stamp="VISION">HUMANS ARE INFRASTRUCTURE</span>
                  <h2>Bring a problem worth measuring.</h2>
                  <p>ACE is most interesting when a real goal, a real expert, a falsifiable hypothesis, and a repeatable measurement can share the same loop.</p>
                  <div className="ace-chip-grid">
                    {['ATHLETE','COACH','CLINICIAN','RESEARCHER','ENGINEER','PARTNER'].map((role)=><span key={role} className="ace-chip">{role}</span>)}
                  </div>
                </aside>

                <form className="ace-contact-form ace-contact-progressive" onSubmit={(e) => e.preventDefault()} aria-label="ACE interest form mock">
                  <div className="ace-field ace-goal-field">
                    <label htmlFor="ace-goal" className="ace-label">What do you want to improve?</label>
                    <textarea
                      id="ace-goal"
                      className="ace-textarea"
                      value={contactGoal}
                      onChange={(event) => setContactGoal(event.target.value)}
                      placeholder="A skill, plateau, research question, facility idea..."
                    />
                    <p className="ace-field-hint">Start with the human goal. ACE can organize context around it.</p>
                  </div>
                  {contactGoal.trim().length > 0 && (
                    <div className="ace-contact-followup" aria-live="polite">
                      <div className="ace-field"><label htmlFor="ace-interest" className="ace-label">Which perspective are you bringing?</label><select id="ace-interest" className="ace-select" defaultValue="Founding Member"><option>Founding Member</option><option>Coach / Clinician / Researcher</option><option>Technology Partner</option><option>Potential Investor</option></select></div>
                      <div className="ace-form-grid">
                        <div className="ace-field"><label htmlFor="ace-name" className="ace-label">Full name</label><input id="ace-name" type="text" className="ace-input" placeholder="Jane Doe" /></div>
                        <div className="ace-field"><label htmlFor="ace-email" className="ace-label">Email</label><input id="ace-email" type="email" className="ace-input" placeholder="jane@example.com" /></div>
                      </div>
                      <button type="button" className="ace-disabled-cta" aria-disabled="true">Waitlist integration planned</button>
                    </div>
                  )}
                  <div className="ace-contact-meta"><span>PRETOTYPE / NO SUBMISSION</span><span>NO MEDICAL OR PERFORMANCE CLAIM IMPLIED</span></div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      <DeferredGuide />
    </div>
  );
};
export default App;
