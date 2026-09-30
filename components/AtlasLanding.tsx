import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, Cpu, Network, ShieldCheck, Users, Zap } from 'lucide-react';
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
} from '../landing/public.ts';
import { View } from '../types';

type Props = {
  onChangeView: (view: View) => void;
};

const stampClass: Record<string, string> = {
  LIVE: 'text-tennis-yellow',
  SHIPPED: 'text-tennis-yellow/80',
  RESEARCH: 'text-cyan-300/90',
  PLANNED: 'text-white/50',
  VISION: 'text-tennis-yellow',
  SPEC: 'text-white/70',
  MOCK: 'text-orange-300/80',
  PRETOTYPE: 'text-tennis-yellow',
};

const laneIcon = (group: string) => {
  if (group === 'Understand') return <Activity className="w-6 h-6" />;
  if (group === 'Simulate') return <Cpu className="w-6 h-6" />;
  if (group === 'Connect') return <Users className="w-6 h-6" />;
  return <Zap className="w-6 h-6" />;
};

const Stamp: React.FC<{ stamp: string }> = ({ stamp }) => (
  <span className={`text-[10px] font-mono tracking-[0.2em] ${stampClass[stamp] ?? 'text-white/50'}`}>
    {stamp}
  </span>
);

const AtlasLanding: React.FC<Props> = ({ onChangeView }) => {
  return (
    <div className="min-h-full overflow-x-hidden">
      <section className="relative min-h-[88dvh] flex items-center justify-center px-5 sm:px-6 overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          aria-hidden="true"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent 0, transparent 47px, rgba(223,255,79,0.08) 47px, rgba(223,255,79,0.08) 48px), repeating-linear-gradient(0deg, transparent 0, transparent 21px, rgba(223,255,79,0.06) 21px, rgba(223,255,79,0.06) 22px)',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(223,255,79,0.08),transparent_28rem)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

        <div className="relative z-10 max-w-5xl text-center py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-tennis-yellow/30 bg-tennis-yellow/10 text-tennis-yellow text-xs sm:text-sm font-medium mb-6"
          >
            <Network className="w-4 h-4" />
            <span>{product.kicker}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-[-0.055em] mb-6 leading-[0.94]"
          >
            A FEEDBACK LOOP <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-tennis-yellow via-white to-cyan-200">
              AROUND THE HUMAN.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="text-lg sm:text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            {product.subhead}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto"
          >
            <button
              type="button"
              onClick={() => onChangeView(View.AMENITIES)}
              className="px-7 py-4 bg-tennis-yellow text-tennis-dark font-bold rounded-full hover:bg-white transition-all flex items-center justify-center gap-2 group"
            >
              See the system
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              type="button"
              onClick={() => onChangeView(View.FACILITY_DEMO)}
              className="px-7 py-4 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-all backdrop-blur-sm border border-white/10"
            >
              Explore the campus sketch
            </button>
          </motion.div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-mono tracking-wider text-white/45">
            <span>HUMAN AGENCY</span>
            <span>MEASURED OUTCOMES</span>
            <span>EXPERT COLLABORATION</span>
            <span>TRACEABLE SIMULATION</span>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-6 py-16 sm:py-20 border-t border-white/10">
        <div className="max-w-3xl mb-10">
          <p className="text-xs font-mono tracking-[0.3em] text-tennis-yellow mb-3">THE LOOP</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Start with a goal. Learn from reality.</h2>
          <p className="text-gray-400 text-base sm:text-lg">
            ACE is organized around a repeatable human-in-the-loop cycle, not around a single score or a single model.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {feedbackLoop.map((step, index) => (
            <div key={step.label} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 min-h-[155px]">
              <span className="text-[10px] font-mono text-white/35">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="text-lg font-bold mt-3 mb-2">{step.label}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-6 py-16 sm:py-20 border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 items-start">
          <div>
            <p className="text-xs font-mono tracking-[0.3em] text-cyan-300 mb-3">{blueprintPositioning.eyebrow}</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5">{blueprintPositioning.title}</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-4">{blueprintPositioning.body}</p>
            <p className="text-xs text-white/35">{blueprintPositioning.disclaimer}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {principles.map((principle) => (
              <div key={principle.title} className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <ShieldCheck className="w-5 h-5 text-tennis-yellow mb-4" />
                <h3 className="font-bold text-lg mb-2">{principle.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{principle.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-6 py-16 sm:py-20 border-t border-white/10">
        <div className="max-w-3xl mb-10">
          <p className="text-xs font-mono tracking-[0.3em] text-tennis-yellow mb-3">SYSTEM TOPOLOGY</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">The digital twin is the connective tissue.</h2>
          <p className="text-gray-400 text-lg">
            It should connect the physical world to evidence, simulation, experts, agents, and measured follow-up without pretending any model is reality itself.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {architectureFlow.map((node, index) => (
            <div key={node.label} className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5">
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="text-[10px] font-mono text-white/30">{String(index + 1).padStart(2, '0')}</span>
                {node.stamp && <Stamp stamp={node.stamp} />}
              </div>
              <h3 className="text-xl font-bold mb-2">{node.label}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{node.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-6 py-16 border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-xs font-mono tracking-[0.3em] text-tennis-yellow mb-3">HUMANS + AGENTS</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-5 tracking-tight">The right person is part of the architecture.</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              ACE should help people discover the limiting factor, surface the evidence, and involve the right expert. Agents extend attention and coordination; they do not replace scoped human authority.
            </p>
            <div className="flex flex-wrap gap-2">
              {expertDomains.map((domain) => (
                <span key={domain} className="px-3 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-gray-300">
                  {domain}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-300/15 bg-cyan-300/[0.035] p-6 sm:p-7">
            <p className="text-xs font-mono tracking-[0.3em] text-cyan-300 mb-3">EVIDENCE BEFORE OPTIMIZATION</p>
            <h3 className="text-2xl font-bold mb-4">Do not let the twin invent truth.</h3>
            <p className="text-gray-400 mb-6">
              Every meaningful claim should retain what kind of thing it is, where it came from, and how uncertain it is.
            </p>
            <div className="flex flex-wrap gap-2">
              {evidenceClasses.map((item) => (
                <span key={item} className="px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-[11px] font-mono tracking-wide text-white/70">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-6 py-16 sm:py-20 border-t border-white/10">
        <div className="max-w-3xl mb-10">
          <p className="text-xs font-mono tracking-[0.3em] text-cyan-300 mb-3">FIRST PROOF</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Prove one closed loop before building everything.</h2>
          <p className="text-gray-400 text-lg">
            Pickleball is the first instrumented testbed because the rules, outcomes, state transitions, and repeatable skills make the loop falsifiable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {firstProof.map((step) => (
            <div key={step.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <Stamp stamp={step.stamp} />
              <h3 className="text-xl font-bold mt-3 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-6 py-16 border-t border-white/10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="max-w-3xl">
            <p className="text-xs font-mono tracking-[0.3em] text-white/45 mb-3">WHAT EXISTS VS WHAT WE ARE TESTING</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Status is part of the interface.</h2>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 max-w-xl">
            {statusLegend.map((item) => (
              <span key={item.stamp} className="text-[10px] text-white/45">
                <strong className={stampClass[item.stamp]}>{item.stamp}</strong> · {item.body}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className={`p-6 rounded-2xl bg-white/5 border ${
                pillar.stamp === 'LIVE' ? 'border-tennis-yellow/40 bg-[#0c0d0b]' : 'border-white/10'
              }`}
            >
              <Stamp stamp={pillar.stamp} />
              <h3 className="text-2xl font-bold mb-2 mt-3">{pillar.title}</h3>
              <p className="text-gray-400 leading-relaxed">{pillar.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-6 pb-16">
        <div className="rounded-3xl border border-tennis-yellow/15 bg-gradient-to-br from-tennis-yellow/[0.07] via-white/[0.03] to-transparent p-6 sm:p-8 flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">The facility is the environment. The feedback loop is the product.</h2>
            <p className="text-gray-400">
              Sports, labs, experts, nutrition, recovery, community, agents, simulation, and the 3D world all exist to make the next real-world outcome more useful.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChangeView(View.AMENITIES)}
            className="shrink-0 px-6 py-3 rounded-full bg-tennis-yellow text-tennis-dark font-bold hover:bg-white transition-colors"
          >
            Explore ACE
          </button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 pb-8">
        <p className="text-gray-500 text-sm max-w-4xl">{product.thisSite}</p>
        <p className="text-gray-500 text-sm max-w-4xl mt-2">{product.liveTwin}</p>
      </div>
    </div>
  );
};

export const AtlasProduct: React.FC<{ onChangeView: (view: View) => void }> = ({ onChangeView }) => {
  return (
    <div className="max-w-7xl mx-auto pt-10">
      <p className="text-xs font-mono tracking-[0.3em] text-tennis-yellow mb-3">ACE SYSTEM</p>
      <h2 className="text-4xl md:text-6xl font-bold mb-4 border-b border-white/10 pb-6 tracking-tight">How the loop compounds</h2>
      <p className="text-gray-400 text-lg mb-4 max-w-4xl">{product.subhead}</p>
      <p className="text-gray-500 text-sm mb-12 max-w-4xl font-mono">
        {product.thisSite} {product.liveTwin}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-24">
        {lanes.map((lane) => (
          <div key={lane.group} className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-tennis-yellow/10 flex items-center justify-center text-tennis-yellow mb-4">
              {laneIcon(lane.group)}
            </div>
            <h3 className="text-2xl font-bold mb-4">{lane.group}</h3>
            <ul className="space-y-3 text-gray-300">
              {lane.items.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-tennis-yellow shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mb-16">
        <p className="text-xs font-mono tracking-[0.3em] text-cyan-300 mb-3">CURRENT RESEARCH TRACKS</p>
        <h3 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight">Prove the loop before scaling the campus.</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {inFlight.map((item) => (
            <div key={item.title} className="p-6 rounded-2xl border border-white/10 bg-white/5">
              <Stamp stamp={item.stamp} />
              <h4 className="text-2xl font-bold mt-3 mb-2">{item.title}</h4>
              <p className="text-gray-400 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mb-24">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
          <p className="text-xs font-mono tracking-[0.3em] text-tennis-yellow mb-3">THE PHYSICAL CAMPUS</p>
          <h3 className="text-3xl font-bold mb-5">A place where domains can actually meet.</h3>
          <p className="text-gray-400 mb-6">
            The facility vision is intentionally multidisciplinary. Some capabilities may ultimately live through external partners rather than under one roof; the campus sketch is a program, not a construction claim.
          </p>
          <div className="flex flex-wrap gap-2">
            {facilityDomains.map((domain) => (
              <span key={domain} className="px-3 py-2 rounded-full border border-white/10 bg-black/20 text-sm text-gray-300">
                {domain}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <Stamp stamp={campusNested.stamp} />
          <h3 className="text-3xl font-bold">{campusNested.title}</h3>
          <p className="text-gray-400 text-lg leading-relaxed">{campusNested.body}</p>
          <button
            type="button"
            onClick={() => onChangeView(View.FACILITY_DEMO)}
            className="self-start px-6 py-3 bg-white/10 rounded-full font-bold hover:bg-white/20 transition-all border border-white/10"
          >
            Open Pascal campus
          </button>
          <div className="h-[280px] rounded-3xl overflow-hidden relative border border-tennis-yellow/20 bg-gradient-to-br from-[#1a1520] via-[#12141c] to-[#0c0d0b]">
            <div className="absolute inset-[12%] grid grid-cols-3 gap-1 opacity-70">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="border border-tennis-yellow/15 bg-white/5" />
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="px-4 py-2 bg-black/50 backdrop-blur-md rounded-lg border border-white/10 text-sm font-mono text-tennis-yellow text-center">
                VISION · HUMAN PERFORMANCE CAMPUS
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtlasLanding;
