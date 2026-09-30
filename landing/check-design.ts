import fs from 'node:fs';

const read = (path: string) => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

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
requireText(landing, /ace-signal-band/, 'landing must keep the high-contrast signal band');
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
requireText(css, /ace-map-controls/, 'campus controls design contract missing');

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
    'signal band',
    'responsive mobile',
    'reduced motion',
    'editorial specs',
    'editorial contact',
    'editorial campus',
  ],
}, null, 2));
