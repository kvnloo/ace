import React, { useState, useEffect } from 'react';

const PrivacyPolicy: React.FC = () => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'information-collected', title: 'Information We Collect' },
    { id: 'how-we-use', title: 'How We Use Your Information' },
    { id: 'data-security', title: 'Data Security' },
    { id: 'health-data', title: 'Health & Biometric Data' },
    { id: 'third-party', title: 'Third-Party Sharing' },
    { id: 'your-rights', title: 'Your Rights' },
    { id: 'retention', title: 'Data Retention' },
    { id: 'children', title: "Children's Privacy" },
    { id: 'changes', title: 'Changes to This Policy' },
    { id: 'contact', title: 'Contact Information' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-400 text-lg">Last Updated: January 26, 2025</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Table of Contents */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="lg:sticky lg:top-8 bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Table of Contents
              </h2>
              <ul className="space-y-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className={`text-left w-full px-3 py-2 rounded-md text-sm transition-colors ${
                        activeSection === section.id
                          ? 'bg-green-500/20 text-green-400 font-medium'
                          : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                      }`}
                    >
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 md:p-12 border border-gray-700">
            <section id="introduction" className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-green-400">Introduction</h2>
              <p className="text-gray-300 leading-relaxed">
                LawnTech Dynamics ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your information when you use our tennis facility,
                website, and related services.
              </p>
              <p className="text-gray-300 leading-relaxed mt-4">
                By using our services, you agree to the collection and use of information in accordance with this policy.
                If you do not agree with our policies and practices, please do not use our services.
              </p>
            </section>

            <section id="information-collected" className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-green-400">Information We Collect</h2>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">Personal Information</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                <li>Name, email address, phone number, and mailing address</li>
                <li>Date of birth and emergency contact information</li>
                <li>Payment and billing information</li>
                <li>Membership and account credentials</li>
                <li>Photographs and video recordings from facility cameras</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">Health & Biometric Data</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                <li>Heart rate and cardiovascular measurements</li>
                <li>Movement patterns and biomechanical analysis</li>
                <li>Performance metrics and athletic data</li>
                <li>Health questionnaire responses and medical history</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">Usage Data</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Court reservations and facility usage patterns</li>
                <li>Training session data and performance analytics</li>
                <li>Website and app interaction data</li>
                <li>IP address, browser type, and device information</li>
              </ul>
            </section>

            <section id="how-we-use" className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-green-400">How We Use Your Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">We use the collected information for:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Providing and improving our tennis facility services</li>
                <li>Processing membership applications and managing accounts</li>
                <li>Delivering personalized training programs and performance analytics</li>
                <li>Communicating about schedules, events, and promotional offers</li>
                <li>Ensuring safety and security within our facility</li>
                <li>Conducting research to improve athletic training methods</li>
                <li>Complying with legal obligations and protecting our rights</li>
              </ul>
            </section>

            <section id="data-security" className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-green-400">Data Security</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li><strong>Encryption:</strong> All sensitive data is encrypted in transit and at rest using AES-256 encryption</li>
                <li><strong>Access Controls:</strong> Strict role-based access controls limit who can view your data</li>
                <li><strong>Secure Storage:</strong> Data is stored on secure servers with regular security audits</li>
                <li><strong>Employee Training:</strong> Staff receives regular training on data protection practices</li>
                <li><strong>Monitoring:</strong> Continuous monitoring for unauthorized access attempts</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                However, no method of transmission over the internet or electronic storage is 100% secure. While we strive
                to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section id="health-data" className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-green-400">Health & Biometric Data</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Your health and biometric data receives special protection under applicable laws. We:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Obtain explicit consent before collecting biometric data</li>
                <li>Use health data solely for performance improvement and safety purposes</li>
                <li>Store health information separately from other personal data</li>
                <li>Limit access to health data to authorized personnel only</li>
                <li>Never sell your health or biometric information</li>
                <li>Delete biometric data within 3 years of your last interaction or upon request</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                You may opt out of biometric data collection at any time. Some features may be unavailable without this data.
              </p>
            </section>

            <section id="third-party" className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-green-400">Third-Party Sharing</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We may share your information with third parties only in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li><strong>Service Providers:</strong> Payment processors, analytics providers, and IT service providers</li>
                <li><strong>Research Partners:</strong> Anonymized, aggregated data for sports science research</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                We require all third parties to respect the security of your data and treat it in accordance with applicable law.
                We do not sell your personal information to third parties.
              </p>
            </section>

            <section id="your-rights" className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-green-400">Your Rights</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal obligations)</li>
                <li><strong>Portability:</strong> Request transfer of your data in a machine-readable format</li>
                <li><strong>Opt-Out:</strong> Opt out of marketing communications and biometric data collection</li>
                <li><strong>Restriction:</strong> Request limitation on how we use your data</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                To exercise these rights, please contact us at privacy@lawntechdynamics.com. We will respond within 30 days.
              </p>
            </section>

            <section id="retention" className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-green-400">Data Retention</h2>
              <p className="text-gray-300 leading-relaxed">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy,
                unless a longer retention period is required by law. Generally:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
                <li>Active membership data: Duration of membership plus 7 years</li>
                <li>Financial records: 7 years after transaction</li>
                <li>Biometric data: 3 years from last interaction or upon deletion request</li>
                <li>Marketing data: Until you opt out or request deletion</li>
              </ul>
            </section>

            <section id="children" className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-green-400">Children's Privacy</h2>
              <p className="text-gray-300 leading-relaxed">
                Our services are not directed to children under 13. We do not knowingly collect information from children
                under 13 without parental consent. For minors aged 13-17, we require parental consent before collecting
                biometric data. If you believe we have collected information from a child under 13, please contact us
                immediately.
              </p>
            </section>

            <section id="changes" className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-green-400">Changes to This Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
                <li>Posting the new policy on our website with an updated "Last Updated" date</li>
                <li>Sending an email to your registered email address</li>
                <li>Displaying a prominent notice on our facility premises</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                Your continued use of our services after changes become effective constitutes acceptance of the revised policy.
              </p>
            </section>

            <section id="contact" className="mb-0">
              <h2 className="text-2xl font-bold mb-4 text-green-400">Contact Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
                <p className="text-gray-300 mb-2"><strong>Email:</strong> privacy@lawntechdynamics.com</p>
                <p className="text-gray-300 mb-2"><strong>Phone:</strong> (555) 123-4567</p>
                <p className="text-gray-300 mb-2"><strong>Mail:</strong> LawnTech Dynamics</p>
                <p className="text-gray-300 pl-16">123 Tennis Court Lane</p>
                <p className="text-gray-300 pl-16">Austin, TX 78701</p>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
