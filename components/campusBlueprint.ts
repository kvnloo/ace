export type Vec3 = [number, number, number];

export const CAMPUS_BLUEPRINT = {
  towers: [
    { id: 'west-bio-tower', side: 'west' as const, position: [-42, 32, 0] as Vec3, size: [54, 64, 66] as Vec3 },
    { id: 'east-bio-tower', side: 'east' as const, position: [42, 32, 0] as Vec3, size: [54, 64, 66] as Vec3 },
  ],
  arches: [
    { id: 'arrival-arch', z: 38, height: 68 },
    { id: 'atrium-arch', z: 0, height: 70 },
    { id: 'garden-arch', z: -25, height: 64 },
  ],
  floorElevations: [4, 17, 30, 43, 56],
  bridges: [
    { id: 'bridge-low', y: 17 },
    { id: 'bridge-mid', y: 30 },
    { id: 'bridge-high', y: 43 },
  ],
  courts: [
    { id: 'court-hard', color: '#1769aa', position: [-72, 0.25, 82] as Vec3 },
    { id: 'court-grass', color: '#71a64d', position: [-24, 0.25, 82] as Vec3 },
    { id: 'court-clay', color: '#c96645', position: [24, 0.25, 82] as Vec3 },
    { id: 'court-ochre', color: '#c6a545', position: [72, 0.25, 82] as Vec3 },
  ],
  livingWalls: [
    { id: 'west-wall-front', position: [-42, 38, 34.4] as Vec3 },
    { id: 'east-wall-front', position: [42, 38, 34.4] as Vec3 },
    { id: 'west-wall-rear', position: [-42, 38, -27] as Vec3 },
    { id: 'east-wall-rear', position: [42, 38, -27] as Vec3 },
  ],
  cameras: {
    arrival: { position: [210, 112, 238] as Vec3, target: [0, 27, 8] as Vec3, fov: 38 },
    orbit: { position: [210, 112, 238] as Vec3, target: [0, 27, 8] as Vec3, fov: 38 },
  },
} as const;

export type CampusCameraName = 'arrival' | 'orbit' | 'capture';

export function getCampusCamera(name: CampusCameraName) {
  return CAMPUS_BLUEPRINT.cameras[name === 'capture' ? 'arrival' : name];
}
