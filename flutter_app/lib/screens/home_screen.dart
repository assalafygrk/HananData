// lib/screens/home_screen.dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_data.dart';
import '../widgets/shared_widgets.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final quickActions = [
      const _QuickAction(label: 'Buy Data',      icon: Icons.signal_cellular_alt_rounded, route: '/data'),
      const _QuickAction(label: 'Buy Airtime',   icon: Icons.phone_android_rounded,       route: '/airtime'),
      const _QuickAction(label: 'Cable TV',      icon: Icons.tv_rounded,                  route: '/cable'),
      const _QuickAction(label: 'Electricity',   icon: Icons.bolt_rounded,                route: '/electricity'),
      const _QuickAction(label: 'Airtime→Cash',  icon: Icons.swap_horiz_rounded,          route: '/airtimecash'),
      const _QuickAction(label: 'Fund Wallet',   icon: Icons.account_balance_wallet_outlined, route: '/wallet'),
    ];

    return Scaffold(
      backgroundColor: kBackground,
      body: Column(
        children: [
          // Header with gradient
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Color(0xFF0D1B35), Color(0xFF1B3A6B)],
              ),
            ),
            child: SafeArea(
              bottom: false,
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 20),
                child: Column(
                  children: [
                    // Greeting row
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Good morning,',
                              style: dFont(size: 12, color: const Color(0xFF7BAED4))),
                            const SizedBox(height: 2),
                            Text('Aisha Bello 👋',
                              style: GoogleFonts.inter(
                                fontSize: 20, fontWeight: FontWeight.w700, color: Colors.white,
                              )),
                          ],
                        ),
                        // Notification bell — functional
                        GestureDetector(
                          onTap: () => Navigator.pushNamed(context, '/notifications'),
                          child: Stack(
                            children: [
                              Container(
                                width: 42, height: 42,
                                decoration: BoxDecoration(
                                  color: Colors.white.withValues(alpha: 0.1),
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(Icons.notifications_outlined,
                                  color: Colors.white, size: 22),
                              ),
                              // Unread badge
                              Positioned(
                                top: 6, right: 6,
                                child: Container(
                                  width: 10, height: 10,
                                  decoration: BoxDecoration(
                                    color: kAccentGreen,
                                    shape: BoxShape.circle,
                                    border: Border.all(color: const Color(0xFF0D1B35), width: 1.5),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    // Balance card
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: Colors.white.withValues(alpha: 0.15)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Wallet Balance',
                            style: dFont(size: 11, weight: FontWeight.w600, color: const Color(0xFF7BAED4))),
                          const SizedBox(height: 4),
                          Text('₦48,750.00',
                            style: GoogleFonts.inter(
                              fontSize: 30, fontWeight: FontWeight.w800,
                              color: Colors.white, letterSpacing: -0.5,
                            )),
                          const SizedBox(height: 2),
                          Text('0123 456 789 · HananData MFB',
                            style: dFont(size: 11, color: const Color(0xFF7BAED4))),
                          const SizedBox(height: 16),
                          // Add money only (Send Money removed)
                          GestureDetector(
                            onTap: () => Navigator.pushNamed(context, '/wallet'),
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                              decoration: BoxDecoration(
                                color: kAccentGreen,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Icon(Icons.add_circle_outline, color: Colors.white, size: 16),
                                  const SizedBox(width: 8),
                                  Text('Add Money',
                                    style: dFont(size: 14, weight: FontWeight.w700, color: Colors.white)),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          // Scrollable body
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Quick Actions
                  Padding(
                    padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SectionLabel('Quick Actions'),
                        const SizedBox(height: 12),
                        GridView.count(
                          crossAxisCount: 3,
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          mainAxisSpacing: 10,
                          crossAxisSpacing: 10,
                          childAspectRatio: 0.95,
                          children: quickActions.map((qa) => _QuickActionTile(qa: qa)).toList(),
                        ),
                      ],
                    ),
                  ),
                  // Recent transactions
                  Padding(
                    padding: const EdgeInsets.fromLTRB(20, 24, 20, 20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const SectionLabel('Recent'),
                            GestureDetector(
                              onTap: () => Navigator.pushNamed(context, '/history'),
                              child: Text('See all',
                                style: dFont(size: 13, weight: FontWeight.w600, color: kPrimaryNavy)),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        ...kHistoryItems.take(4).map((t) => Padding(
                          padding: const EdgeInsets.only(bottom: 8),
                          child: TxnRow(txn: t),
                        )),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          // Bottom nav
          AppBottomNav(
            active: 'home',
            onTap: (id) {
              if (id != 'home') Navigator.pushNamed(context, '/$id');
            },
          ),
        ],
      ),
    );
  }
}

class _QuickAction {
  final String label;
  final IconData icon;
  final String route;
  const _QuickAction({required this.label, required this.icon, required this.route});
}

class _QuickActionTile extends StatelessWidget {
  final _QuickAction qa;
  const _QuickActionTile({required this.qa});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => Navigator.pushNamed(context, qa.route),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: kCardBorder),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 40, height: 40,
              decoration: BoxDecoration(
                color: const Color(0xFFF0F4FA),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(qa.icon, color: kPrimaryNavy, size: 20),
            ),
            const SizedBox(height: 8),
            Text(
              qa.label,
              textAlign: TextAlign.center,
              style: dFont(size: 11, weight: FontWeight.w600, color: kMediumText),
            ),
          ],
        ),
      ),
    );
  }
}
