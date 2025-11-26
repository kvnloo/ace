import React from 'react';
import { motion } from 'framer-motion';

const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Terms of <span className="text-tennis-yellow">Service</span>
          </h1>
          <p className="text-xl text-gray-300">Last updated: November 2024</p>
        </div>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using LawnTech Dynamics facilities and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Membership and Access</h2>
            <p className="mb-4">
              <strong className="text-white">2.1 Membership Requirements:</strong> You must be at least 18 years old to become a member. Minors may use the facility under adult supervision with appropriate waivers.
            </p>
            <p className="mb-4">
              <strong className="text-white">2.2 Membership Tiers:</strong> Different membership tiers provide access to different facilities and services as outlined in our pricing structure.
            </p>
            <p>
              <strong className="text-white">2.3 Access Cards:</strong> Members are responsible for their biometric access credentials and should not share them with others.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Booking and Cancellation</h2>
            <p className="mb-4">
              <strong className="text-white">3.1 Court Reservations:</strong> Members can book courts through our mobile app or website according to their membership tier privileges.
            </p>
            <p className="mb-4">
              <strong className="text-white">3.2 Cancellation Policy:</strong> Court bookings can be cancelled up to 4 hours in advance for a full refund. Late cancellations or no-shows may result in booking privileges being temporarily suspended.
            </p>
            <p>
              <strong className="text-white">3.3 Waitlist:</strong> If your preferred time is not available, you may join the waitlist and will be notified if a slot becomes available.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Payment Terms</h2>
            <p className="mb-4">
              <strong className="text-white">4.1 Membership Fees:</strong> Monthly membership fees are charged on the first day of each month and are non-refundable.
            </p>
            <p className="mb-4">
              <strong className="text-white">4.2 Payment Methods:</strong> We accept major credit cards and ACH transfers for membership payments.
            </p>
            <p>
              <strong className="text-white">4.3 Late Payments:</strong> Failure to pay membership fees may result in suspension of access until payment is received.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Facility Rules and Conduct</h2>
            <p className="mb-4">
              <strong className="text-white">5.1 Appropriate Behavior:</strong> Members must conduct themselves respectfully toward staff and other members at all times.
            </p>
            <p className="mb-4">
              <strong className="text-white">5.2 Equipment Care:</strong> Members are responsible for proper use and care of facility equipment.
            </p>
            <p className="mb-4">
              <strong className="text-white">5.3 Safety:</strong> Members must follow all safety guidelines and instructions from staff.
            </p>
            <p>
              <strong className="text-white">5.4 Violations:</strong> Violation of facility rules may result in membership suspension or termination.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Liability and Assumption of Risk</h2>
            <p className="mb-4">
              <strong className="text-white">6.1 Inherent Risks:</strong> Physical activities involve inherent risks of injury. By using our facilities, you assume these risks.
            </p>
            <p className="mb-4">
              <strong className="text-white">6.2 Waiver:</strong> Members waive certain claims against LawnTech Dynamics for injuries sustained during normal use of the facility.
            </p>
            <p>
              <strong className="text-white">6.3 Insurance:</strong> Members are encouraged to maintain their own health and accident insurance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. AI Coaching and Biometric Data</h2>
            <p className="mb-4">
              <strong className="text-white">7.1 Consent:</strong> Use of AI coaching features requires consent to collection and processing of biometric data.
            </p>
            <p className="mb-4">
              <strong className="text-white">7.2 Data Use:</strong> Biometric data is used solely to provide personalized coaching and performance insights.
            </p>
            <p>
              <strong className="text-white">7.3 Withdrawal:</strong> You may withdraw consent and request deletion of biometric data at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Termination</h2>
            <p className="mb-4">
              <strong className="text-white">8.1 Member Termination:</strong> Members may cancel their membership with 30 days notice.
            </p>
            <p>
              <strong className="text-white">8.2 Facility Termination:</strong> We reserve the right to terminate memberships for violations of these terms or facility rules.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Changes to Terms</h2>
            <p>
              We may modify these Terms of Service at any time. Members will be notified of significant changes via email. Continued use of the facility after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Contact Information</h2>
            <p>
              For questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:legal@lawntechdynamics.com" className="text-tennis-yellow hover:underline">
                legal@lawntechdynamics.com
              </a>
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default Terms;
