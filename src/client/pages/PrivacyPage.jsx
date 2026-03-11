import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Eye, Database, Lock, Share2, Bell, UserCheck, Mail } from 'lucide-react';

const PrivacyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      icon: Database,
      title: '1. Information We Collect',
      content: [
        'We collect personal information that you provide directly to us when creating an account, including your name, email address, phone number, and any other information you choose to provide.',
        'We automatically collect certain technical information when you visit our platform, including your IP address, browser type, device information, and usage patterns through cookies and similar technologies.',
        'For transaction purposes, we may collect financial information such as deposit and withdrawal details, investment history, and wallet addresses necessary to process your transactions.'
      ]
    },
    {
      icon: Eye,
      title: '2. How We Use Your Information',
      content: [
        'We use your personal information to create and manage your account, process transactions, and provide our investment platform services to you.',
        'Your information helps us improve our platform, personalize your experience, send important updates about your account, and communicate changes to our services or policies.',
        'We may use aggregated, anonymized data for analytics purposes to understand platform usage patterns and improve our services. This data cannot be used to identify individual users.'
      ]
    },
    {
      icon: Shield,
      title: '3. Data Protection & Security',
      content: [
        'We implement industry-standard security measures including encryption (SSL/TLS), secure password hashing (bcrypt), and access controls to protect your personal information from unauthorized access.',
        'Your account is protected by your unique credentials. We strongly recommend using a strong, unique password and never sharing your login details with anyone.',
        'While we take extensive measures to secure your data, no method of electronic storage or transmission is 100% secure. We cannot guarantee absolute security but are committed to protecting your information to the best of our ability.'
      ]
    },
    {
      icon: Share2,
      title: '4. Information Sharing',
      content: [
        'We do not sell, trade, or rent your personal information to third parties. Your data is used exclusively for providing and improving our services.',
        'We may share your information with trusted service providers who assist us in operating our platform, processing payments, or analyzing usage — only to the extent necessary for them to perform their functions.',
        'We may disclose your information when required by law, to comply with legal processes, to protect the rights and safety of VC Coin, our users, or others, or to respond to government requests.'
      ]
    },
    {
      icon: Lock,
      title: '5. Cookies & Tracking',
      content: [
        'We use essential cookies to maintain your session, remember your preferences, and ensure the platform functions properly. These cookies are necessary for the basic operation of our platform.',
        'Analytics cookies help us understand how visitors interact with our platform, allowing us to improve user experience. You can control cookie preferences through your browser settings.',
        'We do not use third-party advertising cookies. Any tracking is limited to platform improvement and security purposes only.'
      ]
    },
    {
      icon: UserCheck,
      title: '6. Your Rights',
      content: [
        'You have the right to access, update, or correct your personal information at any time through your account settings on our platform.',
        'You may request deletion of your account and associated personal data by contacting our support team. Please note that some data may need to be retained for legal or regulatory compliance purposes.',
        'You can opt out of non-essential communications at any time. However, we may still send you important account-related notifications such as security alerts and transaction confirmations.'
      ]
    },
    {
      icon: Bell,
      title: '7. Data Retention',
      content: [
        'We retain your personal information for as long as your account is active or as needed to provide our services. If you close your account, we will delete or anonymize your data within a reasonable timeframe.',
        'Certain information may be retained for longer periods where required by law, for legitimate business purposes, or to resolve disputes and enforce our agreements.',
        'Transaction records and financial data may be retained for up to 7 years in compliance with applicable financial regulations and tax requirements.'
      ]
    },
    {
      icon: Mail,
      title: '8. Contact Us',
      content: [
        'If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us through our Contact page.',
        'We take your privacy seriously and will respond to all privacy-related inquiries within 30 business days.',
        'This Privacy Policy was last updated in March 2026. We may update this policy from time to time, and we will notify you of any significant changes through our platform or via email.'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-bg-dark">
      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-green/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Your Privacy Matters
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-poppins mb-4">
            Privacy <span className="bg-linear-to-r from-cyan to-green bg-clip-text text-transparent">Policy</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            We are committed to protecting your personal information and being transparent about how we use it. Last updated: March 2026.
          </p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 hover:border-white/15 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-cyan" />
                  </div>
                  <h2 className="text-xl font-semibold text-white font-poppins">{section.title}</h2>
                </div>
                <div className="space-y-4">
                  {section.content.map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-white/60 leading-relaxed text-[15px]">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Contact CTA */}
          <div className="bg-linear-to-r from-cyan/10 to-green/10 border border-cyan/20 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-semibold text-white mb-3 font-poppins">Privacy Concerns?</h3>
            <p className="text-white/60 mb-5">If you have any questions about how we handle your data, we're here to help.</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-cyan to-green text-bg-dark font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan/25 transition-all duration-300"
            >
              <Mail className="w-4 h-4" />
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;
