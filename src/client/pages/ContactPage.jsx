import React, { useEffect, useState } from 'react';
import {
  Mail,
  MessageSquare,
  Send,
  MapPin,
  Clock,
  Headphones,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { api } from '../../utils/api';

const faqs = [
  {
    q: 'How do I create an account?',
    a: 'Click "Get Started" or visit the Sign Up page. Enter your name, email, mobile number, and a referral code (if you have one). Verify your email and you\'re ready to invest.',
  },
  {
    q: 'What is the minimum investment?',
    a: 'The minimum investment amount is 1,000 VC. You can choose from multiple plans based on your investment goals and risk appetite.',
  },
  {
    q: 'How does the 6-level commission work?',
    a: 'When anyone in your 6-level network makes an investment, you earn a commission — 10% on Level 1, 5% on Level 2, 3% on Level 3, 2% on Level 4, 1.5% on Level 5, and 1% on Level 6.',
  },
  {
    q: 'How do I withdraw my earnings?',
    a: 'Go to the Withdraw section in your dashboard. The minimum withdrawal is 500 VC. Withdrawals are processed after admin approval, typically within 24 hours.',
  },
  {
    q: 'Is my investment safe?',
    a: 'We use enterprise-grade encryption, secure payment gateways, and multi-layer verification. All deposits require admin approval for an additional layer of security.',
  },
  {
    q: 'What fees does VC Coin charge?',
    a: 'We charge a transparent 5% admin fee on transactions. There are no hidden charges — what you see is what you get.',
  },
];

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [openFaq, setOpenFaq] = useState(null);
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [contactInfo, setContactInfo] = useState({ email: 'support@vccoin.com', telegram: '', address: 'New Delhi, India', hours: 'Mon–Sat: 9 AM – 9 PM IST' });

  useEffect(() => {
    api.getContactInfo().then(setContactInfo).catch(() => { });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    const els = document.querySelectorAll('.animate-on-scroll');
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitting(true);
    try {
      await api.submitEnquiry(form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus(null), 4000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus(null), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative py-28 md:py-36 overflow-hidden bg-bg-dark">
        <div className="absolute top-0 left-0 w-112.5 h-112.5 bg-cyan/6 blur-[140px] rounded-full -ml-48 -mt-48 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-100 h-100 bg-purple/8 blur-[120px] rounded-full -mr-48 -mb-48 pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-3xl">
          <div className="animate-on-scroll inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan text-sm font-bold mb-8">
            <Headphones size={16} /> Get In Touch
          </div>

          <h1 className="animate-on-scroll text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            We'd Love to <span className="gradient-text">Hear From You</span>
          </h1>

          <p className="animate-on-scroll text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Have a question, feedback, or need help? Our team is here to assist you. Reach out and we'll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* ─── Contact Cards ─── */}
      <section className="py-4 bg-bg-dark">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto -mt-12 relative z-20">
            {[
              {
                icon: Mail,
                title: 'Email Us',
                line1: contactInfo.email,
                line2: 'We reply within 24 hours',
                color: 'green',
                href: `mailto:${contactInfo.email}`,
              },
              {
                icon: MessageSquare,
                title: 'Live Chat',
                line1: contactInfo.telegram || 'Telegram Support',
                line2: 'Available 9 AM – 9 PM IST',
                color: 'cyan',
                href: contactInfo.telegram ? `https://t.me/${contactInfo.telegram.replace('@', '')}` : '#',
              },
              {
                icon: MapPin,
                title: 'Office',
                line1: contactInfo.address,
                line2: 'By appointment only',
                color: 'purple',
                href: null,
              },
            ].map((c, i) => {
              const bgMap = { green: 'bg-green/10 text-green', cyan: 'bg-cyan/10 text-cyan', purple: 'bg-purple/10 text-purple' };
              const borderMap = { green: 'hover:border-green/30', cyan: 'hover:border-cyan/30', purple: 'hover:border-purple/30' };
              return (
                <div
                  key={i}
                  className={`animate-on-scroll group relative p-7 rounded-2xl bg-white/5 border border-white/10 ${borderMap[c.color]} transition-all duration-500 hover:-translate-y-1 text-center`}
                  style={{ transitionDelay: `${i * 0.08}s` }}
                >
                  <div className={`w-13 h-13 rounded-xl flex items-center justify-center mx-auto mb-5 ${bgMap[c.color]}`}>
                    <c.icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{c.title}</h3>
                  {c.href ? (
                    <a href={c.href} className="text-sm text-white/70 hover:text-white transition-colors block" target="_blank" rel="noopener noreferrer">
                      {c.line1} <ExternalLink size={12} className="inline ml-1 opacity-40" />
                    </a>
                  ) : (
                    <p className="text-sm text-white/70">{c.line1}</p>
                  )}
                  <p className="text-xs text-white/30 mt-1 flex items-center justify-center gap-1">
                    <Clock size={11} /> {c.line2}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Contact Form + FAQ ─── */}
      <section className="py-24 bg-bg-dark relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-green/5 blur-[120px] rounded-full -ml-48 pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

            {/* ── Form ── */}
            <div>
              <div className="animate-on-scroll inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-green text-sm font-bold mb-6">
                <Send size={14} /> Send a Message
              </div>
              <h2 className="animate-on-scroll text-3xl md:text-4xl font-extrabold text-white mb-8">
                Drop Us a <span className="gradient-text">Message</span>
              </h2>

              {status === 'success' && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-green/10 border border-green/20 mb-6 animate-fade-in-up">
                  <CheckCircle2 size={18} className="text-green" />
                  <span className="text-sm text-green font-medium">Message sent successfully! We'll get back to you soon.</span>
                </div>
              )}
              {status === 'error' && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-400/10 border border-red-400/20 mb-6 animate-fade-in-up">
                  <AlertCircle size={18} className="text-red-400" />
                  <span className="text-sm text-red-400 font-medium">Failed to send message. Please try again.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-white/40 uppercase tracking-wider font-semibold mb-2">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-green/40 focus:bg-white/7 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/40 uppercase tracking-wider font-semibold mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-green/40 focus:bg-white/7 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-white/40 uppercase tracking-wider font-semibold mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="What's this about?"
                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-green/40 focus:bg-white/7 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/40 uppercase tracking-wider font-semibold mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-green/40 focus:bg-white/7 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-green to-green-dark text-bg-dark font-bold rounded-xl shadow-glow-green hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* ── FAQ ── */}
            <div>
              <div className="animate-on-scroll inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-purple text-sm font-bold mb-6">
                <AlertCircle size={14} /> FAQs
              </div>
              <h2 className="animate-on-scroll text-3xl md:text-4xl font-extrabold text-white mb-8">
                Frequently Asked <span className="text-purple">Questions</span>
              </h2>

              <div className="space-y-3">
                {faqs.map((faq, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <div
                      key={i}
                      className={`animate-on-scroll rounded-xl border transition-all duration-300 ${isOpen ? 'bg-white/6 border-purple/20' : 'bg-white/3 border-white/5 hover:border-white/10'}`}
                      style={{ transitionDelay: `${i * 0.05}s` }}
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left"
                      >
                        <span className="text-sm font-semibold text-white/80 pr-4">{faq.q}</span>
                        <ChevronDown
                          size={16}
                          className={`text-white/30 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-purple' : ''}`}
                        />
                      </button>
                      <div
                        className="overflow-hidden transition-all duration-300"
                        style={{ maxHeight: isOpen ? '200px' : '0', opacity: isOpen ? 1 : 0 }}
                      >
                        <p className="px-5 pb-4 text-sm text-white/50 leading-relaxed">{faq.a}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Support Hours Banner ─── */}
      <section className="py-16 bg-bg-dark">
        <div className="container mx-auto px-4 md:px-6">
          <div className="animate-on-scroll group relative max-w-4xl mx-auto overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 md:p-12 shadow-card hover:border-cyan/30 transition-all duration-700 text-center">
            <div className="absolute top-0 left-0 h-0.75 w-0 bg-linear-to-r from-transparent via-cyan to-transparent transition-all duration-700 group-hover:w-full opacity-0 group-hover:opacity-100" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan/10 blur-[100px] rounded-full group-hover:bg-cyan/20 transition-colors duration-700 pointer-events-none" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-cyan/10 flex items-center justify-center mx-auto mb-6">
                <Clock size={24} className="text-cyan" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-3">Support Hours</h3>
              <p className="text-white/50 text-base md:text-lg max-w-xl mx-auto mb-6">
                {contactInfo.hours ? `Our support team is available ${contactInfo.hours}.` : 'Our support team is available Monday to Saturday, 9:00 AM to 9:00 PM IST.'} For urgent queries, reach us on Telegram for faster responses.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green/10 border border-green/20 text-green text-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-green animate-pulse" /> Mon–Sat: 9 AM – 9 PM
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/50 text-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-white/30" /> Sunday: Closed
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
