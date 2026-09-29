export type HonestyStamp =
  | 'LIVE'
  | 'SHIPPED'
  | 'SPEC'
  | 'VISION'
  | 'PLANNED'
  | 'MOCK'
  | 'PRETOTYPE'
  | 'RESEARCH';

export type Pillar = {
  stamp: HonestyStamp;
  title: string;
  body: string;
};

export type Lane = {
  group: string;
  items: string[];
};

export type LoopStep = {
  label: string;
  body: string;
};

export const product = {
  name: 'ACE',
  host: 'ACE public pretotype',
  kicker: 'PRETOTYPE · human flourishing feedback loop',
  headline: 'A FEEDBACK LOOP AROUND THE HUMAN.',
  subhead:
    'A physical campus + digital twin ecosystem for setting goals, measuring reality, connecting with the right experts, simulating options, acting, and learning from verified outcomes.',
  thisSite:
    'PRETOTYPE landing. This page communicates the system direction and runs the Pascal campus sketch; it does not run the private 60Hz twin, clinical systems, or the experimental simulation stack.',
  liveTwin:
    'The live racquet twin and Facility OS remain private products. Research and vision capabilities below are labeled explicitly and are not presented as shipped.',
};

export const feedbackLoop: LoopStep[] = [
  {
    label: 'Goal',
    body: 'Start with what the person actually wants to improve. ACE does not reduce a human to one universal score.',
  },
  {
    label: 'Observe',
    body: 'Collect relevant evidence from sessions, sensors, computer vision, self-report, and experts.',
  },
  {
    label: 'Model',
    body: 'Update provenance-aware personal and facility twins while keeping uncertainty explicit.',
  },
  {
    label: 'Hypothesize',
    body: 'Humans and agents propose explanations for plateaus, opportunities, and evidence gaps.',
  },
  {
    label: 'Simulate',
    body: 'Compare possible futures with a world model plus sport- or domain-specific rules.',
  },
  {
    label: 'Connect',
    body: 'Route the person to the right coach, PT, physician, nutritionist, researcher, peer, or mentor.',
  },
  {
    label: 'Intervene',
    body: 'Choose a scoped, user- or expert-approved action instead of letting agents acquire unlimited authority.',
  },
  {
    label: 'Measure',
    body: 'Repeat comparable observations after the intervention.',
  },
  {
    label: 'Verify',
    body: 'Keep observations, estimates, simulations, and outcomes distinct so progress is not self-reported by the model.',
  },
  {
    label: 'Learn',
    body: 'Update beliefs about what works for this person, this skill, and this context.',
  },
];

export const pillars: Pillar[] = [
  {
    stamp: 'LIVE',
    title: 'Private racquet digital twin',
    body: 'The interactive facility twin runs outside this Pages bundle. It remains the first proving ground for match state, replay, cameras, scoreboards, and facility workflows.',
  },
  {
    stamp: 'SHIPPED',
    title: 'Facility OS foundation',
    body: 'Booking, operations, cleaning/coverage, utilization and other facility workflows exist in the private racquet stack against demo/sim data. They are substrate, not the end goal.',
  },
  {
    stamp: 'RESEARCH',
    title: 'Trusted sport + simulation substrate',
    body: 'Current work is freezing 2026 pickleball semantics, separating a sport-blind transition kernel, replaying seeded differential tapes, and preparing a backend-neutral world/physics interface.',
  },
  {
    stamp: 'VISION',
    title: 'Human flourishing loop',
    body: 'Personal evidence graphs, response-to-intervention learning, expert routing, scoped agents, nutrition/recovery, research, community, and a traceable 3D view converge around one goal: help people become more capable.',
  },
];

