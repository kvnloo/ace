import fs from 'node:fs';
import path from 'node:path';

const read = (filePath: string) => fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf8');
const manifest = JSON.parse(read('public/twin/ace-digital-twin-v1.json'));
const campus = read('components/CampusExperience.tsx');
const renderer = read('components/TwinExportCampus.tsx');
const fallback = read('components/twin/TwinExportFallback.tsx');
const adapter = read('twin/adapter.ts');
const app = read('App.tsx');

if (manifest.schemaVersion !== 'ace.public-campus.v1') {
  throw new Error('public twin export schema drift');
}
if (manifest.courts.length !== 11) {
  throw new Error(`expected 11 exported courts, got ${manifest.courts.length}`);
}
if (manifest.rooms.length !== 9) {
  throw new Error(`expected 9 exported rooms, got ${manifest.rooms.length}`);
}
if (!manifest.provenance.runtimeStateExcluded) {
  throw new Error('public twin export must exclude mutable runtime state');
}
if ('repository' in manifest.source || 'commit' in manifest.source) {
  throw new Error('public snapshot must not leak private repository provenance');
}
if (!/TwinExportCampus/.test(campus) || /PascalFacility/.test(campus)) {
  throw new Error('CampusExperience must use the real export renderer, not Pascal');
}
if (!/!enable3d/.test(campus) || !/TwinExportFallback/.test(campus)) {
  throw new Error('Campus must default to the same export-backed fallback before 3D opt-in');
}
if (!/frameloop="demand"/.test(renderer)) {
  throw new Error('twin renderer must remain demand-rendered while idle');
}
if (!/autoRotate=\{false\}/.test(renderer)) {
  throw new Error('twin camera must not auto-rotate');
}
if (!/courtFeature/.test(renderer) || !/roomFeature/.test(renderer)) {
  throw new Error('exported geometry must retain contextual selection');
}
if (!/ACE DIGITAL TWIN · STRUCTURAL EXPORT/.test(fallback)) {
  throw new Error('fallback must identify the real export');
}
if (!/validateTwinExport/.test(adapter)) {
  throw new Error('public twin snapshot must be schema-validated');
}
if (!/SPEC · PUBLIC EXPORT/.test(app)) {
  throw new Error('Campus maturity label must reflect exported SPEC geometry');
}

console.log(JSON.stringify({
  ok: true,
  schema: manifest.schemaVersion,
  exportId: manifest.source.exportId,
  courts: manifest.courts.length,
  rooms: manifest.rooms.length,
  runtimeStateExcluded: manifest.provenance.runtimeStateExcluded,
}, null, 2));
