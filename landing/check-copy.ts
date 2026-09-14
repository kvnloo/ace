import {
  campusNested,
  inFlight,
  lanes,
  pillars,
  product,
} from './public.ts';

const blob = JSON.stringify({ product, pillars, lanes, inFlight, campusNested });

if (product.name !== 'HomeBase') {
  throw new Error(`public landing product must be HomeBase, got ${product.name}`);
}
if (product.host !== 'ACE Pages') {
  throw new Error('public landing host must stay ACE Pages');
}
if (!/pretotype/i.test(product.thisSite)) {
  throw new Error('this-site stamp must say pretotype');
}
if (/live GPU loop/i.test(product.thisSite) && !/not/i.test(product.thisSite)) {
  throw new Error('this site must not claim the live GPU loop');
}
if (!/does not run/i.test(product.thisSite)) {
  throw new Error('this-site stamp must say this Pages site does not run the twin');
}
if (!/private/i.test(product.liveTwin)) {
  throw new Error('live twin must stay the private HomeBase product');
}
if (pillars.length < 3) {
  throw new Error('need shipped engine, facility OS, and live-twin-elsewhere pillars');
}
const stamps = pillars.map((p) => p.stamp);
if (!stamps.includes('SHIPPED') || !stamps.includes('LIVE')) {
  throw new Error('pillars must distinguish SHIPPED work from the LIVE twin elsewhere');
}
if (!lanes.some((lane) => /play/i.test(lane.group))) {
  throw new Error('product lanes must include Play');
}
if (!lanes.some((lane) => /ops/i.test(lane.group))) {
  throw new Error('product lanes must include Ops');
}
if (campusNested.stamp === 'LIVE') {
  throw new Error('ACE campus sketch is not the live HomeBase twin');
}
if (!/Pascal|campus/i.test(campusNested.body)) {
  throw new Error('campus nested copy must name the Pascal campus sketch');
}
if (!inFlight.some((item) => /Blender/i.test(item.title))) {
  throw new Error('in-flight lanes must mention Blender-native GFX');
}

const leaks = [
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

console.log(JSON.stringify({ ok: true, product: product.name, pillars: pillars.length, lanes: lanes.length }, null, 2));
