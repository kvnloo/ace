import React, { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, Check } from 'lucide-react';

type SubjectType = 'general' | 'membership' | 'investment' | 'partnership' | 'media';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  subject: SubjectType;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    subject: 'general',
    message: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const subjectOptions: { value: SubjectType; label: string }[] = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'membership', label: 'Membership' },
    { value: 'investment', label: 'Investment' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'media', label: 'Media' }
  ];

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 5 seconds
    setTimeout(() => {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: 'general',
        message: ''
      });
      setIsSubmitted(false);
    }, 5000);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Get in <span className="text-tennis-yellow">Touch</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Have questions about LawnTech Dynamics? We'd love to hear from you.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center"
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-gray-300">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-bold text-gray-300">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full bg-black/30 border ${
                        errors.fullName ? 'border-red-400' : 'border-white/10'
                      } rounded-xl px-4 py-3 focus:outline-none focus:border-tennis-yellow transition-colors`}
                      placeholder="Jane Doe"
                    />
                    {errors.fullName && (
                      <p className="text-sm text-red-400">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-bold text-gray-300">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full bg-black/30 border ${
                        errors.email ? 'border-red-400' : 'border-white/10'
                      } rounded-xl px-4 py-3 focus:outline-none focus:border-tennis-yellow transition-colors`}
                      placeholder="jane@example.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-400">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone (Optional) */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-bold text-gray-300">
                      Phone Number <span className="text-gray-500 text-xs">(optional)</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-tennis-yellow transition-colors"
                      placeholder="(512) 555-0147"
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-bold text-gray-300">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-tennis-yellow transition-colors text-gray-300"
                    >
                      {subjectOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-bold text-gray-300">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className={`w-full bg-black/30 border ${
                        errors.message ? 'border-red-400' : 'border-white/10'
                      } rounded-xl px-4 py-3 focus:outline-none focus:border-tennis-yellow transition-colors h-32 resize-none`}
                      placeholder="Tell us how we can help..."
                    />
                    {errors.message && (
                      <p className="text-sm text-red-400">{errors.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-tennis-yellow text-tennis-dark font-bold text-lg py-4 rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-tennis-dark/30 border-t-tennis-dark rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Right Column - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-8"
          >
            {/* Contact Information */}
            <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-tennis-yellow/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-tennis-yellow" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Email</h3>
                    <a
                      href="mailto:info@lawntechdynamics.com"
                      className="text-gray-300 hover:text-tennis-yellow transition-colors"
                    >
                      info@lawntechdynamics.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-tennis-yellow/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-tennis-yellow" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Phone</h3>
                    <a
                      href="tel:+15125550147"
                      className="text-gray-300 hover:text-tennis-yellow transition-colors"
                    >
                      (512) 555-0147
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-tennis-yellow/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-tennis-yellow" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Location</h3>
                    <p className="text-gray-300">
                      Austin, Texas
                      <br />
                      <span className="text-sm text-gray-400">(Coming 2026)</span>
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-tennis-yellow/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-tennis-yellow" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Hours</h3>
                    <p className="text-gray-300">By Appointment Only</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-bold mb-6">Our Location</h2>
              <div className="w-full h-64 bg-slate-800/50 rounded-xl flex items-center justify-center border border-white/10">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-tennis-yellow/50 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-gray-400">Austin, Texas</p>
                  <p className="text-sm text-gray-500 mt-2">Interactive map coming soon</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
