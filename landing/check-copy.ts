import {
  architectureFlow,
  blueprintPositioning,
  campusNested,
  evidenceClasses,
  expertDomains,
  facilityDomains,
  feedbackLoop,
  firstProof,
  inFlight,
  lanes,
  pillars,
  principles,
  product,
  statusLegend,
} from './public.ts';

const blob = JSON.stringify({
  product,
  blueprintPositioning,
  feedbackLoop,
  principles,
  architectureFlow,
  pillars,
  statusLegend,
  lanes,
  firstProof,
  evidenceClasses,
  expertDomains,
  facilityDomains,
  inFlight,
  campusNested,
});

if (product.name !== 'ACE') {
  throw new Error(`public landing product must be ACE, got ${product.name}`);
}
if (!/feedback loop/i.test(`${product.headline} ${product.kicker}`)) {
  throw new Error('ACE copy must lead with the human feedback loop');
}
if (!/digital twin/i.test(product.subhead) || !/expert/i.test(product.subhead)) {
  throw new Error('ACE subhead must connect the digital twin to human expertise');
}
if (!/pretotype/i.test(product.thisSite)) {
  throw new Error('this-site stamp must say pretotype');
}
if (/live GPU/i.test(product.thisSite) && !/does not/i.test(product.thisSite)) {
  throw new Error('this site must not claim the private live GPU loop');
}
if (!/private/i.test(product.liveTwin)) {
  throw new Error('private/live product boundary must remain explicit');
}

if (!/independent/i.test(blueprintPositioning.body) || !/no affiliation/i.test(blueprintPositioning.disclaimer)) {
  throw new Error('Blueprint inspiration must explicitly avoid affiliation claims');
}

const loopLabels = feedbackLoop.map((step) => step.label);
for (const required of ['Goal', 'Observe', 'Model', 'Hypothesize', 'Simulate', 'Connect', 'Intervene', 'Measure', 'Verify', 'Learn']) {
  if (!loopLabels.includes(required)) {
    throw new Error(`feedback loop missing ${required}`);
  }
}
if (feedbackLoop[0]?.label !== 'Goal' || feedbackLoop.at(-1)?.label !== 'Learn') {
  throw new Error('feedback loop must begin with Goal and end with Learn');
}

for (const required of ['Human agency first', 'Evidence before optimization', 'Humans are infrastructure', 'Simulation must earn trust']) {
  if (!principles.some((principle) => principle.title === required)) {
    throw new Error(`principles missing ${required}`);
  }
}

for (const required of ['Physical ACE', 'Evidence', 'Digital twins', 'Simulation', 'Humans + agents', 'Verified outcome']) {
  if (!architectureFlow.some((node) => node.label === required)) {
    throw new Error(`architecture flow missing ${required}`);
  }
}

const stamps = new Set(pillars.map((p) => p.stamp));
for (const required of ['LIVE', 'SHIPPED', 'RESEARCH', 'VISION']) {
  if (!stamps.has(required as (typeof pillars)[number]['stamp'])) {
    throw new Error(`pillars must include ${required}`);
  }
}
for (const required of ['LIVE', 'SHIPPED', 'RESEARCH', 'VISION', 'SPEC', 'MOCK']) {
  if (!statusLegend.some((item) => item.stamp === required)) {
    throw new Error(`status legend missing ${required}`);
  }
}

for (const group of ['Understand', 'Simulate', 'Connect', 'Improve']) {
  if (!lanes.some((lane) => lane.group === group)) {
    throw new Error(`system lanes must include ${group}`);
  }
}

if (firstProof.length < 4 || !firstProof.some((item) => /intervention/i.test(item.title + item.body))) {
  throw new Error('first proof must close the loop through an intervention');
}

for (const evidence of ['OBSERVATION', 'ESTIMATE', 'HYPOTHESIS', 'SIMULATION', 'INTERVENTION', 'VERIFIED OUTCOME']) {
  if (!evidenceClasses.includes(evidence as (typeof evidenceClasses)[number])) {
    throw new Error(`evidence taxonomy missing ${evidence}`);
  }
}

if (!expertDomains.some((domain) => /physical therapists/i.test(domain))) {
  throw new Error('expert network must include physical therapists');
}
if (!expertDomains.some((domain) => /physicians/i.test(domain))) {
  throw new Error('expert network must include physicians');
}
if (!expertDomains.some((domain) => /nutrition/i.test(domain))) {
  throw new Error('expert network must include nutrition');
}
if (!facilityDomains.some((domain) => /research/i.test(domain))) {
  throw new Error('facility vision must include research');
}
if (!facilityDomains.some((domain) => /agriculture/i.test(domain))) {
  throw new Error('facility vision must include controlled-environment agriculture');
}

if (!inFlight.some((item) => /WorldKernel|physics/i.test(item.title))) {
  throw new Error('research tracks must mention the world/physics substrate');
}
if (!inFlight.some((item) => /evidence|provenance/i.test(item.title))) {
  throw new Error('research tracks must mention the evidence spine');
}
if (!inFlight.some((item) => /athlete|intervention/i.test(item.title))) {
  throw new Error('research tracks must include a falsifiable athlete loop');
}
if (!inFlight.some((item) => /expert|authority/i.test(item.title))) {
  throw new Error('research tracks must include human/agent authority');
}
if (!inFlight.some((item) => /3D|traceable/i.test(item.title))) {
  throw new Error('research tracks must include traceable 3D projection');
}

if (campusNested.stamp !== 'SPEC') {
  throw new Error('public campus geometry must be labeled SPEC');
}
if (!/structural export|digital twin/i.test(campusNested.body)) {
  throw new Error('campus copy must identify the real digital-twin export');
}
if (!/runtime state|private operational data/i.test(campusNested.body)) {
  throw new Error('campus copy must preserve the public/private state boundary');
}

if (/learning styles/i.test(blob)) {
  throw new Error('landing must not use fixed learning-style claims');
}
if (/USAPA 2025/i.test(blob)) {
  throw new Error('landing must not regress to stale USAPA 2025 claims');
}

const leaks = [
  'HomeBase',
  'HOMEBASE',
  'homebase',
  'Rally House',
  'RallyHouse',
  'Groot',
  'Telegram',
  'host 0',
  'host-0',
  '/mnt/zer0',
  'NOW.yaml',
  ':4210',
  'facilityOS/checkpoint',
  'Floor Plan.png',
];
for (const leak of leaks) {
  if (blob.includes(leak)) {
    throw new Error(`public landing leaked private detail: ${leak}`);
  }
}

console.log(
  JSON.stringify(
    {
      ok: true,
      product: product.name,
      loopSteps: feedbackLoop.length,
      principles: principles.length,
      architectureNodes: architectureFlow.length,
      pillars: pillars.length,
      lanes: lanes.length,
      evidenceClasses: evidenceClasses.length,
      firstProof: firstProof.length,
    },
    null,
    2,
  ),
);
