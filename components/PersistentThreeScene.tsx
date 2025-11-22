import React from 'react';
import ThreeScene from './ThreeScene';
import TestScene from './TestScene';
import BasicThreeScene from './BasicThreeScene';
import type { FeatureData } from '../types';

interface PersistentThreeSceneProps {
  onFeatureSelect: (feature: FeatureData) => void;
}

/**
 * PersistentThreeScene - Wrapper to prevent canvas blanking
 *
 * This component ensures the ThreeScene canvas stays mounted
 * and visible after loading completes, preventing the blank
 * canvas issue.
 */
const PersistentThreeScene: React.FC<PersistentThreeSceneProps> = ({ onFeatureSelect }) => {
  // TEMPORARY: Using pure Three.js due to R3F/React 19 compatibility issue
  const USE_BASIC_SCENE = true;

  if (USE_BASIC_SCENE) {
    return (
      <div className="w-full h-full">
        <BasicThreeScene />
      </div>
    );
  }

  // R3F version (currently broken with React 19)
  const USE_TEST_SCENE = false;

  if (USE_TEST_SCENE) {
    return (
      <div className="w-full h-full">
        <TestScene />
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ThreeScene onFeatureSelect={onFeatureSelect} />
    </div>
  );
};

export default PersistentThreeScene;
