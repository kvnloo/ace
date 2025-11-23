/**
 * Batch Control Panel Example
 *
 * Demonstrates complete integration of FPS monitoring with component batch management
 */

import React, { useEffect, useState } from 'react';
import { BatchControlPanel } from './BatchControlPanel';
import { useFPSBatchController } from '../../hooks/useFPSBatchController';
import { ComponentBatch } from '../../services/fps';

/**
 * Example 1: Basic Usage
 */
export const BasicExample: React.FC = () => {
  const { controller, state } = useFPSBatchController();

  return (
    <div>
      <h2>FPS: {state.currentFPS}</h2>
      <BatchControlPanel controller={controller} initiallyOpen={true} />
    </div>
  );
};

/**
 * Example 2: With Custom Warning Handler
 */
export const WithWarningHandler: React.FC = () => {
  const { controller, state, actions } = useFPSBatchController();
  const [customWarnings, setCustomWarnings] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = controller.onWarning((warning) => {
      // Custom warning handling
      if (warning.type === 'fps_critical') {
        console.error('Critical performance issue!', warning);
        setCustomWarnings(prev => [
          ...prev,
          `CRITICAL: ${warning.message}`
        ]);
      } else {
        console.warn('Performance warning:', warning);
        setCustomWarnings(prev => [
          ...prev,
          warning.message
        ]);
      }
    });

    return unsubscribe;
  }, [controller]);

  return (
    <div>
      <BatchControlPanel controller={controller} />

      {customWarnings.length > 0 && (
        <div style={{ padding: '1rem', background: '#ff6b6b', color: 'white' }}>
          <h3>Performance Warnings:</h3>
          {customWarnings.map((msg, i) => (
            <p key={i}>{msg}</p>
          ))}
          <button onClick={() => setCustomWarnings([])}>
            Clear Warnings
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Example 3: Manual Batch Control
 */
export const ManualControlExample: React.FC = () => {
  const { controller, state, actions } = useFPSBatchController();
  const [selectedBatch, setSelectedBatch] = useState<ComponentBatch>(
    ComponentBatch.GRASS
  );

  const handleEnableBatch = async () => {
    const success = await actions.enableBatch(selectedBatch);
    console.log(
      success ? `Enabled ${selectedBatch}` : `Failed to enable ${selectedBatch}`
    );
  };

  const handleDisableBatch = async () => {
    const success = await actions.disableBatch(selectedBatch);
    console.log(
      success ? `Disabled ${selectedBatch}` : `Failed to disable ${selectedBatch}`
    );
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <h3>Manual Batch Control</h3>
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value as ComponentBatch)}
        >
          {Object.values(ComponentBatch).map(batch => (
            <option key={batch} value={batch}>
              {batch}
            </option>
          ))}
        </select>

        <button onClick={handleEnableBatch}>Enable</button>
        <button onClick={handleDisableBatch}>Disable</button>
        <button onClick={actions.clearManualOverrides}>
          Clear All Overrides
        </button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <h4>Current State:</h4>
        <p>FPS: {state.currentFPS} (avg: {state.averageFPS})</p>
        <p>Enabled: {state.enabledBatches.join(', ')}</p>
        <p>Disabled: {state.disabledBatches.join(', ')}</p>
      </div>

      <BatchControlPanel controller={controller} />
    </div>
  );
};

/**
 * Example 4: Correlation Tracking
 */
export const CorrelationExample: React.FC = () => {
  const { controller } = useFPSBatchController();
  const [correlations, setCorrelations] = useState<any>({});

  useEffect(() => {
    const interval = setInterval(() => {
      const data = controller.exportCorrelationData();
      setCorrelations(data);
    }, 2000);

    return () => clearInterval(interval);
  }, [controller]);

  return (
    <div>
      <h3>FPS-to-Batch Correlations</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Batch</th>
            <th>Avg Impact</th>
            <th>Samples</th>
            <th>Enabled FPS</th>
            <th>Disabled FPS</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(correlations).map(([batch, data]: [string, any]) => (
            <tr key={batch}>
              <td>{batch}</td>
              <td>{data.averageImpact.toFixed(1)} FPS</td>
              <td>{data.sampleCount}</td>
              <td>
                {data.enabledFPS.length > 0
                  ? `${(data.enabledFPS.reduce((a: number, b: number) => a + b, 0) / data.enabledFPS.length).toFixed(1)}`
                  : 'N/A'}
              </td>
              <td>
                {data.disabledFPS.length > 0
                  ? `${(data.disabledFPS.reduce((a: number, b: number) => a + b, 0) / data.disabledFPS.length).toFixed(1)}`
                  : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => {
        const data = controller.exportCorrelationData();
        console.log('Correlation Data:', JSON.stringify(data, null, 2));
      }}>
        Export to Console
      </button>

      <BatchControlPanel controller={controller} />
    </div>
  );
};

/**
 * Example 5: Complete Integration with Scene
 */
export const CompleteIntegrationExample: React.FC = () => {
  const { controller, state, actions } = useFPSBatchController();
  const [showPanel, setShowPanel] = useState(false);

  // Example: Integrate with 3D scene
  useEffect(() => {
    // Listen for batch changes and update scene
    const unsubscribe = controller.getBatchManager().onBatchChange((event) => {
      console.log(`Batch ${event.batch} ${event.enabled ? 'enabled' : 'disabled'}`);

      // In real implementation, update Three.js scene here
      // Example:
      // if (event.batch === ComponentBatch.GRASS && event.enabled) {
      //   scene.add(grassMesh);
      // } else if (!event.enabled) {
      //   scene.remove(grassMesh);
      // }
    });

    return unsubscribe;
  }, [controller]);

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      {/* Scene container */}
      <div style={{ width: '100%', height: '100%', background: '#1a1a1a' }}>
        <div style={{ padding: '1rem', color: 'white' }}>
          <h1>3D Scene</h1>
          <div>FPS: {state.currentFPS}</div>
          <div>Batches: {state.enabledBatches.length}/{Object.keys(ComponentBatch).length}</div>
          <button onClick={() => setShowPanel(!showPanel)}>
            {showPanel ? 'Hide' : 'Show'} Controls
          </button>
        </div>
      </div>

      {/* Batch control panel */}
      {showPanel && (
        <BatchControlPanel
          controller={controller}
          initiallyOpen={true}
          onClose={() => setShowPanel(false)}
        />
      )}

      {/* Warning overlay */}
      {state.warnings.length > 0 && (
        <div style={{
          position: 'fixed',
          top: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255, 107, 107, 0.9)',
          color: 'white',
          padding: '1rem',
          borderRadius: '0.5rem',
          maxWidth: '500px'
        }}>
          {state.warnings.map((warning, i) => (
            <div key={i} style={{ marginBottom: '0.5rem' }}>
              <strong>{warning.type}:</strong> {warning.message}
              <button
                onClick={() => actions.dismissWarning(i)}
                style={{ marginLeft: '1rem' }}
              >
                Dismiss
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Example 6: Performance Testing
 */
export const PerformanceTestingExample: React.FC = () => {
  const { controller } = useFPSBatchController();
  const [testResults, setTestResults] = useState<string[]>([]);

  const runPerformanceTest = async () => {
    const results: string[] = [];

    // Test each batch
    for (const batch of Object.values(ComponentBatch)) {
      if (batch === ComponentBatch.COURTS_ONLY) continue;

      // Get baseline
      const before = controller.getFPSMonitor().getAverageFPS(30);
      results.push(`Testing ${batch}...`);

      // Enable batch
      await controller.enableBatch(batch);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for stabilization

      // Measure impact
      const after = controller.getFPSMonitor().getAverageFPS(30);
      const impact = before - after;
      results.push(`${batch}: ${impact.toFixed(1)} FPS impact`);

      // Disable batch
      await controller.disableBatch(batch);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setTestResults(results);
  };

  return (
    <div>
      <h3>Performance Testing</h3>
      <button onClick={runPerformanceTest}>Run Test</button>

      <pre style={{
        background: '#1a1a1a',
        color: '#00ff00',
        padding: '1rem',
        fontFamily: 'monospace'
      }}>
        {testResults.join('\n')}
      </pre>

      <BatchControlPanel controller={controller} />
    </div>
  );
};

export default {
  BasicExample,
  WithWarningHandler,
  ManualControlExample,
  CorrelationExample,
  CompleteIntegrationExample,
  PerformanceTestingExample
};
