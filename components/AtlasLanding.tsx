import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Leaf, Zap } from 'lucide-react';
import { campusNested, inFlight, lanes, pillars, product } from '../landing/public.ts';
import { View } from '../types';

type Props = {
  onChangeView: (view: View) => void;
};

const stampClass: Record<string, string> = {
  LIVE: 'text-tennis-yellow',
  SHIPPED: 'text-tennis-yellow/80',
  PLANNED: 'text-white/50',
  VISION: 'text-tennis-yellow',
  SPEC: 'text-white/70',
  MOCK: 'text-orange-300/80',
  PRETOTYPE: 'text-tennis-yellow',
};

const laneIcon = (group: string) => {
  if (group === 'Play') return <Zap className="w-6 h-6" />;
  if (group === 'Grow') return <Leaf className="w-6 h-6" />;
  return <Cpu className="w-6 h-6" />;
};

const AtlasLanding: React.FC<Props> = ({ onChangeView }) => {
  return (
    <div className="h-full overflow-y-auto custom-scrollbar pb-20">
      <div className="relative min-h-[90vh] flex items-center justify-center px-6 overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent 0, transparent 47px, rgba(223,255,79,0.08) 47px, rgba(223,255,79,0.08) 48px), repeating-linear-gradient(0deg, transparent 0, transparent 21px, rgba(223,255,79,0.06) 21px, rgba(223,255,79,0.06) 22px)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

        <div className="relative z-10 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-tennis-yellow/30 bg-tennis-yellow/10 text-tennis-yellow text-sm font-medium mb-6"
          >
            <Zap className="w-4 h-4" />
            <span>{product.kicker}</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-sm tracking-[0.35em] uppercase text-white/60 mb-4"
          >
            {product.name}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-6 leading-tight"
          >
            SOIL TO CELL. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-tennis-yellow to-white">UNDER AN HOUR A WEEK.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            {product.subhead}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => onChangeView(View.AMENITIES)}
              className="px-8 py-4 bg-tennis-yellow text-tennis-dark font-bold rounded-full hover:bg-white transition-all flex items-center gap-2 group"
            >
              See the tracks
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onChangeView(View.FACILITY_DEMO)}
              className="px-8 py-4 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-all backdrop-blur-sm"
            >
              Campus sketch
            </button>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-6 py-20 border-t border-white/10">
        {pillars.map((pillar) => (
          <div
            key={pillar.title}
            className={`p-6 rounded-2xl bg-white/5 border ${
              pillar.stamp === 'LIVE' ? 'border-tennis-yellow/40 bg-[#0c0d0b]' : 'border-white/10'
            }`}
          >
            <span className={`text-[10px] font-mono tracking-widest ${stampClass[pillar.stamp] ?? 'text-white/50'}`}>
              {pillar.stamp}
            </span>
            <h3 className="text-2xl font-bold mb-2 mt-3">{pillar.title}</h3>
            <p className="text-gray-400">{pillar.body}</p>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-8">
        <p className="text-gray-500 text-sm max-w-3xl">{product.thisSite}</p>
        <p className="text-gray-500 text-sm max-w-3xl mt-2">{product.liveTwin}</p>
      </div>
    </div>
  );
};

export const AtlasProduct: React.FC<{ onChangeView: (view: View) => void }> = ({ onChangeView }) => {
  return (
    <div className="max-w-7xl mx-auto pt-10">
      <h2 className="text-4xl font-bold mb-4 border-b border-white/10 pb-6">{product.name}</h2>
      <p className="text-gray-400 text-lg mb-4 max-w-3xl">{product.subhead}</p>
      <p className="text-gray-500 text-sm mb-12 max-w-3xl font-mono">
        {product.thisSite} {product.liveTwin}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
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
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
        {inFlight.map((item) => (
          <div key={item.title} className="p-6 rounded-2xl border border-white/10 bg-white/5">
            <span className="text-[10px] font-mono tracking-widest text-white/50">{item.stamp}</span>
            <h3 className="text-2xl font-bold mt-3 mb-2">{item.title}</h3>
            <p className="text-gray-400">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-center gap-12 pb-12">
        <div className="flex-1 space-y-6">
          <span className="text-[10px] font-mono tracking-widest text-tennis-yellow">{campusNested.stamp}</span>
          <h3 className="text-3xl font-bold">{campusNested.title}</h3>
          <p className="text-gray-400 text-lg leading-relaxed">{campusNested.body}</p>
          <button
            onClick={() => onChangeView(View.FACILITY_DEMO)}
            className="px-6 py-3 bg-white/10 rounded-full font-bold hover:bg-white/20 transition-all"
          >
            Open Pascal campus
          </button>
        </div>
        <div className="flex-1 h-[280px] rounded-3xl overflow-hidden relative border border-tennis-yellow/20 bg-gradient-to-br from-[#1a1520] via-[#12141c] to-[#0c0d0b]">
          <div className="absolute inset-[12%] grid grid-cols-3 gap-1 opacity-70">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border border-tennis-yellow/15 bg-white/5" />
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="px-4 py-2 bg-black/50 backdrop-blur-md rounded-lg border border-white/10 text-sm font-mono text-tennis-yellow">
              VISION · CAMPUS SKETCH
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtlasLanding;
