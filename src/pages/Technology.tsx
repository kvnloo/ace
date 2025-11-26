import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Camera, Brain, Wifi, Zap, Shield } from 'lucide-react';

const Technology: React.FC = () => {
  const technologies = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Computer Vision",
      description: "RGB + depth cameras track every movement with millimeter precision, providing real-time biomechanics analysis and AI coaching feedback.",
      specs: ["120fps capture", "3D pose estimation", "Multi-player tracking"]
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Coaching Engine",
      description: "Machine learning models trained on millions of professional matches analyze your technique and provide personalized improvement strategies.",
      specs: ["147+ biomarkers", "Real-time feedback", "Adaptive training plans"]
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "Digital Twin",
      description: "A complete virtual replica of the facility built in Unity/Three.js, enabling predictive maintenance and autonomous operations.",
      specs: ["1000+ IoT sensors", "Real-time simulation", "Predictive analytics"]
    },
    {
      icon: <Wifi className="w-8 h-8" />,
      title: "IoT Network",
      description: "Distributed sensor network monitors everything from court conditions to air quality, optimizing the environment for peak performance.",
      specs: ["Temperature control", "Humidity tracking", "Air quality monitoring"]
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Smart Energy",
      description: "100% renewable energy with intelligent load balancing, battery storage, and grid integration for carbon-neutral operations.",
      specs: ["Solar + wind", "Energy storage", "Smart grid integration"]
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Biometric Access",
      description: "Secure, contactless entry using facial recognition and biometric authentication for seamless member experience.",
      specs: ["Facial recognition", "Multi-factor auth", "Privacy-first design"]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Technology <span className="text-tennis-yellow">Stack</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Cutting-edge AI, robotics, and IoT systems working together to create the ultimate athletic experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-tennis-yellow/20 flex items-center justify-center text-tennis-yellow mb-4">
                {tech.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{tech.title}</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">{tech.description}</p>
              <ul className="space-y-2">
                {tech.specs.map((spec, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-1 h-1 rounded-full bg-tennis-yellow" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <section className="border-t border-white/10 pt-20">
          <h2 className="text-4xl font-bold mb-12 text-center">Technical Architecture</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-tennis-yellow">Hardware Layer</h3>
              <ul className="space-y-3 text-gray-300">
                <li>• RGB-D camera arrays (Intel RealSense)</li>
                <li>• Edge computing nodes (NVIDIA Jetson)</li>
                <li>• Environmental sensors (Particle IoT)</li>
                <li>• Robotic maintenance systems</li>
                <li>• Biometric access terminals</li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4 text-tennis-yellow">Software Stack</h3>
              <ul className="space-y-3 text-gray-300">
                <li>• Unity/Three.js digital twin</li>
                <li>• TensorFlow biomechanics models</li>
                <li>• Kubernetes orchestration</li>
                <li>• TimescaleDB time-series analytics</li>
                <li>• React Native mobile apps</li>
              </ul>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default Technology;
