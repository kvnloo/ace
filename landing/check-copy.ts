import {
  campusNested,
  evidenceClasses,
  expertDomains,
  facilityDomains,
  feedbackLoop,
  inFlight,
  lanes,
  pillars,
  product,
} from './public.ts';

const blob = JSON.stringify({
  product,
  feedbackLoop,
  pillars,
  lanes,
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

const loopLabels = feedbackLoop.map((step) => step.label);
for (const required of ['Goal', 'Observe', 'Model', 'Hypothesize', 'Simulate', 'Connect', 'Intervene', 'Measure', 'Verify', 'Learn']) {
  if (!loopLabels.includes(required)) {
    throw new Error(`feedback loop missing ${required}`);
  }
}
if (feedbackLoop[0]?.label !== 'Goal' || feedbackLoop.at(-1)?.label !== 'Learn') {
  throw new Error('feedback loop must begin with Goal and end with Learn');
}

const stamps = new Set(pillars.map((p) => p.stamp));
for (const required of ['LIVE', 'SHIPPED', 'RESEARCH', 'VISION']) {
  if (!stamps.has(required as (typeof pillars)[number]['stamp'])) {
    throw new Error(`pillars must include ${required}`);
  }
}

for (const group of ['Understand', 'Simulate', 'Connect', 'Improve']) {
  if (!lanes.some((lane) => lane.group === group)) {
    throw new Error(`system lanes must include ${group}`);
  }
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
if (!inFlight.some((item) => /WorldKernel|physics/i.test(item.title))) {
  throw new Error('research tracks must mention the world/physics substrate');
}
if (!inFlight.some((item) => /evidence|provenance/i.test(item.title))) {
  throw new Error('research tracks must mention the evidence spine');
}
if (!inFlight.some((item) => /athlete|intervention/i.test(item.title))) {
  throw new Error('research tracks must include a falsifiable athlete loop');
}

if (campusNested.stamp === 'LIVE') {
  throw new Error('campus sketch is not the live GPU twin');
}
if (!/Pascal|campus/i.test(campusNested.body)) {
  throw new Error('campus nested copy must identify the Pascal/campus pretotype');
}
if (/learning styles/i.test(blob)) {
  throw new Error('landing must not use fixed learning-style claims');
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
      pillars: pillars.length,
      lanes: lanes.length,
      evidenceClasses: evidenceClasses.length,
    },
    null,
    2,
  ),
);
