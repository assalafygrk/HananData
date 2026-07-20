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
                          // Action buttons row
                          Row(
                            children: [
                              // Add Money
                              GestureDetector(
                                onTap: () => Navigator.pushNamed(context, '/wallet'),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
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
                                        style: dFont(size: 13, weight: FontWeight.w700, color: Colors.white)),
                                    ],
                                  ),
                                ),
                              ),
                              const SizedBox(width: 10),
                              // Referral
                              GestureDetector(
                                onTap: () => _showReferral(context),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                                  decoration: BoxDecoration(
                                    gradient: const LinearGradient(
                                      colors: [Color(0xFF7B2FBE), Color(0xFF9B59B6)],
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                    ),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      const Icon(Icons.card_giftcard_rounded, color: Colors.white, size: 16),
                                      const SizedBox(width: 8),
                                      Text('Refer & Earn',
                                        style: dFont(size: 13, weight: FontWeight.w700, color: Colors.white)),
                                    ],
                                  ),
                                ),
                              ),
                            ],
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

  static void _showReferral(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => Container(
        margin: const EdgeInsets.only(top: 60),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              margin: const EdgeInsets.only(top: 12),
              width: 40, height: 4,
              decoration: BoxDecoration(color: kCardBorder, borderRadius: BorderRadius.circular(2)),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 20, 24, 40),
              child: Column(
                children: [
                  // Icon
                  Container(
                    width: 64, height: 64,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF7B2FBE), Color(0xFF9B59B6)],
                        begin: Alignment.topLeft, end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Icon(Icons.card_giftcard_rounded, color: Colors.white, size: 32),
                  ),
                  const SizedBox(height: 16),
                  Text('Refer & Earn', style: dFont(size: 22, weight: FontWeight.w800)),
                  const SizedBox(height: 6),
                  Text('Share your code. Earn ₦200 for each friend who signs up and makes their first transaction.',
                    style: dFont(size: 13, color: kMutedText), textAlign: TextAlign.center),
                  const SizedBox(height: 24),
                  // Referral code box
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF5F0FF),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFF7B2FBE).withValues(alpha: 0.3)),
                    ),
                    child: Column(
                      children: [
                        Text('Your Referral Code', style: dFont(size: 12, color: kMutedText)),
                        const SizedBox(height: 6),
                        Text('HANAN-A2B3C4',
                          style: dFont(size: 24, weight: FontWeight.w900, color: const Color(0xFF7B2FBE),
                            letterSpacing: 2)),
                        const SizedBox(height: 10),
                        GestureDetector(
                          onTap: () {
                            // Copy code
                          },
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                            decoration: BoxDecoration(
                              color: const Color(0xFF7B2FBE),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(Icons.copy_rounded, color: Colors.white, size: 14),
                                const SizedBox(width: 6),
                                Text('Copy Code', style: dFont(size: 13, weight: FontWeight.w700, color: Colors.white)),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  // Stats row
                  Row(
                    children: [
                      Expanded(child: _statBox('12', 'Friends\nReferred', const Color(0xFF7B2FBE))),
                      const SizedBox(width: 12),
                      Expanded(child: _statBox('₦2,400', 'Total\nEarned', kAccentGreen)),
                      const SizedBox(width: 12),
                      Expanded(child: _statBox('₦200', 'Per\nReferral', kPrimaryNavy)),
                    ],
                  ),
                  const SizedBox(height: 20),
                  PrimaryBtn(
                    label: 'Share Referral Link',
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  static Widget _statBox(String value, String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.07),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: color.withValues(alpha: 0.2)),
      ),
      child: Column(
        children: [
          Text(value, style: dFont(size: 16, weight: FontWeight.w800, color: color)),
          const SizedBox(height: 4),
          Text(label, style: dFont(size: 10, color: kMutedText), textAlign: TextAlign.center),
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
