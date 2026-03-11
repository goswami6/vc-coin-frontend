import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Header from './client/components/Header';
import HomePage from './client/pages/HomePage';
import AboutPage from './client/pages/AboutPage';
import ContactPage from './client/pages/ContactPage';
import Footer from './client/components/Footer';
import Signup from './client/pages/SignupPage';
import Login from './client/pages/Login';
import ForgotPassword from './client/pages/ForgotPassword';
import DashboardLayout from './user/pages/DashboardLayout';
import DashboardHome from './user/pages/DashboardHome';
import AdminLayout from './admin/pages/AdminLayout';
import AdminHome from './admin/pages/AdminHome';
import AdminPlans from './admin/pages/AdminPlans';
import AdminDeposits from './admin/pages/AdminDeposits';
import AdminInvestments from './admin/pages/AdminInvestments';
import Investments from './user/pages/Investments';
import Deposit from './user/pages/Deposit';
import WalletPage from './user/pages/WalletPage';
import TransferPage from './user/pages/TransferPage';
import MarketplacePage from './user/pages/MarketplacePage';
import WithdrawPage from './user/pages/WithdrawPage';
import AdminMarketplace from './admin/pages/AdminMarketplace';
import AdminWithdrawals from './admin/pages/AdminWithdrawals';
import AdminSettings from './admin/pages/AdminSettings';
import TransactionsPage from './user/pages/TransactionsPage';
import TeamPage from './user/pages/TeamPage';
import UserSettings from './user/pages/UserSettings';
import AdminTransactions from './admin/pages/AdminTransactions';
import AdminUsers from './admin/pages/AdminUsers';
import AdminReports from './admin/pages/AdminReports';
import AdminAnalytics from './admin/pages/AdminAnalytics';
import AdminNotifications from './admin/pages/AdminNotifications';
import AdminEnquiries from './admin/pages/AdminEnquiries';
import TermsPage from './client/pages/TermsPage';
import PrivacyPage from './client/pages/PrivacyPage';

// Create a wrapper component to handle conditional rendering
const AppContent = () => {
  const location = useLocation();

  // Hide public Header/Footer on login, signup, and all dashboard pages
  const shouldHide = ['/login', '/signup', '/forgot-password'].includes(location.pathname) || location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-bg-dark">
      {!shouldHide && <Header />}

      <main className={!shouldHide ? "pt-17.5 md:pt-15" : ""}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Dashboard with nested layout */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="wallet" element={<WalletPage />} />
            <Route path="investments" element={<Investments />} />
            <Route path="deposit" element={<Deposit />} />
            <Route path="withdraw" element={<WithdrawPage />} />
            <Route path="transfer" element={<TransferPage />} />
            <Route path="marketplace" element={<MarketplacePage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="settings" element={<UserSettings />} />
          </Route>

          {/* Admin with nested layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHome />} />
            <Route path="plans" element={<AdminPlans />} />
            <Route path="deposits" element={<AdminDeposits />} />
            <Route path="investments" element={<AdminInvestments />} />
            <Route path="marketplace" element={<AdminMarketplace />} />
            <Route path="withdrawals" element={<AdminWithdrawals />} />
            <Route path="transactions" element={<AdminTransactions />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </main>

      {!shouldHide && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;