export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://vc-coin-backend.onrender.com';

const getJson = async (res) => {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { message: text };
  }
};

const handleResponse = async (res) => {
  const data = await getJson(res);
  if (!res.ok) {
    throw new Error(data?.message || res.statusText || 'API request failed');
  }
  return data;
};

const fetchJson = (url, options) => {
  const { headers: optHeaders, ...rest } = options || {};
  return fetch(`${API_BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...optHeaders,
    },
    ...rest,
  }).then(handleResponse);
};

export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage.getItem('vc_token');
};

export const setToken = (token) => {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem('vc_token', token);
};

export const clearToken = () => {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem('vc_token');
};

export const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const fetchMultipart = (url, formData) =>
  fetch(`${API_BASE_URL}${url}`, {
    method: 'POST',
    headers: { ...authHeaders() },
    body: formData,
  }).then(handleResponse);

const fetchMultipartPut = (url, formData) =>
  fetch(`${API_BASE_URL}${url}`, {
    method: 'PUT',
    headers: { ...authHeaders() },
    body: formData,
  }).then(handleResponse);

export const api = {
  register: (payload) =>
    fetchJson('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) =>
    fetchJson('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => fetchJson('/api/auth/me', { method: 'GET', headers: authHeaders() }),
  forgotPassword: (payload) =>
    fetchJson('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify(payload) }),
  verifyOtp: (payload) =>
    fetchJson('/api/auth/verify-otp', { method: 'POST', body: JSON.stringify(payload) }),
  resetPassword: (payload) =>
    fetchJson('/api/auth/reset-password', { method: 'POST', body: JSON.stringify(payload) }),
  updateProfile: (payload) =>
    fetchJson('/api/auth/profile', { method: 'PUT', headers: { ...authHeaders() }, body: JSON.stringify(payload) }),
  changePassword: (payload) =>
    fetchJson('/api/auth/change-password', { method: 'PUT', headers: { ...authHeaders() }, body: JSON.stringify(payload) }),

  // Investment Plans
  createPlan: (formData) => fetchMultipart('/api/plans', formData),
  getPlans: () => fetchJson('/api/plans', { headers: authHeaders() }),
  getActivePlans: () => fetchJson('/api/plans/active', { headers: authHeaders() }),
  updatePlan: (id, formData) => fetchMultipartPut(`/api/plans/${id}`, formData),
  deletePlan: (id) => fetchJson(`/api/plans/${id}`, { method: 'DELETE', headers: authHeaders() }),

  // Deposits
  createDeposit: (formData) => fetchMultipart('/api/deposits', formData),
  myDeposits: () => fetchJson('/api/deposits/my', { headers: authHeaders() }),
  getBalance: () => fetchJson('/api/deposits/balance', { headers: authHeaders() }),
  getAllDeposits: () => fetchJson('/api/deposits/all', { headers: authHeaders() }),
  updateDepositStatus: (id, payload) =>
    fetchJson(`/api/deposits/${id}/status`, {
      method: 'PUT',
      headers: { ...authHeaders() },
      body: JSON.stringify(payload),
    }),

  // Investments
  invest: (payload) =>
    fetchJson('/api/investments', {
      method: 'POST',
      headers: { ...authHeaders() },
      body: JSON.stringify(payload),
    }),
  myInvestments: () => fetchJson('/api/investments/my', { headers: authHeaders() }),
  getAllInvestments: () => fetchJson('/api/investments/all', { headers: authHeaders() }),
  cancelInvestment: (id) =>
    fetchJson(`/api/investments/${id}/cancel`, { method: 'PUT', headers: { ...authHeaders() } }),
  toggleAutoRenew: (id) =>
    fetchJson(`/api/investments/${id}/toggle-renew`, { method: 'PUT', headers: { ...authHeaders() } }),

  // P2P Transfers
  sendTransfer: (payload) =>
    fetchJson('/api/transfers/send', {
      method: 'POST',
      headers: { ...authHeaders() },
      body: JSON.stringify(payload),
    }),
  myTransfers: () => fetchJson('/api/transfers/my', { headers: authHeaders() }),

  // Marketplace (Buy/Sell)
  createSellOrder: (payload) =>
    fetchJson('/api/marketplace', {
      method: 'POST',
      headers: { ...authHeaders() },
      body: JSON.stringify(payload),
    }),
  mySellOrders: () => fetchJson('/api/marketplace/my', { headers: authHeaders() }),
  browseMarketplace: () => fetchJson('/api/marketplace/browse', { headers: authHeaders() }),
  buyOrder: (id, formData) => fetchMultipart(`/api/marketplace/buy/${id}`, formData),
  getAllSellOrders: () => fetchJson('/api/marketplace/all', { headers: authHeaders() }),
  updateSellOrderStatus: (id, payload) =>
    fetchJson(`/api/marketplace/${id}/status`, {
      method: 'PUT',
      headers: { ...authHeaders() },
      body: JSON.stringify(payload),
    }),

  // Withdrawals
  requestWithdraw: (payload) =>
    fetchJson('/api/withdrawals', {
      method: 'POST',
      headers: { ...authHeaders() },
      body: JSON.stringify(payload),
    }),
  myWithdrawals: () => fetchJson('/api/withdrawals/my', { headers: authHeaders() }),
  getAllWithdrawals: () => fetchJson('/api/withdrawals/all', { headers: authHeaders() }),
  updateWithdrawalStatus: (id, payload) =>
    fetchJson(`/api/withdrawals/${id}/status`, {
      method: 'PUT',
      headers: { ...authHeaders() },
      body: JSON.stringify(payload),
    }),

  // Transactions
  myTransactions: () => fetchJson('/api/transactions/my', { headers: authHeaders() }),
  allTransactions: () => fetchJson('/api/transactions/all', { headers: authHeaders() }),

  // Referrals & Level Income
  myReferralInfo: () => fetchJson('/api/referrals/my', { headers: authHeaders() }),
  myTeamMembers: () => fetchJson('/api/referrals/team', { headers: authHeaders() }),
  referralDashboardStats: () => fetchJson('/api/referrals/dashboard-stats', { headers: authHeaders() }),
  allLevelIncomes: () => fetchJson('/api/referrals/all', { headers: authHeaders() }),

  // Settings
  getVcRate: () => fetchJson('/api/settings/vc-rate'),
  updateVcRate: (vc_rate) =>
    fetchJson('/api/settings/vc-rate', {
      method: 'PUT',
      headers: { ...authHeaders() },
      body: JSON.stringify({ vc_rate }),
    }),
  getDepositSettings: () => fetchJson('/api/settings/deposit'),
  updateDepositSettings: (formData) =>
    fetch(`${API_BASE_URL}/api/settings/deposit`, {
      method: 'PUT',
      headers: { ...authHeaders() },
      body: formData,
    }).then(handleResponse),

  // Admin Users
  getAdminUsers: () => fetchJson('/api/admin/users', { headers: authHeaders() }),
  getAdminUserDetail: (id) => fetchJson(`/api/admin/users/${id}/detail`, { headers: authHeaders() }),
  toggleBlockUser: (id) =>
    fetchJson(`/api/admin/users/${id}/toggle-block`, { method: 'PUT', headers: { ...authHeaders() } }),
  adminAddWallet: (id, amount, note) =>
    fetchJson(`/api/admin/users/${id}/add-wallet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ amount, note }),
    }),

  // Admin Reports
  getReport: (from, to) => fetchJson(`/api/admin/reports?from=${from}&to=${to}`, { headers: authHeaders() }),
  getReportDetails: (from, to, type) => fetchJson(`/api/admin/reports/details?from=${from}&to=${to}&type=${type}`, { headers: authHeaders() }),

  // Admin Dashboard
  getAdminDashboard: () => fetchJson('/api/admin/dashboard', { headers: authHeaders() }),

  // Admin Notifications
  getAdminNotifications: (limit) => fetchJson(`/api/admin/notifications?limit=${limit || 50}`, { headers: authHeaders() }),

  // Contact
  getContactInfo: () => fetchJson('/api/contact/info'),
  submitEnquiry: (payload) => fetchJson('/api/contact', { method: 'POST', body: JSON.stringify(payload) }),
  getEnquiries: () => fetchJson('/api/contact/enquiries', { headers: authHeaders() }),
  updateEnquiryStatus: (id, payload) =>
    fetchJson(`/api/contact/enquiries/${id}`, { method: 'PUT', headers: { ...authHeaders() }, body: JSON.stringify(payload) }),
  deleteEnquiry: (id) =>
    fetchJson(`/api/contact/enquiries/${id}`, { method: 'DELETE', headers: { ...authHeaders() } }),
  updateContactInfo: (payload) =>
    fetchJson('/api/contact/info', { method: 'PUT', headers: { ...authHeaders() }, body: JSON.stringify(payload) }),
};
