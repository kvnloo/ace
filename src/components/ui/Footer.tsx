import React from 'react';
import { Linkedin, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { View } from '../../types';

interface FooterProps {
  onChangeView: (view: View) => void;
}

const Footer: React.FC<FooterProps> = ({ onChangeView }) => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Vision', view: View.HOME },
    { label: 'Amenities', view: View.AMENITIES },
    { label: 'Technology', view: View.TECHNOLOGY },
    { label: 'Contact', view: View.CONTACT },
  ];

  const facilities = [
    { label: 'Gallery', view: View.GALLERY },
    { label: '3D Tour', view: View.FACILITY_DEMO },
    { label: 'Sustainability', view: View.SUSTAINABILITY },
    { label: 'Specifications', view: View.SPECIFICATIONS },
  ];

  const socialLinks = [
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  ];

  return (
    <footer className="relative bg-slate-950 border-t border-white/10">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Column 1: Brand & Social */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-tennis-yellow rounded-full animate-pulse"></span>
              <div className="text-xl font-extrabold tracking-tighter text-white">
                LAWNTECH <span className="text-tennis-yellow font-light">DYNAMICS</span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Pioneering the future of athletic performance through advanced biomechanics,
              sustainable agriculture, and precision engineering.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-tennis-yellow hover:border-tennis-yellow transition-all hover:bg-white/10"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold tracking-wider uppercase text-white">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => onChangeView(link.view)}
                  className="text-white/60 text-sm hover:text-tennis-yellow transition-colors text-left"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Column 3: Facilities */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold tracking-wider uppercase text-white">
              Facilities
            </h3>
            <nav className="flex flex-col gap-3">
              {facilities.map((facility) => (
                <button
                  key={facility.label}
                  onClick={() => onChangeView(facility.view)}
                  className="text-white/60 text-sm hover:text-tennis-yellow transition-colors text-left"
                >
                  {facility.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Column 4: Contact Info */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold tracking-wider uppercase text-white">
              Contact
            </h3>
            <div className="flex flex-col gap-4">
              <a
                href="mailto:info@lawntechdynamics.com"
                className="flex items-center gap-3 text-white/60 text-sm hover:text-tennis-yellow transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-tennis-yellow transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span>info@lawntechdynamics.com</span>
              </a>

              <a
                href="tel:+15127778888"
                className="flex items-center gap-3 text-white/60 text-sm hover:text-tennis-yellow transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-tennis-yellow transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <span>+1 (512) 777-8888</span>
              </a>

              <div className="flex items-start gap-3 text-white/60 text-sm">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>
                  2100 Innovation Drive<br />
                  Austin, TX 78758
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">
              © {currentYear} LawnTech Dynamics. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <button
                onClick={() => onChangeView(View.PRIVACY)}
                className="text-white/40 text-sm hover:text-tennis-yellow transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => onChangeView(View.TERMS)}
                className="text-white/40 text-sm hover:text-tennis-yellow transition-colors"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