export const lanes: Lane[] = [
  {
    group: 'Understand',
    items: [
      'Personal twin as an evidence graph, not a synthetic copy of a person',
      'Observation, estimate, hypothesis, simulation, intervention and outcome stay distinct',
      'Uncertainty, provenance, intended use and consent remain attached to derived state',
      'Facility/world state follows the same evidence discipline',
    ],
  },
  {
    group: 'Simulate',
    items: [
      'Backend-neutral world kernel for time, bodies, contacts, surfaces and trajectories',
      'Independent sport packages assign meaning after physics',
      'Pickleball is the first testbed; other sports should extend the protocol, not a giant ontology',
      'Counterfactuals must earn trust against real measured outcomes',
    ],
  },
  {
    group: 'Connect',
    items: [
      'Coaches, PTs, physicians, nutritionists, scientists, farmers, peers and mentors are first-class',
      'Agents surface evidence gaps, candidate explanations and relevant experts',
      'Access and action authority are scoped by purpose, data and approval',
      'The user can decline routing, recommendations, and interventions',
    ],
  },
  {
    group: 'Improve',
    items: [
      'Personalization means measured response to interventions, not fixed learning-style labels',
      'Training, recovery, nutrition and strategy can be treated as explicit experiments',
      'Progression and gamification should reflect verified capability gains',
      'The system should shrink or stop features that fail to improve real outcomes',
    ],
  },
];

export const evidenceClasses = [
  'OBSERVATION',
  'SELF REPORT',
  'EXPERT JUDGMENT',
  'ESTIMATE',
  'HYPOTHESIS',
  'SIMULATION',
  'RECOMMENDATION',
  'INTERVENTION',
  'VERIFIED OUTCOME',
] as const;

export const expertDomains = [
  'Athletes',
  'Coaches',
  'Physical therapists',
  'Physicians',
  'Nutritionists',
  'Biomechanists',
  'Sports scientists',
  'Learning scientists',
  'Researchers',
  'Farm / CEA experts',
  'Engineers',
  'Peers + mentors',
] as const;

export const facilityDomains = [
  'Racquet + field sports',
  'Strength + conditioning',
  'Biomechanics + motion capture',
  'PT + rehabilitation',
  'Medical + diagnostics',
  'Nutrition + food',
  'Recovery',
  'Research labs',
  'Social + community',
  'Farm / controlled-environment agriculture',
  'Maker + engineering spaces',
] as const;

export const inFlight: Pillar[] = [
  {
    stamp: 'RESEARCH',
    title: 'Evidence + provenance spine',
    body: 'One versioned envelope is being designed so real observations, estimates, simulations, interventions and verified outcomes cannot silently collapse into one another.',
  },
  {
    stamp: 'RESEARCH',
    title: 'WorldKernel + ball-physics bakeoff',
    body: 'ACE should own a stable world/simulation contract and benchmark candidate physics backends against measured ball flight, bounce, impact and replay cases before choosing a solver.',
  },
  {
    stamp: 'RESEARCH',
    title: 'First athlete intervention loop',
    body: 'The near-term proof is intentionally narrow: one athlete, one skill, one baseline, one coaching hypothesis, one intervention, one repeated measurement, one falsifiable result.',
  },
  {
    stamp: 'RESEARCH',
    title: 'Expert graph + agent authority',
    body: 'Agents should extend human attention and coordination while experts retain scoped authority. No expert or agent automatically receives the whole personal twin.',
  },
  {
    stamp: 'RESEARCH',
    title: 'Traceable 3D twin',
    body: 'Every meaningful visual state should trace back to authoritative rule/model state, source evidence, provenance and uncertainty. The scene is a projection, never the source of truth.',
  },
  {
    stamp: 'RESEARCH',
    title: 'Machine-checkable sport laws',
    body: 'Pickleball 2026 is being turned into a provenance-backed sport package with deterministic parity testing. Bend is an experiment for proving narrow laws, not a runtime rewrite.',
  },
];

export const campusNested = {
  stamp: 'VISION' as HonestyStamp,
  title: 'Human-performance campus sketch',
  body: 'Nested Pascal pretotype: Naperville racquet SPEC plus an APEX human-performance wing for training, labs, physiotherapy, recovery, research and community. Dimensions outside the origin spec remain inferred.',
};
