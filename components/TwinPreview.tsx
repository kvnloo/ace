// "Enter twin" for the pretotype: owner-approved films of the simulated ops twin and
// zoomable gigapixel stills of the proposed campus. Manifest-driven; the full twin links here later.
import React, { useEffect, useRef, useState } from 'react';
import '../styles/twin-preview.css';

export type TwinStatus = 'VISION' | 'SIMULATED' | 'SPEC' | 'RESEARCH';
export interface TwinItem {
  id: string;
  kind: 'deepzoom' | 'film';
  title: string;
  caption: string;
  status: TwinStatus;
  source: string;       // e.g. "kvnloo/ace-digital-twin@fb8e1fa · Blender Cycles"
  captured: string;     // ISO date
  approved: boolean;    // only owner-approved items render without ?drafts=1
  dzi?: string;         // deepzoom: path to .dzi relative to the assets base
  preview?: string;     // still fallback / poster (relative)
  src?: string;         // film mp4 (relative)
  pixels?: [number, number];
  durationS?: number;
}
export interface TwinManifest { schema: 'ace.twin-preview.v1'; updated: string; items: TwinItem[] }

const ASSETS = (import.meta as unknown as { env: Record<string, string | undefined> }).env.VITE_ACE_ASSETS_BASE ?? 'https://kvnloo.github.io/ace-assets/';
const url = (p: string) => new URL(p, ASSETS).toString();

export function visibleItems(m: TwinManifest | null, drafts: boolean): TwinItem[] {
  return (m?.items ?? []).filter(i => i.approved || drafts);
}

const DeepZoom: React.FC<{ item: TwinItem }> = ({ item }) => {
  const el = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let viewer: { destroy(): void } | null = null; let cancelled = false;
    import('openseadragon').then(({ default: OSD }) => {
      if (cancelled || !el.current) return;
      const v = OSD({
        element: el.current, tileSources: url(item.dzi!), prefixUrl: '', showNavigationControl: false,
        showNavigator: true, navigatorPosition: 'BOTTOM_RIGHT', animationTime: 0.9, springStiffness: 9,
        maxZoomPixelRatio: 1.6, visibilityRatio: 0.9, homeFillsViewer: true, constrainDuringPan: true, gestureSettingsMouse: { clickToZoom: false },
        crossOriginPolicy: 'Anonymous',
      });
      v.addHandler('open-failed', () => setFailed(true));
      viewer = v;
    }).catch(() => setFailed(true));
    return () => { cancelled = true; viewer?.destroy(); };
  }, [item.dzi]);
  if (failed && item.preview) return <img className="ace-twin-still" src={url(item.preview)} alt={item.title} />;
  return <div ref={el} className="ace-twin-zoom" role="img" aria-label={`${item.title}. Scroll or pinch to zoom.`} />;
};

const Stamp: React.FC<{ item: TwinItem }> = ({ item }) => (
  <span className="ace-stamp" data-stamp={item.approved ? item.status : 'MOCK'}>
    {item.approved ? item.status : `DRAFT · ${item.status}`}
  </span>
);

const Provenance: React.FC<{ item: TwinItem }> = ({ item }) => (
  <p className="ace-twin-prov">
    {item.source} · captured {item.captured}
    {item.pixels ? ` · ${(item.pixels[0] * item.pixels[1] / 1e6).toFixed(0)} MP` : ''}
  </p>
);

const TwinPreview: React.FC = () => {
  const [manifest, setManifest] = useState<TwinManifest | null>(null);
  const [error, setError] = useState(false);
  const drafts = typeof location !== 'undefined' && new URLSearchParams(location.search).has('drafts');
  useEffect(() => {
    fetch(url('twin/manifest.json'), { cache: 'no-cache' })
      .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setManifest)
      .catch(() => setError(true));
  }, []);
  const items = visibleItems(manifest, drafts);
  const zooms = items.filter(i => i.kind === 'deepzoom');
  const films = items.filter(i => i.kind === 'film');
  const [active, setActive] = useState(0);
  const z = zooms[Math.min(active, Math.max(0, zooms.length - 1))];

  return (
    <section className="ace-twin" data-ace-section="Twin">
      <header className="ace-twin-head">
        <span className="ace-kicker">TWIN PREVIEW</span>
        <h1>Look inside the campus before it exists.</h1>
        <p>
          Zoom into full-resolution renders of the proposed ACE campus, and watch the operations twin run a simulated
          member day: robots turning courts over, food moving from the farm to the kitchen, and every action checked
          against a safety policy. The fully interactive twin will open here when it is ready.
        </p>
      </header>

      {error && <p className="ace-twin-empty">The preview gallery could not load right now. Please try again shortly.</p>}
      {!error && manifest && !items.length && <p className="ace-twin-empty">New twin captures are being reviewed. Check back soon.</p>}

      {z && (
        <figure className="ace-twin-stage">
          <DeepZoom key={z.id} item={z} />
          <figcaption>
            <Stamp item={z} />
            <strong>{z.title}</strong>
            <span>{z.caption}</span>
            <Provenance item={z} />
          </figcaption>
          {zooms.length > 1 && (
            <div className="ace-twin-tabs" role="tablist" aria-label="Zoomable renders">
              {zooms.map((it, i) => (
                <button key={it.id} role="tab" aria-selected={i === active} onClick={() => setActive(i)}>{it.title}</button>
              ))}
            </div>
          )}
        </figure>
      )}

      {films.length > 0 && (
        <div className="ace-twin-films">
          {films.map(f => (
            <figure key={f.id} className="ace-twin-film">
              <video src={url(f.src!)} poster={f.preview ? url(f.preview) : undefined} controls muted playsInline preload="none" />
              <figcaption>
                <Stamp item={f} />
                <strong>{f.title}</strong>
                <span>{f.caption}</span>
                <Provenance item={f} />
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
};

export default TwinPreview;
