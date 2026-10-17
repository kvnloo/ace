import { FACILITY_COLORS } from './theme.ts';

/** Peak-performance campus program mined from origin/enhance/3D. Not origin measurements. */

export const APEX_BUILDING_ID = 'building_apex';
export const APEX_LEVEL_ID = 'level_apex';
export const APEX_WIDTH = 90;
export const APEX_DEPTH = 90;
export const APEX_GAP = 40;

export type VisionRoom = {
  id: string;
  name: string;
  color: string;
  occupancy: string;
  cluster: 'labs' | 'recovery' | 'training';
};

/** Six APEX labs plus gym / pool / clubhouse. Capacities and cell size are inferred. */
export const APEX_ROOMS: VisionRoom[] = [
  {
    id: 'biometric',
    name: 'Biometric lab',
    color: FACILITY_COLORS.vision.biometric,
    occupancy: 'VISION — VO2 / force plate / mocap language; capacity unspecified',
    cluster: 'labs',
  },
  {
    id: 'cognitive',
    name: 'Cognitive lab',
    color: FACILITY_COLORS.vision.cognitive,
    occupancy: 'VISION — cognitive training; capacity unspecified',
    cluster: 'labs',
  },
  {
    id: 'movement',
    name: 'Movement studio',
    color: FACILITY_COLORS.vision.movement,
    occupancy: 'VISION — movement optimization; capacity unspecified',
    cluster: 'labs',
  },
  {
    id: 'research',
    name: 'Research integration',
    color: FACILITY_COLORS.vision.research,
    occupancy: 'VISION — scientists / protocol translation; capacity unspecified',
    cluster: 'labs',
  },
  {
    id: 'nutrition',
    name: 'Nutrition kitchen',
    color: FACILITY_COLORS.vision.nutrition,
    occupancy: 'VISION — personalized nutrition language; capacity unspecified',
    cluster: 'labs',
  },
  {
    id: 'recovery',
    name: 'Recovery / physiotherapy',
    color: FACILITY_COLORS.vision.recovery,
    occupancy: 'VISION — recovery suite + physio; capacity unspecified',
    cluster: 'recovery',
  },
  {
    id: 'gym',
    name: 'Gym',
    color: FACILITY_COLORS.vision.gym,
    occupancy: 'VISION — all-sports training floor; capacity unspecified',
    cluster: 'training',
  },
  {
    id: 'pool',
    name: 'Pool',
    color: FACILITY_COLORS.vision.pool,
    occupancy: 'VISION — aquatic training; capacity unspecified',
    cluster: 'training',
  },
  {
    id: 'clubhouse',
    name: 'Clubhouse',
    color: FACILITY_COLORS.vision.clubhouse,
    occupancy: 'VISION — scientists / athletes / members; capacity unspecified',
    cluster: 'training',
  },
];

export const APEX_ZONE_IDS = APEX_ROOMS.map((room) => `zone_${room.id}`);
