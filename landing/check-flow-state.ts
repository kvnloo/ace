import fs from 'node:fs';
import path from 'node:path';

const read = (filePath: string) => fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf8');
const requireText = (source: string, pattern: RegExp, message: string) => {
  if (!pattern.test(source)) throw new Error(message);
};
const forbidText = (source: string, pattern: RegExp, message: string) => {
  if (pattern.test(source)) throw new Error(message);
};

const css = read('styles/flow-state.css');
const landing = read('components/AtlasLanding.tsx');
const product = read('components/AtlasProduct.tsx');
const spec = read('components/Specifications.tsx');
const app = read('App.tsx');
const contact = read('components/ContactExperience.tsx');
const motion = read('landing/motion.ts');
const scene = read('facility/generateScene.ts');
const vision = read('facility/vision.ts');
const theme = read('facility/theme.ts');
const index = read('index.tsx');
const designDoc = read('docs/DESIGN.md');

requireText(index, /flow-state\.css/, 'flow-state layer must load after the nightly experiment layer');
requireText(designDoc, /invisible augmentation/i, 'design constitution must preserve the invisible-augmentation thesis');
requireText(designDoc, /more interactive states with less visible motion/i, 'design constitution must preserve the interaction-density rule');
forbidText(designDoc, /slow orbital system motion|one marquee \/ signal rail/i, 'obsolete nightly motion guidance must not return');
requireText(css, /--ace-bg:\s*#071426/i, 'ACE navy substrate missing');
requireText(css, /--ace-signal:\s*#DFFF4F/i, 'legacy tennis-lime signal must be restored');
requireText(css, /--ace-glass-bg:/, 'augmentation glass token missing');
requireText(css, /\.ace-core-trace-signal/, 'continuous feedback-loop signal missing');
requireText(css, /\.ace-core-orbit\s*\{[^}]*transform:\s*none\s*!important/s, 'hero orbit must remain spatially stable');
requireText(css, /\[data-ace-reveal\]\s*\{[^}]*transform:\s*none\s*!important/s, 'reveal motion must not translate content');
requireText(css, /\.ace-scroll-cue i\s*\{[^}]*animation:\s*none\s*!important/s, 'scroll cue must not pulse autonomously');
requireText(css, /\.ace-action-primary::before[\s\S]*content:\s*none\s*!important/, 'decorative CTA shine sweep must stay disabled');
requireText(css, /\.ace-progressive-field/, 'goal-first contact progressive disclosure styling missing');
requireText(css, /prefers-reduced-motion/, 'reduced-motion flow-state rules missing');

requireText(motion, /Goal:\s*'anchor'/, 'Goal must map to anchor semantics');
requireText(motion, /Simulate:\s*'branch'/, 'Simulation must map to branching semantics');
requireText(motion, /Verify:\s*'verify'/, 'Verification semantics missing');
requireText(landing, /ace-core-trace-signal/, 'home must render one continuous loop signal');
requireText(landing, /data-principle=/, 'principles need semantic hooks');
forbidText(landing, /ace-signal-track/, 'autonomous marquee should not remain on the flow-state branch');

requireText(product, /data-motion=/, 'system lanes must expose semantic motion intent');
forbidText(css, /\.ace-product-lane:hover > svg\s*\{[^}]*transform:/s, 'system hover must not use decorative icon transforms');

requireText(spec, /data-stamp=\{category\.stamp\}/, 'spec material must derive from epistemic stamp');
forbidText(spec, /ace-spec-enter/, 'spec route must not stagger/fly cards into place');

requireText(contact, /What do you want ACE to help you improve\?/, 'contact must begin with the human goal');
requireText(contact, /data-open=\{hasGoal/, 'contact must progressively disclose context after goal');
requireText(app, /ContactExperience/, 'App must use the goal-first contact experience');

requireText(scene, /FACILITY_COLORS/, 'Pascal scene must use shared facility theme');
requireText(vision, /FACILITY_COLORS/, 'VISION rooms must use shared facility theme');
requireText(theme, /ACE_ENVIRONMENT/, 'facility environment tokens missing');
requireText(theme, /signal:\s*'#DFFF4F'/, 'facility signal must match ACE brand');
forbidText(css, /animation:\s*aceCorridor/, 'campus connectors must not autonomously shuttle');
forbidText(css, /transform:\s*rotate\([^)]*\).*ace-wordmark/s, 'wordmark should not perform decorative rotation');

console.log(JSON.stringify({
  ok: true,
  contracts: [
    'navy + tennis-lime identity',
    'glass means augmentation',
    'human anchor',
    'continuous semantic loop signal',
    'semantic lane motion',
    'low-motion spec',
    'goal-first contact',
    'shared campus palette',
    'no autonomous marquee/corridor motion',
    'reduced motion parity',
  ],
}, null, 2));
