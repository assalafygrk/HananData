// lib/constants/app_data.dart
import 'dart:math';
import 'package:flutter/material.dart';

// ─── Color helpers ────────────────────────────────────────────────────────────

Color hexColor(String hex) {
  final h = hex.replaceAll('#', '');
  return Color(int.parse('FF$h', radix: 16));
}

// ─── Networks ─────────────────────────────────────────────────────────────────

class NetworkInfo {
  final String id;
  final String name;
  final String logoLetter;   // Letter shown in logo circle
  final Color color;
  final Color bg;
  final Color text;
  final Color dot;

  const NetworkInfo({
    required this.id,
    required this.name,
    required this.logoLetter,
    required this.color,
    required this.bg,
    required this.text,
    required this.dot,
  });
}

final List<NetworkInfo> kNetworks = [
  const NetworkInfo(
    id: 'mtn', name: 'MTN', logoLetter: 'M',
    color: Color(0xFFFFCC00), bg: Color(0xFFFFFBE6),
    text: Color(0xFF7A6000), dot: Color(0xFFE6B800),
  ),
  const NetworkInfo(
    id: 'airtel', name: 'Airtel', logoLetter: 'A',
    color: Color(0xFFE4002B), bg: Color(0xFFFFF0F2),
    text: Color(0xFFB80022), dot: Color(0xFFE4002B),
  ),
  const NetworkInfo(
    id: 'glo', name: 'Glo', logoLetter: 'G',
    color: Color(0xFF009A44), bg: Color(0xFFE8F5EE),
    text: Color(0xFF006B2F), dot: Color(0xFF009A44),
  ),
  const NetworkInfo(
    id: '9mobile', name: '9mobile', logoLetter: '9',
    color: Color(0xFF006E51), bg: Color(0xFFE6F1EE),
    text: Color(0xFF004D38), dot: Color(0xFF006E51),
  ),
];

// ─── Data Plans ───────────────────────────────────────────────────────────────

class DataPlan {
  final String id;
  final String size;
  final int price;
  final String validity;
  const DataPlan({required this.id, required this.size, required this.price, required this.validity});
}

final Map<String, List<DataPlan>> kDataPlans = {
  'daily': [
    const DataPlan(id: 'd1', size: '100MB', price: 100, validity: '1 Day'),
    const DataPlan(id: 'd2', size: '200MB', price: 150, validity: '1 Day'),
    const DataPlan(id: 'd3', size: '500MB', price: 200, validity: '1 Day'),
    const DataPlan(id: 'd4', size: '1GB',   price: 350, validity: '1 Day'),
  ],
  'weekly': [
    const DataPlan(id: 'w1', size: '1GB',  price: 300,  validity: '7 Days'),
    const DataPlan(id: 'w2', size: '2GB',  price: 500,  validity: '7 Days'),
    const DataPlan(id: 'w3', size: '5GB',  price: 1000, validity: '7 Days'),
    const DataPlan(id: 'w4', size: '10GB', price: 1500, validity: '7 Days'),
  ],
  'monthly': [
    const DataPlan(id: 'm1', size: '3GB',  price: 1000, validity: '30 Days'),
    const DataPlan(id: 'm2', size: '10GB', price: 2500, validity: '30 Days'),
    const DataPlan(id: 'm3', size: '20GB', price: 4500, validity: '30 Days'),
    const DataPlan(id: 'm4', size: '50GB', price: 9000, validity: '30 Days'),
  ],
};

// ─── Cable ────────────────────────────────────────────────────────────────────

class CableProvider {
  final String id;
  final String name;
  final String logoLetter;  // Letter(s) for logo circle
  final Color color;
  final Color bg;
  const CableProvider({
    required this.id,
    required this.name,
    required this.logoLetter,
    required this.color,
    required this.bg,
  });
}

class CablePackage {
  final String id;
  final String name;
  final int price;
  final String channels;
  const CablePackage({required this.id, required this.name, required this.price, required this.channels});
}

final List<CableProvider> kCableProviders = [
  const CableProvider(id: 'dstv',      name: 'DStv',      logoLetter: 'D', color: Color(0xFF003087), bg: Color(0xFFE8F0FB)),
  const CableProvider(id: 'gotv',      name: 'GOtv',      logoLetter: 'G', color: Color(0xFF0070BA), bg: Color(0xFFE8F4FB)),
  const CableProvider(id: 'startimes', name: 'StarTimes',  logoLetter: 'S', color: Color(0xFFCC1020), bg: Color(0xFFFDEBEC)),
];

