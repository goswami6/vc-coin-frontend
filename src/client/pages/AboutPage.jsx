import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  TrendingUp,
  Users,
  Globe,
  Zap,
  Lock,
  Eye,
  Target,
  Rocket,
  ArrowRight,
  CheckCircle2,
  Gem,
  BarChart3,
  Star,
} from 'lucide-react';

const AboutPage = () => {
  const [counts, setCounts] = useState({ users: 0, countries: 0, volume: 0, uptime: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef(null);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const targets = { users: 15280, countries: 98, volume: 245, uptime: 99.9 };
    const duration = 1800;
    const frameRate = 1000 / 60;
    const totalFrames = duration / frameRate;
    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      const p = frame / totalFrames;
      setCounts({
        users: Math.floor(targets.users * p),
        countries: Math.floor(targets.countries * p),
        volume: Math.floor(targets.volume * p),
        uptime: +(targets.uptime * p).toFixed(1),
      });
      if (frame >= totalFrames) { setCounts(targets); clearInterval(counter); }
    }, frameRate);
    return () => clearInterval(counter);
  }, [isVisible]);

  const values = [
    {
      icon: Shield,
      title: 'Security First',
      desc: 'Enterprise-grade encryption and multi-layer security protocols protect every transaction and account on our platform.',
      color: 'green',
    },
    {
      icon: Eye,
      title: 'Full Transparency',
      desc: 'Real-time rate tracking, clear fee structures, and open transaction records so you always know where your money is.',
      color: 'cyan',
    },
    {
      icon: Zap,
      title: 'Instant Execution',
      desc: 'Lightning-fast buy, sell, and withdrawal processing powered by optimised infrastructure and smart routing.',
      color: 'purple',
    },
    {
      icon: Users,
      title: 'Community Driven',
      desc: 'A 6-level referral system that rewards network builders and creates shared prosperity for every member.',
      color: 'blue',
    },
  ];



  const colorMap = {
    green: { icon: 'bg-green/10 text-green', glow: 'shadow-glow-green', border: 'group-hover:border-green/30' },
    cyan: { icon: 'bg-cyan/10 text-cyan', glow: '', border: 'group-hover:border-cyan/30' },
    purple: { icon: 'bg-purple/10 text-purple', glow: 'shadow-glow-purple', border: 'group-hover:border-purple/30' },
    blue: { icon: 'bg-blue/10 text-blue', glow: '', border: 'group-hover:border-blue/30' },
  };

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative py-28 md:py-36 overflow-hidden bg-bg-dark">
        <div className="absolute top-0 right-0 w-125 h-125 bg-purple/8 blur-[140px] rounded-full -mr-60 -mt-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-100 h-100 bg-green/6 blur-[120px] rounded-full -ml-48 -mb-48 pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-4xl">
          <div className="animate-on-scroll inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-purple text-sm font-bold mb-8">
            <Gem size={16} /> About VC Coin
          </div>

          <h1 className="animate-on-scroll text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            Building the Future of{' '}
            <span className="gradient-text">Crypto Investment</span>
          </h1>

          <p className="animate-on-scroll text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            VC Coin is a next-generation cryptocurrency platform that combines secure investing, daily returns, and a powerful 6-level commission system — all in one place.
          </p>

          <div className="animate-on-scroll flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-4 bg-linear-to-r from-green to-green-dark text-bg-dark font-bold rounded-lg flex items-center gap-2 shadow-glow-green hover:-translate-y-1 transition-transform"
            >
              <Rocket size={18} /> Start Investing
            </Link>
            <a
              href="#our-story"
              className="px-8 py-4 border-2 border-white/10 text-white/70 font-bold rounded-lg hover:border-white/20 hover:text-white transition-all"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* ─── Stats Banner ─── */}
      <section ref={statsRef} className="py-4 bg-bg-dark border-y border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 py-8">
            {[
              { label: 'Active Investors', value: counts.users.toLocaleString(), icon: Users, suffix: '+', color: 'text-green' },
              { label: 'Countries', value: counts.countries, icon: Globe, suffix: '+', color: 'text-cyan' },
              { label: 'Volume (Lakhs)', value: counts.volume, icon: BarChart3, suffix: 'L+', color: 'text-purple' },
              { label: 'Uptime', value: counts.uptime, icon: Zap, suffix: '%', color: 'text-green' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className={`w-11 h-11 rounded-xl ${s.color === 'text-green' ? 'bg-green/10' : s.color === 'text-cyan' ? 'bg-cyan/10' : 'bg-purple/10'} flex items-center justify-center mx-auto mb-3`}>
                  <s.icon size={20} className={s.color} />
                </div>
                <p className="text-2xl md:text-3xl font-extrabold text-white">
                  {s.value}{s.suffix}
                </p>
                <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Our Story ─── */}
      <section id="our-story" className="py-24 bg-bg-dark relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-cyan/5 blur-[120px] rounded-full -mr-48 pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: text */}
            <div>
              <div className="animate-on-scroll inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan text-sm font-bold mb-6">
                <Target size={16} /> Our Story
              </div>
              <h2 className="animate-on-scroll text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                From Vision to a <span className="text-cyan">Global Platform</span>
              </h2>
              <div className="space-y-4 text-white/60 text-base md:text-lg leading-relaxed">
                <p className="animate-on-scroll">
                  VC Coin was founded with a simple belief: everyone deserves access to wealth-building tools that were once reserved for institutional players. Our team of fintech engineers and blockchain enthusiasts set out to create a platform that's transparent, rewarding, and easy to use.
                </p>
                <p className="animate-on-scroll">
                  Today, we serve thousands of investors across the globe with daily investment returns, instant buy/sell execution, and a community-powered referral program that lets your network work for you.
                </p>
                <p className="animate-on-scroll">
                  We're just getting started — and we want you to grow with us.
                </p>
              </div>
            </div>

            {/* Right: Mission & Vision cards */}
            <div className="space-y-6">
              <div className="animate-on-scroll group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-green/30 transition-all duration-500">
                <div className="absolute top-0 left-0 h-0.5 w-0 bg-linear-to-r from-transparent via-green to-transparent transition-all duration-500 group-hover:w-full opacity-0 group-hover:opacity-100 shadow-[0_0_15px_#5EFC8D]" />
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-green/10 flex items-center justify-center shadow-glow-green">
                    <Target size={22} className="text-green" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Our Mission</h3>
                </div>
                <p className="text-white/50 leading-relaxed">
                  To democratise crypto investing by offering a secure, transparent, and rewarding platform accessible to anyone — regardless of experience or background.
                </p>
              </div>

              <div className="animate-on-scroll group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-purple/30 transition-all duration-500">
                <div className="absolute top-0 left-0 h-0.5 w-0 bg-linear-to-r from-transparent via-purple to-transparent transition-all duration-500 group-hover:w-full opacity-0 group-hover:opacity-100 shadow-[0_0_15px_#8477D1]" />
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple/10 flex items-center justify-center shadow-glow-purple">
                    <Rocket size={22} className="text-purple" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Our Vision</h3>
                </div>
                <p className="text-white/50 leading-relaxed">
                  To become the most trusted community-driven investment ecosystem, empowering millions to build financial freedom through next-generation crypto tools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Our Values ─── */}
      <section className="py-24 bg-bg-dark relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green/5 blur-[120px] rounded-full -ml-48 -mb-48 pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="animate-on-scroll inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-green text-sm font-bold mb-6">
              <Star size={16} className="fill-green" /> Core Values
            </div>
            <h2 className="animate-on-scroll text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
              What We <span className="gradient-text">Stand For</span>
            </h2>
            <p className="animate-on-scroll text-white/60 text-lg">
              Every decision we make is guided by these principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {values.map((v, i) => {
              const c = colorMap[v.color];
              return (
                <div
                  key={i}
                  className={`animate-on-scroll group relative p-8 rounded-2xl bg-white/5 border border-white/10 ${c.border} hover:-translate-y-1 transition-all duration-500`}
                  style={{ transitionDelay: `${i * 0.08}s` }}
                >
                  <div className={`absolute top-0 left-0 h-0.5 w-0 bg-linear-to-r from-transparent via-${v.color} to-transparent transition-all duration-500 group-hover:w-full opacity-0 group-hover:opacity-100`} />
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${c.icon} ${c.glow}`}>
                    <v.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green transition-colors">{v.title}</h3>
                  <p className="text-white/50 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Why Choose Us ─── */}
      <section className="py-24 bg-bg-dark">
        <div className="container mx-auto px-4 md:px-6">
          <div className="animate-on-scroll group relative max-w-5xl mx-auto overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 md:p-14 shadow-card hover:border-green/30 transition-all duration-700">
            <div className="absolute top-0 left-0 h-0.75 w-0 bg-linear-to-r from-transparent via-green to-transparent transition-all duration-700 group-hover:w-full opacity-0 group-hover:opacity-100 shadow-[0_0_20px_#5EFC8D]" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-green/10 blur-[100px] rounded-full group-hover:bg-green/20 transition-colors duration-700 pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green/10 border border-green/20 text-green text-sm font-bold mb-8">
                <Lock size={16} /> Why VC Coin
              </div>

              <h3 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
                A Platform Built for <span className="text-green">Trust & Growth</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 mb-10">
                {[
                  'Transparent fee structure — just 5% admin fee',
                  'Daily ROI credited automatically',
                  'Verified deposits with admin approval',
                  'Instant P2P transfers between users',
                  '6-level commission on team investments',
                  'Withdraw anytime — min 500 VC',
                  'Real-time VC rate tracking',
                  'Dedicated admin support',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-green shrink-0" />
                    <span className="text-white/70 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/signup"
                className="inline-flex items-center gap-3 px-10 py-5 bg-linear-to-r from-green to-green-dark text-bg-dark font-black rounded-xl shadow-glow-green hover:-translate-y-1 hover:brightness-110 transition-all duration-300"
              >
                Join VC Coin Today <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
