/**
 * QualityBadge Component
 *
 * A simple badge component to display quality metrics.
 * This component was created using Test-Driven Development (TDD).
 *
 * See: tests/unit/QualityBadge.test.tsx for the test suite.
 * See: claudedocs/workflows/TDD_SETUP_GUIDE.md for TDD workflow details.
 */

export interface QualityBadgeProps {
  /** Quality level: 'high', 'medium', 'low' */
  quality: 'high' | 'medium' | 'low';
  /** Optional label to display */
  label?: string;
  /** Optional test ID for testing */
  testId?: string;
}

export function QualityBadge({ quality, label, testId }: QualityBadgeProps) {
  const colors = {
    high: { bg: '#10b981', text: '#ffffff' },
    medium: { bg: '#f59e0b', text: '#ffffff' },
    low: { bg: '#ef4444', text: '#ffffff' },
  };

  const icons = {
    high: '✓',
    medium: '!',
    low: '✗',
  };

  const selectedColor = colors[quality];
  const icon = icons[quality];

  return (
    <div
      data-testid={testId || 'quality-badge'}
      role="status"
      aria-label={`Quality: ${quality}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        borderRadius: '0.375rem',
        backgroundColor: selectedColor.bg,
        color: selectedColor.text,
        fontSize: '0.875rem',
        fontWeight: 600,
      }}
    >
      <span aria-hidden="true">{icon}</span>
      <span>{label || quality.toUpperCase()}</span>
    </div>
  );
}