final Map<String, List<CablePackage>> kCablePackages = {
  'dstv': [
    const CablePackage(id: 'cp1', name: 'Padi',         price: 2500,  channels: '77 channels'),
    const CablePackage(id: 'cp2', name: 'Yanga',        price: 3500,  channels: '110 channels'),
    const CablePackage(id: 'cp3', name: 'Confam',       price: 6200,  channels: '152 channels'),
    const CablePackage(id: 'cp4', name: 'Compact',      price: 10500, channels: '190 channels'),
    const CablePackage(id: 'cp5', name: 'Compact Plus', price: 16600, channels: '218 channels'),
    const CablePackage(id: 'cp6', name: 'Premium',      price: 29500, channels: '254 channels'),
  ],
  'gotv': [
    const CablePackage(id: 'gp1', name: 'Lite',  price: 410,  channels: '20 channels'),
    const CablePackage(id: 'gp2', name: 'Jinja', price: 1640, channels: '40 channels'),
    const CablePackage(id: 'gp3', name: 'Jolli', price: 2460, channels: '55 channels'),
    const CablePackage(id: 'gp4', name: 'Max',   price: 4150, channels: '75 channels'),
    const CablePackage(id: 'gp5', name: 'Supa',  price: 6400, channels: '100+ channels'),
  ],
  'startimes': [
    const CablePackage(id: 'sp1', name: 'Nova',    price: 900,  channels: '30 channels'),
    const CablePackage(id: 'sp2', name: 'Basic',   price: 1850, channels: '50 channels'),
    const CablePackage(id: 'sp3', name: 'Smart',   price: 2600, channels: '70 channels'),
    const CablePackage(id: 'sp4', name: 'Classic', price: 3100, channels: '90 channels'),
  ],
};

// ─── Discos ───────────────────────────────────────────────────────────────────

final List<String> kDiscos = [
  'Ikeja Electric (IKEDC)',
  'Eko Electric (EKEDC)',
  'Abuja Electric (AEDC)',
  'Enugu Electric (EEDC)',
  'Port Harcourt Electric (PHED)',
  'Ibadan Electric (IBEDC)',
  'Kano Electric (KEDCO)',
  'Jos Electric (JED)',
  'Kaduna Electric (KAEDCO)',
  'Benin Electric (BEDC)',
  'Yola Electric (YEDC)',
];

/// Short display name extracted from parentheses, e.g. "IKEDC"
String discoShortName(String disco) {
  final match = RegExp(r'\(([^)]+)\)').firstMatch(disco);
  return match?.group(1) ?? disco;
}

/// Brand color per disco
Color discoColor(String discoShort) {
  const map = {
    'IKEDC':  Color(0xFF003087),
    'EKEDC':  Color(0xFF00529B),
    'AEDC':   Color(0xFF006837),
    'EEDC':   Color(0xFF862633),
    'PHED':   Color(0xFF005F9E),
    'IBEDC':  Color(0xFF009A44),
    'KEDCO':  Color(0xFF8B0000),
    'JED':    Color(0xFFE65C00),
    'KAEDCO': Color(0xFF004B8D),
    'BEDC':   Color(0xFF006B6B),
    'YEDC':   Color(0xFF6A0572),
  };
  return map[discoShort] ?? const Color(0xFF1B3A6B);
}

// ─── History Items ────────────────────────────────────────────────────────────

class HistoryItem {
  final String id;
  final String type;
  final String? network;
  final String? provider;   // for cable/electricity
  final String desc;
  final String? plan;       // data plan / cable package etc
  final int amount;
  final String date;
  final String status;
  final String refId;
  const HistoryItem({
    required this.id,
    required this.type,
    this.network,
    this.provider,
    required this.desc,
    this.plan,
    required this.amount,
    required this.date,
    required this.status,
    required this.refId,
  });
}

