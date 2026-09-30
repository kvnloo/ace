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
const motion = read('landing/motion.ts');
const html = read('index.html');
const experience = read('components/experience/AceExperienceProvider.tsx');

const requireText = (source: string, pattern: RegExp, message: string) => {
  if (!pattern.test(source)) throw new Error(message);
};
const forbidText = (source: string, pattern: RegExp, message: string) => {
  if (pattern.test(source)) throw new Error(message);
};

requireText(css, /--ace-bg:\s*#071426/i, 'ACE base must remain the canonical deep navy substrate');
requireText(css, /--ace-signal:\s*#dfff4f/i, 'ACE must retain the original tennis-green signal');
requireText(css, /--ace-glass:/, 'augmentation glass token missing');
requireText(css, /--ace-radius-human:/, 'human interaction radius token missing');
requireText(css, /--ace-motion-settle:/, 'semantic motion timing token missing');
requireText(html, /<meta name="theme-color" content="#071426"\s*\/>/i, 'bootstrap theme-color must match the canonical navy substrate');
requireText(html, /:root\s*\{[^}]*background:\s*#071426/s, 'bootstrap :root background must match the canonical navy substrate');
requireText(html, /html\s*\{[^}]*background:\s*#071426/s, 'bootstrap html background must match the canonical navy substrate');
forbidText(html, /\\n\s*<link rel="icon"/i, 'index.html must not render escaped newline text before the app mounts');

forbidText(css, /\.ace-product-lane:hover\s*>\s*svg\s*\{[^}]*transform:/s, 'system lane hover must not use decorative icon transforms');
forbidText(css, /\.ace-page::after\s*\{[^}]*--ace-pointer|\.ace-page::after[\s\S]{0,400}var\(--ace-pointer-/s, 'global pointer-follow spotlight must be removed');
forbidText(css, /\.ace-signal-track\s*\{[^}]*var\(--ace-marquee-x/s, 'manifesto signal band must not move with scroll');
forbidText(css, /\.ace-core-orbit\s*\{[^}]*animation:\s*aceSpin/s, 'hero system must not autonomously orbit');
forbidText(css, /rotate\(calc\(var\(--ace-scroll\)/, 'hero system must not rotate merely because the page scrolls');
forbidText(css, /\[data-ace-reveal\]\s*\{[^}]*translate3d/s, 'section reveal must clarify in place instead of moving content into position');
forbidText(css, /\.ace-action-primary::before|\.ace-nav-cta::before/, 'primary actions must not use decorative light-sweep pseudo elements');
forbidText(css, /html\[data-ace-scrolling="true"\]\s+\.ace-wordmark-mark\s*\{[^}]*transform:/s, 'wordmark must not pulse or scale merely because the page is scrolling');
forbidText(css, /\.ace-flow-row:hover[\s\S]{0,320}translateY\(-2px\)/, 'content surfaces must acknowledge attention without lift-on-hover');
forbidText(css, /@keyframes\s+aceHeroIn[\s\S]{0,220}translate/i, 'hero entry should resolve optically in place, not travel into view');
forbidText(css, /@keyframes\s+aceRouteFallbackIn[\s\S]{0,180}translate/i, 'route fallback should preserve spatial context');
forbidText(css, /@keyframes\s+acePanelIn[\s\S]{0,220}translate/i, 'augmentation panels should resolve where they belong instead of flying in');
forbidText(css, /--ace-scroll-px|--ace-velocity/, 'ambient scroll parallax/velocity should not animate the environment');
forbidText(experience, /--ace-scroll-px|--ace-velocity|--ace-grid-y|--ace-marquee-x/, 'runtime should publish only narrative scroll state, not decorative motion fields');
forbidText(css, /@keyframes\s+ace(?:RouteOut|RouteIn|ContentOut|ContentIn|MenuIn|MenuItemIn)[\s\S]{0,260}transform:/i, 'navigation continuity should resolve in place instead of moving the viewport');
forbidText(css, /animation:\s*ace(?:Pulse|Cue|Corridor)\b/i, 'continuous decorative loops must not run in the flow-state system');

requireText(landing, /data-motion="stable-human"/, 'hero must declare stable-human motion semantics');
requireText(motion, /'Evidence before optimization'[\s\S]*resolve-evidence/, 'principles must expose evidence-resolution semantics');
requireText(motion, /'Simulation must earn trust'[\s\S]*branch-counterfactual/, 'principles must expose counterfactual semantics');
requireText(landing, /ace-loop-signal/, 'feedback loop needs one continuous semantic signal');
requireText(motion, /Goal:[\s\S]*Observe:[\s\S]*Model:[\s\S]*Hypothesize:[\s\S]*Simulate:[\s\S]*Connect:[\s\S]*Intervene:[\s\S]*Measure:[\s\S]*Verify:[\s\S]*Learn:/, 'all ten loop steps need intentional motion semantics');
if ((motion.match(/teaches:/g) ?? []).length < 18) throw new Error('semantic motion entries must explain what each effect teaches');
requireText(motion, /Understand:[\s\S]*behavior:\s*'clarify'/, 'Understand lane must use clarify semantics');
requireText(motion, /Simulate:[\s\S]*behavior:\s*'branch'/, 'Simulate lane must use branch semantics');
requireText(motion, /Connect:[\s\S]*behavior:\s*'contextual-connect'/, 'Connect lane must use contextual connection semantics');
requireText(motion, /Improve:[\s\S]*behavior:\s*'compare'/, 'Improve lane must use comparative semantics');

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
requireText(app, /ace-feature-card-state/, 'campus selection must expose compact epistemic annotation state');
requireText(css, /Campus attention hierarchy/, 'campus must keep the world primary and attention-responsive');

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
