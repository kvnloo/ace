import React from 'react';
import { View } from '../types';
import { Menu, X } from 'lucide-react';

interface NavBarProps {
  currentView: View;
  onChangeView: (view: View) => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentView, onChangeView }) => {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const base = import.meta.env.BASE_URL;
  const channel = base.includes('/nightly/') ? 'NIGHTLY' : base.includes('/dev/') ? 'DEV' : 'PRETOTYPE';

  const NavItem = ({ view, label }: { view: View; label: string }) => (
    <button
      type="button"
      aria-current={currentView === view ? 'page' : undefined}
      onClick={() => {
        onChangeView(view);
        setIsMobileOpen(false);
      }}
      className={`text-sm font-semibold tracking-wide transition-colors uppercase ${
        currentView === view ? 'text-tennis-yellow' : 'text-white/70 hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <button
          type="button"
          aria-label="Go to ACE home"
          className="text-2xl font-extrabold tracking-tighter text-white cursor-pointer flex items-center gap-2"
          onClick={() => onChangeView(View.HOME)}
        >
          <span aria-hidden="true" className="w-3 h-3 bg-tennis-yellow rounded-full shadow-[0_0_18px_rgba(223,255,79,0.65)]" />
          ACE
          <span className="ml-2 text-[10px] tracking-widest font-mono font-normal text-tennis-yellow/80 border border-tennis-yellow/40 px-2 py-0.5 rounded-full">
            {channel}
          </span>
        </button>

        <div className="hidden md:flex items-center gap-7">
          <NavItem view={View.HOME} label="ACE" />
          <NavItem view={View.AMENITIES} label="System" />
          <NavItem view={View.SPECIFICATIONS} label="Facility" />
          <NavItem view={View.FACILITY_DEMO} label="Campus" />
          <NavItem view={View.INVEST} label="Contact" />
          <button
            type="button"
            className="border border-tennis-yellow/70 text-tennis-yellow px-5 py-2 rounded-full text-sm font-bold hover:bg-tennis-yellow hover:text-tennis-dark transition-all"
            onClick={() => onChangeView(View.INVEST)}
          >
            JOIN WAITLIST
          </button>
        </div>

        <div className="md:hidden">
          <button
            type="button"
            aria-label={isMobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="text-white p-2 rounded-lg hover:bg-white/10"
          >
            {isMobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {isMobileOpen && (
        <div
          id="mobile-nav"
          className="absolute top-full left-0 w-full bg-slate-950/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col items-start gap-6 md:hidden shadow-2xl"
        >
          <NavItem view={View.HOME} label="ACE" />
          <NavItem view={View.AMENITIES} label="System" />
          <NavItem view={View.SPECIFICATIONS} label="Facility" />
          <NavItem view={View.FACILITY_DEMO} label="Campus" />
          <NavItem view={View.INVEST} label="Contact" />
        </div>
      )}
    </nav>
  );
};

export default NavBar;
