import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import { CharacterSystem } from '../components/CharacterSystem';

describe('CharacterSystem', () => {
  it('should render without crashing', () => {
    const { container } = render(
      <Canvas>
        <CharacterSystem enabled={true} />
      </Canvas>
    );
    expect(container).toBeTruthy();
  });

  it('should respect enabled prop', () => {
    const { container: enabledContainer } = render(
      <Canvas>
        <CharacterSystem enabled={true} />
      </Canvas>
    );
    expect(enabledContainer.querySelector('group[name="character-system"]')).toBeTruthy();

    const { container: disabledContainer } = render(
      <Canvas>
        <CharacterSystem enabled={false} />
      </Canvas>
    );
    // When disabled, component returns null
    expect(disabledContainer.querySelector('group[name="character-system"]')).toBeNull();
  });

  it('should accept custom character counts', () => {
    const { container } = render(
      <Canvas>
        <CharacterSystem
          playerCount={24}
          coachCount={6}
          staffCount={4}
          visitorCount={10}
          spectatorCount={100}
          enabled={true}
        />
      </Canvas>
    );
    expect(container).toBeTruthy();
  });

  it('should accept custom court positions', () => {
    const customPositions: Array<[number, number, number]> = [
      [0, 0, 0],
      [10, 0, 0],
      [20, 0, 0],
    ];

    const { container } = render(
      <Canvas>
        <CharacterSystem
          courtPositions={customPositions}
          playerCount={6}
          enabled={true}
        />
      </Canvas>
    );
    expect(container).toBeTruthy();
  });
});
