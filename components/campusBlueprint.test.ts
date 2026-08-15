import { describe, expect, it } from 'vitest';
import { CAMPUS_BLUEPRINT, getCampusCamera } from './campusBlueprint';

describe('ACE exterior campus blueprint', () => {
  it('preserves the reference-bound silhouette contract', () => {
    expect(CAMPUS_BLUEPRINT.towers).toHaveLength(2);
    expect(CAMPUS_BLUEPRINT.towers.map((tower) => tower.side)).toEqual(['west', 'east']);
    expect(CAMPUS_BLUEPRINT.arches).toHaveLength(3);
    expect(CAMPUS_BLUEPRINT.floorElevations).toEqual([4, 17, 30, 43, 56]);
    expect(CAMPUS_BLUEPRINT.bridges.length).toBeGreaterThanOrEqual(3);
    expect(CAMPUS_BLUEPRINT.courts).toHaveLength(4);
    expect(CAMPUS_BLUEPRINT.livingWalls).toHaveLength(4);
  });

  it('keeps stable IDs and a deterministic authored arrival camera', () => {
    const ids = [
      ...CAMPUS_BLUEPRINT.towers,
      ...CAMPUS_BLUEPRINT.arches,
      ...CAMPUS_BLUEPRINT.bridges,
      ...CAMPUS_BLUEPRINT.courts,
      ...CAMPUS_BLUEPRINT.livingWalls,
    ].map((item) => item.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(getCampusCamera('arrival')).toEqual({
      position: [210, 112, 238],
      target: [0, 27, 8],
      fov: 38,
    });
    expect(getCampusCamera('capture')).toEqual(getCampusCamera('arrival'));
  });
});
