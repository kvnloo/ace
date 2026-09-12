import { FeatureData } from '../types';

/** Inferred envelope from the earlier Three.js sketch — not in the origin spec. */
export const BUILDING_WIDTH = 140;
export const BUILDING_DEPTH = 120;
/** Sport-hall storey, not the 20 m theater height used by the old primitive scene. */
export const WALL_HEIGHT = 10;
export const WALL_THICKNESS = 0.35;

export const SITE_ID = 'site_naperville';
export const BUILDING_ID = 'building_lawntech';

export type FloorLevel = 'ALL' | 0 | 1 | 2 | 3;
export type AnnotationMode = 'NONE' | 'LABELS' | 'MEASUREMENTS';

export const FEATURES: FeatureData[] = [
  {
    id: 'ground_tennis',
    title: 'Ground: Tennis Arena',
    description:
      '24 tennis courts (hard, clay, grass, wood) plus a pro shop. Surface split is unspecified in origin — this sketch does not invent 6/6/6/6.',
    icon: '🎾',
    position: [0, 5, 20],
  },
  {
    id: 'level1_racquet',
    title: 'L1: Racquet Mezzanine',
    description: '16 badminton, 4 squash, 16 table tennis.',
    icon: '🏸',
    position: [-20, 15, 0],
  },
  {
    id: 'level2_social',
    title: 'L2: Pickleball & Heritage',
    description: '8 pickleball courts and 1 real tennis court.',
    icon: '🏓',
    position: [20, 25, 0],
  },
  {
    id: 'level3_farm',
    title: 'L3: Vertical Grass Lab',
    description:
      '500 m² per section (origin). Section count is unspecified — this sketch is one lab zone, not four inferred racks.',
    icon: '🌱',
    position: [0, 35, 0],
  },
];

export const SKETCH_BY_FLOOR: Record<
  string,
  { title: string; note: string; variant: 'tennis' | 'badminton' | 'pickle' | 'farm' | 'campus' }
> = {
  ALL: {
    title: 'Naperville facility',
    note: '24 tennis · grass lab · Pascal / CSS sketch',
    variant: 'campus',
  },
  '0': {
    title: 'Ground: Tennis arena',
    note: '24 courts · hard / clay / grass / wood',
    variant: 'tennis',
  },
  '1': {
    title: 'L1: Racquet mezzanine',
    note: '16 badminton · 4 squash · 16 table tennis',
    variant: 'badminton',
  },
  '2': {
    title: 'L2: Pickleball & heritage',
    note: '8 pickleball · 1 real tennis',
    variant: 'pickle',
  },
  '3': {
    title: 'L3: Vertical grass lab',
    note: '500 m² per section · section count unspecified',
    variant: 'farm',
  },
};

export function levelNodeId(floor: 0 | 1 | 2 | 3): `level_${string}` {
  return `level_${floor}`;
}
