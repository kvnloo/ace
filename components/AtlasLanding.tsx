import React from 'react';
import { Network, ShieldCheck, Users } from 'lucide-react';
import {
  architectureFlow,
  blueprintPositioning,
  evidenceClasses,
  expertDomains,
  feedbackLoop,
  firstProof,
  pillars,
  principles,
  product,
  statusLegend,
} from '../landing/public.ts';
import { View } from '../types';

type Props = {
  onChangeView: (view: View) => void;
};

const orbitNodes = [
  { id: 'evidence', label: 'Evidence', left: '50%', top: '3%' },
  { id: 'experts', label: 'Experts', left: '86%', top: '23%' },
  { id: 'world', label: 'World', left: '96%', top: '59%' },
  { id: 'outcome', label: 'Outcome', left: '70%', top: '92%' },
  { id: 'agents', label: 'Agents', left: '26%', top: '91%' },
  { id: 'simulation', label: 'Simulation', left: '5%', top: '60%' },
  { id: 'twin', label: 'Twin', left: '13%', top: '23%' },
];

const Stamp: React.FC<{ stamp: string }> = ({ stamp }) => (
  <span className="ace-stamp" data-stamp={stamp}>{stamp}</span>
);

const OrbitCore: React.FC = () => (
  <div className="ace-core-wrap" data-motion="stable-human" aria-label="ACE human-centered system diagram">
    <div className="ace-core">
      <div className="ace-core-ring" aria-hidden="true" />
      <div className="ace-core-orbit" aria-hidden="true">
        {orbitNodes.map((node) => (
          <div
            key={node.label}
            className="ace-core-node"
            data-node={node.id}
            style={{ left: node.left, top: node.top }}
          >
            {node.label}
          </div>
        ))}
      </div>
      <div className="ace-core-human">
        <div>
          <strong>Human</strong>
          <span>goal owner</span>
        </div>
      </div>
    </div>
    <p className="ace-core-caption">
      MODEL ≠ REALITY<br />
      SIMULATION ≠ OUTCOME<br />
      EVIDENCE RETAINS PROVENANCE
    </p>
  </div>
);

