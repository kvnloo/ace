import React from 'react';
import { Activity, Brain, Cpu, Droplets, Home, Layers, Network, Server, Users, Zap } from 'lucide-react';
import { product } from '../landing/public.ts';

const specs = [
  {
    category: 'ACE system',
    stamp: 'PRETOTYPE / RESEARCH',
    icon: Network,
    items: [
      { label: 'Objective', value: 'Human-defined goals, not one universal score' },
      { label: 'Loop', value: 'Observe → model → simulate → intervene → verify → learn' },
      { label: 'Twin', value: 'Evidence graph with provenance + uncertainty' },
      { label: 'Agents', value: 'Scoped support for humans, not unlimited authority' },
    ],
  },
  {
    category: 'Current proving ground',
    stamp: 'RESEARCH',
    icon: Activity,
    items: [
      { label: 'Sport', value: 'Pickleball 2026 rules/profile work' },
      { label: 'Kernel', value: 'Sport-blind transition protocol + seeded differential tapes' },
      { label: 'Physics', value: 'Backend-neutral WorldKernel / ball-physics bakeoff' },
      { label: 'Learning', value: 'First athlete intervention-response loop' },
    ],
  },
  {
    category: 'Human + expert network',
    stamp: 'VISION',
    icon: Users,
    items: [
      { label: 'Performance', value: 'Athletes + coaches + biomechanists + sports scientists' },
      { label: 'Care', value: 'PT + physicians + recovery specialists' },
      { label: 'Fuel', value: 'Nutritionists + food / farm experts' },
      { label: 'Research', value: 'Scientists + learning experts + engineers + peers' },
    ],
  },
  {
    category: 'Ground / tennis arena',
    stamp: 'SPEC',
    icon: Home,
    items: [
      { label: 'Tennis courts', value: '24 total: hard, clay, grass, wood' },
      { label: 'Surface split', value: 'Unspecified; not asserted as 6 / 6 / 6 / 6' },
      { label: 'Amenities', value: 'Pro shop + lockers' },
      { label: 'Envelope', value: '140 × 120 m remains inferred in the public sketch' },
    ],
  },
  {
    category: 'Level 1 / racquet',
    stamp: 'SPEC',
    icon: Zap,
    items: [
      { label: 'Badminton', value: '16 courts' },
      { label: 'Squash', value: '4 courts' },
      { label: 'Table tennis', value: '16 stations' },
      { label: 'Flooring', value: 'Shock-absorbent synthetic in the sketch language' },
    ],
  },
  {
    category: 'Level 2 / social + heritage',
    stamp: 'SPEC',
    icon: Layers,
    items: [
      { label: 'Pickleball', value: '8 courts' },
      { label: 'Real tennis', value: '1 historic court' },
      { label: 'Viewing decks', value: 'Not in the origin spec' },
      { label: 'Role', value: 'Sports remain the first falsifiable system testbed' },
    ],
  },
  {
    category: 'Level 3 / grass lab',
    stamp: 'SPEC + VISION',
    icon: Droplets,
    items: [
      { label: 'Area', value: '500 m² per section in the origin spec' },
      { label: 'Section count', value: 'Unspecified; do not infer four sections' },
      { label: 'Technology', value: 'Hydroponics remains planned' },
      { label: 'ACE role', value: 'Nutrition / food systems research loop' },
    ],
  },
  {
    category: 'APEX human-performance',
    stamp: 'VISION',
    icon: Brain,
    items: [
      { label: 'Labs', value: 'Biomechanics, cognition, movement, research, nutrition' },
      { label: 'Recovery', value: 'Physiotherapy + recovery suite' },
      { label: 'Training', value: 'Gym, pool, clubhouse — all sports' },
      { label: 'Dimensions', value: '30 × 30 m cells are inferred, not origin measurements' },
    ],
  },
  {
    category: 'Digital-twin trust boundary',
    stamp: 'RESEARCH',
    icon: Cpu,
    items: [
      { label: '3D', value: 'Projection of authoritative state, never the source of truth' },
      { label: 'Evidence', value: 'Observation / estimate / simulation / outcome stay distinct' },
      { label: 'Access', value: 'Purpose-scoped consent and expert authority' },
      { label: 'This site', value: 'Public PRETOTYPE; private live loops remain elsewhere' },
    ],
  },
  {
    category: 'Facility automation overlay',
    stamp: 'SHIPPED + RESEARCH',
    icon: Server,
    items: [
      { label: 'Booking / ops', value: 'Facility OS foundation shipped against demo / simulation data' },
      { label: 'Monitoring', value: 'Mock or research where not otherwise verified' },
      { label: 'Energy', value: 'Solar + BMS language remains planned' },
      { label: 'Robotics', value: 'Private/prototype work; not presented as live here' },
    ],
  },
];

const Specifications: React.FC = () => {
  return (
    <div className="ace-page">
      <div className="ace-spec-page">
        <header className="ace-spec-head">
          <div>
            <p className="ace-kicker">SYSTEM / CAMPUS / TRUST BOUNDARY</p>
            <h1>
              {product.name} <span>spec.</span>
            </h1>
          </div>
          <p>
            The campus is infrastructure around a larger loop: understand a person, connect the right humans and tools, test an intervention, and learn from measured outcomes. Every line below preserves SPEC / RESEARCH / VISION boundaries.
          </p>
        </header>

        <div className="ace-spec-grid">
          {specs.map((category, index) => {
            const Icon = category.icon;
            return (
              <article
                className="ace-spec-card"
                data-stamp={category.stamp}
                key={category.category}
              >
                <div className="ace-spec-card-head">
                  <div className="ace-spec-card-icon"><Icon size={19} /></div>
                  <h2>{category.category}</h2>
                  <span className="ace-spec-card-index">{String(index + 1).padStart(2, '0')}</span>
                </div>

                <div className="ace-chip-grid" style={{ marginTop: 14 }}>
                  <span className="ace-chip">{category.stamp}</span>
                </div>

                <dl className="ace-spec-list">
                  {category.items.map((item) => (
                    <li key={item.label}>
                      <dt>{item.label}</dt>
                      <dd>{item.value}</dd>
                    </li>
                  ))}
                </dl>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Specifications;
