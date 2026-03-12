import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Calendar,
  Percent,
  Wallet,
  Users,
  ArrowDownToLine,
  ShieldCheck,
  CheckCircle,
  Zap,
  X,
  AlertTriangle,
  RefreshCw,
  RotateCcw,
} from 'lucide-react';
import { api, API_BASE_URL as API_BASE } from '../../utils/api';

const Investments = () => {
  useOutletContext();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [myInvestments, setMyInvestments] = useState([]);
  const [investStats, setInvestStats] = useState({ activeInvested: 0, activeCount: 0 });
  const [investing, setInvesting] = useState(false);

  // Popup state
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    Promise.all([
      api.getActivePlans().then((d) => setPlans(d.plans || [])).catch(() => { }),
      api.getBalance().then((d) => setBalance(d.balance || 0)).catch(() => { }),
      api.myInvestments().then((d) => {
        setMyInvestments(d.investments || []);
        setInvestStats(d.stats || {});
      }).catch(() => { }),
    ]).finally(() => setLoading(false));
  }, []);

  const handleInvestClick = (plan) => {
    setSelectedPlan(plan);
    setShowPopup(true);
  };

  const handleConfirmInvest = async () => {
    if (!selectedPlan) return;
    // If insufficient balance, go to deposit page
    if (balance < Number(selectedPlan.investment_amount)) {
      setShowPopup(false);
      navigate('/dashboard/deposit');
      return;
    }
    setInvesting(true);
    try {
      await api.invest({
        plan_id: selectedPlan.id,
        plan_name: selectedPlan.name,
        amount: selectedPlan.investment_amount,
        daily_roi: selectedPlan.daily_roi,
        tenure_days: selectedPlan.tenure_days,
        total_return: selectedPlan.total_return,
      });
      // Refresh data
      const [balData, invData] = await Promise.all([
        api.getBalance(),
        api.myInvestments(),
      ]);
      setBalance(balData.balance || 0);
      setMyInvestments(invData.investments || []);
      setInvestStats(invData.stats || {});
      setShowPopup(false);
    } catch (err) {
      alert(err.message || 'Investment failed.');
    } finally {
      setInvesting(false);
    }
  };

  const insufficientAmount = selectedPlan
    ? Math.max(0, Number(selectedPlan.investment_amount) - balance)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-green/30 border-t-green rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Investment Plans</h1>
        <p className="text-white/40 text-sm mt-1">Choose a plan and start earning daily returns</p>
      </div>

      {/* Income Overview */}
      {(() => {
        const activeInvs = myInvestments.filter((i) => i.status === 'active');
        const dailyTotal = activeInvs.reduce((sum, i) => sum + (Number(i.dailyAmount) || 0), 0);
        const totalEarned = myInvestments.reduce((sum, i) => sum + (Number(i.earned) || 0), 0);
        const totalInvested = Number(investStats.activeInvested || 0);
        const totalIncome = totalInvested + totalEarned;
        return (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-green/10 text-green flex items-center justify-center shrink-0">
                <Percent size={18} />
              </div>
              <div>
                <p className="text-xs text-white/30 mb-0.5">Daily Income</p>
                <p className="text-sm font-bold text-green">{dailyTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })} VC</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan/10 text-cyan flex items-center justify-center shrink-0">
                <TrendingUp size={18} />
              </div>
              <div>
                <p className="text-xs text-white/30 mb-0.5">Total Income</p>
                <p className="text-sm font-bold text-cyan">{totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })} VC</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple/10 text-purple flex items-center justify-center shrink-0">
                <Wallet size={18} />
              </div>
              <div>
                <p className="text-xs text-white/30 mb-0.5">Total Invested</p>
                <p className="text-sm font-bold text-purple">{Number(investStats.activeInvested || 0).toLocaleString('en-IN')} VC</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue/10 text-blue flex items-center justify-center shrink-0">
                <Zap size={18} />
              </div>
              <div>
                <p className="text-xs text-white/30 mb-0.5">Active Plans</p>
                <p className="text-sm font-bold text-white">{investStats.activeCount || 0}</p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Plans */}
      {plans.length === 0 ? (
        <div className="bg-white/5 border border-white/5 rounded-2xl p-12 text-center">
          <TrendingUp size={48} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/30 text-sm">No investment plans available right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden hover:border-green/20 transition-all group">
              {/* Image */}
              <div className="h-44 bg-linear-to-br from-green/10 to-cyan/5 flex items-center justify-center overflow-hidden relative">
                {plan.image ? (
                  <img src={`${API_BASE}${plan.image}`} alt={plan.name} className="w-full h-full object-cover" />
                ) : (
                  <TrendingUp size={56} className="text-white/5" />
                )}
                <div className="absolute top-3 right-3 bg-green/90 text-bg-dark text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Zap size={10} /> ACTIVE
                </div>
              </div>

              {/* Info */}
              <div className="p-5 space-y-4">
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-white/30 text-[10px] uppercase tracking-wider mb-1">
                      <Wallet size={10} /> Investment
                    </div>
                    <p className="text-base font-bold text-cyan">{Number(plan.investment_amount).toLocaleString()} VC</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-white/30 text-[10px] uppercase tracking-wider mb-1">
                      <Percent size={10} /> Daily ROI
                    </div>
                    <p className="text-base font-bold text-green">{plan.daily_roi}%</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-white/30 text-[10px] uppercase tracking-wider mb-1">
                      <Calendar size={10} /> Duration
                    </div>
                    <p className="text-base font-bold text-white">{plan.tenure_days} Days</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-white/30 text-[10px] uppercase tracking-wider mb-1">
                      <TrendingUp size={10} /> Total Return
                    </div>
                    <p className="text-base font-bold text-purple">{Number(plan.total_return).toLocaleString()} VC</p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-1.5 text-xs text-white/40">
                  <p className="flex items-center gap-1.5"><CheckCircle size={12} className="text-green" /> {plan.tenure_days} days return — earn {plan.daily_roi}% daily</p>
                  <p className="flex items-center gap-1.5"><CheckCircle size={12} className="text-green" /> Level income up to 6 levels</p>
                  <p className="flex items-center gap-1.5"><CheckCircle size={12} className="text-green" /> Min withdrawal: 500 VC</p>
                  <p className="flex items-center gap-1.5"><RefreshCw size={12} className="text-green" /> Auto-renewal for continuous earnings</p>
                </div>

                <button
                  onClick={() => handleInvestClick(plan)}
                  className="w-full bg-linear-to-r from-green to-cyan text-bg-dark font-black py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm hover:brightness-110 transition-all mt-2"
                >
                  <TrendingUp size={16} /> Invest Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* My Active Investments */}
      {myInvestments.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap size={20} className="text-cyan" /> My Investments
          </h2>

          {/* Investment Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
              <p className="text-xs text-white/30 mb-1">Active Investments</p>
              <p className="text-xl font-bold text-white">{investStats.activeCount || 0}</p>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
              <p className="text-xs text-white/30 mb-1">Total Invested</p>
              <p className="text-xl font-bold text-cyan">{Number(investStats.activeInvested || 0).toLocaleString()} VC</p>
            </div>
          </div>

          {/* Auto Renewal Info Banner */}
          <div className="bg-linear-to-r from-purple/10 to-cyan/5 border border-white/5 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple/10 flex items-center justify-center shrink-0 mt-0.5">
              <RefreshCw size={18} className="text-purple" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Auto Renewal</p>
              <p className="text-xs text-white/40 mt-0.5">
                Enable auto-renewal on any investment to automatically re-invest when the cycle completes — same amount, same plan, continuous earnings. By default auto-renewal is off.
              </p>
            </div>
          </div>

          {/* Active Investment Cards */}
          <div className="space-y-3">
            {myInvestments.map((inv) => {
              const isActive = inv.status === 'active';
              const handleToggleRenew = async (e) => {
                e.stopPropagation();
                try {
                  const res = await api.toggleAutoRenew(inv.id);
                  setMyInvestments((prev) =>
                    prev.map((i) =>
                      i.id === inv.id ? { ...i, auto_renew: res.investment.auto_renew } : i
                    )
                  );
                } catch (err) {
                  console.error('Toggle error:', err);
                }
              };
              return (
                <div key={inv.id} className={`bg-white/5 border rounded-2xl p-5 ${isActive ? 'border-green/10' : 'border-white/5 opacity-60'}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {inv.plan_image ? (
                        <img src={`${API_BASE}${inv.plan_image}`} alt="" className="w-10 h-10 rounded-xl object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-green/10 flex items-center justify-center">
                          <TrendingUp size={18} className="text-green" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-white flex items-center gap-2">
                          {inv.plan_name}
                          {inv.renewal_count > 0 && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold bg-purple/10 text-purple px-2 py-0.5 rounded-full">
                              <RotateCcw size={9} /> Cycle {inv.renewal_count + 1}
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-white/30">
                          {new Date(inv.start_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} — {new Date(inv.end_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Auto Renew Toggle */}
                      {isActive && (
                        <button
                          onClick={handleToggleRenew}
                          title={inv.auto_renew ? 'Auto-renewal ON — click to disable' : 'Auto-renewal OFF — click to enable'}
                          className="flex items-center gap-1.5 text-[10px] font-bold transition-all"
                        >
                          <span className={`text-white/40 ${!inv.auto_renew ? 'font-black text-white/60' : ''}`}>OFF</span>
                          <div className={`relative w-8 h-4 rounded-full transition-all ${inv.auto_renew ? 'bg-green' : 'bg-white/10'}`}>
                            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${inv.auto_renew ? 'left-[18px]' : 'left-0.5'}`} />
                          </div>
                          <span className={`text-white/40 ${inv.auto_renew ? 'font-black text-green' : ''}`}>ON</span>
                        </button>
                      )}
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${isActive ? 'bg-green/10 text-green' : 'bg-white/5 text-white/30'
                        }`}>
                        {inv.status}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-[10px] text-white/30 mb-1.5">
                      <span>Day {inv.daysActive} / {inv.tenure_days}</span>
                      <span>{inv.progress?.toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-green to-cyan rounded-full transition-all"
                        style={{ width: `${inv.progress || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* ROI Details */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <p className="text-[10px] text-white/30 mb-0.5">Invested</p>
                      <p className="text-sm font-bold text-white">{Number(inv.amount).toLocaleString()} VC</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <p className="text-[10px] text-white/30 mb-0.5">Earned</p>
                      <p className="text-sm font-bold text-green">+{Number(inv.earned || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })} VC</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <p className="text-[10px] text-white/30 mb-0.5">Total Return</p>
                      <p className="text-sm font-bold text-cyan">{Number(inv.total_return).toLocaleString()} VC</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirm Investment Popup */}
      {showPopup && selectedPlan && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bg-dark border border-white/10 rounded-2xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">Confirm Investment</h2>
              <button onClick={() => setShowPopup(false)} className="text-white/30 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <p className="text-white/50 text-sm">You are about to invest in:</p>

              {/* Plan Info */}
              <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-center">
                <h3 className="text-lg font-bold text-white mb-1">{selectedPlan.name}</h3>
                <p className="text-2xl font-black text-cyan">₹{Number(selectedPlan.investment_amount).toLocaleString('en-IN')}</p>
              </div>

              <p className="text-white/30 text-xs text-center">Amount will be deducted from your Main Wallet</p>

              {/* Balance */}
              <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                <span className="text-white/50 text-sm">Current Balance:</span>
                <span className="text-lg font-bold text-white">₹{Number(balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>

              {/* Insufficient Balance Warning */}
              {balance < Number(selectedPlan.investment_amount) && (
                <div className="bg-red-400/10 border border-red-400/20 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle size={20} className="text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-400 text-sm font-bold">Insufficient balance!</p>
                    <p className="text-red-400/70 text-xs mt-0.5">
                      You need ₹{insufficientAmount.toLocaleString('en-IN')} more. Add funds to continue.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Button */}
              {balance >= Number(selectedPlan.investment_amount) ? (
                <button
                  onClick={handleConfirmInvest}
                  disabled={investing}
                  className="w-full bg-linear-to-r from-green to-cyan text-bg-dark font-black py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm hover:brightness-110 transition-all disabled:opacity-50"
                >
                  <CheckCircle size={16} /> {investing ? 'Processing...' : 'Confirm Investment'}
                </button>
              ) : (
                <button
                  onClick={handleConfirmInvest}
                  className="w-full bg-linear-to-r from-cyan to-blue text-white font-black py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm hover:brightness-110 transition-all"
                >
                  <ArrowDownToLine size={16} /> Go to Deposit
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Investments;
