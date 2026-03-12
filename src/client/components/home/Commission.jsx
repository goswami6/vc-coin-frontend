import React, { useEffect, useRef } from 'react';
import { Layers } from 'lucide-react';

const Commission = () => {
  const sectionRef = useRef(null);

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

    const elements = sectionRef.current.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const levels = [
    { level: "1", percent: "10%", label: "Direct Referral", color: "text-green", bg: "bg-green/10", border: "border-green/20" },
    { level: "2", percent: "5%", label: "2nd Level", color: "text-cyan", bg: "bg-cyan/10", border: "border-cyan/20" },
    { level: "3", percent: "3%", label: "3rd Level", color: "text-blue", bg: "bg-blue/10", border: "border-blue/20" },
    { level: "4", percent: "2%", label: "4th Level", color: "text-purple", bg: "bg-purple/10", border: "border-purple/20" },
    { level: "5", percent: "1.5%", label: "5th Level", color: "text-white", bg: "bg-white/5", border: "border-white/10" },
    { level: "6", percent: "1%", label: "6th Level", color: "text-green", bg: "bg-green/10", border: "border-green/20" },
  ];

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-bg-dark relative overflow-hidden" id="commission">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-150 md:h-150 bg-purple/5 blur-[80px] md:blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10">

        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-16 animate-on-scroll">
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-purple text-xs md:text-sm font-bold mb-4 md:mb-6">
            <Layers size={16} /> Commission System
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 md:mb-6">
            Earn With Our <span className="text-purple">6-Level</span> Commission
          </h2>
          <p className="text-white/60 text-sm md:text-lg">
            Our revolutionary multi-level commission system rewards you for building your network of investors.
          </p>
        </div>

        {/* Commission Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6 px-1 sm:px-4 md:px-6">
          {levels.map((item, index) => (
            <div
              key={index}
              className="animate-on-scroll group relative p-3 sm:p-4 md:p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple/50 transition-all duration-500 hover:-translate-y-2 text-center"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              {/* Top Hover Line */}
              <div className="absolute top-0 left-0 h-0.5 w-0 bg-linear-to-r from-transparent via-purple to-transparent transition-all duration-500 group-hover:w-full opacity-0 group-hover:opacity-100 shadow-[0_0_15px_#8477D1]"></div>

              {/* Level Badge */}
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-bg-dark border border-white/10 flex items-center justify-center text-white/40 text-xs md:text-sm font-bold mx-auto mb-2 md:mb-4 group-hover:border-purple group-hover:text-purple transition-colors">
                {item.level}
              </div>

              {/* Percentage */}
              <div className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black mb-1 md:mb-2 tracking-tight ${item.color}`}>
                {item.percent}
              </div>

              {/* Label */}
              <div className="text-white/50 text-[10px] md:text-xs uppercase tracking-widest font-bold">
                {item.label}
              </div>

              {/* Subtle Glow behind each card on hover */}
              <div className={`absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 blur-xl md:blur-2xl transition-opacity duration-500 ${item.bg}`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Commission;
