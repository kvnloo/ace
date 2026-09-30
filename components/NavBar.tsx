import React from 'react';
import { Menu, X } from 'lucide-react';
import { View } from '../types';

interface NavBarProps {
  currentView: View;
  onChangeView: (view: View) => void;
}

const fallbackSection: Record<View, string> = {
  [View.HOME]: 'Manifesto',
  [View.AMENITIES]: 'System',
  [View.SPECIFICATIONS]: 'Spec',
  [View.FACILITY_DEMO]: 'Campus',
  [View.INVEST]: 'Contact',
};

const NavBar: React.FC<NavBarProps> = ({ currentView, onChangeView }) => {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [liveSection, setLiveSection] = React.useState(fallbackSection[currentView]);
  const base = import.meta.env.BASE_URL;
  const channel = base.includes('/nightly/') ? 'NIGHTLY' : base.includes('/dev/') ? 'DEV' : 'PRETOTYPE';

  React.useEffect(() => {
    setIsMobileOpen(false);
    setLiveSection(fallbackSection[currentView]);

    if (currentView !== View.HOME) return;

    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-ace-section]'));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const label = (visible.target as HTMLElement).dataset.aceSection;
        if (label) setLiveSection(label);
      },
      { rootMargin: '-34% 0px -52% 0px', threshold: [0, 0.2, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [currentView]);

  const NavItem = ({ view, label }: { view: View; label: string }) => (
    <button
      type="button"
      aria-current={currentView === view ? 'page' : undefined}
      onClick={() => onChangeView(view)}
      className="ace-nav-link"
    >
      {label}
    </button>
  );

  return (
    <header className="ace-nav">
      <div className="ace-nav-inner">
        <button
          type="button"
          className="ace-wordmark"
          aria-label="Go to ACE home"
          onClick={() => onChangeView(View.HOME)}
        >
          <span className="ace-wordmark-mark" aria-hidden="true" />
          <span>ACE</span>
        </button>

        <span className="ace-channel">{channel}</span>
        <span className="ace-live-section" aria-live="polite">{liveSection}</span>

        <nav className="ace-nav-links" aria-label="Primary navigation">
          <NavItem view={View.HOME} label="Manifesto" />
          <NavItem view={View.AMENITIES} label="System" />
          <NavItem view={View.SPECIFICATIONS} label="Spec" />
          <NavItem view={View.FACILITY_DEMO} label="Campus" />
          <NavItem view={View.INVEST} label="Contact" />
          <button type="button" className="ace-nav-cta" onClick={() => onChangeView(View.FACILITY_DEMO)}>
            Enter twin
          </button>
        </nav>

        <button
          type="button"
          className="ace-menu-button"
          aria-label={isMobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileOpen}
          aria-controls="ace-mobile-nav"
          onClick={() => setIsMobileOpen((open) => !open)}
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {isMobileOpen && (
          <nav id="ace-mobile-nav" className="ace-mobile-nav" aria-label="Mobile navigation">
            <NavItem view={View.HOME} label="Manifesto" />
            <NavItem view={View.AMENITIES} label="System" />
            <NavItem view={View.SPECIFICATIONS} label="Spec" />
            <NavItem view={View.FACILITY_DEMO} label="Campus" />
            <NavItem view={View.INVEST} label="Contact" />
          </nav>
        )}
      </div>
      <div className="ace-scroll-meter" aria-hidden="true"><span /></div>
    </header>
  );
};

export default NavBar;
