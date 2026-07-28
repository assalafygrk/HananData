export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  kycTier: 1 | 2 | 3;
  walletBalance: number;
  status: 'active' | 'suspended';
  joinedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  type: 'airtime' | 'data' | 'cable' | 'electricity' | 'airtime-to-cash' | 'wallet-funding';
  amount: number;
  status: 'success' | 'failed' | 'pending';
  network?: string;
  reference: string;
  date: string;
  notes?: string;
}

export interface PricingConfig {
  id: string;
  category: 'airtime' | 'data' | 'cable' | 'electricity';
  network: string;
  planName: string;
  apiPrice: number; // Cost from aggregator
  vendorPrice: number; // Price for resellers/agents
  userPrice: number; // Price for regular users
  lastUpdatedBy: string;
  lastUpdatedAt: string;
}

export interface Broadcast {
  id: string;
  subject: string;
  message: string;
  segment: 'all' | 'tier1' | 'tier2' | 'tier3' | 'suspended';
  sentAt: string;
  sentBy: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Support Staff' | 'Finance';
  status: 'active' | 'inactive';
}
