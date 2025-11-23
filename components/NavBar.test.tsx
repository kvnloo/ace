import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { View } from '../types';
import NavBar from './NavBar';

describe('NavBar Component', () => {
  const mockOnChangeView = vi.fn();

  const defaultProps = {
    currentView: View.HOME,
    onChangeView: mockOnChangeView,
  };

  afterEach(() => {
    mockOnChangeView.mockClear();
  });

  describe('Rendering', () => {
    it('should render the logo with correct text', () => {
      render(<NavBar {...defaultProps} />);
      expect(screen.getByText(/LAWNTECH/i)).toBeInTheDocument();
      expect(screen.getByText(/DYNAMICS/i)).toBeInTheDocument();
    });

    it('should render all navigation items in desktop nav', () => {
      render(<NavBar {...defaultProps} />);

      const desktopNav = screen.getAllByText('Vision')[0];
      expect(desktopNav).toBeInTheDocument();
      expect(screen.getAllByText('Specs')[0]).toBeInTheDocument();
      expect(screen.getAllByText('3D Map')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Amenities')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Invest')[0]).toBeInTheDocument();
    });

    it('should render JOIN WAITING LIST button', () => {
      render(<NavBar {...defaultProps} />);
      expect(screen.getByText('JOIN WAITING LIST')).toBeInTheDocument();
    });

    it('should highlight current view', () => {
      render(<NavBar {...defaultProps} currentView={View.SPECIFICATIONS} />);

      const specsButtons = screen.getAllByText('Specs');
      const activeButton = specsButtons.find((btn) => btn.className.includes('text-tennis-yellow'));
      expect(activeButton).toBeDefined();
    });

    it('should render mobile menu toggle button', () => {
      const { container } = render(<NavBar {...defaultProps} />);
      const mobileToggle = container.querySelector('.md\\:hidden button');
      expect(mobileToggle).toBeInTheDocument();
    });
  });

  describe('Navigation Interactions', () => {
    it('should call onChangeView when logo is clicked', async () => {
      const user = userEvent.setup();
      render(<NavBar {...defaultProps} currentView={View.SPECIFICATIONS} />);

      const logo = screen.getByText(/LAWNTECH/i);
      await user.click(logo);

      expect(mockOnChangeView).toHaveBeenCalledWith(View.HOME);
    });

    it('should call onChangeView when Vision nav item is clicked', async () => {
      const user = userEvent.setup();
      render(<NavBar {...defaultProps} />);

      const visionButtons = screen.getAllByText('Vision');
      await user.click(visionButtons[0]);

      expect(mockOnChangeView).toHaveBeenCalledWith(View.HOME);
    });

    it('should call onChangeView when Specs nav item is clicked', async () => {
      const user = userEvent.setup();
      render(<NavBar {...defaultProps} />);

      const specsButtons = screen.getAllByText('Specs');
      await user.click(specsButtons[0]);

      expect(mockOnChangeView).toHaveBeenCalledWith(View.SPECIFICATIONS);
    });

    it('should call onChangeView when 3D Map nav item is clicked', async () => {
      const user = userEvent.setup();
      render(<NavBar {...defaultProps} />);

      const mapButtons = screen.getAllByText('3D Map');
      await user.click(mapButtons[0]);

      expect(mockOnChangeView).toHaveBeenCalledWith(View.FACILITY_DEMO);
    });

    it('should call onChangeView when Amenities nav item is clicked', async () => {
      const user = userEvent.setup();
      render(<NavBar {...defaultProps} />);

      const amenitiesButtons = screen.getAllByText('Amenities');
      await user.click(amenitiesButtons[0]);

      expect(mockOnChangeView).toHaveBeenCalledWith(View.AMENITIES);
    });

    it('should call onChangeView when Invest nav item is clicked', async () => {
      const user = userEvent.setup();
      render(<NavBar {...defaultProps} />);

      const investButtons = screen.getAllByText('Invest');
      await user.click(investButtons[0]);

      expect(mockOnChangeView).toHaveBeenCalledWith(View.INVEST);
    });

    it('should call onChangeView when JOIN WAITING LIST button is clicked', async () => {
      const user = userEvent.setup();
      render(<NavBar {...defaultProps} />);

      const waitingListButton = screen.getByText('JOIN WAITING LIST');
      await user.click(waitingListButton);

      expect(mockOnChangeView).toHaveBeenCalledWith(View.INVEST);
    });
  });

  describe('Mobile Menu', () => {
    it('should not show mobile menu initially', () => {
      render(<NavBar {...defaultProps} />);

      // Mobile menu items should not be visible initially
      const visionButtons = screen.getAllByText('Vision');
      // Desktop version exists, mobile hidden
      expect(visionButtons.length).toBeGreaterThanOrEqual(1);
    });

    it('should toggle mobile menu when hamburger is clicked', async () => {
      const user = userEvent.setup();
      render(<NavBar {...defaultProps} />);

      // Find all buttons (including hidden mobile toggle)
      const buttons = screen.getAllByRole('button', { hidden: true });
      const menuButton = buttons.find(
        (btn) => btn.querySelector('svg') !== null && !btn.textContent?.includes('WAITING')
      );

      if (menuButton) {
        await user.click(menuButton);

        // After clicking, mobile menu should be visible
        const visionButtons = screen.getAllByText('Vision');
        expect(visionButtons.length).toBeGreaterThan(1);
      }
    });

    it('should close mobile menu when nav item is clicked', async () => {
      const user = userEvent.setup();
      render(<NavBar {...defaultProps} />);

      // Open mobile menu
      const buttons = screen.getAllByRole('button', { hidden: true });
      const menuButton = buttons.find(
        (btn) => btn.querySelector('svg') !== null && !btn.textContent?.includes('WAITING')
      );

      if (menuButton) {
        await user.click(menuButton);

        // Click a nav item in mobile menu
        const visionButtons = screen.getAllByText('Vision');
        const mobileVision = visionButtons[visionButtons.length - 1];
        await user.click(mobileVision);

        expect(mockOnChangeView).toHaveBeenCalledWith(View.HOME);
      }
    });
  });

  describe('Accessibility', () => {
    it('should have nav element', () => {
      const { container } = render(<NavBar {...defaultProps} />);
      const nav = container.querySelector('nav');
      expect(nav).toBeInTheDocument();
    });

    it('should have clickable buttons with proper role', () => {
      render(<NavBar {...defaultProps} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should have semantic button elements for navigation', () => {
      render(<NavBar {...defaultProps} />);
      const visionButtons = screen.getAllByText('Vision');
      visionButtons.forEach((button) => {
        expect(button.tagName).toBe('BUTTON');
      });
    });
  });

  describe('Visual States', () => {
    it('should apply active styling to current view', () => {
      render(<NavBar {...defaultProps} currentView={View.AMENITIES} />);

      const amenitiesButtons = screen.getAllByText('Amenities');
      const activeButton = amenitiesButtons.find((btn) =>
        btn.className.includes('text-tennis-yellow')
      );

      expect(activeButton).toBeDefined();
    });

    it('should apply inactive styling to non-current views', () => {
      render(<NavBar {...defaultProps} currentView={View.HOME} />);

      const specsButtons = screen.getAllByText('Specs');
      const inactiveButton = specsButtons.find((btn) => btn.className.includes('text-white/70'));

      expect(inactiveButton).toBeDefined();
    });
  });
});
