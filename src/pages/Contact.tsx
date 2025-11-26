import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Get in <span className="text-tennis-yellow">Touch</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Have questions about our facility? Want to schedule a tour? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-tennis-yellow/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-tennis-yellow" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Email</h3>
                  <p className="text-gray-300">info@lawntechdynamics.com</p>
                  <p className="text-gray-300">support@lawntechdynamics.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-tennis-yellow/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-tennis-yellow" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Phone</h3>
                  <p className="text-gray-300">+1 (512) 555-0123</p>
                  <p className="text-sm text-gray-400 mt-1">Monday - Friday, 9am - 6pm CST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-tennis-yellow/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-tennis-yellow" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Location</h3>
                  <p className="text-gray-300">Austin, Texas</p>
                  <p className="text-sm text-gray-400 mt-1">Pilot facility coming 2025</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-bold mb-2">Name</label>
                <input
                  type="text"
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-tennis-yellow transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Email</label>
                <input
                  type="email"
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-tennis-yellow transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Subject</label>
                <input
                  type="text"
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-tennis-yellow transition-colors"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Message</label>
                <textarea
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-tennis-yellow transition-colors h-32"
                  placeholder="Your message..."
                />
              </div>
              <button className="w-full bg-tennis-yellow text-tennis-dark font-bold py-3 rounded-xl hover:bg-white transition-all">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
