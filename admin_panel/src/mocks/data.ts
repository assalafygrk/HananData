import { User, Transaction, PricingConfig, Broadcast, Staff, Provider, PaymentGateway, Referral, AnalyticsData, SystemLog } from './types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'Adebayo Oluwaseun', phone: '08031234567', email: 'adebayo@example.com', kycTier: 2, walletBalance: 15400, status: 'active', joinedAt: '2026-05-12T10:30:00Z' },
  { id: 'u2', name: 'Chioma Nwosu', phone: '08129876543', email: 'chioma@example.com', kycTier: 1, walletBalance: 250, status: 'active', joinedAt: '2026-06-01T14:15:00Z' },
  { id: 'u3', name: 'Hassan Ibrahim', phone: '07055554444', email: 'hassan@example.com', kycTier: 3, walletBalance: 125000, status: 'suspended', joinedAt: '2026-01-20T09:00:00Z' },
  { id: 'u4', name: 'Folake Adeleke', phone: '09012341234', email: 'folake@example.com', kycTier: 2, walletBalance: 4500, status: 'active', joinedAt: '2026-07-10T16:45:00Z' },
  { id: 'u5', name: 'Emeka Okafor', phone: '08099998888', email: 'emeka@example.com', kycTier: 1, walletBalance: 0, status: 'active', joinedAt: '2026-07-25T11:20:00Z' },
];

export const mockTransactions: Transaction[] = [
  { id: 'tx1', userId: 'u1', userName: 'Adebayo Oluwaseun', type: 'data', amount: 1500, status: 'success', network: 'MTN', reference: 'REF-M12345', date: '2026-07-28T10:15:00Z' },
  { id: 'tx2', userId: 'u2', userName: 'Chioma Nwosu', type: 'airtime', amount: 500, status: 'failed', network: 'Airtel', reference: 'REF-A98765', date: '2026-07-28T09:45:00Z', notes: 'Timeout from aggregator' },
  { id: 'tx3', userId: 'u4', userName: 'Folake Adeleke', type: 'wallet-funding', amount: 5000, status: 'success', reference: 'REF-W45678', date: '2026-07-27T18:30:00Z' },
  { id: 'tx4', userId: 'u1', userName: 'Adebayo Oluwaseun', type: 'electricity', amount: 10000, status: 'pending', reference: 'REF-E11223', date: '2026-07-28T11:00:00Z' },
  { id: 'tx5', userId: 'u3', userName: 'Hassan Ibrahim', type: 'cable', amount: 8500, status: 'success', reference: 'REF-C33445', date: '2026-07-26T14:20:00Z' },
];

export const mockPricing: PricingConfig[] = [
  { id: 'p1', category: 'data', network: 'MTN', planName: '1GB (30 Days)', planId: 'MTN-1GB-30', providerId: 'prov1', apiPrice: 220, vendorPrice: 235, userPrice: 250, lastUpdatedBy: 'Super Admin', lastUpdatedAt: '2026-07-01T10:00:00Z' },
  { id: 'p2', category: 'data', network: 'Airtel', planName: '1.5GB (30 Days)', planId: 'AIR-1.5GB-30', providerId: 'prov1', apiPrice: 300, vendorPrice: 320, userPrice: 350, lastUpdatedBy: 'Super Admin', lastUpdatedAt: '2026-07-01T10:00:00Z' },
  { id: 'p3', category: 'airtime', network: 'Glo', planName: 'Airtime', planId: 'GLO-VTU', providerId: 'prov3', apiPrice: 96, vendorPrice: 97, userPrice: 98, lastUpdatedBy: 'Super Admin', lastUpdatedAt: '2026-07-05T08:30:00Z' },
];

export const mockBroadcasts: Broadcast[] = [
  { id: 'b1', subject: 'System Maintenance', message: 'We will be undergoing scheduled maintenance on Sunday at 2 AM.', segment: 'all', sentAt: '2026-07-25T15:00:00Z', sentBy: 'Super Admin' },
  { id: 'b2', subject: 'New MTN Data Prices', message: 'Enjoy our new cheaper MTN data plans starting today!', segment: 'tier1', sentAt: '2026-07-20T10:00:00Z', sentBy: 'Marketing Team' },
];

