import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Globe, Rocket, TrendingUp, Users, Gem, Check, ArrowRight } from 'lucide-react';
import { BarChart3, PieChart } from 'lucide-react';
import {
  ShoppingCart,
  HandCoins,
  RefreshCw,
  Wallet,
  LineChart,
  Star
} from 'lucide-react';
import Commission from '../components/home/Commission';
import LiveTransactions from '../components/home/LiveTransactions';
import logo from '../../assets/logo/logo.png';

const HomePage = () => {
  const [counts, setCounts] = useState({ investors: 0, volume: 0, countries: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    "Minimum Investment: 1000 VC",
    "Daily ROI on Investments",
    "6-Level Commission Income",
    "Instant Buy/Sell Execution",
    "5% Admin Fee Only",
    "Withdraw Anytime (500 VC min)"
  ];


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Target all elements with the animation class
    const animatedElements = sectionRef.current.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Intersection Observer to trigger animations on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Counter Logic
  useEffect(() => {
    if (!isVisible) return;

    const targets = { investors: 15280, volume: 2450000, countries: 98 };
    const duration = 2000;
    const frameRate = 1000 / 60;
    const totalFrames = duration / frameRate;

    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;

      setCounts({
        investors: Math.floor(targets.investors * progress),
        volume: Math.floor(targets.volume * progress),
        countries: Math.floor(targets.countries * progress),
      });

      if (frame >= totalFrames) {
        setCounts(targets);
        clearInterval(counter);
      }
    }, frameRate);

    return () => clearInterval(counter);
  }, [isVisible]);

  const featureData = [
    {
      title: "Buy VC Coin",
      desc: "Purchase VC Coin instantly using USDT with real-time exchange rates and minimal fees.",
      icon: <ShoppingCart size={24} />,
      color: "green",
      shadow: "shadow-glow-green"
    },
    {
      title: "Sell VC Coin",
      desc: "Sell your VC holdings at the best market rates with instant settlement to your wallet.",
      icon: <ShoppingCart size={24} className="rotate-180" />, // Using ShoppingCart as placeholder for Sell
      color: "purple",
      shadow: "shadow-glow-purple"
    },
    {
      title: "USDT Conversion",
      desc: "Convert VC to USDT seamlessly with transparent fee structure and live rate updates.",
      icon: <RefreshCw size={24} />,
      color: "cyan",
      shadow: "shadow-glow-cyan"
    },
    {
      title: "Easy Withdrawal",
      desc: "Withdraw your earnings anytime with minimum 500 VC. Fast processing with admin approval.",
      icon: <Wallet size={24} />,
      color: "blue",
      shadow: "shadow-glow-blue"
    },
    {
      title: "Investment Plans",
      desc: "Start investing with minimum 1000 VC and earn daily returns on your portfolio value.",
      icon: <LineChart size={24} />,
      color: "purple",
      shadow: "shadow-glow-purple"
    },
    {
      title: "6-Level Referral",
      desc: "Earn commissions across 6 levels when your referrals invest. Build your network and earn passively.",
      icon: <Users size={24} />,
      color: "green",
      shadow: "shadow-glow-green"
    }
  ];
  return (
    <>
      {/* hero section */}
      <section
        ref={sectionRef}
        className="relative min-h-screen flex items-center pt-16 pb-16 overflow-hidden bg-bg-dark"
        id="hero"
      >
        <div className="container mx-auto px-4 md:px-26 z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

            {/* Left Content */}
            <div className="w-full lg:w-3/5 text-center lg:text-left">
              {/* Badge */}
              <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-green text-sm font-bold mb-6 animate-pulse-glow">
                <span className="w-2 h-2 rounded-full bg-green"></span>
                Live Trading Active
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
                Invest in <span className="gradient-text">VC Coin</span> & Earn Daily Returns
              </h1>

              <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 mb-10">
                The next-generation cryptocurrency investment platform with a powerful 6-Level commission system.
                Start with just 1000 VC and grow your portfolio exponentially.
              </p>

              {/* Hero Actions with Lucide Icons */}
              <div className="hero-actions flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-16">
                <Link
                  to="/signup"
                  className="w-full sm:w-auto px-8 py-4 bg-linear-to-r from-green to-green-dark text-bg-dark font-bold rounded-lg flex items-center justify-center gap-2 shadow-glow-green hover:-translate-y-1 transition-transform"
                >
                  <Rocket size={20} strokeWidth={2.5} />
                  Get Started
                </Link>

                <Link
                  to="/exchange"
                  className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-cyan text-cyan font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-cyan/10 transition-colors"
                >
                  <TrendingUp size={20} strokeWidth={2.5} />
                  Start Trading
                </Link>
              </div>

              {/* Stats */}
              <div className="hero-stats grid grid-cols-3 gap-2 sm:gap-8 pt-8 border-t border-white/10">

                {/* Active Investors - Green Theme */}
                <div className={`hero-stat flex flex-col items-center lg:items-start animate-on-scroll ${isVisible ? 'visible' : ''}`}>
                  <div className="mb-3 p-2 rounded-lg bg-green/10 text-green shadow-glow-green">
                    <Users size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />
                  </div>
                  <div className="text-xl sm:text-3xl font-bold text-white mb-1">
                    {counts.investors.toLocaleString()}
                  </div>
                  <div className="text-[10px] sm:text-xs text-white/50 uppercase tracking-widest font-semibold text-center lg:text-left">
                    Investors
                  </div>
                </div>

                {/* Total Volume - Cyan Theme */}
                <div
                  className={`hero-stat flex flex-col items-center lg:items-start animate-on-scroll ${isVisible ? 'visible' : ''}`}
                  style={{ transitionDelay: '0.1s' }}
                >
                  <div className="mb-3 p-2 rounded-lg bg-cyan/10 text-cyan border border-cyan/20">
                    <DollarSign size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />
                  </div>
                  <div className="text-xl sm:text-3xl font-bold text-white mb-1">
                    ${(counts.volume / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-[10px] sm:text-xs text-white/50 uppercase tracking-widest font-semibold text-center lg:text-left">
                    Volume
                  </div>
                </div>

                {/* Countries - Purple Theme */}
                <div
                  className={`hero-stat flex flex-col items-center lg:items-start animate-on-scroll ${isVisible ? 'visible' : ''}`}
                  style={{ transitionDelay: '0.2s' }}
                >
                  <div className="mb-3 p-2 rounded-lg bg-purple/10 text-purple shadow-glow-purple">
                    <Globe size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />
                  </div>
                  <div className="text-xl sm:text-3xl font-bold text-white mb-1">
                    {counts.countries}
                  </div>
                  <div className="text-[10px] sm:text-xs text-white/50 uppercase tracking-widest font-semibold text-center lg:text-left">
                    Countries
                  </div>
                </div>

              </div>
            </div>

            {/* Right Visuals */}
            <div className="hidden lg:block w-full lg:w-2/5 relative h-162.5">

              {/* Main Floating Coin - Using 'absolute' to make manual positioning work */}
              <div className="absolute z-20 w-40 h-40 md:w-56 md:h-56 bg-linear-to-br from-purple to-cyan rounded-full flex items-center justify-center shadow-glow-purple animate-float 
              left-10 md:left-62.5 top-25 md:top-82.5">
                <img src={logo} alt="VC Coin" className="w-24 h-24 md:w-36 md:h-36 object-contain drop-shadow-lg" />
                <div className="absolute inset-0 bg-white/10 rounded-full blur-xl opacity-50"></div>
              </div>

              {/* Orbiting Elements - Centered Wrapper */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

                {/* Outer Orbit */}
                <div className="absolute w-87.5 h-87.5 md:w-125 md:h-125 border border-white/10 rounded-full animate-spin-slow">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-cyan rounded-full shadow-glow-cyan"></div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-5 h-5 bg-purple rounded-full shadow-glow-purple"></div>
                </div>

                {/* Inner Orbit */}
                <div className="absolute w-62.5 h-62.5 md:w-87.5 md:h-87.5 border border-white/5 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '15s' }}>
                  <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-green rounded-full shadow-glow-green"></div>
                  <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-cyan rounded-full shadow-glow-cyan"></div>
                </div>

                {/* Background Glow */}
                <div className="absolute w-80 h-80 bg-purple/20 blur-[120px] rounded-full"></div>
              </div>
            </div>

          </div>
        </div>
      </section>
      {/* PriceTicker */}

      {/* features section */}
      <section ref={sectionRef} className="py-24 bg-bg-dark relative overflow-hidden" id="features">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple/5 blur-[120px] rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green/5 blur-[120px] rounded-full -ml-48 -mb-48"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">

          {/* Section Header */}
          <div className="max-w-3xl mx-auto text-center mb-16 animate-on-scroll">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-green text-sm font-bold mb-6">
              <Star size={16} className="fill-green" /> Platform Features
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
              Everything You Need to <br />
              <span className="gradient-text">Grow Your Wealth</span>
            </h2>
            <p className="text-white/60 text-lg md:text-xl">
              Our platform offers a complete suite of tools for cryptocurrency investment and portfolio management.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-24">
            {featureData.map((item, index) => (
              <div
                key={index}
                className="animate-on-scroll group relative overflow-hidden p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                {/* Top Animated Line */}
                <div className="absolute top-0 left-0 h-0.5 w-0 bg-linear-to-r from-transparent via-green to-transparent transition-all duration-500 group-hover:w-full opacity-0 group-hover:opacity-100 shadow-[0_0_15px_#5EFC8D]"></div>

                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 
        ${item.color === 'green' ? 'bg-green/10 text-green shadow-glow-green' : ''}
        ${item.color === 'purple' ? 'bg-purple/10 text-purple shadow-glow-purple' : ''}
        ${item.color === 'cyan' ? 'bg-cyan/10 text-cyan border border-cyan/20' : ''}
        ${item.color === 'blue' ? 'bg-blue/10 text-blue border border-blue/20' : ''}
      `}>
                  {item.icon}
                </div>

                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-green transition-colors">
                  {item.title}
                </h3>
                <p className="text-white/50 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* commission */}
      <Commission />
      {/* instant plan */}
      <section className="py-20 bg-bg-dark">
        <div className="container mx-auto px-4 md:px-6">
          <div
            ref={cardRef}
            className="animate-on-scroll group relative max-w-6xl mx-auto overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 md:p-12 shadow-card transition-all duration-700 hover:border-green/30"
          >
            {/* Top Hover Line */}
            <div className="absolute top-0 left-0 h-0.75 w-0 bg-linear-to-r from-transparent via-green to-transparent transition-all duration-700 group-hover:w-full opacity-0 group-hover:opacity-100 shadow-[0_0_20px_#5EFC8D]"></div>

            {/* Background Gradient Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-green/10 blur-[100px] rounded-full group-hover:bg-green/20 transition-colors duration-700"></div>

            <div className="relative z-10 flex flex-col items-start">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green/10 border border-green/20 text-green text-sm font-bold mb-8">
                <Gem size={16} /> Premium Plan
              </div>

              {/* Content Header */}
              <h3 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                Start Your Investment Journey <br />
                With <span className="text-green">1000 VC</span>
              </h3>

              <p className="text-white/60 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
                Join thousands of investors who are already earning daily returns through our secure and transparent platform.
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 w-full mb-12">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-4 group/item">
                    <div className="shrink-0 w-6 h-6 rounded-full bg-green/20 border border-green/30 flex items-center justify-center text-green group-hover/item:scale-110 transition-transform">
                      <Check size={14} strokeWidth={3} />
                    </div>
                    <span className="text-white/80 font-medium text-base md:text-lg">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Link
                to="/signup"
                className="inline-flex items-center gap-3 px-10 py-5 bg-linear-to-r from-green to-green-dark text-bg-dark font-black rounded-xl shadow-glow-green hover:-translate-y-1 hover:brightness-110 transition-all duration-300"
              >
                Start Investing Now <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* live transaction */}
      <LiveTransactions />



    </>
  )
}

export default HomePage