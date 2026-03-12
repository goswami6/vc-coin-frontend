import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Header from './client/components/Header';
import Footer from './client/components/Footer';
import ScrollToTop from './client/components/ScrollToTop';

// Eager-loaded: most visited pages load instantly
import HomePage from './client/pages/HomePage';
import Login from './client/pages/Login';
import Signup from './client/pages/SignupPage';
import DashboardLayout from './user/pages/DashboardLayout';
import DashboardHome from './user/pages/DashboardHome';
import WalletPage from './user/pages/WalletPage';
import Investments from './user/pages/Investments';
import Deposit from './user/pages/Deposit';
import WithdrawPage from './user/pages/WithdrawPage';
import TransferPage from './user/pages/TransferPage';
import MarketplacePage from './user/pages/MarketplacePage';
import TeamPage from './user/pages/TeamPage';
import TransactionsPage from './user/pages/TransactionsPage';
import UserSettings from './user/pages/UserSettings';

// Lazy-loaded: less frequent pages
const AboutPage = lazy(() => import('./client/pages/AboutPage'));
const ContactPage = lazy(() => import('./client/pages/ContactPage'));
const TermsPage = lazy(() => import('./client/pages/TermsPage'));
const PrivacyPage = lazy(() => import('./client/pages/PrivacyPage'));
const ForgotPassword = lazy(() => import('./client/pages/ForgotPassword'));

const AdminLayout = lazy(() => import('./admin/pages/AdminLayout'));
const AdminHome = lazy(() => import('./admin/pages/AdminHome'));
const AdminPlans = lazy(() => import('./admin/pages/AdminPlans'));
const AdminDeposits = lazy(() => import('./admin/pages/AdminDeposits'));
const AdminInvestments = lazy(() => import('./admin/pages/AdminInvestments'));
const AdminMarketplace = lazy(() => import('./admin/pages/AdminMarketplace'));
const AdminWithdrawals = lazy(() => import('./admin/pages/AdminWithdrawals'));
const AdminSettings = lazy(() => import('./admin/pages/AdminSettings'));
const AdminTransactions = lazy(() => import('./admin/pages/AdminTransactions'));
const AdminUsers = lazy(() => import('./admin/pages/AdminUsers'));
const AdminReports = lazy(() => import('./admin/pages/AdminReports'));
const AdminAnalytics = lazy(() => import('./admin/pages/AdminAnalytics'));
const AdminNotifications = lazy(() => import('./admin/pages/AdminNotifications'));
const AdminEnquiries = lazy(() => import('./admin/pages/AdminEnquiries'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 border-3 border-cyan/30 border-t-cyan rounded-full animate-spin" />
  </div>
);

// Create a wrapper component to handle conditional rendering
const AppContent = () => {
  const location = useLocation();

  // Hide public Header/Footer on login, signup, and all dashboard pages
  const shouldHide = ['/login', '/signup', '/forgot-password'].includes(location.pathname) || location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-bg-dark">
      <ScrollToTop />
      {!shouldHide && <Header />}

      <main className={!shouldHide ? "pt-17.5 md:pt-15" : ""}>
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
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