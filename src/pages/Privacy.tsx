import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Privacy <span className="text-tennis-yellow">Policy</span>
          </h1>
          <p className="text-xl text-gray-300">Last updated: November 2024</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <Shield className="w-10 h-10 text-tennis-yellow mb-3" />
            <h3 className="text-xl font-bold mb-2">Data Protection</h3>
            <p className="text-gray-300 text-sm">Your data is encrypted and protected with industry-leading security.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <Lock className="w-10 h-10 text-tennis-yellow mb-3" />
            <h3 className="text-xl font-bold mb-2">Secure Storage</h3>
            <p className="text-gray-300 text-sm">All personal information is stored securely in encrypted databases.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <Eye className="w-10 h-10 text-tennis-yellow mb-3" />
            <h3 className="text-xl font-bold mb-2">Transparency</h3>
            <p className="text-gray-300 text-sm">You have full visibility into how we use your data.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <Database className="w-10 h-10 text-tennis-yellow mb-3" />
            <h3 className="text-xl font-bold mb-2">Your Control</h3>
            <p className="text-gray-300 text-sm">Request, export, or delete your data at any time.</p>
          </div>
        </div>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
            <p className="mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name, email address, and contact information</li>
              <li>Payment and billing information</li>
              <li>Performance metrics and biometric data (with consent)</li>
              <li>Court booking and facility usage data</li>
              <li>Communications with our support team</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
            <p className="mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process your bookings and payments</li>
              <li>Deliver personalized AI coaching and performance insights</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Biometric Data</h2>
            <p className="mb-4">
              Our AI coaching system collects biometric data including movement patterns, biomechanics, and performance metrics. This data:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Is collected only with your explicit consent</li>
              <li>Is used solely to provide personalized coaching</li>
              <li>Can be deleted at any time upon request</li>
              <li>Is never sold or shared with third parties</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security audits.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
            <p className="mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data in a portable format</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent for biometric data collection</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@lawntechdynamics.com" className="text-tennis-yellow hover:underline">
                privacy@lawntechdynamics.com
              </a>
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default Privacy;