const AtlasLanding: React.FC<Props> = ({ onChangeView }) => {
  const marquee = [
    'HUMAN AGENCY',
    'OBSERVE BEFORE OPTIMIZE',
    'EXPERTS ARE INFRASTRUCTURE',
    'SIMULATION MUST EARN TRUST',
    'VERIFY IN THE REAL WORLD',
  ];

  return (
    <div className="ace-page">
      <section className="ace-hero" data-ace-section="Manifesto">
        <div className="ace-hero-grid">
          <div className="ace-hero-copy ace-hero-entry ace-hero-entry-copy">
            <p className="ace-kicker">{product.kicker}</p>
            <h1>
              <span>A feedback loop</span>
              <span className="ace-signal-line">around the human.</span>
            </h1>
            <p className="ace-hero-sub">{product.subhead}</p>

            <div className="ace-actions">
              <button type="button" className="ace-action-primary" onClick={() => onChangeView(View.AMENITIES)}>
                Enter the system
              </button>
              <button
                type="button"
                className="ace-action-secondary"
                onPointerEnter={() => void import('./CampusExperience')}
                onFocus={() => void import('./CampusExperience')}
                onClick={() => onChangeView(View.FACILITY_DEMO)}
              >
                Explore the campus
              </button>
            </div>

            <div className="ace-hero-notes" aria-label="ACE design principles">
              <div className="ace-hero-note">
                <strong>{feedbackLoop.length}</strong>
                <span>steps in the learning loop</span>
              </div>
              <div className="ace-hero-note">
                <strong>{evidenceClasses.length}</strong>
                <span>evidence classes kept distinct</span>
              </div>
              <div className="ace-hero-note">
                <strong>{architectureFlow.length}</strong>
                <span>system layers from world to outcome</span>
              </div>
              <div className="ace-hero-note">
                <strong>1</strong>
                <span>human goal owner at the center</span>
              </div>
            </div>
          </div>

          <div className="ace-hero-entry ace-hero-entry-core">
            <OrbitCore />
          </div>
        </div>
        <div className="ace-scroll-cue" aria-hidden="true">
          <span>Scroll / trace the loop</span>
          <i />
        </div>
      </section>

      <div className="ace-loop-rail" aria-label="ACE feedback loop">
        <div className="ace-loop-signal" aria-hidden="true"><span /></div>
        {feedbackLoop.map((step, index) => (
          <div className="ace-loop-rail-item" key={step.label}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{step.label}</strong>
          </div>
        ))}
      </div>

      <section className="ace-section" data-ace-reveal data-ace-section="01 / Principles">
        <div className="ace-section-grid">
          <div className="ace-section-index">
            <span className="ace-number">01</span>
            <div>
              <p className="ace-kicker">OPERATING PRINCIPLES</p>
              <h2>Make the system earn trust.</h2>
            </div>
          </div>
          <div>
            <p className="ace-section-lede">
              {blueprintPositioning.body} {blueprintPositioning.disclaimer}
            </p>
            <div className="ace-manifest-grid">
              {principles.map((principle) => (
                <article
                  className="ace-manifest-item"
                  data-motion={{
                    'Human agency first': 'stable-agency',
                    'Evidence before optimization': 'resolve-evidence',
                    'Humans are infrastructure': 'contextual-connect',
                    'Simulation must earn trust': 'branch-counterfactual',
                  }[principle.title]}
                  key={principle.title}
                >
                  <ShieldCheck className="ace-item-icon" />
                  <h3>{principle.title}</h3>
                  <p>{principle.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="ace-section" data-ace-reveal data-ace-section="02 / System topology">
        <div className="ace-section-grid">
          <div className="ace-section-index">
            <span className="ace-number">02</span>
            <div>
              <p className="ace-kicker">SYSTEM TOPOLOGY</p>
              <h2>The twin is connective tissue.</h2>
            </div>
          </div>
          <div>
            <p className="ace-section-lede">
              Physical reality flows through evidence, models, simulation, humans and agents, then comes back through measured outcomes. Each layer has a different trust level.
            </p>
            <div className="ace-flow">
              {architectureFlow.map((node, index) => (
                <article className="ace-flow-row" key={node.label}>
                  <span className="ace-flow-num">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="ace-flow-title">{node.label}</h3>
                  <p className="ace-flow-body">{node.body}</p>
                  {node.stamp ? <Stamp stamp={node.stamp} /> : <span />}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="ace-section" data-ace-reveal data-ace-section="03 / Humans + evidence">
        <div className="ace-section-grid">
          <div className="ace-section-index">
            <span className="ace-number">03</span>
            <div>
              <p className="ace-kicker">HUMANS + EVIDENCE</p>
              <h2>Authority stays legible.</h2>
            </div>
          </div>
          <div>
            <div className="ace-dual">
              <article className="ace-dual-panel">
                <Users size={25} />
                <h3>The right person is part of the architecture.</h3>
                <p>
                  ACE should discover the limiting factor, surface the evidence, and bring in the right expert. Agents extend attention and coordination; they do not silently inherit human authority.
                </p>
                <div className="ace-chip-grid">
                  {expertDomains.map((domain) => <span key={domain} className="ace-chip">{domain}</span>)}
                </div>
              </article>

              <article className="ace-dual-panel">
                <Network size={25} />
                <h3>Do not let the twin invent truth.</h3>
                <p>
                  Every meaningful claim keeps its type, provenance, uncertainty and intended use. A prediction can be useful without being confused for an observation.
                </p>
                <div className="ace-chip-grid">
                  {evidenceClasses.map((item) => <span key={item} className="ace-chip" data-evidence={item}>{item}</span>)}
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="ace-section ace-paper-section" data-ace-reveal data-ace-section="04 / First proof">
        <div className="ace-section-grid">
          <div className="ace-section-index">
            <span className="ace-number">04</span>
            <div>
              <p className="ace-kicker">FIRST PROOF</p>
              <h2>One loop before everything.</h2>
            </div>
          </div>
          <div>
            <p className="ace-section-lede">
              Pickleball is the first instrumented testbed because state, rules, outcomes and repeatable skills are explicit enough to falsify the architecture.
            </p>
            <div className="ace-proof-grid">
              {firstProof.map((step) => (
                <article className="ace-proof-card" key={step.title}>
                  <Stamp stamp={step.stamp} />
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="ace-section" data-ace-reveal data-ace-section="05 / Truth model">
        <div className="ace-section-grid">
          <div className="ace-section-index">
            <span className="ace-number">05</span>
            <div>
              <p className="ace-kicker">TRUTH MODEL</p>
              <h2>Status is part of the interface.</h2>
            </div>
          </div>
          <div>
            <p className="ace-section-lede">
              The design should make uncertainty and maturity visible instead of hiding them in footnotes. Shipped, research and vision are different products of the loop.
            </p>
            <div className="ace-status-grid">
              {pillars.map((pillar) => (
                <article className="ace-status-card" data-stamp={pillar.stamp} key={pillar.title}>
                  <Stamp stamp={pillar.stamp} />
                  <h3>{pillar.title}</h3>
                  <p>{pillar.body}</p>
                </article>
              ))}
            </div>

            <div className="ace-chip-grid" style={{ marginTop: 28 }}>
              {statusLegend.map((item) => (
                <span className="ace-chip" key={item.stamp}>
                  {item.stamp} · {item.body}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="ace-signal-band" aria-hidden="true">
        <div className="ace-signal-track">
          {marquee.map((item, index) => (
            <span key={item + index}>✦ {item}</span>
          ))}
        </div>
      </div>

      <section className="ace-final" data-ace-reveal data-ace-section="06 / Manifesto">
        <p className="ace-kicker">ACE / PRETOTYPE</p>
        <h2>
          The facility is the environment.<br />
          <span>The feedback loop is the product.</span>
        </h2>
        <div className="ace-final-row">
          <p className="ace-final-copy">
            Sports, labs, experts, nutrition, recovery, community, agents, simulation and the 3D world only matter if they help a person make a better decision, test it, and learn from what actually happened.
          </p>
          <button type="button" className="ace-action-primary" onClick={() => onChangeView(View.AMENITIES)}>
            Explore ACE
          </button>
        </div>
      </section>

      <footer className="ace-footnote">
        <span>{product.thisSite}</span>
        <span>{product.liveTwin}</span>
      </footer>
    </div>
  );
};

export default AtlasLanding;
