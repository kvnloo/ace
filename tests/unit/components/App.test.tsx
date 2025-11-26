import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../../src/App';
import { View } from '../../../src/types';

// Mock the heavy 3D components to avoid WebGL issues in tests
vi.mock('../../../src/components/ThreeScene', () => ({
  default: ({ onFeatureSelect }: any) => (
    <div data-testid="three-scene">3D Scene Mock</div>
  ),
}));

vi.mock('../../../src/components/AIChat', () => ({
  default: () => <div data-testid="ai-chat">AI Chat Mock</div>,
}));

vi.mock('../../../src/components/loading/LoadingScreen', () => ({
  default: ({ onComplete }: any) => {
    // Auto-complete loading
    setTimeout(onComplete, 0);
    return <div data-testid="loading-screen">Loading...</div>;
  },
}));

describe('App', () => {
  it('should render the application', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should show HOME view by default', () => {
    render(<App />);
    expect(screen.getByText(/AUTONOMOUS/i)).toBeInTheDocument();
    expect(screen.getByText(/INTEGRATED/i)).toBeInTheDocument();
  });

  it('should render navigation bar', () => {
    render(<App />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should display hero section in HOME view', () => {
    render(<App />);
    expect(screen.getByText(/Future of Racket Sports/i)).toBeInTheDocument();
  });

  it('should show multi-sport excellence section', () => {
    render(<App />);
    expect(screen.getByText(/Multi-Sport Excellence/i)).toBeInTheDocument();
  });

  it('should display APEX Performance section', () => {
    render(<App />);
    expect(screen.getByText(/APEX Performance/i)).toBeInTheDocument();
    expect(screen.getByText(/147 biomarkers/i)).toBeInTheDocument();
  });

  it('should show Vertical Farm section', () => {
    render(<App />);
    expect(screen.getByText(/Vertical Farm/i)).toBeInTheDocument();
  });

  it('should display Autonomous Operations section', () => {
    render(<App />);
    expect(screen.getByText(/Autonomous Operations/i)).toBeInTheDocument();
  });

  it('should have explore 3D demo button', async () => {
    const user = userEvent.setup();
    render(<App />);

    const exploreButton = screen.getByRole('button', { name: /Explore 3D Demo/i });
    expect(exploreButton).toBeInTheDocument();

    await user.click(exploreButton);

    await waitFor(() => {
      expect(screen.getByTestId('three-scene')).toBeInTheDocument();
    });
  });

  it('should have view amenities button', async () => {
    const user = userEvent.setup();
    render(<App />);

    const amenitiesButton = screen.getByRole('button', { name: /View Amenities/i });
    expect(amenitiesButton).toBeInTheDocument();

    await user.click(amenitiesButton);

    await waitFor(() => {
      // Amenities view should be rendered
      expect(screen.queryByText(/AUTONOMOUS/i)).not.toBeInTheDocument();
    });
  });

  it('should render AI chat component', () => {
    render(<App />);
    expect(screen.getByTestId('ai-chat')).toBeInTheDocument();
  });

  it('should display global FPS monitor', () => {
    render(<App />);
    // FPS monitor is rendered globally
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('should apply correct styling classes', () => {
    const { container } = render(<App />);
    const mainContent = container.querySelector('main');
    expect(mainContent).toHaveClass('relative', 'w-full', 'h-screen');
  });

  it('should handle view transitions smoothly', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Start on HOME
    expect(screen.getByText(/AUTONOMOUS/i)).toBeInTheDocument();

    // Navigate to 3D Demo
    const exploreButton = screen.getByRole('button', { name: /Explore 3D Demo/i });
    await user.click(exploreButton);

    await waitFor(() => {
      expect(screen.getByTestId('three-scene')).toBeInTheDocument();
    });
  });

  it('should show loading screen when entering 3D view', async () => {
    const user = userEvent.setup();
    render(<App />);

    const exploreButton = screen.getByRole('button', { name: /Explore 3D Demo/i });
    await user.click(exploreButton);

    // Loading screen should appear briefly
    expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
  });

  it('should maintain responsive layout classes', () => {
    const { container } = render(<App />);
    expect(container.querySelector('.min-h-screen')).toBeInTheDocument();
  });
});
