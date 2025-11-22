import React from 'react';
import { View } from '../types';
import { Menu, X } from 'lucide-react';

interface NavBarProps {
  currentView: View;
  onChangeView: (view: View) => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentView, onChangeView }) => {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const NavItem = ({ view, label }: { view: View; label: string }) => (
    <button
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
    <nav className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-slate-900/90 to-transparent pt-4 pb-8 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
            className="text-2xl font-extrabold tracking-tighter text-white cursor-pointer flex items-center gap-2"
            onClick={() => onChangeView(View.HOME)}
        >
            <span className="w-3 h-3 bg-tennis-yellow rounded-full animate-pulse"></span>
            LAWNTECH <span className="text-tennis-yellow font-light">DYNAMICS</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <NavItem view={View.HOME} label="Vision" />
          <NavItem view={View.SPECIFICATIONS} label="Specs" />
          <NavItem view={View.FACILITY_DEMO} label="3D Map" />
          <NavItem view={View.AMENITIES} label="Amenities" />
          <NavItem view={View.INVEST} label="Invest" />
          <button 
            className="border border-tennis-yellow text-tennis-yellow px-5 py-2 rounded-full text-sm font-bold hover:bg-tennis-yellow hover:text-tennis-dark transition-all"
            onClick={() => onChangeView(View.INVEST)}
          >
            JOIN WAITING LIST
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="text-white">
            {isMobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="absolute top-full left-0 w-full bg-slate-900 border-b border-white/10 p-6 flex flex-col gap-6 md:hidden glass-panel">
          <NavItem view={View.HOME} label="Vision" />
          <NavItem view={View.SPECIFICATIONS} label="Specs" />
          <NavItem view={View.FACILITY_DEMO} label="3D Map" />
          <NavItem view={View.AMENITIES} label="Amenities" />
          <NavItem view={View.INVEST} label="Invest" />
        </div>
      )}
    </nav>
  );
};

export default NavBar;