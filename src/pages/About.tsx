import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, TrendingUp } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          About <span className="text-tennis-yellow">LawnTech Dynamics</span>
        </h1>
        <p className="text-xl text-gray-300 mb-12 max-w-3xl">
          We're building the world's first autonomous racket sports and health optimization facility,
          where cutting-edge technology meets sustainable practices.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <Target className="w-12 h-12 text-tennis-yellow mb-4" />
            <h3 className="text-2xl font-bold mb-2">Our Mission</h3>
            <p className="text-gray-300">
              To revolutionize athletic performance through integrated technology,
              personalized health optimization, and sustainable practices.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <TrendingUp className="w-12 h-12 text-tennis-yellow mb-4" />
            <h3 className="text-2xl font-bold mb-2">Our Vision</h3>
            <p className="text-gray-300">
              A world where every athlete has access to world-class facilities and
              AI-powered coaching, regardless of their location or budget.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <Users className="w-12 h-12 text-tennis-yellow mb-4" />
            <h3 className="text-2xl font-bold mb-2">Our Team</h3>
            <p className="text-gray-300">
              A diverse team of engineers, athletes, nutritionists, and AI specialists
              dedicated to pushing the boundaries of human performance.
            </p>
          </div>
        </div>

        <section id="team" className="border-t border-white/10 pt-20">
          <h2 className="text-4xl font-bold mb-12 text-center">Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-tennis-yellow to-white/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-1">Jane Smith</h3>
              <p className="text-tennis-yellow mb-2">CEO & Founder</p>
              <p className="text-sm text-gray-300">Former tennis pro and tech entrepreneur</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-tennis-yellow to-white/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-1">Dr. Michael Chen</h3>
              <p className="text-tennis-yellow mb-2">Chief Technology Officer</p>
              <p className="text-sm text-gray-300">AI researcher and robotics expert</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-tennis-yellow to-white/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-1">Sarah Johnson</h3>
              <p className="text-tennis-yellow mb-2">Chief Operating Officer</p>
              <p className="text-sm text-gray-300">Operations and sustainability specialist</p>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default About;
