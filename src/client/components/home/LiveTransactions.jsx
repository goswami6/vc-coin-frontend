import React, { useEffect, useState, useRef } from 'react';
import { Bolt, ArrowUpCircle, ArrowDownCircle, User } from 'lucide-react';

const LiveTransactions = () => {
  const [investments, setInvestments] = useState([
    { id: 1, user: "ak***22", amount: "5,000 VC", time: "Just now" },
    { id: 2, user: "sh***89", amount: "1,200 VC", time: "2 mins ago" },
    { id: 3, user: "vi***k1", amount: "10,000 VC", time: "5 mins ago" },
  ]);

  const [withdrawals, setWithdrawals] = useState([
    { id: 1, user: "ra***07", amount: "800 VC", time: "1 min ago" },
    { id: 2, user: "mi***x9", amount: "2,500 VC", time: "4 mins ago" },
    { id: 3, user: "an***p2", amount: "1,100 VC", time: "8 mins ago" },
  ]);

  const sectionRef = useRef(null);

  useEffect(() => {
    // Intersection Observer for animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });

    const elements = sectionRef.current.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => observer.observe(el));

    // Simulation of live feed updates
    const interval = setInterval(() => {
      const newUser = `user_${Math.floor(Math.random() * 99)}`;
      const newAmt = (Math.floor(Math.random() * 10) + 1) * 500;
      
      setInvestments(prev => [{ id: Date.now(), user: `${newUser.slice(0,4)}***`, amount: `${newAmt} VC`, time: "Just now" }, ...prev.slice(0, 4)]);
    }, 5000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-bg-dark relative" id="live-feed">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 animate-on-scroll">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-sm font-bold mb-6">
            <Bolt size={16} fill="currentColor" /> Live Feed
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
            Recent <span className="text-cyan">Transactions</span>
          </h2>
          <p className="text-white/60 text-lg">
            See real-time activity on our platform. Join the growing community of VC investors.
          </p>
        </div>

        {/* Live Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* Investment Feed */}
          <div className="animate-on-scroll relative overflow-hidden bg-white/5 border border-white/10 rounded-2xl p-6 group transition-all duration-500 hover:border-green/30">
            <div className="absolute top-0 left-0 h-[2px] w-0 bg-green transition-all duration-700 group-hover:w-full opacity-0 group-hover:opacity-100 shadow-[0_0_15px_#5EFC8D]"></div>
            
            <h3 className="flex items-center gap-3 text-white font-bold mb-6 text-lg uppercase tracking-wider">
              <ArrowUpCircle className="text-green" size={24} /> 
              Recent Investments
            </h3>
            
            <div className="space-y-4">
              {investments.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 animate-fade-in-up">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green/10 flex items-center justify-center text-green">
                      <User size={18} />
                    </div>
                    <div>
                      <div className="text-white font-medium">{item.user}</div>
                      <div className="text-white/40 text-xs">{item.time}</div>
                    </div>
                  </div>
                  <div className="text-green font-black text-lg">+{item.amount}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Withdrawal Feed */}
          <div className="animate-on-scroll relative overflow-hidden bg-white/5 border border-white/10 rounded-2xl p-6 group transition-all duration-500 hover:border-cyan/30" style={{ transitionDelay: '0.2s' }}>
            <div className="absolute top-0 left-0 h-[2px] w-0 bg-cyan transition-all duration-700 group-hover:w-full opacity-0 group-hover:opacity-100 shadow-[0_0_15px_#8EF9F3]"></div>

            <h3 className="flex items-center gap-3 text-white font-bold mb-6 text-lg uppercase tracking-wider">
              <ArrowDownCircle className="text-cyan" size={24} /> 
              Recent Withdrawals
            </h3>

            <div className="space-y-4">
              {withdrawals.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 animate-fade-in-up">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan/10 flex items-center justify-center text-cyan">
                      <User size={18} />
                    </div>
                    <div>
                      <div className="text-white font-medium">{item.user}</div>
                      <div className="text-white/40 text-xs">{item.time}</div>
                    </div>
                  </div>
                  <div className="text-cyan font-black text-lg">-{item.amount}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LiveTransactions;
