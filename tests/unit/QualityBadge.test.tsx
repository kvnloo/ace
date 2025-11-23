/**
 * QualityBadge Component Test Suite
 *
 * This test suite demonstrates the Test-Driven Development (TDD) workflow:
 * 1. RED: Write failing test
 * 2. GREEN: Write minimal code to pass
 * 3. REFACTOR: Improve code quality
 *
 * See: claudedocs/workflows/TDD_SETUP_GUIDE.md for complete workflow documentation
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QualityBadge } from '../../components/QualityBadge';

describe('QualityBadge Component', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<QualityBadge quality="high" />);
      expect(container).toBeTruthy();
    });

    it('should display the badge element', () => {
      render(<QualityBadge quality="high" />);
      const badge = screen.getByTestId('quality-badge');
      expect(badge).toBeInTheDocument();
    });

    it('should have appropriate ARIA role', () => {
      render(<QualityBadge quality="high" />);
      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Quality Levels', () => {
    it('should display HIGH quality badge', () => {
      render(<QualityBadge quality="high" />);
      expect(screen.getByText('HIGH')).toBeInTheDocument();
    });

    it('should display MEDIUM quality badge', () => {
      render(<QualityBadge quality="medium" />);
      expect(screen.getByText('MEDIUM')).toBeInTheDocument();
    });

    it('should display LOW quality badge', () => {
      render(<QualityBadge quality="low" />);
      expect(screen.getByText('LOW')).toBeInTheDocument();
    });
  });

  describe('Custom Labels', () => {
    it('should display custom label when provided', () => {
      render(<QualityBadge quality="high" label="Excellent" />);
      expect(screen.getByText('Excellent')).toBeInTheDocument();
      expect(screen.queryByText('HIGH')).not.toBeInTheDocument();
    });

    it('should display default label when not provided', () => {
      render(<QualityBadge quality="medium" />);
      expect(screen.getByText('MEDIUM')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have appropriate aria-label for high quality', () => {
      render(<QualityBadge quality="high" />);
      const badge = screen.getByLabelText('Quality: high');
      expect(badge).toBeInTheDocument();
    });

    it('should have appropriate aria-label for medium quality', () => {
      render(<QualityBadge quality="medium" />);
      const badge = screen.getByLabelText('Quality: medium');
      expect(badge).toBeInTheDocument();
    });

    it('should have appropriate aria-label for low quality', () => {
      render(<QualityBadge quality="low" />);
      const badge = screen.getByLabelText('Quality: low');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Visual Indicators', () => {
    it('should display checkmark icon for high quality', () => {
      render(<QualityBadge quality="high" />);
      expect(screen.getByText('✓')).toBeInTheDocument();
    });

    it('should display warning icon for medium quality', () => {
      render(<QualityBadge quality="medium" />);
      expect(screen.getByText('!')).toBeInTheDocument();
    });

    it('should display error icon for low quality', () => {
      render(<QualityBadge quality="low" />);
      expect(screen.getByText('✗')).toBeInTheDocument();
    });
  });

  describe('Custom Test ID', () => {
    it('should use custom test ID when provided', () => {
      render(<QualityBadge quality="high" testId="custom-badge" />);
      const badge = screen.getByTestId('custom-badge');
      expect(badge).toBeInTheDocument();
    });

    it('should use default test ID when not provided', () => {
      render(<QualityBadge quality="high" />);
      const badge = screen.getByTestId('quality-badge');
      expect(badge).toBeInTheDocument();
    });
  });
});
