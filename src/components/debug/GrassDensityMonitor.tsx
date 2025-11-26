/**
 * GrassDensityMonitor Component
 *
 * Displays real-time grass blade density statistics in a floating overlay.
 */

import React from 'react';

interface GrassDensityMonitorProps {
  densities: { courtIndex: number; density: number; fps: number }[];
  phase: 'init' | 'burst' | 'monitor';
  visible?: boolean;
}

const REAL_BLADES_PER_COURT = 7_000_000;

const GrassDensityMonitor: React.FC<GrassDensityMonitorProps> = ({
  densities,
  phase,
  visible = true,
}) => {
  if (!visible || densities.length === 0) return null;

  const totalBlades = densities.reduce((sum, d) => sum + d.density, 0);
  const avgFPS = densities.reduce((sum, d) => sum + d.fps, 0) / densities.length;
  const percentReal = (totalBlades / (REAL_BLADES_PER_COURT * densities.length)) * 100;

  const phaseColors = {
    init: '#fbbf24',    // yellow
    burst: '#22c55e',   // green
    monitor: '#3b82f6', // blue
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '100px',
        right: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        padding: '16px',
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#fff',
        zIndex: 9999,
        minWidth: '220px',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '12px',
        paddingBottom: '8px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <span style={{ fontSize: '16px' }}>🌿</span>
        <span style={{ fontWeight: 'bold', fontSize: '14px' }}>GRASS DENSITY</span>
        <span
          style={{
            marginLeft: 'auto',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: 'bold',
            backgroundColor: phaseColors[phase],
            color: phase === 'init' ? '#000' : '#fff',
            textTransform: 'uppercase',
          }}
        >
          {phase}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#9ca3af' }}>Total Blades:</span>
          <span style={{ color: '#22c55e', fontWeight: 'bold' }}>
            {totalBlades.toLocaleString()}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#9ca3af' }}>Per Court:</span>
          <span style={{ color: '#fbbf24' }}>
            {densities.length > 0
              ? Math.round(totalBlades / densities.length).toLocaleString()
              : '0'}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#9ca3af' }}>% of Real:</span>
          <span style={{ color: '#60a5fa' }}>
            {percentReal.toFixed(3)}%
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#9ca3af' }}>Avg FPS:</span>
          <span style={{ color: avgFPS > 60 ? '#22c55e' : avgFPS > 30 ? '#fbbf24' : '#ef4444' }}>
            {avgFPS.toFixed(0)}
          </span>
        </div>

        <div style={{
          marginTop: '8px',
          paddingTop: '8px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          fontSize: '10px',
          color: '#6b7280'
        }}>
          Real grass: ~7M blades/court
        </div>
      </div>
    </div>
  );
};

export default GrassDensityMonitor;
