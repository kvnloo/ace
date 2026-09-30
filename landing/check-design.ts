import fs from 'node:fs';
import path from 'node:path';

const read = (filePath: string) => fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf8');

const landing = read('components/AtlasLanding.tsx');
const nav = read('components/NavBar.tsx');
const specs = read('components/Specifications.tsx');
const app = read('App.tsx');
const css = read('styles/ace.css');
const html = read('index.html');

const requireText = (source: string, pattern: RegExp, message: string) => {
  if (!pattern.test(source)) throw new Error(message);
};

requireText(landing, /ace-core/, 'landing must keep the human-centered system core');
requireText(landing, /ace-loop-rail/, 'landing must expose the full feedback loop as a visible rail');
requireText(landing, /ace-signal-field/, 'landing must keep the quiet operating-beliefs field');
requireText(landing, /ace-paper-section/, 'landing must keep the high-contrast paper proof interlude');
requireText(landing, /The facility is the environment/, 'landing must retain the top-level ACE thesis');
requireText(nav, /ace-wordmark/, 'navigation must use ACE editorial chrome');
requireText(nav, /aria-current/, 'navigation must expose current-page state accessibly');
requireText(specs, /ace-spec-grid/, 'spec page must use the editorial matrix');
requireText(app, /ace-contact-layout/, 'contact page must use the editorial collaboration surface');
requireText(app, /ace-campus-shell/, 'campus must use the shared ACE visual system');

requireText(css, /Barlow Condensed/, 'display typography token missing');
requireText(css, /IBM Plex Mono/, 'mono typography token missing');
requireText(css, /prefers-reduced-motion/, 'reduced-motion fallback missing');
requireText(css, /@media \(max-width: 780px\)/, 'narrow-mobile design contract missing');
requireText(css, /ace-core-orbit/, 'hero orbit motion contract missing');
requireText(css, /\.ace-hero::before/, 'poster-scale ACE hero signature missing');
requireText(css, /\.ace-paper-section/, 'paper/ink editorial interlude missing');
requireText(css, /ace-map-controls/, 'campus controls design contract missing');
requireText(css, /ace-campus-enable-3d/, 'adaptive campus control missing');
requireText(read('components/experience/AceExperienceProvider.tsx'), /from 'lenis'/, 'Lenis runtime missing');
requireText(read('components/CampusExperience.tsx'), /aceQuality === 'lite'/, 'lite-mode campus gate missing');
requireText(read('App.tsx'), /DeferredGuide/, 'guide must remain interaction-deferred');
if (/framer-motion/.test(read('package.json'))) {
  throw new Error('public runtime must not regress to framer-motion');
}
if (/cdn\.tailwindcss\.com/.test(html)) {
  throw new Error('Tailwind browser CDN must stay removed');
}

requireText(html, /Barlow\+Condensed/, 'Barlow Condensed must be loaded');
requireText(html, /IBM\+Plex\+Mono/, 'IBM Plex Mono must be loaded');

const genericCardRegressions = [
  ['landing', landing],
  ['specifications', specs],
  ['navigation', nav],
].flatMap(([name, source]) => {
  const matches = source.match(/rounded-(?:2xl|3xl)/g) ?? [];
  return matches.map((match) => `${name}:${match}`);
});

if (genericCardRegressions.length > 0) {
  throw new Error(
    `core ACE surfaces regressed toward generic rounded-card UI: ${genericCardRegressions.join(', ')}`,
  );
}

console.log(JSON.stringify({
  ok: true,
  contracts: [
    'editorial typography',
    'human-centered hero',
    'loop rail',
    'poster-scale hero signature',
    'paper proof interlude',
    'quiet signal field',
    'responsive mobile',
    'reduced motion',
    'editorial specs',
    'editorial contact',
    'editorial campus',
  ],
}, null, 2));
