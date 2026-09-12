import { generateLawnTechScene, sceneStats } from './generateScene.ts';
import { APEX_BUILDING_ID, APEX_LEVEL_ID, APEX_ROOMS, APEX_ZONE_IDS } from './vision.ts';

const scene = generateLawnTechScene();
const stats = sceneStats(scene);
const required = [
  'site_naperville',
  'building_lawntech',
  'level_0',
  'level_1',
  'level_2',
  'level_3',
  'zone_grass-lab',
  APEX_BUILDING_ID,
  APEX_LEVEL_ID,
  ...APEX_ZONE_IDS,
];
const missing = required.filter((id) => !scene.nodes[id]);
const farmZones = Object.values(scene.nodes).filter(
  (node) => node.type === 'zone' && String(node.id).includes('grass'),
);
const visionZones = Object.values(scene.nodes).filter((node) => {
  if (node.type !== 'zone') return false;
  return (node.metadata as { honesty?: string } | undefined)?.honesty === 'VISION';
});
const siteMeta = scene.nodes.site_naperville.metadata as {
  envelope?: string;
  vision?: string;
};

if (missing.length) {
  throw new Error(`missing nodes: ${missing.join(', ')}`);
}
if (stats.kinds.building !== 2) {
  throw new Error(`expected 2 buildings, got ${stats.kinds.building}`);
}
if (stats.kinds.level !== 5) {
  throw new Error(`expected 4 LawnTech levels + 1 APEX level, got ${stats.kinds.level}`);
}
if (farmZones.length !== 1) {
  throw new Error(`expected one grass-lab zone, got ${farmZones.length}`);
}
if (visionZones.length !== APEX_ROOMS.length) {
  throw new Error(`expected ${APEX_ROOMS.length} VISION zones, got ${visionZones.length}`);
}
if (stats.hasFourFarmSections) {
  throw new Error('inferred farm sections leaked into the Pascal scene');
}
if (siteMeta.envelope !== 'inferred-140x120') {
  throw new Error('site envelope stamp missing');
}
if (siteMeta.vision !== 'peak-performance-campus') {
  throw new Error('site vision stamp missing');
}

const site = scene.nodes.site_naperville as { children?: string[] };
if (!site.children?.includes('building_lawntech') || !site.children?.includes(APEX_BUILDING_ID)) {
  throw new Error('site must parent both LawnTech and APEX');
}

console.log(
  JSON.stringify(
    {
      ok: true,
      ...stats,
      visionZones: visionZones.length,
      apexRooms: APEX_ROOMS.map((room) => room.id),
    },
    null,
    2,
  ),
);
