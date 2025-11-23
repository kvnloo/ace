import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Specifications from './Specifications';

describe('Specifications Component', () => {
  describe('Rendering', () => {
    it('should render the main heading', () => {
      render(<Specifications />);
      expect(screen.getByText(/Facility/i)).toBeInTheDocument();
      expect(screen.getByText(/Blueprints/i)).toBeInTheDocument();
    });

    it('should render the subtitle', () => {
      render(<Specifications />);
      expect(
        screen.getByText(/A four-story vertical integration of sport, agriculture, and technology/i)
      ).toBeInTheDocument();
    });

    it('should render all 5 specification categories', () => {
      render(<Specifications />);

      expect(screen.getByText('Ground Floor: Tennis Arena')).toBeInTheDocument();
      expect(screen.getByText('Level 1: Racquet Sports')).toBeInTheDocument();
      expect(screen.getByText('Level 2: Social & Heritage')).toBeInTheDocument();
      expect(screen.getByText('Level 3: Vertical Farming')).toBeInTheDocument();
      expect(screen.getByText('Autonomous Systems')).toBeInTheDocument();
    });
  });

  describe('Ground Floor: Tennis Arena', () => {
    it('should display hard courts specification', () => {
      render(<Specifications />);
      expect(screen.getByText(/Hard Courts/i)).toBeInTheDocument();
      const sixCourts = screen.getAllByText('6 Courts');
      expect(sixCourts.length).toBeGreaterThan(0);
    });

    it('should display clay courts specification', () => {
      render(<Specifications />);
      expect(screen.getByText(/Clay Courts/i)).toBeInTheDocument();
    });

    it('should display grass courts specification', () => {
      render(<Specifications />);
      expect(screen.getByText(/Grass Courts/i)).toBeInTheDocument();
    });

    it('should display wood courts specification', () => {
      render(<Specifications />);
      expect(screen.getByText(/Wood Courts/i)).toBeInTheDocument();
    });

    it('should display amenities', () => {
      render(<Specifications />);
      expect(screen.getByText(/Amenities/i)).toBeInTheDocument();
      expect(screen.getByText(/Pro Shop & Lockers/i)).toBeInTheDocument();
    });
  });

  describe('Level 1: Racquet Sports', () => {
    it('should display badminton courts', () => {
      render(<Specifications />);
      expect(screen.getByText(/Badminton Courts/i)).toBeInTheDocument();
      expect(screen.getByText('16 Courts')).toBeInTheDocument();
    });

    it('should display squash courts', () => {
      render(<Specifications />);
      expect(screen.getByText(/Squash Courts/i)).toBeInTheDocument();
      expect(screen.getByText('4 Courts')).toBeInTheDocument();
    });

    it('should display table tennis', () => {
      render(<Specifications />);
      expect(screen.getByText(/Table Tennis/i)).toBeInTheDocument();
      expect(screen.getByText('16 Tables')).toBeInTheDocument();
    });

    it('should display flooring information', () => {
      render(<Specifications />);
      expect(screen.getByText(/Flooring/i)).toBeInTheDocument();
      expect(screen.getByText(/Shock-Absorbent Synthetic/i)).toBeInTheDocument();
    });
  });

  describe('Level 2: Social & Heritage', () => {
    it('should display pickleball courts', () => {
      render(<Specifications />);
      expect(screen.getByText(/Pickleball Courts/i)).toBeInTheDocument();
      expect(screen.getByText('8 Courts')).toBeInTheDocument();
    });

    it('should display real tennis court', () => {
      render(<Specifications />);
      expect(screen.getByText(/Real Tennis Court/i)).toBeInTheDocument();
      expect(screen.getByText(/1 Historic Court/i)).toBeInTheDocument();
    });

    it('should display viewing decks', () => {
      render(<Specifications />);
      expect(screen.getByText(/Viewing Decks/i)).toBeInTheDocument();
      expect(screen.getByText(/360° Glass Walkways/i)).toBeInTheDocument();
    });
  });

  describe('Level 3: Vertical Farming', () => {
    it('should display farming area', () => {
      render(<Specifications />);
      expect(screen.getByText(/Farming Area/i)).toBeInTheDocument();
      expect(screen.getByText(/4 x 500m² Sections/i)).toBeInTheDocument();
    });

    it('should display technology', () => {
      render(<Specifications />);
      expect(screen.getByText('Technology')).toBeInTheDocument();
      expect(screen.getByText(/Auto-Hydroponics/i)).toBeInTheDocument();
    });

    it('should display lighting information', () => {
      render(<Specifications />);
      expect(screen.getByText(/Lighting/i)).toBeInTheDocument();
      expect(screen.getByText(/Full Spectrum LED/i)).toBeInTheDocument();
    });

    it('should display robot fleet', () => {
      render(<Specifications />);
      expect(screen.getByText(/Robot Fleet/i)).toBeInTheDocument();
      expect(screen.getByText(/Patch Transporters/i)).toBeInTheDocument();
    });
  });

  describe('Autonomous Systems', () => {
    it('should display access control', () => {
      render(<Specifications />);
      expect(screen.getByText(/Access/i)).toBeInTheDocument();
      expect(screen.getByText(/Biometric \/ Mobile App/i)).toBeInTheDocument();
    });

    it('should display monitoring system', () => {
      render(<Specifications />);
      expect(screen.getByText(/Monitoring/i)).toBeInTheDocument();
      expect(screen.getByText(/Drone & Lidar Fleet/i)).toBeInTheDocument();
    });

    it('should display energy system', () => {
      render(<Specifications />);
      expect(screen.getByText(/Energy/i)).toBeInTheDocument();
      expect(screen.getByText(/Solar \+ Smart BMS/i)).toBeInTheDocument();
    });

    it('should display irrigation system', () => {
      render(<Specifications />);
      expect(screen.getByText(/Irrigation/i)).toBeInTheDocument();
      expect(screen.getByText(/AI Predictive Water/i)).toBeInTheDocument();
    });
  });

  describe('Visual Elements', () => {
    it('should render category icons', () => {
      const { container } = render(<Specifications />);
      const icons = container.querySelectorAll('svg');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('should render check mark icons for list items', () => {
      const { container } = render(<Specifications />);
      // Check for SVG elements in list items
      const listItems = container.querySelectorAll('li svg');
      expect(listItems.length).toBeGreaterThan(0);
    });

    it('should have proper grid layout container', () => {
      const { container } = render(<Specifications />);
      const grid = container.querySelector('[class*="grid"]');
      expect(grid).toBeInTheDocument();
    });
  });

  describe('Data Structure', () => {
    it('should render correct number of specification cards', () => {
      const { container } = render(<Specifications />);
      // Each category should be in a motion.div
      const categories = screen.getAllByRole('heading', { level: 3 });
      expect(categories.length).toBe(5);
    });

    it('should have all category headings as h3 elements', () => {
      render(<Specifications />);
      const headings = screen.getAllByRole('heading', { level: 3 });

      const headingTexts = headings.map((h) => h.textContent);
      expect(headingTexts).toContain('Ground Floor: Tennis Arena');
      expect(headingTexts).toContain('Level 1: Racquet Sports');
      expect(headingTexts).toContain('Level 2: Social & Heritage');
      expect(headingTexts).toContain('Level 3: Vertical Farming');
      expect(headingTexts).toContain('Autonomous Systems');
    });
  });

  describe('Content Completeness', () => {
    it('should render all tennis arena items', () => {
      render(<Specifications />);

      expect(screen.getByText(/DecoTurf/i)).toBeInTheDocument();
      expect(screen.getByText(/Red Clay/i)).toBeInTheDocument();
      expect(screen.getByText(/Organic/i)).toBeInTheDocument();
      expect(screen.getByText(/Maple/i)).toBeInTheDocument();
    });

    it('should display numeric values correctly', () => {
      render(<Specifications />);

      // Check for various numeric specifications
      const sixCourts = screen.getAllByText('6 Courts');
      expect(sixCourts.length).toBe(4); // 4 types of tennis courts

      expect(screen.getByText('16 Courts')).toBeInTheDocument();
      expect(screen.getByText('4 Courts')).toBeInTheDocument();
      expect(screen.getByText('16 Tables')).toBeInTheDocument();
      expect(screen.getByText('8 Courts')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have main heading for screen readers', () => {
      render(<Specifications />);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
    });

    it('should have semantic list structure', () => {
      const { container } = render(<Specifications />);
      const lists = container.querySelectorAll('ul');
      expect(lists.length).toBeGreaterThan(0);
    });

    it('should have proper heading hierarchy', () => {
      render(<Specifications />);
      const h2 = screen.getByRole('heading', { level: 2 });
      const h3s = screen.getAllByRole('heading', { level: 3 });

      expect(h2).toBeInTheDocument();
      expect(h3s.length).toBe(5);
    });
  });

  describe('Layout and Styling', () => {
    it('should have max-width container', () => {
      const { container } = render(<Specifications />);
      const maxWidthContainer = container.querySelector('[class*="max-w-7xl"]');
      expect(maxWidthContainer).toBeInTheDocument();
    });

    it('should have responsive padding', () => {
      const { container } = render(<Specifications />);
      const paddedContainer = container.querySelector('[class*="px-6"]');
      expect(paddedContainer).toBeInTheDocument();
    });

    it('should render category cards with proper styling classes', () => {
      const { container } = render(<Specifications />);
      // Check for glass panel / card styling
      const styledCards = container.querySelectorAll('[class*="bg-white/5"]');
      expect(styledCards.length).toBeGreaterThan(0);
    });
  });
});
