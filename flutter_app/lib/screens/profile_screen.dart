// lib/screens/profile_screen.dart
import 'package:flutter/material.dart';
import '../widgets/shared_widgets.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final accountSettings = [
      const _MenuItem(icon: '👤', label: 'Account Details',   sub: 'Name, email, BVN'),
      const _MenuItem(icon: '🔐', label: 'Change PIN',         sub: 'Update your 6-digit PIN'),
      const _MenuItem(icon: '🔑', label: 'Transaction PIN',    sub: '4-digit payment PIN'),
      const _MenuItem(icon: '🔔', label: 'Notifications',      sub: 'Push alerts & SMS'),
      const _MenuItem(icon: '🛡️', label: 'Security & Privacy', sub: 'Biometrics, data'),
    ];

    final supportItems = [
      const _MenuItem(icon: '💬', label: 'Help & Support',   sub: 'Chat, call, or email us', highlight: true),
      const _MenuItem(icon: '⭐', label: 'Rate HananData',   sub: 'Leave us a review'),
      const _MenuItem(icon: 'ℹ️', label: 'About HananData',  sub: 'Version 2.4.1'),
    ];

    return Scaffold(
      backgroundColor: kBackground,
      body: SafeArea(
        child: Column(
          children: [
            const AppStatusBar(),
            // Header
            Container(
              color: Colors.white,
              padding: const EdgeInsets.fromLTRB(20, 6, 20, 14),
              child: Row(
                children: [
                  Text('Profile',
                    style: dFont(size: 20, weight: FontWeight.w800, color: kPrimaryDark)),
                ],
              ),
            ),
            const Divider(height: 1, color: kCardBorder),
            Expanded(
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // User card
                    Container(
                      color: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
                      child: Row(
                        children: [
                          // Avatar
                          Container(
                            width: 64, height: 64,
                            decoration: BoxDecoration(
                              gradient: const LinearGradient(
                                colors: [kPrimaryNavy, kPrimaryBlue],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              ),
                              borderRadius: BorderRadius.circular(18),
                            ),
                            alignment: Alignment.center,
                            child: Text('AB',
                              style: dFont(size: 22, weight: FontWeight.w900, color: Colors.white)),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Aisha Bello',
                                  style: dFont(size: 18, weight: FontWeight.w800)),
                                const SizedBox(height: 2),
                                Text('+234 801 234 5678',
                                  style: dFont(size: 13, color: kMutedText)),
                                const SizedBox(height: 6),
                                Row(
                                  children: [
                                    Container(
                                      width: 8, height: 8,
                                      decoration: const BoxDecoration(
                                        color: kAccentGreen,
                                        shape: BoxShape.circle,
                                      ),
                                    ),
                                    const SizedBox(width: 6),
                                    Text('Verified · Tier 2',
                                      style: dFont(size: 11, weight: FontWeight.w600, color: kAccentGreen2)),
                                  ],
                                ),
                              ],
                            ),
                          ),
                          // Edit button
                          Container(
                            width: 36, height: 36,
                            decoration: const BoxDecoration(
                              color: kBackground,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.edit_outlined, color: kMutedText, size: 16),
                          ),
                        ],
                      ),
                    ),
                    const Divider(height: 1, color: Color(0xFFF0F4FA)),
                    // Account settings
                    const Padding(
                      padding: EdgeInsets.fromLTRB(20, 20, 20, 8),
                      child: SectionLabel('Account Settings'),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: Column(
                        children: accountSettings.map((item) =>
                          Padding(
                            padding: const EdgeInsets.only(bottom: 8),
                            child: _MenuTile(item: item),
                          ),
                        ).toList(),
                      ),
                    ),
                    // Support & Info
                    const Padding(
                      padding: EdgeInsets.fromLTRB(20, 16, 20, 8),
                      child: SectionLabel('Support & Info'),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: Column(
                        children: supportItems.map((item) =>
                          Padding(
                            padding: const EdgeInsets.only(bottom: 8),
                            child: _MenuTile(item: item),
                          ),
                        ).toList(),
                      ),
                    ),
                    // Log out
                    Padding(
                      padding: const EdgeInsets.fromLTRB(20, 8, 20, 32),
                      child: GestureDetector(
                        onTap: () => Navigator.pushNamedAndRemoveUntil(
                          context, '/login', (_) => false),
                        child: Container(
                          width: double.infinity,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFEE2E2),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: kErrorRed),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.logout_rounded, color: kErrorRed, size: 18),
                              const SizedBox(width: 8),
                              Text('Log Out',
                                style: dFont(size: 15, weight: FontWeight.w700, color: kErrorRed)),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            AppBottomNav(
              active: 'profile',
              onTap: (id) {
                if (id == 'home') {
                  Navigator.pushNamedAndRemoveUntil(context, '/home', (_) => false);
                } else if (id != 'profile') {
                  Navigator.pushNamed(context, '/$id');
                }
              },
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Menu tile ────────────────────────────────────────────────────────────────

class _MenuItem {
  final String icon;
  final String label;
  final String sub;
  final bool highlight;
  const _MenuItem({required this.icon, required this.label, required this.sub, this.highlight = false});
}

class _MenuTile extends StatelessWidget {
  final _MenuItem item;
  const _MenuTile({required this.item});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: item.highlight ? const Color(0xFFE8F5EE) : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: item.highlight ? kAccentGreen : const Color(0xFFF0F4FA),
        ),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        leading: Text(item.icon, style: const TextStyle(fontSize: 20)),
        title: Text(item.label,
          style: dFont(size: 14, weight: FontWeight.w600,
            color: item.highlight ? kAccentGreen2 : kPrimaryDark)),
        subtitle: Text(item.sub, style: dFont(size: 12, color: kMutedText)),
        trailing: const Icon(Icons.chevron_right_rounded,
          color: Color(0xFFB8C4D9), size: 20),
        onTap: () {},
      ),
    );
  }
}
