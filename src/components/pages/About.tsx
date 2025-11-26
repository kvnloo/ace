import React from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Activity,
  Leaf,
  Users,
  Brain,
  TrendingUp,
  Shield,
  Heart
} from 'lucide-react';

const About: React.FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <motion.section
        className="mb-24 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Building the Future of <br />
            <span className="text-tennis-yellow">Human Performance</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            We're creating autonomous sports facilities that combine elite athleticism with
            cutting-edge health optimization—powered by AI, sustained by nature.
          </p>
        </div>
      </motion.section>

      {/* Our Story Section */}
      <motion.section
        className="mb-24"
        {...fadeInUp}
      >
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our <span className="text-tennis-yellow">Story</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
            <h3 className="text-2xl font-bold mb-4 text-tennis-yellow">Revolutionizing Racket Sports</h3>
            <p className="text-gray-200 leading-relaxed mb-4">
              LawnTech Dynamics began with a simple vision: to transform how athletes train, compete,
              and optimize their performance. We saw an opportunity to merge the timeless elegance of
              racket sports with the precision of modern technology.
            </p>
            <p className="text-gray-200 leading-relaxed">
              Our facility is the world's first to feature autonomous court management, real-time
              biomechanics analysis, and AI-driven coaching—creating an environment where every
              session accelerates improvement.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
            <h3 className="text-2xl font-bold mb-4 text-tennis-yellow">Technology Meets Athletic Excellence</h3>
            <p className="text-gray-200 leading-relaxed mb-4">
              Beyond the courts, we've built APEX—our performance optimization center that tracks
              147 biomarkers daily. This isn't just a gym; it's a laboratory for human potential,
              where AI algorithms analyze sleep, nutrition, recovery, and cognitive function to
              deliver personalized protocols.
            </p>
            <p className="text-gray-200 leading-relaxed">
              Every member gains access to insights previously reserved for elite professional
              athletes, backed by continuous research integration from 247+ scientific studies analyzed daily.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors lg:col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-tennis-yellow">Sustainability Through Innovation</h3>
            <p className="text-gray-200 leading-relaxed mb-4">
              We believe peak performance and environmental responsibility go hand in hand.
              Our integrated vertical farm produces personalized nutrition with 95% less water
              than traditional agriculture, zero pesticides, and 100% renewable energy.
            </p>
            <p className="text-gray-200 leading-relaxed">
              From carbon-negative operations to robotic maintenance systems, we're proving
              that the facility of the future can be both high-performance and sustainable.
              Every innovation serves our members while respecting our planet.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Core Values Section */}
      <motion.section
        className="mb-24"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Core <span className="text-tennis-yellow">Values</span>
          </h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Principles that guide everything we build and every decision we make
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Innovation */}
          <motion.div
            className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all group"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-indigo-900/30 rounded-2xl group-hover:bg-indigo-900/50 transition-colors">
                <Zap className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold">Innovation</h3>
            </div>
            <p className="text-gray-200 mb-4 leading-relaxed">
              We leverage cutting-edge AI, automation, and digital twin technology to create
              experiences that were impossible just years ago.
            </p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <span>Computer vision coaching on all courts</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <span>Real-time biomechanics analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <span>Digital twin facility simulation</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <span>1000+ IoT sensors for autonomous operations</span>
              </li>
            </ul>
          </motion.div>

          {/* Performance */}
          <motion.div
            className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all group"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-red-900/30 rounded-2xl group-hover:bg-red-900/50 transition-colors">
                <Activity className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold">Performance</h3>
            </div>
            <p className="text-gray-200 mb-4 leading-relaxed">
              Every member deserves elite-level insights. We track 147 biomarkers daily and
              deliver personalized optimization protocols backed by continuous research.
            </p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <span>VO₂ Max improvement: +28% average</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <span>HRV tracking: +12% average gain</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <span>Sleep efficiency: 94% average</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <span>247+ studies analyzed daily for protocol updates</span>
              </li>
            </ul>
          </motion.div>

          {/* Sustainability */}
          <motion.div
            className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all group"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-emerald-900/30 rounded-2xl group-hover:bg-emerald-900/50 transition-colors">
                <Leaf className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold">Sustainability</h3>
            </div>
            <p className="text-gray-200 mb-4 leading-relaxed">
              Carbon-negative operations aren't just a goal—they're our foundation. From
              vertical farming to renewable energy, we prove sustainability enhances performance.
            </p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <span>95% water reduction vs. traditional farming</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <span>100% renewable energy for all operations</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <span>Zero pesticide policy on all produce</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <span>Zero waste facility design</span>
              </li>
            </ul>
          </motion.div>

          {/* Community */}
          <motion.div
            className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all group"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-purple-900/30 rounded-2xl group-hover:bg-purple-900/50 transition-colors">
                <Users className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold">Community</h3>
            </div>
            <p className="text-gray-200 mb-4 leading-relaxed">
              We're building more than a facility—we're cultivating a community of athletes,
              researchers, and health enthusiasts united in the pursuit of human excellence.
            </p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <span>Professional athletes train alongside members</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <span>Research collaboration opportunities</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <span>Member-driven protocol improvements</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
                <span>Knowledge sharing and learning programs</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </motion.section>

      {/* Leadership Team Section */}
      <motion.section
        className="mb-24"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Leadership <span className="text-tennis-yellow">Team</span>
          </h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Visionaries combining expertise in technology, sports science, and sustainability
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* CEO/Founder */}
          <motion.div
            className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all text-center group"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-tennis-yellow/20 to-tennis-yellow/5 border-2 border-tennis-yellow/30 mx-auto mb-4 flex items-center justify-center group-hover:border-tennis-yellow/60 transition-colors">
              <span className="text-3xl font-bold text-tennis-yellow">AJ</span>
            </div>
            <h3 className="text-xl font-bold mb-1">Dr. Alex Jordan</h3>
            <p className="text-sm text-tennis-yellow mb-3 font-semibold">CEO & Founder</p>
            <p className="text-sm text-gray-300 leading-relaxed">
              Former professional tennis player and MIT engineer. PhD in Sports Biomechanics.
              10+ years building AI-driven performance systems for Olympic athletes.
            </p>
          </motion.div>

          {/* CTO */}
          <motion.div
            className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all text-center group"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400/20 to-indigo-400/5 border-2 border-indigo-400/30 mx-auto mb-4 flex items-center justify-center group-hover:border-indigo-400/60 transition-colors">
              <span className="text-3xl font-bold text-indigo-400">SC</span>
            </div>
            <h3 className="text-xl font-bold mb-1">Sarah Chen</h3>
            <p className="text-sm text-indigo-400 mb-3 font-semibold">Chief Technology Officer</p>
            <p className="text-sm text-gray-300 leading-relaxed">
              Ex-Tesla Autopilot lead. Stanford CS. Built computer vision systems for
              autonomous vehicles. Expert in digital twins and IoT infrastructure.
            </p>
          </motion.div>

          {/* Head of Performance Science */}
          <motion.div
            className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all text-center group"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-400/20 to-red-400/5 border-2 border-red-400/30 mx-auto mb-4 flex items-center justify-center group-hover:border-red-400/60 transition-colors">
              <span className="text-3xl font-bold text-red-400">MP</span>
            </div>
            <h3 className="text-xl font-bold mb-1">Dr. Marcus Patel</h3>
            <p className="text-sm text-red-400 mb-3 font-semibold">Head of Performance Science</p>
            <p className="text-sm text-gray-300 leading-relaxed">
              Exercise physiology researcher from Johns Hopkins. Designed training protocols
              for NBA teams. Pioneer in continuous biomarker monitoring and AI protocol optimization.
            </p>
          </motion.div>

          {/* Head of Sustainability */}
          <motion.div
            className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all text-center group"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-400/5 border-2 border-emerald-400/30 mx-auto mb-4 flex items-center justify-center group-hover:border-emerald-400/60 transition-colors">
              <span className="text-3xl font-bold text-emerald-400">EL</span>
            </div>
            <h3 className="text-xl font-bold mb-1">Dr. Emma Liu</h3>
            <p className="text-sm text-emerald-400 mb-3 font-semibold">Head of Sustainability</p>
            <p className="text-sm text-gray-300 leading-relaxed">
              Agricultural engineer from UC Davis. 15 years in controlled environment agriculture.
              Led vertical farm projects for Plenty and AeroFarms. Expert in nutrient optimization.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Advisory Board Section */}
      <motion.section
        className="mb-24"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Advisory <span className="text-tennis-yellow">Board</span>
          </h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Industry leaders guiding our vision and strategy
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Dr. James Martinez", role: "Sports Medicine Specialist", icon: <Heart className="w-5 h-5" /> },
              { name: "Lisa Thompson", role: "Former Olympic Coach", icon: <TrendingUp className="w-5 h-5" /> },
              { name: "Dr. Rachel Kim", role: "AI & Machine Learning Expert", icon: <Brain className="w-5 h-5" /> },
              { name: "Michael Santos", role: "Sustainable Architecture", icon: <Leaf className="w-5 h-5" /> },
              { name: "Dr. Amanda Foster", role: "Nutritional Genomics", icon: <Activity className="w-5 h-5" /> },
              { name: "Robert Chen", role: "Robotics & Automation", icon: <Shield className="w-5 h-5" /> }
            ].map((advisor, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="p-2 bg-tennis-yellow/10 rounded-lg flex-shrink-0 text-tennis-yellow">
                  {advisor.icon}
                </div>
                <div>
                  <h4 className="font-bold text-white">{advisor.name}</h4>
                  <p className="text-sm text-gray-300">{advisor.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;
