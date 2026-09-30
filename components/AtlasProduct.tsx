import React from 'react';
import { Activity, Cpu, Users, Zap } from 'lucide-react';
import {
  campusNested,
  facilityDomains,
  inFlight,
  lanes,
  product,
} from '../landing/public.ts';
import { View } from '../types';
import { laneMotion } from '../landing/motion.ts';

const laneIcon = (group: string) => {
  if (group === 'Understand') return <Activity />;
  if (group === 'Simulate') return <Cpu />;
  if (group === 'Connect') return <Users />;
  return <Zap />;
};

const Stamp: React.FC<{ stamp: string }> = ({ stamp }) => (
  <span className="ace-stamp" data-stamp={stamp}>{stamp}</span>
);

const AtlasProduct: React.FC<{ onChangeView: (view: View) => void }> = ({ onChangeView }) => (
  <div className="ace-product">
    <header className="ace-product-head" data-ace-reveal data-ace-section="System">
      <p className="ace-kicker">ACE SYSTEM</p>
      <h2>How the loop compounds.</h2>
      <p className="ace-section-lede">{product.subhead}</p>
    </header>

    <div className="ace-product-lanes">
      {lanes.map((lane) => (
        <article
          className="ace-product-lane"
          data-lane={lane.group.toLowerCase()}
          data-motion={laneMotion[lane.group as keyof typeof laneMotion] ?? 'resolve'}
          key={lane.group}
        >
          {laneIcon(lane.group)}
          <h3>{lane.group}</h3>
          <ul>
            {lane.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>
      ))}
    </div>

    <section className="ace-section" style={{ width: '100%' }} data-ace-reveal data-ace-section="System / R&D">
      <div className="ace-section-grid">
        <div className="ace-section-index">
          <span className="ace-number">R&D</span>
          <div>
            <p className="ace-kicker">CURRENT RESEARCH</p>
            <h2>Prove the loop before scaling the campus.</h2>
          </div>
        </div>
        <div className="ace-research-grid">
          {inFlight.map((item) => (
            <article className="ace-research-card" key={item.title}>
              <Stamp stamp={item.stamp} />
              <h4>{item.title}</h4>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="ace-section" style={{ width: '100%' }} data-ace-reveal data-ace-section="System / Campus">
      <div className="ace-section-grid">
        <div className="ace-section-index">
          <span className="ace-number">PHY</span>
          <div>
            <p className="ace-kicker">PHYSICAL CAMPUS</p>
            <h2>A place where domains can meet.</h2>
          </div>
        </div>
        <div>
          <p className="ace-section-lede">{campusNested.body}</p>
          <div className="ace-chip-grid">
            {facilityDomains.map((domain) => <span className="ace-chip" key={domain}>{domain}</span>)}
          </div>
          <div className="ace-actions">
            <button
              type="button"
              className="ace-action-secondary"
              onPointerEnter={() => void import('./CampusExperience')}
              onFocus={() => void import('./CampusExperience')}
              onClick={() => onChangeView(View.FACILITY_DEMO)}
            >
              Open Pascal campus
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default AtlasProduct;
