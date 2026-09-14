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
  name: 'ATLAS',
  host: 'ATLAS pretotype',
  kicker: 'PRETOTYPE · soil to cell',
  headline: 'SOIL TO CELL. UNDER AN HOUR A WEEK.',
  subhead:
    'Specify a stack, simulate it, then bind a live twin. Indoor racquet facility OS and CEA GrowTwin are tracks. This public page is a pretotype — it does not run a second live GPU loop or Unreal in the browser.',
  thisSite:
    'PRETOTYPE landing. This site does not run the 60Hz twin, the rules engine, the booking API, or the UE5 farm twin.',
  liveTwin:
    'Live GPU and photoreal twins stay in private products. Players, ball, cameras, robots, and Unreal are not simulated in this tab.',
};

export const pillars: Pillar[] = [
  {
    stamp: 'SHIPPED',
    title: 'Facility OS (racquet)',
    body: 'USAPA 2025 rules engine, booking, cleaning robots, ROI dashboard, overlays — completed against demo/sim data in the private twin. Not bundled here.',
  },
  {
    stamp: 'VISION',
    title: 'GrowTwin (CEA)',
    body: 'PCPartPicker for farms: specify a CEA stack, simulate yield and watts, then bind a live twin. Under an hour a week. Photoreal UE5/Cesium is the twin claim — not this React page.',
  },
  {
    stamp: 'LIVE',
    title: 'Live twins live elsewhere',
    body: 'The 3D racquet facility and the photoreal farm twin run in private apps. ATLAS Pages will not spawn those loops.',
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
    group: 'Grow',
    items: [
      'CEA stack spec — PCPartPicker for farms',
      'Simulate yield and watts before a physical build',
      'Bind a live twin — UE5/Cesium is the twin claim',
      'Robot chef is downstream of the farm',
    ],
  },
  {
    group: 'Ops',
    items: [
      'Court booking and schedule merge',
      'Cleaning robots and coverage maps',
      'ROI / utilization / clean-score dashboard',
      'C(RAID) named hybrid — not CI/CD theater',
    ],
  },
];

export const inFlight: Pillar[] = [
  {
    stamp: 'PLANNED',
    title: 'Blender-native GFX',
    body: 'Modernize meshes so a twin can render in Blender, not only the browser. In progress on the private product — not this Pages sketch.',
  },
  {
    stamp: 'PLANNED',
    title: 'Web GFX quality',
    body: 'Raise lighting, materials, and meshes in the existing webapp. Same twin, not a second renderer here.',
  },
];

export const campusNested = {
  stamp: 'VISION' as HonestyStamp,
  title: 'Campus sketch',
  body: 'Nested Pascal pretotype: Naperville racquet SPEC plus an APEX peak-performance wing. Envelope and APEX cells inferred. Not the live GPU twin.',
};
