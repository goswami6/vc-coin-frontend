import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, AlertTriangle, Users, Ban, CreditCard, Scale, Mail } from 'lucide-react';

const TermsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      icon: FileText,
      title: '1. Acceptance of Terms',
      content: [
        'By accessing or using VC Coin\'s platform, website, and services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.',
        'If you do not agree with any part of these terms, you must not use our platform. We reserve the right to modify these terms at any time, and your continued use of the platform constitutes acceptance of any changes.',
        'You must be at least 18 years of age to use our services. By using VC Coin, you represent and warrant that you meet this age requirement.'
      ]
    },
    {
      icon: Users,
      title: '2. Account Registration',
      content: [
        'To access certain features of our platform, you must create an account. You agree to provide accurate, current, and complete information during registration and to keep your account information updated.',
        'You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorized access or use of your account.',
        'VC Coin reserves the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or pose a risk to other users or the platform.'
      ]
    },
    {
      icon: CreditCard,
      title: '3. Investments & Transactions',
      content: [
        'All investment plans and returns displayed on our platform are subject to market conditions and platform policies. Past performance does not guarantee future results.',
        'Deposits, withdrawals, and transfers are processed according to our platform\'s processing timelines. VC Coin is not responsible for delays caused by third-party payment processors or network congestion.',
        'Minimum deposit and withdrawal amounts, fees, and processing times are displayed on the platform and may be updated from time to time. Users are responsible for reviewing these details before initiating transactions.'
      ]
    },
    {
      icon: AlertTriangle,
      title: '4. Risk Disclosure',
      content: [
        'Cryptocurrency investments carry inherent risks, including but not limited to market volatility, regulatory changes, and technological vulnerabilities. You should only invest funds that you can afford to lose.',
        'VC Coin does not provide financial, investment, or legal advice. All investment decisions are made solely by the user, and we are not liable for any losses incurred through use of our platform.',
        'The value of cryptocurrencies can fluctuate significantly. Users acknowledge and accept the risks associated with cryptocurrency investments before using our services.'
      ]
    },
    {
      icon: Ban,
      title: '5. Prohibited Activities',
      content: [
        'Users must not use the platform for any unlawful purpose, including money laundering, fraud, terrorism financing, or any activity that violates applicable laws and regulations.',
        'Creating multiple accounts, using automated tools to access the platform, manipulating referral systems, or engaging in any form of market manipulation is strictly prohibited.',
        'Any attempt to exploit vulnerabilities, interfere with platform operations, or compromise the security of other users\' accounts will result in immediate account termination and may be reported to authorities.'
      ]
    },
    {
      icon: Shield,
      title: '6. Intellectual Property',
      content: [
        'All content on the VC Coin platform, including text, graphics, logos, icons, images, and software, is the property of VC Coin and is protected by intellectual property laws.',
        'Users may not reproduce, distribute, modify, or create derivative works from any content on our platform without prior written consent from VC Coin.',
        'The VC Coin name, logo, and all related names, logos, product and service names are trademarks of VC Coin. You must not use such marks without our prior written permission.'
      ]
    },
    {
      icon: Scale,
      title: '7. Limitation of Liability',
      content: [
        'VC Coin provides its platform and services on an "as is" and "as available" basis without warranties of any kind, either express or implied.',
        'To the fullest extent permitted by law, VC Coin shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the platform.',
        'Our total liability for any claim arising from these terms or your use of our services shall not exceed the amount you have deposited on the platform in the preceding 12 months.'
      ]
    },
    {
      icon: Mail,
      title: '8. Contact & Disputes',
      content: [
        'For any questions regarding these Terms of Service, please contact our support team through the Contact page on our website.',
        'Any disputes arising from these terms shall be resolved through good-faith negotiation. If a resolution cannot be reached, disputes shall be submitted to binding arbitration under applicable laws.',
        'These Terms of Service are governed by and construed in accordance with the laws of India. You agree to submit to the exclusive jurisdiction of the courts in New Delhi, India.'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-bg-dark">
      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-green text-sm font-medium mb-6">
            <FileText className="w-4 h-4" />
            Legal
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-poppins mb-4">
            Terms of <span className="bg-linear-to-r from-green to-cyan bg-clip-text text-transparent">Service</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Please read these terms carefully before using our platform. Last updated: March 2026.
          </p>
        </div>
      </section>

      {/* Terms Content */}
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
                  <div className="w-10 h-10 rounded-xl bg-green/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-green" />
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
          <div className="bg-linear-to-r from-green/10 to-cyan/10 border border-green/20 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-semibold text-white mb-3 font-poppins">Have Questions?</h3>
            <p className="text-white/60 mb-5">If you have any questions about these terms, feel free to reach out to us.</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-green to-cyan text-bg-dark font-semibold rounded-xl hover:shadow-lg hover:shadow-green/25 transition-all duration-300"
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

export default TermsPage;