final List<HistoryItem> kHistoryItems = [
  const HistoryItem(id: 'h1', type: 'data',        network: 'MTN',     desc: '5GB Data · 30 Days',     plan: '5GB · 30 Days',          amount: -1000,  date: 'Today, 2:30 PM',   status: 'success', refId: 'HNDA3X8F'),
  const HistoryItem(id: 'h2', type: 'airtime',     network: 'Airtel',  desc: '₦500 Airtime',            plan: null,                     amount: -500,   date: 'Today, 9:15 AM',   status: 'success', refId: 'HNDZ1Q9R'),
  const HistoryItem(id: 'h3', type: 'cable',       provider: 'DStv',   desc: 'DStv Compact',            plan: 'Compact · 190 channels', amount: -10500, date: 'Jul 14, 9:00 AM',  status: 'success', refId: 'HNDM7Y2K'),
  const HistoryItem(id: 'h4', type: 'electricity', provider: 'IKEDC',  desc: 'Ikeja Electric · ₦5,000', plan: 'Prepaid · Meter 12345',  amount: -5000,  date: 'Jul 12, 3:45 PM',  status: 'failed',  refId: 'HNDP4W6L'),
  const HistoryItem(id: 'h5', type: 'wallet',      desc: 'Wallet Funding',          plan: null,                     amount: 20000,  date: 'Jul 10, 10:20 AM', status: 'success', refId: 'HNDB9T1V'),
  const HistoryItem(id: 'h6', type: 'data',        network: 'Glo',     desc: '10GB Data · 30 Days',     plan: '10GB · 30 Days',         amount: -2500,  date: 'Jul 8, 8:00 AM',   status: 'success', refId: 'HNDC5R3N'),
  const HistoryItem(id: 'h7', type: 'airtimecash', network: 'MTN',     desc: '₦500 Airtime → Cash',     plan: '25% fee applied',        amount: 375,    date: 'Jul 7, 1:00 PM',   status: 'success', refId: 'HNDE2H8J'),
  const HistoryItem(id: 'h8', type: 'airtime',     network: '9mobile', desc: '₦200 Airtime',            plan: null,                     amount: -200,   date: 'Jul 5, 6:10 PM',   status: 'success', refId: 'HNDF6U4S'),
  const HistoryItem(id: 'h9', type: 'cable',       provider: 'GOtv',   desc: 'GOtv Max',                plan: 'Max · 75 channels',      amount: -4150,  date: 'Jul 3, 11:00 AM',  status: 'success', refId: 'HNDG3K7D'),
];

// ─── Notifications ────────────────────────────────────────────────────────────

class AppNotification {
  final String id;
  final String title;
  final String body;
  final String time;
  final String icon;     // emoji icon
  final String? route;   // optional navigation route
  final bool isRead;
  const AppNotification({
    required this.id,
    required this.title,
    required this.body,
    required this.time,
    required this.icon,
    this.route,
    this.isRead = false,
  });
}

final List<AppNotification> kNotifications = [
  const AppNotification(
    id: 'n1',
    title: 'Transaction Successful! 🎉',
    body: 'Your MTN 5GB data bundle has been activated on 08012345678.',
    time: 'Just now',
    icon: '📶',
    route: '/history',
    isRead: false,
  ),
  const AppNotification(
    id: 'n2',
    title: 'Wallet Funded',
    body: '₦20,000 has been added to your HananData wallet. New balance: ₦48,750.',
    time: '2 hours ago',
    icon: '💰',
    route: '/wallet',
    isRead: false,
  ),
  const AppNotification(
    id: 'n3',
    title: 'Airtime Purchase',
    body: 'Your Airtel ₦500 airtime recharge was successful.',
    time: 'Today, 9:15 AM',
    icon: '📱',
    route: '/history',
    isRead: true,
  ),
  const AppNotification(
    id: 'n4',
    title: 'Transaction Failed ❌',
    body: 'Your Ikeja Electric payment of ₦5,000 could not be processed. Please retry.',
    time: 'Jul 12, 3:45 PM',
    icon: '⚡',
    route: '/electricity',
    isRead: true,
  ),
  const AppNotification(
    id: 'n5',
    title: 'Special Offer 🔥',
    body: 'Get 2x data on MTN! Buy 10GB for the price of 5GB today only.',
    time: 'Jul 11, 12:00 PM',
    icon: '🎁',
    route: '/data',
    isRead: true,
  ),
  const AppNotification(
    id: 'n6',
    title: 'Security Alert',
    body: 'Your account was accessed from a new device. If this wasn\'t you, change your PIN immediately.',
    time: 'Jul 10, 8:00 AM',
    icon: '🔐',
    route: '/profile',
    isRead: true,
  ),
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

String fmtNaira(int n) {
  // Nigerian locale number formatting with commas
  final s = n.abs().toString();
  final buf = StringBuffer();
  for (int i = 0; i < s.length; i++) {
    if (i > 0 && (s.length - i) % 3 == 0) buf.write(',');
    buf.write(s[i]);
  }
  return buf.toString();
}

String genRef() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  final rand = Random();
  final code = List.generate(8, (_) => chars[rand.nextInt(chars.length)]).join();
  return 'HND$code';
}
