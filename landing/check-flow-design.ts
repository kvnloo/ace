import fs from 'node:fs';
import path from 'node:path';

const read = (filePath: string) => fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf8');

const css = read('styles/ace.css');
const landing = read('components/AtlasLanding.tsx');
const product = read('components/AtlasProduct.tsx');
const specs = read('components/Specifications.tsx');
const app = read('App.tsx');
const sketch = read('components/facility/SketchMap.tsx');
const scene = read('facility/generateScene.ts');
const theme = read('facility/theme.ts');

const requireText = (source: string, pattern: RegExp, message: string) => {
  if (!pattern.test(source)) throw new Error(message);
};
const forbidText = (source: string, pattern: RegExp, message: string) => {
  if (pattern.test(source)) throw new Error(message);
};

requireText(css, /--ace-bg:\s*#0[56789a-f][0-9a-f]{4}/i, 'ACE base must remain a deep navy family rather than green-black');
requireText(css, /--ace-signal:\s*#d[c-f]ff4[0-9a-f]/i, 'ACE tennis-lime signal token missing');
requireText(css, /--ace-glass:/, 'augmentation glass token missing');
requireText(css, /--ace-radius-human:/, 'human interaction radius token missing');
requireText(css, /--ace-motion-settle:/, 'semantic motion timing token missing');

forbidText(css, /\.ace-product-lane:hover\s*>\s*svg\s*\{[^}]*transform:/s, 'system lane hover must not use decorative icon transforms');
forbidText(css, /\.ace-page::after\s*\{[^}]*--ace-pointer|\.ace-page::after[\s\S]{0,400}var\(--ace-pointer-/s, 'global pointer-follow spotlight must be removed');
forbidText(css, /\.ace-signal-track\s*\{[^}]*var\(--ace-marquee-x/s, 'manifesto signal band must not move with scroll');
forbidText(css, /\.ace-core-orbit\s*\{[^}]*animation:\s*aceSpin/s, 'hero system must not autonomously orbit');

requireText(landing, /data-motion="stable-human"/, 'hero must declare stable-human motion semantics');
requireText(landing, /resolve-evidence/, 'principles must expose evidence-resolution semantics');
requireText(landing, /branch-counterfactual/, 'principles must expose counterfactual semantics');
requireText(landing, /ace-loop-signal/, 'feedback loop needs one continuous semantic signal');
requireText(product, /Understand:\s*'clarify'/, 'Understand lane must use clarify semantics');
requireText(product, /Simulate:\s*'branch'/, 'Simulate lane must use branch semantics');
requireText(product, /Connect:\s*'contextual-connect'/, 'Connect lane must use contextual connection semantics');
requireText(product, /Improve:\s*'compare'/, 'Improve lane must use comparative semantics');

requireText(specs, /data-stamp=\{category\.stamp\}/, 'spec cards must expose epistemic stamp to material layer');
forbidText(specs, /ace-spec-enter/, 'spec route should not use staggered entrance animation');

const goal = app.indexOf('What do you want to improve?');
const name = app.indexOf('Full name');
if (goal < 0 || name < 0 || goal > name) {
  throw new Error('contact flow must ask the human goal before identity fields');
}
requireText(app, /ace-contact-progressive/, 'contact form needs progressive goal-first structure');

requireText(theme, /ACE_FACILITY_THEME/, 'facility theme must be centralized');
requireText(theme, /environment/, 'facility theme must define environmental substrate');
requireText(theme, /signal/, 'facility theme must define active signal');
requireText(theme, /spec/, 'facility theme must define SPEC material');
requireText(theme, /vision/, 'facility theme must define VISION material');
requireText(scene, /ACE_FACILITY_THEME/, 'Pascal scene must consume shared facility theme');
requireText(sketch, /ace-augmentation-glass/, 'campus overlays must use augmentation glass semantics');

console.log(JSON.stringify({
  ok: true,
  contracts: [
    'deep-navy + tennis-lime identity',
    'glass means augmentation',
    'human-centered radius',
    'stable human hero',
    'continuous loop signal',
    'semantic system-lane motion',
    'epistemic materials',
    'low-motion specification route',
    'goal-first contact',
    'shared facility palette',
  ],
}, null, 2));
