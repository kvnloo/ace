import React from 'react';
import { Menu, X } from 'lucide-react';
import { View } from '../types';

/**
 * Props for the NavBar component
 * @interface NavBarProps
 * @property {View} currentView - The currently active view/page being displayed
 * @property {(view: View) => void} onChangeView - Callback fired when user navigates to a different view
 */
interface NavBarProps {
  currentView: View;
  onChangeView: (view: View) => void;
}

/**
 * NavBar Component - Main navigation header for the application
 *
 * Provides a responsive, accessible navigation bar with:
 * - Desktop navigation menu for all main application views
 * - Mobile hamburger menu that collapses on smaller screens
 * - Branded logo and title (LawnTech Dynamics)
 * - Call-to-action "Join Waiting List" button
 * - Visual active state highlighting for current view
 * - Automatic mobile menu closing on navigation
 * - Escape key support for closing mobile menu
 *
 * The component uses Tailwind CSS for responsive design, splitting desktop
 * and mobile layouts at the md breakpoint.
 *
 * @component
 * @example
 * ```tsx
 * const [currentView, setCurrentView] = useState<View>(View.HOME);
 *
 * return (
 *   <NavBar
 *     currentView={currentView}
 *     onChangeView={setCurrentView}
 *   />
 * );
 * ```
 *
 * @param {NavBarProps} props - Component props
 * @param {View} props.currentView - The currently active view
 * @param {Function} props.onChangeView - Callback to handle view changes
 * @returns {React.ReactElement} The rendered navigation bar
 */
const NavBar: React.FC<NavBarProps> = ({ currentView, onChangeView }) => {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  /**
   * NavItem Subcomponent - Individual navigation button
   * Renders a button that updates the current view on click and closes mobile menu
   * @component
   * @param {Object} props - Props object
   * @param {View} props.view - The view this nav item represents
   * @param {string} props.label - Display label for the navigation item
   */
  const NavItem = ({ view, label }: { view: View; label: string }) => (
    <button
      onClick={() => {
        onChangeView(view);
        setIsMobileOpen(false);
      }}
      className={`text-sm font-semibold tracking-wide transition-colors uppercase ${
        currentView === view ? 'text-tennis-yellow' : 'text-white/70 hover:text-white'
      }`}
      aria-current={currentView === view ? 'page' : undefined}
      aria-label={`Navigate to ${label}`}
    >
      {label}
    </button>
  );

  /**
   * Effect Hook: Handle Escape key to close mobile menu
   * Listens for Escape key press and closes the mobile navigation menu when pressed
   * Automatically cleans up event listener when component unmounts or menu closes
   */
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };

    if (isMobileOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isMobileOpen]);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-slate-900/90 to-transparent pt-4 pb-8 px-6"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button
          className="text-2xl font-extrabold tracking-tighter text-white cursor-pointer flex items-center gap-2"
          onClick={() => onChangeView(View.HOME)}
          aria-label="Return to home page - LawnTech Dynamics"
        >
          <span className="w-3 h-3 bg-tennis-yellow rounded-full animate-pulse" aria-hidden="true" />
          LAWNTECH <span className="text-tennis-yellow font-light">DYNAMICS</span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8" role="list">
          <NavItem view={View.HOME} label="Vision" />
          <NavItem view={View.SPECIFICATIONS} label="Specs" />
          <NavItem view={View.FACILITY_DEMO} label="3D Map" />
          <NavItem view={View.AMENITIES} label="Amenities" />
          <NavItem view={View.INVEST} label="Invest" />
          <button
            className="border border-tennis-yellow text-tennis-yellow px-5 py-2 rounded-full text-sm font-bold hover:bg-tennis-yellow hover:text-tennis-dark transition-all"
            onClick={() => onChangeView(View.INVEST)}
            aria-label="Join waiting list for LawnTech Dynamics facility"
          >
            JOIN WAITING LIST
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="text-white"
            aria-label={isMobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-navigation"
          >
            {isMobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <nav
          id="mobile-navigation"
          className="absolute top-full left-0 w-full bg-slate-900 border-b border-white/10 p-6 flex flex-col gap-6 md:hidden glass-panel"
          aria-label="Mobile navigation menu"
        >
          <NavItem view={View.HOME} label="Vision" />
          <NavItem view={View.SPECIFICATIONS} label="Specs" />
          <NavItem view={View.FACILITY_DEMO} label="3D Map" />
          <NavItem view={View.AMENITIES} label="Amenities" />
          <NavItem view={View.INVEST} label="Invest" />
        </nav>
      )}
    </nav>
  );
};

export default NavBar;
