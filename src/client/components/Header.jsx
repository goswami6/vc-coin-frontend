import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getToken, clearToken, api } from '../../utils/api';
import { Wallet, PieChart, Users, User, LogOut } from 'lucide-react';
import logo from '../../assets/logo/logo.png';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userBalance, setUserBalance] = useState('0.00 VC');
  const [userInitial, setUserInitial] = useState('U');

  const location = useLocation();
  const navigate = useNavigate();

  const checkAuthStatus = () => {
    const token = getToken();
    if (token) {
      setIsLoggedIn(true);
      api.me().then((data) => {
        const u = data.user || data;
        setUserInitial(u.name?.charAt(0)?.toUpperCase() || 'U');
        setUserBalance(`${parseFloat(u.balance || 0).toFixed(2)} VC`);
      }).catch(() => {
        clearToken();
        setIsLoggedIn(false);
      });
    } else {
      setIsLoggedIn(false);
    }
  };

  // Check login status + close menus on mount and when location changes
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      checkAuthStatus();
      setMobileMenuOpen(false);
      setUserDropdownOpen(false);
    });
    return () => cancelAnimationFrame(id);
  }, [location]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const toggleMobileNav = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    clearToken();
    setIsLoggedIn(false);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  const authNavLinks = isLoggedIn
    ? [...navLinks, { path: '/dashboard', label: 'Dashboard' }]
    : navLinks;

  return (
    <header
      className={`header fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-deep-purple-dark/95 backdrop-blur-glass shadow-lg'
        : 'bg-deep-purple/85 backdrop-blur-glass'
        } border-b border-purple/20`}
      id="header"
    >
      <div className="container mx-auto px-4 md:px-20 flex items-center justify-between h-17.5 md:h-15">
        {/* Logo */}
        <Link to="/" className="logo flex items-center gap-2 font-heading font-extrabold text-xl md:text-2xl shrink-0">
          <img src={logo} alt="VC Coin" className="w-9 h-9 md:w-10 md:h-10 rounded-lg object-contain" />
          <span className="text-white">VC Coin</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-links hidden md:flex items-center gap-1">
          {authNavLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${isActive(link.path)
                ? 'text-cyan bg-cyan/12 active'
                : 'text-white/70 hover:text-cyan hover:bg-cyan/8'
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="nav-actions flex items-center gap-2 md:gap-3">
          {/* Wallet - Visible on desktop, hidden on very small mobile if needed, but here kept responsive */}
          {isLoggedIn && (
            <div
              className="nav-wallet hidden xs:flex items-center gap-2 px-3 md:px-4 py-2 bg-green/10 border border-green/20 rounded-md text-xs md:text-sm font-semibold text-green"
              id="navWallet"
            >
              <Wallet size={12} />
              <span id="navBalance" className="whitespace-nowrap">{userBalance}</span>
            </div>
          )}

          {/* User Menu */}
          {isLoggedIn && (
            <div className="nav-user relative" id="navUser">
              <button
                onClick={toggleUserDropdown}
                className="w-8.75 h-8.75 md:w-9.5 md:h-9.5 rounded-full bg-linear-to-r from-purple to-cyan flex items-center justify-center font-bold text-sm cursor-pointer hover:shadow-glow-purple transition-all"
                id="navUserInitial"
              >
                {userInitial}
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div
                  className="user-dropdown absolute top-full right-0 mt-2.5 w-50 md:w-55 bg-deep-purple border border-white/10 rounded-md p-2 shadow-card z-50 animate-fade-in-up"
                  id="userDropdown"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-sm text-sm text-white/70 hover:bg-white/5 hover:text-cyan transition-all"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <PieChart size={14} /> Dashboard
                  </Link>
                  <Link
                    to="/dashboard/wallet"
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-sm text-sm text-white/70 hover:bg-white/5 hover:text-cyan transition-all"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <Wallet size={14} /> My Wallet
                  </Link>
                  <Link
                    to="/dashboard/team"
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-sm text-sm text-white/70 hover:bg-white/5 hover:text-cyan transition-all"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <Users size={14} /> My Team
                  </Link>
                  <Link
                    to="/dashboard/settings"
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-sm text-sm text-white/70 hover:bg-white/5 hover:text-cyan transition-all"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <User size={14} /> Profile
                  </Link>

                  <div className="divider h-px bg-white/6 my-1.5"></div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-sm text-sm text-red-400 hover:bg-red-500/10 transition-all w-full text-left"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {!isLoggedIn && (
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/login"
                className="btn btn-outline btn-sm px-4 py-2 text-sm font-semibold border-2 border-cyan text-cyan bg-transparent hover:bg-cyan hover:text-bg-dark rounded-md transition-all"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="btn btn-primary btn-sm px-4 py-2 text-sm font-semibold bg-linear-to-r from-green to-green-dark text-bg-dark shadow-glow-green hover:shadow-[0_0_30px_rgba(94,252,141,0.5)] rounded-md transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}

          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 border border-red-500/20 rounded-md transition-all"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMobileNav}
            className="mobile-toggle md:hidden flex flex-col items-center justify-center gap-1.5 w-8 h-8 bg-none border-none z-60"
            id="mobileToggle"
            aria-label="Toggle Menu"
          >
            <span className={`block w-6 h-0.5 bg-white rounded-sm transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`} />
            <span className={`block w-6 h-0.5 bg-white rounded-sm transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''
              }`} />
            <span className={`block w-6 h-0.5 bg-white rounded-sm transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu Overlay */}
      <div
        className={`mobile-nav fixed inset-0 top-0 left-0 w-full h-screen bg-bg-dark/98 backdrop-blur-xl z-55 transition-transform duration-500 ease-in-out md:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full pt-20 px-6 pb-10 overflow-y-auto">
          {/* Mobile Navigation Links */}
          <nav className="flex flex-col gap-2">
            {authNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-4 text-lg font-medium rounded-md transition-all ${isActive(link.path)
                  ? 'text-cyan bg-cyan/10'
                  : 'text-white/80 hover:text-cyan hover:bg-cyan/5'
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Actions Section */}
          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col gap-4">
            {isLoggedIn ? (
              <>
                <div className="flex items-center justify-between px-4 py-4 bg-green/10 border border-green/20 rounded-lg text-green">
                  <div className="flex items-center gap-3">
                    <Wallet size={16} />
                    <span className="font-semibold uppercase text-xs tracking-wider">Balance</span>
                  </div>
                  <span className="font-bold">{userBalance}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-2">
                  <MobileMenuBtn to="/dashboard/wallet" icon={<Wallet size={20} />} label="Wallet" onClick={() => setMobileMenuOpen(false)} />
                  <MobileMenuBtn to="/dashboard/settings" icon={<User size={20} />} label="Profile" onClick={() => setMobileMenuOpen(false)} />
                </div>

                <button
                  onClick={handleLogout}
                  className="mt-4 flex items-center justify-center gap-3 px-4 py-4 text-base font-semibold rounded-md text-red-400 bg-red-500/5 border border-red-500/10 transition-all w-full"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-4">
                <Link
                  to="/login"
                  className="w-full py-4 text-center font-bold text-cyan border border-cyan/30 rounded-lg bg-cyan/5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="w-full py-4 text-center font-bold text-bg-dark bg-linear-to-r from-green to-green-dark rounded-lg shadow-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close desktop dropdown */}
      {userDropdownOpen && (
        <div
          className="fixed inset-0 z-30 hidden md:block"
          onClick={() => setUserDropdownOpen(false)}
        />
      )}
    </header>
  );
};

// Helper component for mobile sub-buttons
const MobileMenuBtn = ({ to, icon, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-white/5 border border-white/10 text-white/70"
  >
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </Link>
);

export default Header;