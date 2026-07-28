import { User, Transaction, PricingConfig, Broadcast, Staff } from './types';

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
  { id: 'p1', category: 'data', network: 'MTN', planName: '1GB (30 Days)', apiPrice: 220, vendorPrice: 235, userPrice: 250, lastUpdatedBy: 'Super Admin', lastUpdatedAt: '2026-07-01T10:00:00Z' },
  { id: 'p2', category: 'data', network: 'Airtel', planName: '1.5GB (30 Days)', apiPrice: 300, vendorPrice: 320, userPrice: 350, lastUpdatedBy: 'Super Admin', lastUpdatedAt: '2026-07-01T10:00:00Z' },
  { id: 'p3', category: 'airtime', network: 'Glo', planName: 'Airtime', apiPrice: 96, vendorPrice: 97, userPrice: 98, lastUpdatedBy: 'Super Admin', lastUpdatedAt: '2026-07-05T08:30:00Z' },
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
