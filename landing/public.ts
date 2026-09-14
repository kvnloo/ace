export type HonestyStamp = 'LIVE' | 'SHIPPED' | 'SPEC' | 'VISION' | 'PLANNED' | 'MOCK' | 'PRETOTYPE';

export type Pillar = {
  stamp: HonestyStamp;
  title: string;
  body: string;
};

export type Lane = {
  group: string;
  items: string[];
};

export const product = {
  name: 'HomeBase',
  host: 'ACE Pages',
  kicker: 'PRETOTYPE landing · live twin is private',
  headline: 'THE FACILITY, RUNNING.',
  subhead:
    'Indoor pickleball digital twin and facility OS. This public page is a pretotype landing — ACE does not start a second live GPU loop.',
  thisSite:
    'PRETOTYPE landing on ACE Pages. This site does not run the 60Hz twin, the rules engine, or the booking API.',
  liveTwin:
    'The live GPU twin stays in the private HomeBase product. Players, ball, cameras, and robots are not simulated in this tab.',
};

export const pillars: Pillar[] = [
  {
    stamp: 'SHIPPED',
    title: 'USAPA 2025 rules engine',
    body: 'Pure TypeScript: serve sequence, kitchen / NVZ, two-bounce, faults, side-out scoring, shot selection, and physics. Vitest-backed in the private repo — not bundled on this Pages site.',
  },
  {
    stamp: 'SHIPPED',
    title: 'Facility OS MVP',
    body: 'Booking and schedule, cleaning robots, ROI / utilization dashboard, 3D overlays, gamification, and surface profiles — completed against demo/sim data in the private twin.',
  },
  {
    stamp: 'LIVE',
    title: 'Live GPU twin lives elsewhere',
    body: 'The 3D facility — players, ball, scoreboards, cameras, spectators — runs in the private HomeBase app. ACE Pages will not spawn that loop.',
  },
];

export const lanes: Lane[] = [
  {
    group: 'Play',
    items: [
      'USAPA 2025 rules + court physics',
      'Players, ball, kitchen / NVZ',
      'In-world scoreboards and React overlay',
      'Multi-camera spectator views',
    ],
  },
  {
    group: 'Ops',
    items: [
      'Court booking and schedule merge',
      'Cleaning robots and coverage maps',
      'ROI / utilization / clean-score dashboard',
      'REST API with seed/demo mode',
    ],
  },
  {
    group: 'Place',
    items: [
      'Court lighting, reflections, signage',
      'Spectators, benches, walkways',
      'ADA curb ramps and handrails',
      'Lockers, fountains, cameras, jumbotron',
    ],
  },
];

export const inFlight: Pillar[] = [
  {
    stamp: 'PLANNED',
    title: 'Blender-native GFX',
    body: 'Modernize meshes and environment so the twin can render in Blender, not only the browser. In progress on the private product — not this Pages sketch.',
  },
  {
    stamp: 'PLANNED',
    title: 'Web GFX quality',
    body: 'Raise lighting, materials, and meshes in the existing webapp. Same twin, not a second renderer here.',
  },
];

export const campusNested = {
  stamp: 'VISION' as HonestyStamp,
  title: 'ACE campus sketch',
  body: 'Nested Pascal pretotype: Naperville racquet SPEC plus an APEX peak-performance wing. Envelope and APEX cells inferred. Not the HomeBase live twin.',
};