export const mockStaff: Staff[] = [
  { id: 's1', name: 'Super Admin', email: 'admin@hanandata.com', role: 'Super Admin', status: 'active' },
  { id: 's2', name: 'John Doe', email: 'john.support@hanandata.com', role: 'Support Staff', status: 'active' },
  { id: 's3', name: 'Jane Smith', email: 'jane.finance@hanandata.com', role: 'Finance', status: 'inactive' },
];

export const mockProviders: Provider[] = [
  { id: 'prov1', name: 'Alrahuz Data', type: 'VTU', apiKey: 'sk_live_alrahuz...', baseUrl: 'https://alrahuz.com/api', status: 'active', balance: 154000, lowBalanceThreshold: 50000 },
  { id: 'prov2', name: 'Shago Payments', type: 'Electricity', apiKey: 'sk_live_shago...', baseUrl: 'https://shago.net/api', status: 'active', balance: 8500, lowBalanceThreshold: 20000 },
  { id: 'prov3', name: 'SME Plug', type: 'VTU', apiKey: 'sk_live_sme...', baseUrl: 'https://smeplug.com/api', status: 'active', balance: 500000, lowBalanceThreshold: 100000 },
];

export const mockGateways: PaymentGateway[] = [
  { id: 'gw1', name: 'Paystack', publicKey: 'pk_live_paystack...', secretKey: 'sk_live_paystack...', webhookUrl: 'https://hanandata.com/webhook/paystack', status: 'active', feePercentage: 1.5 },
  { id: 'gw2', name: 'Monnify', publicKey: 'pk_live_monnify...', secretKey: 'sk_live_monnify...', webhookUrl: 'https://hanandata.com/webhook/monnify', status: 'inactive', feePercentage: 1.2 },
];

export const mockReferrals: Referral[] = [
  { id: 'ref1', referrerId: 'u1', referrerName: 'Adebayo Oluwaseun', referredUserId: 'u2', referredUserName: 'Chioma Nwosu', bonusEarned: 500, status: 'paid', date: '2026-06-05T10:00:00Z' },
  { id: 'ref2', referrerId: 'u4', referrerName: 'Folake Adeleke', referredUserId: 'u5', referredUserName: 'Emeka Okafor', bonusEarned: 500, status: 'pending', date: '2026-07-26T12:00:00Z' },
];

export const mockAnalyticsData: AnalyticsData[] = [
  { date: 'Mon', revenue: 45000, cost: 42000, profit: 3000 },
  { date: 'Tue', revenue: 52000, cost: 48500, profit: 3500 },
  { date: 'Wed', revenue: 49000, cost: 46000, profit: 3000 },
  { date: 'Thu', revenue: 61000, cost: 56000, profit: 5000 },
  { date: 'Fri', revenue: 58000, cost: 53000, profit: 5000 },
  { date: 'Sat', revenue: 75000, cost: 68000, profit: 7000 },
  { date: 'Sun', revenue: 82000, cost: 74000, profit: 8000 },
];

export const mockLogs: SystemLog[] = [
  { id: 'log1', timestamp: new Date().toISOString(), level: 'info', actor: 'Super Admin', action: 'Updated Pricing', details: 'Changed MTN 1GB user price to 250', source: 'admin_panel' },
  { id: 'log2', timestamp: new Date(Date.now() - 3600000).toISOString(), level: 'error', actor: 'System', action: 'Aggregator Timeout', details: 'Shago Payments API timed out after 30s', source: 'system' },
  { id: 'log3', timestamp: new Date(Date.now() - 7200000).toISOString(), level: 'info', actor: 'Adebayo Oluwaseun', action: 'Data Purchase', details: 'Purchased MTN 1GB (Ref: REF-M12345)', source: 'mobile_app' },
  { id: 'log4', timestamp: new Date(Date.now() - 14400000).toISOString(), level: 'warning', actor: 'System', action: 'Low API Balance', details: 'Alrahuz Data wallet dropped below 50,000 threshold', source: 'system' },
  { id: 'log5', timestamp: new Date(Date.now() - 86400000).toISOString(), level: 'critical', actor: 'John Doe (Support)', action: 'Suspended User', details: 'Suspended Hassan Ibrahim (u3) due to suspicious activity', source: 'admin_panel' },
  { id: 'log6', timestamp: new Date(Date.now() - 90000000).toISOString(), level: 'info', actor: 'Chioma Nwosu', action: 'Wallet Funded', details: 'Funded wallet via Paystack with N5,000', source: 'mobile_app' },
];
