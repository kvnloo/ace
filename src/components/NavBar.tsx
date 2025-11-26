import React, { useState } from 'react';
import { View } from '../types';
import { Menu, X, ChevronDown } from 'lucide-react';

interface NavBarProps {
  currentView: View;
  onChangeView: (view: View) => void;
}

interface DropdownItem {
  label: string;
  view: View;
  scrollTo?: string;
}

interface NavItemProps {
  view?: View;
  label: string;
  dropdown?: DropdownItem[];
  currentView: View;
  onChangeView: (view: View, scrollTo?: string) => void;
  onMobileClose?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({
  view,
  label,
  dropdown,
  currentView,
  onChangeView,
  onMobileClose
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (dropdown) {
    return (
      <div
        className="relative"
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => setIsDropdownOpen(false)}
      >
        <button
          className={`text-sm font-semibold tracking-wide transition-colors uppercase flex items-center gap-1 py-2 ${
            dropdown.some(item => item.view === currentView)
              ? 'text-tennis-yellow'
              : 'text-white/70 hover:text-white'
          }`}
        >
          {label}
          <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 pt-1">
            <div className="py-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl min-w-[180px] shadow-2xl">
              {dropdown.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onChangeView(item.view, item.scrollTo);
                    setIsDropdownOpen(false);
                    onMobileClose?.();
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                    currentView === item.view
                      ? 'text-tennis-yellow bg-white/5'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        if (view) {
          onChangeView(view);
          onMobileClose?.();
        }
      }}
      className={`text-sm font-semibold tracking-wide transition-colors uppercase py-2 ${
        currentView === view ? 'text-tennis-yellow' : 'text-white/70 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
};

const NavBar: React.FC<NavBarProps> = ({ currentView, onChangeView }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleNavigation = (view: View, scrollTo?: string) => {
    onChangeView(view);

    // Handle scrolling after view change
    if (scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const facilitiesDropdown: DropdownItem[] = [
    { label: 'Amenities', view: View.AMENITIES },
    { label: 'Gallery', view: View.GALLERY },
    { label: '3D Tour', view: View.FACILITY_DEMO }
  ];

  const membershipDropdown: DropdownItem[] = [
    { label: 'Plans', view: View.AMENITIES, scrollTo: 'pricing' },
    { label: 'FAQ', view: View.FAQ }
  ];

  const aboutDropdown: DropdownItem[] = [
    { label: 'Our Story', view: View.ABOUT },
    { label: 'Team', view: View.ABOUT, scrollTo: 'team' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-slate-900/95 via-slate-900/80 to-transparent pt-4 pb-8 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div
          className="text-xl font-extrabold tracking-tighter text-white cursor-pointer flex items-center gap-2 shrink-0"
          onClick={() => handleNavigation(View.HOME)}
        >
          <span className="w-2.5 h-2.5 bg-tennis-yellow rounded-full animate-pulse"></span>
          <span className="hidden sm:inline">LAWNTECH</span>
          <span className="text-tennis-yellow font-light hidden sm:inline">DYNAMICS</span>
          <span className="sm:hidden">LTD</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Primary: Facilities first - what we offer */}
          <NavItem
            label="Facilities"
            dropdown={facilitiesDropdown}
            currentView={currentView}
            onChangeView={handleNavigation}
          />
          <NavItem
            view={View.SPECIFICATIONS}
            label="Technology"
            currentView={currentView}
            onChangeView={handleNavigation}
          />
          <NavItem
            view={View.SUSTAINABILITY}
            label="Sustainability"
            currentView={currentView}
            onChangeView={handleNavigation}
          />
          <NavItem
            label="Membership"
            dropdown={membershipDropdown}
            currentView={currentView}
            onChangeView={handleNavigation}
          />
          {/* Secondary: About moved to end */}
          <NavItem
            label="About"
            dropdown={aboutDropdown}
            currentView={currentView}
            onChangeView={handleNavigation}
          />
          <NavItem
            view={View.CONTACT}
            label="Contact"
            currentView={currentView}
            onChangeView={handleNavigation}
          />
        </div>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            className="border border-tennis-yellow text-tennis-yellow px-4 py-2 rounded-full text-xs font-bold hover:bg-tennis-yellow hover:text-tennis-dark transition-all uppercase tracking-wide"
            onClick={() => handleNavigation(View.INVEST)}
          >
            Invest
          </button>
          <button
            className="bg-tennis-yellow text-tennis-dark px-4 py-2 rounded-full text-xs font-bold hover:bg-white transition-all uppercase tracking-wide"
            onClick={() => handleNavigation(View.INVEST)}
          >
            Join Waitlist
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden">
          <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="text-white p-2">
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="absolute top-full left-0 w-full bg-slate-900/98 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-4 lg:hidden max-h-[80vh] overflow-y-auto">
          {/* Facilities Section */}
          <div className="border-b border-white/10 pb-4">
            <div className="text-xs text-tennis-yellow uppercase tracking-wider mb-3 font-bold">Facilities</div>
            <div className="flex flex-col gap-1 pl-4">
              <button
                onClick={() => {
                  handleNavigation(View.AMENITIES);
                  setIsMobileOpen(false);
                }}
                className="text-left text-sm text-white/70 hover:text-white py-2"
              >
                Amenities
              </button>
              <button
                onClick={() => {
                  handleNavigation(View.GALLERY);
                  setIsMobileOpen(false);
                }}
                className="text-left text-sm text-white/70 hover:text-white py-2"
              >
                Gallery
              </button>
              <button
                onClick={() => {
                  handleNavigation(View.FACILITY_DEMO);
                  setIsMobileOpen(false);
                }}
                className="text-left text-sm text-white/70 hover:text-white py-2"
              >
                3D Tour
              </button>
            </div>
          </div>

          {/* Single Items */}
          <div className="border-b border-white/10 pb-4 flex flex-col gap-1">
            <button
              onClick={() => {
                handleNavigation(View.SPECIFICATIONS);
                setIsMobileOpen(false);
              }}
              className="text-left text-sm font-semibold text-white/70 hover:text-white py-2 uppercase tracking-wide"
            >
              Technology
            </button>
            <button
              onClick={() => {
                handleNavigation(View.SUSTAINABILITY);
                setIsMobileOpen(false);
              }}
              className="text-left text-sm font-semibold text-white/70 hover:text-white py-2 uppercase tracking-wide"
            >
              Sustainability
            </button>
          </div>

          {/* Membership Section */}
          <div className="border-b border-white/10 pb-4">
            <div className="text-xs text-tennis-yellow uppercase tracking-wider mb-3 font-bold">Membership</div>
            <div className="flex flex-col gap-1 pl-4">
              <button
                onClick={() => {
                  handleNavigation(View.AMENITIES, 'pricing');
                  setIsMobileOpen(false);
                }}
                className="text-left text-sm text-white/70 hover:text-white py-2"
              >
                Plans
              </button>
              <button
                onClick={() => {
                  handleNavigation(View.FAQ);
                  setIsMobileOpen(false);
                }}
                className="text-left text-sm text-white/70 hover:text-white py-2"
              >
                FAQ
              </button>
            </div>
          </div>

          {/* About Section */}
          <div className="border-b border-white/10 pb-4">
            <div className="text-xs text-tennis-yellow uppercase tracking-wider mb-3 font-bold">About</div>
            <div className="flex flex-col gap-1 pl-4">
              <button
                onClick={() => {
                  handleNavigation(View.ABOUT);
                  setIsMobileOpen(false);
                }}
                className="text-left text-sm text-white/70 hover:text-white py-2"
              >
                Our Story
              </button>
              <button
                onClick={() => {
                  handleNavigation(View.ABOUT, 'team');
                  setIsMobileOpen(false);
                }}
                className="text-left text-sm text-white/70 hover:text-white py-2"
              >
                Team
              </button>
            </div>
          </div>

          {/* Contact */}
          <button
            onClick={() => {
              handleNavigation(View.CONTACT);
              setIsMobileOpen(false);
            }}
            className="text-left text-sm font-semibold text-white/70 hover:text-white py-2 uppercase tracking-wide border-b border-white/10 pb-4"
          >
            Contact
          </button>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              className="border border-tennis-yellow text-tennis-yellow px-5 py-3 rounded-full text-sm font-bold hover:bg-tennis-yellow hover:text-tennis-dark transition-all"
              onClick={() => {
                handleNavigation(View.INVEST);
                setIsMobileOpen(false);
              }}
            >
              INVEST
            </button>
            <button
              className="bg-tennis-yellow text-tennis-dark px-5 py-3 rounded-full text-sm font-bold hover:bg-white transition-all"
              onClick={() => {
                handleNavigation(View.INVEST);
                setIsMobileOpen(false);
              }}
            >
              JOIN WAITLIST
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
