import React, { useEffect, useState } from 'react';
import * as THREE from 'three';

interface DiagnosticInfo {
  webgl: boolean;
  webgl2: boolean;
  threeLoaded: boolean;
  canvasFound: boolean;
  errors: string[];
  warnings: string[];
  renderer: string | null;
  components: { name: string; loaded: boolean }[];
}

const ThreeSceneDiagnostic: React.FC = () => {
  const [info, setInfo] = useState<DiagnosticInfo>({
    webgl: false,
    webgl2: false,
    threeLoaded: false,
    canvasFound: false,
    errors: [],
    warnings: [],
    renderer: null,
    components: []
  });

  useEffect(() => {
    const diagnostic: DiagnosticInfo = {
      webgl: false,
      webgl2: false,
      threeLoaded: false,
      canvasFound: false,
      errors: [],
      warnings: [],
      renderer: null,
      components: []
    };

    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      diagnostic.webgl = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      diagnostic.webgl2 = !!canvas.getContext('webgl2');
    } catch (e) {
      diagnostic.errors.push(`WebGL check failed: ${e}`);
    }

    // Check Three.js
    diagnostic.threeLoaded = typeof THREE !== 'undefined';
    if (diagnostic.threeLoaded) {
      diagnostic.renderer = THREE.REVISION || 'Unknown version';
    }

    // Check for canvas elements
    const canvases = document.querySelectorAll('canvas');
    diagnostic.canvasFound = canvases.length > 0;
    if (canvases.length > 0) {
      diagnostic.warnings.push(`Found ${canvases.length} canvas element(s)`);
    }

    // Intercept console errors
    const originalError = console.error;
    const capturedErrors: string[] = [];
    console.error = (...args) => {
      capturedErrors.push(args.join(' '));
      originalError(...args);
    };

    // Check component loading
    const componentsToCheck = [
      'TennisCourt',
      'FloorPlate',
      'BuildingShell',
      'ReceptionArea',
      'ParkingLot',
      'RoboticGrassSystem',
      'TransportPods',
      'HydroponicsSystem'
    ];

    componentsToCheck.forEach(comp => {
      diagnostic.components.push({
        name: comp,
        loaded: false // Will be updated if component renders
      });
    });

    // Wait a bit to capture any async errors
    setTimeout(() => {
      diagnostic.errors.push(...capturedErrors);
      console.error = originalError; // Restore original
      setInfo(diagnostic);
    }, 2000);

    // Check for React Three Fiber
    const r3fCheck = document.querySelector('[data-r3f]');
    if (!r3fCheck) {
      diagnostic.errors.push('React Three Fiber canvas not found - Canvas component may not be rendering');
    }

    setInfo(diagnostic);
  }, []);

  return (
    <div className="fixed top-20 left-4 z-[9999] bg-black/90 text-white p-4 rounded-lg max-w-md border border-yellow-400 font-mono text-xs pointer-events-none">
      <h3 className="text-yellow-400 font-bold mb-2">🔍 3D SCENE DIAGNOSTIC</h3>

      <div className="space-y-1">
        <div className={`${info.webgl ? 'text-green-400' : 'text-red-400'}`}>
          {info.webgl ? '✅' : '❌'} WebGL: {info.webgl ? 'Supported' : 'Not supported'}
        </div>

        <div className={`${info.webgl2 ? 'text-green-400' : 'text-yellow-400'}`}>
          {info.webgl2 ? '✅' : '⚠️'} WebGL2: {info.webgl2 ? 'Supported' : 'Not supported'}
        </div>

        <div className={`${info.threeLoaded ? 'text-green-400' : 'text-red-400'}`}>
          {info.threeLoaded ? '✅' : '❌'} Three.js: {info.threeLoaded ? `Loaded (r${info.renderer})` : 'Not loaded'}
        </div>

        <div className={`${info.canvasFound ? 'text-green-400' : 'text-red-400'}`}>
          {info.canvasFound ? '✅' : '❌'} Canvas: {info.canvasFound ? 'Found' : 'Not found'}
        </div>
      </div>

      {info.errors.length > 0 && (
        <div className="mt-2 p-2 bg-red-900/50 rounded">
          <div className="text-red-400 font-bold">Errors:</div>
          {info.errors.map((err, i) => (
            <div key={i} className="text-red-300 text-xs mt-1">
              • {err.substring(0, 100)}...
            </div>
          ))}
        </div>
      )}

      {info.warnings.length > 0 && (
        <div className="mt-2 p-2 bg-yellow-900/50 rounded">
          <div className="text-yellow-400 font-bold">Warnings:</div>
          {info.warnings.map((warn, i) => (
            <div key={i} className="text-yellow-300 text-xs mt-1">
              • {warn}
            </div>
          ))}
        </div>
      )}

      <div className="mt-2 text-xs text-gray-200">
        Check browser console for full errors
      </div>
    </div>
  );
};

export default ThreeSceneDiagnostic;