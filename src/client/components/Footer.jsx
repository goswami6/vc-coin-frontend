import { Link } from 'react-router-dom';
import { Twitter, Send, Instagram, Youtube } from 'lucide-react'; 
import logo from '../../assets/logo/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Sign Up', path: '/signup' },
    { label: 'Login', path: '/login' },
  ];

  const platformLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Investments', path: '/dashboard/investments' },
    { label: 'Deposit', path: '/dashboard/deposit' },
    { label: 'Withdraw', path: '/dashboard/withdraw' },
    { label: 'Marketplace', path: '/dashboard/marketplace' },
  ];

  const legalLinks = [
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Privacy Policy', path: '/privacy' },
  ];

  const socialLinks = [
    { icon: <Twitter size={16} />, label: 'Twitter' },
    { icon: <Send size={16} />, label: 'Telegram' },
    { icon: <Instagram size={16} />, label: 'Instagram' },
    { icon: <Youtube size={16} />, label: 'YouTube' },
  ];

  const linkStyle = {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '14px',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const handleLinkEnter = (e) => {
    e.currentTarget.style.color = '#5EFC8D';
    e.currentTarget.style.paddingLeft = '6px';
  };

  const handleLinkLeave = (e) => {
    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
    e.currentTarget.style.paddingLeft = '0';
  };

  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, #6D5972 0%, #4A3E4F 100%)',
        borderTop: '1px solid rgba(132, 119, 209, 0.15)',
        paddingTop: '72px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Footer Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '48px',
            marginBottom: '48px',
          }}
        >
          {/* Brand Column */}
          <div>
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                fontSize: '24px',
                textDecoration: 'none',
              }}
            >
              <img
                src={logo}
                alt="VC Coin"
                style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'contain' }}
              />
              <span
                style={{
                  background: 'linear-gradient(135deg, #5EFC8D, #8EF9F3)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                VC Coin
              </span>
            </Link>

            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                lineHeight: 1.7,
                margin: '16px 0 20px',
                maxWidth: '400px',
              }}
            >
              The future of cryptocurrency investment. Build your wealth with our secure, transparent, and rewarding platform designed for both beginners and experienced investors.
            </p>

            {/* Social Links */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href="#"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '16px',
                    textDecoration: 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#8477D1';
                    e.currentTarget.style.borderColor = '#8477D1';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4
              style={{
                color: '#8EF9F3',
                fontSize: '16px',
                fontWeight: 600,
                marginBottom: '20px',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {quickLinks.map((item, index) => (
                <li key={index} style={{ marginBottom: '6px' }}>
                  <Link
                    to={item.path}
                    style={linkStyle}
                    onMouseEnter={handleLinkEnter}
                    onMouseLeave={handleLinkLeave}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform Column */}
          <div>
            <h4
              style={{
                color: '#8EF9F3',
                fontSize: '16px',
                fontWeight: 600,
                marginBottom: '20px',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Platform
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {platformLinks.map((item, index) => (
                <li key={index} style={{ marginBottom: '6px' }}>
                  <Link
                    to={item.path}
                    style={linkStyle}
                    onMouseEnter={handleLinkEnter}
                    onMouseLeave={handleLinkLeave}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4
              style={{
                color: '#8EF9F3',
                fontSize: '16px',
                fontWeight: 600,
                marginBottom: '20px',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Legal
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {legalLinks.map((item, index) => (
                <li key={index} style={{ marginBottom: '6px' }}>
                  <Link
                    to={item.path}
                    style={linkStyle}
                    onMouseEnter={handleLinkEnter}
                    onMouseLeave={handleLinkLeave}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact Info */}
            <h4
              style={{
                color: '#8EF9F3',
                fontSize: '16px',
                fontWeight: 600,
                margin: '28px 0 16px',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Get in Touch
            </h4>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
              Have questions? Visit our{' '}
              <Link to="/contact" style={{ color: '#5EFC8D', textDecoration: 'none' }}>
                Contact Page
              </Link>{' '}
              to reach out.
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            padding: '20px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '13px',
            color: 'rgba(255, 255, 255, 0.45)',
          }}
        >
          <span>&copy; {currentYear} VC Coin. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '20px' }}>
            {[
              { label: 'Terms', path: '/terms' },
              { label: 'Privacy', path: '/privacy' },
            ].map((item, index) => (
              <Link
                key={index}
                to={item.path}
                style={{
                  color: 'rgba(255, 255, 255, 0.45)',
                  textDecoration: 'none',
                  transition: 'color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#8EF9F3';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.45)';
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;