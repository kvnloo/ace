import { generateLawnTechScene, sceneStats } from './generateScene.ts';

const scene = generateLawnTechScene();
const stats = sceneStats(scene);
const required = ['site_naperville', 'building_lawntech', 'level_0', 'level_1', 'level_2', 'level_3', 'zone_grass-lab'];
const missing = required.filter((id) => !scene.nodes[id]);
const farmZones = Object.values(scene.nodes).filter(
  (node) => node.type === 'zone' && String(node.id).includes('grass'),
);

if (missing.length) {
  throw new Error(`missing nodes: ${missing.join(', ')}`);
}
if (stats.kinds.level !== 4) {
  throw new Error(`expected 4 levels, got ${stats.kinds.level}`);
}
if (farmZones.length !== 1) {
  throw new Error(`expected one grass-lab zone, got ${farmZones.length}`);
}
if (stats.hasFourFarmSections) {
  throw new Error('inferred farm sections leaked into the Pascal scene');
}
if ((scene.nodes.site_naperville.metadata as { envelope?: string }).envelope !== 'inferred-140x120') {
  throw new Error('site envelope stamp missing');
}

console.log(JSON.stringify({ ok: true, ...stats }, null, 2));
