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
  planId: string;
  providerId: string;
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

export interface Provider {
  id: string;
  name: string;
  type: 'VTU' | 'Electricity' | 'Cable';
  apiKey: string;
  baseUrl: string;
  status: 'active' | 'inactive';
  balance: number;
  lowBalanceThreshold: number;
}

export interface PaymentGateway {
  id: string;
  name: string;
  publicKey: string;
  secretKey: string;
  webhookUrl: string;
  status: 'active' | 'inactive';
  feePercentage: number;
}

export interface Referral {
  id: string;
  referrerId: string;
  referrerName: string;
  referredUserId: string;
  referredUserName: string;
  bonusEarned: number;
  status: 'pending' | 'paid';
  date: string;
}

export interface AnalyticsData {
  date: string;
  revenue: number;
  cost: number;
  profit: number;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  actor: string; // e.g., "System", "Super Admin", or a user's name/ID
  action: string;
  details: string;
  source: 'admin_panel' | 'mobile_app' | 'system';
}
