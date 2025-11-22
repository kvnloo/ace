import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import Grass from '../components/Grass';

describe('Grass Component', () => {
  it('should render without crashing', () => {
    const { container } = render(
      <Canvas>
        <Grass
          position={[0, 0, 0]}
          size={[10, 22]}
          bladeCount={100}
          color="#4d7c0f"
          animated={false}
        />
      </Canvas>
    );
    expect(container).toBeTruthy();
  });

  it('should accept custom blade count', () => {
    const { container } = render(
      <Canvas>
        <Grass
          position={[0, 0, 0]}
          size={[10, 22]}
          bladeCount={500}
          color="#4d7c0f"
          animated={true}
        />
      </Canvas>
    );
    expect(container).toBeTruthy();
  });

  it('should accept custom color', () => {
    const { container } = render(
      <Canvas>
        <Grass
          position={[0, 0, 0]}
          size={[5, 10]}
          bladeCount={100}
          color="#16a34a"
          animated={false}
        />
      </Canvas>
    );
    expect(container).toBeTruthy();
  });

  it('should work with default parameters', () => {
    const { container } = render(
      <Canvas>
        <Grass
          position={[0, 0, 0]}
          size={[10, 22]}
        />
      </Canvas>
    );
    expect(container).toBeTruthy();
  });
});
