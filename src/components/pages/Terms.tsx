import React, { useState, useEffect } from 'react';

const Terms: React.FC = () => {
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
    { id: 'acceptance', title: 'Acceptance of Terms' },
    { id: 'membership', title: 'Membership Terms' },
    { id: 'facility-rules', title: 'Facility Rules' },
    { id: 'health-safety', title: 'Health & Safety' },
    { id: 'liability', title: 'Liability Limitations' },
    { id: 'intellectual-property', title: 'Intellectual Property' },
    { id: 'user-conduct', title: 'User Conduct' },
    { id: 'payment', title: 'Payment & Fees' },
    { id: 'termination', title: 'Termination' },
    { id: 'dispute-resolution', title: 'Dispute Resolution' },
    { id: 'governing-law', title: 'Governing Law' },
    { id: 'contact', title: 'Contact Information' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
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
            <section id="acceptance" className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-green-400">Acceptance of Terms</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Welcome to LawnTech Dynamics. These Terms of Service ("Terms") govern your access to and use of our tennis
                facility, website, mobile applications, and related services (collectively, the "Services").
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy. If you do
                not agree to these Terms, you may not access or use our Services.
              </p>
              <p className="text-gray-300 leading-relaxed">
                These Terms constitute a legally binding agreement between you and LawnTech Dynamics. We reserve the right
                to modify these Terms at any time, and your continued use of the Services constitutes acceptance of any changes.
              </p>
            </section>

            <section id="membership" className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-green-400">Membership Terms</h2>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">Eligibility</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                You must be at least 18 years old to enter into a membership agreement. Minors (under 18) may use the
                facility only with parental or guardian consent and supervision as required by facility rules.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">Membership Types</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li><strong>Individual:</strong> Single person access with basic facility privileges</li>
                <li><strong>Family:</strong> Up to 4 family members living at the same address</li>
                <li><strong>Corporate:</strong> Business memberships with group access options</li>
                <li><strong>Day Pass:</strong> Single-day facility access without ongoing commitment</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">Account Responsibilities</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized account use</li>
                <li>You are responsible for all activities under your account</li>
                <li>Non-transferable: Memberships cannot be transferred or shared</li>
              </ul>
            </section>

            <section id="facility-rules" className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-green-400">Facility Rules</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                All members and guests must comply with facility rules and staff instructions:
              </p>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">Court Usage</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Court reservations must be made through our booking system</li>
                <li>Maximum reservation time: 2 hours per session</li>
                <li>Courts must be vacated promptly at the end of reserved time</li>
                <li>Proper tennis attire and non-marking court shoes required</li>
                <li>No food or beverages (except water) on courts</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">General Conduct</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Respectful behavior toward staff, members, and guests is mandatory</li>
                <li>No harassment, discrimination, or offensive conduct will be tolerated</li>
                <li>Children under 12 must be supervised by an adult at all times</li>
                <li>Smoking and vaping are prohibited in all facility areas</li>
                <li>Pets are not permitted except service animals</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">Equipment & Facilities</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Members are responsible for any damage caused to facility property</li>
                <li>Equipment must be returned to designated areas after use</li>
                <li>Report any equipment damage or facility issues to staff immediately</li>
                <li>Personal training equipment must be approved by management</li>
              </ul>
            </section>

            <section id="health-safety" className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-green-400">Health & Safety Acknowledgment</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                By using our Services, you acknowledge and agree that:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>You are physically capable of participating in tennis and athletic activities</li>
                <li>You will consult with a physician before beginning any exercise program if you have health concerns</li>
                <li>You understand that physical activity carries inherent risks of injury</li>
                <li>You will immediately report any injuries or health issues to facility staff</li>
                <li>You authorize emergency medical treatment if you are unable to consent</li>
              </ul>

              <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-6 mt-6">
                <h4 className="text-lg font-semibold text-amber-400 mb-2">⚠️ Important Health Notice</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  If you have any pre-existing medical conditions, heart problems, respiratory issues, or other health
                  concerns, you MUST consult with a healthcare provider before using our facility. We are not responsible
                  for health complications arising from participation in activities for which you are medically unsuited.
                </p>
              </div>
            </section>

            <section id="liability" className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-green-400">Liability Limitations</h2>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">Assumption of Risk</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                You expressly assume all risks associated with using our facility and participating in tennis activities,
                including but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                <li>Physical injury from athletic activity</li>
                <li>Injuries caused by other participants or equipment</li>
                <li>Injuries resulting from facility conditions</li>
                <li>Loss or theft of personal property</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">Waiver of Claims</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, YOU AGREE TO RELEASE, WAIVE, AND DISCHARGE LAWNTECH DYNAMICS,
                ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS FROM ANY AND ALL LIABILITY FOR INJURIES, DEATH, OR
                PROPERTY DAMAGE ARISING FROM YOUR USE OF THE FACILITY.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">Limitation of Liability</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                IN NO EVENT SHALL LAWNTECH DYNAMICS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
                PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, OR OTHER INTANGIBLE LOSSES,
                RESULTING FROM:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Your access to or use of (or inability to access or use) the Services</li>
                <li>Any conduct or content of any third party on the Services</li>
                <li>Any content obtained from the Services</li>
                <li>Unauthorized access, use, or alteration of your data</li>
              </ul>
            </section>

            <section id="intellectual-property" className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-green-400">Intellectual Property</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                All content, features, and functionality of our Services, including but not limited to text, graphics,
                logos, images, software, training programs, and performance analytics, are owned by LawnTech Dynamics and
                are protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                You may not:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Reproduce, distribute, or create derivative works from our content</li>
                <li>Use our trademarks or branding without written permission</li>
                <li>Reverse engineer or attempt to extract source code from our software</li>
                <li>Remove or modify any copyright, trademark, or proprietary notices</li>
              </ul>
            </section>

            <section id="user-conduct" className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-green-400">User Conduct</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                You agree not to use our Services to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Violate any local, state, national, or international law</li>
                <li>Harass, abuse, or harm another person</li>
                <li>Impersonate any person or entity</li>
                <li>Interfere with or disrupt the Services or servers</li>
                <li>Attempt to gain unauthorized access to any systems or data</li>
                <li>Transmit any viruses, malware, or harmful code</li>
                <li>Engage in any activity that could damage our reputation or business</li>
              </ul>
            </section>

            <section id="payment" className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-green-400">Payment & Fees</h2>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">Membership Fees</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Membership fees are billed according to the plan you select (monthly or annual). You authorize us to
                charge your designated payment method on each billing cycle.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">Fee Changes</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                We reserve the right to modify membership fees with 30 days' advance notice. Continued use of Services
                after fee changes constitutes acceptance of the new fees.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">Refund Policy</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>No refunds for partial months or unused services</li>
                <li>Annual memberships: No refunds after 30-day trial period</li>
                <li>Cancellations must be submitted at least 7 days before next billing cycle</li>
                <li>Day passes and single-session fees are non-refundable</li>
              </ul>
            </section>

            <section id="termination" className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-green-400">Termination</h2>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">By You</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                You may cancel your membership at any time through your account settings or by contacting member services.
                Cancellations take effect at the end of the current billing period.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">By Us</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                We reserve the right to suspend or terminate your account immediately, without prior notice, for:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Violation of these Terms or facility rules</li>
                <li>Fraudulent or illegal activity</li>
                <li>Harassment of staff or members</li>
                <li>Non-payment of fees</li>
                <li>Behavior that threatens safety or disrupts operations</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">Effect of Termination</h3>
              <p className="text-gray-300 leading-relaxed">
                Upon termination, your right to use the Services will immediately cease. All provisions of these Terms
                that by their nature should survive termination shall survive, including ownership provisions, warranty
                disclaimers, and limitations of liability.
              </p>
            </section>

            <section id="dispute-resolution" className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-green-400">Dispute Resolution</h2>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">Informal Resolution</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Before pursuing formal legal action, you agree to first contact us at legal@lawntechdynamics.com to
                attempt to resolve any dispute informally.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">Arbitration Agreement</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Any dispute arising from these Terms or your use of the Services shall be resolved through binding
                arbitration in accordance with the American Arbitration Association rules, rather than in court.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-gray-200">Class Action Waiver</h3>
              <p className="text-gray-300 leading-relaxed">
                You agree that any arbitration or proceeding shall be limited to the dispute between you and LawnTech
                Dynamics individually. You waive any right to participate in a class action lawsuit or class-wide arbitration.
              </p>
            </section>

            <section id="governing-law" className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-green-400">Governing Law</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                These Terms shall be governed by and construed in accordance with the laws of the State of Texas, without
                regard to its conflict of law provisions.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Any legal action or proceeding arising under these Terms will be brought exclusively in the federal or
                state courts located in Travis County, Texas, and you consent to personal jurisdiction in such courts.
              </p>
            </section>

            <section id="contact" className="mb-0">
              <h2 className="text-2xl font-bold mb-4 text-green-400">Contact Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
                <p className="text-gray-300 mb-2"><strong>Email:</strong> legal@lawntechdynamics.com</p>
                <p className="text-gray-300 mb-2"><strong>Phone:</strong> (555) 123-4567</p>
                <p className="text-gray-300 mb-2"><strong>Mail:</strong> LawnTech Dynamics</p>
                <p className="text-gray-300 pl-16">123 Tennis Court Lane</p>
                <p className="text-gray-300 pl-16">Austin, TX 78701</p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-700">
                <p className="text-sm text-gray-400 text-center">
                  By using LawnTech Dynamics services, you acknowledge that you have read, understood, and agree to be
                  bound by these Terms of Service.
                </p>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Terms;
