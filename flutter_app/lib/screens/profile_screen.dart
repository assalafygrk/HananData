// lib/screens/profile_screen.dart
import 'package:flutter/material.dart';
import '../widgets/shared_widgets.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});
  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _darkMode = false;

  @override
  Widget build(BuildContext context) {
    final accountSettings = [
      _MenuItem(icon: '👤', label: 'Account Details',    sub: 'Name, email, BVN',        onTap: () => _showAccountDetails(context)),
      _MenuItem(icon: '📊', label: 'Account Limit',       sub: 'View & upgrade your tier', onTap: () => Navigator.pushNamed(context, '/account-limit')),
      _MenuItem(icon: '🎁', label: 'My Referral',         sub: 'Share & earn rewards',     onTap: () => Navigator.pushNamed(context, '/my-referral')),
    ];

    final supportItems = [
      _MenuItem(icon: '💬', label: 'Help & Support',    sub: 'Chat, call, or email us',  highlight: true, onTap: () => _showHelp(context)),
      _MenuItem(icon: '⭐', label: 'Rate HananData',    sub: 'Leave us a review',         onTap: () => _showRating(context)),
      _MenuItem(icon: '📜', label: 'Legal',              sub: 'Terms, Privacy & Policies', onTap: () => Navigator.pushNamed(context, '/legal')),
      _MenuItem(icon: 'ℹ️', label: 'About HananData',   sub: 'Version 2.4.1',             onTap: () => _showAbout(context)),
    ];

    return Scaffold(
      backgroundColor: kBackground,
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Container(
              color: Colors.white,
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 14),
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
                          GestureDetector(
                            onTap: () => _showAccountDetails(context),
                            child: Container(
                              width: 36, height: 36,
                              decoration: const BoxDecoration(
                                color: kBackground,
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.edit_outlined, color: kMutedText, size: 16),
                            ),
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
                    // Preferences
                    const Padding(
                      padding: EdgeInsets.fromLTRB(20, 16, 20, 8),
                      child: SectionLabel('Preferences'),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: Column(
                        children: [
                          // Dark Mode — toggle inline (no sub-screen)
                          _DarkModeTile(
                            value: _darkMode,
                            onChanged: (v) => setState(() => _darkMode = v),
                          ),
                          const SizedBox(height: 8),
                          // Settings
                          _MenuTile(item: _MenuItem(
                            icon: '⚙️', label: 'Settings',
                            sub: 'App preferences & security',
                            onTap: () => Navigator.pushNamed(context, '/settings'),
                          )),
                        ],
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

  // ─── Sub-screen bottom sheets ─────────────────────────────────────────────

  void _showAccountDetails(BuildContext context) {
    _showSheet(context, title: 'Account Details', icon: '👤', child: Column(
      children: [
        _infoRow('Full Name', 'Aisha Bello'),
        const Divider(height: 1, color: kCardBorder),
        _infoRow('Phone', '+234 801 234 5678'),
        const Divider(height: 1, color: kCardBorder),
        _infoRow('Email', 'aisha.bello@email.com'),
        const Divider(height: 1, color: kCardBorder),
        _infoRow('BVN', '•••••••••••'),
        const Divider(height: 1, color: kCardBorder),
        _infoRow('Tier', 'Tier 2 · Verified'),
        const Divider(height: 1, color: kCardBorder),
        _infoRow('Account No.', '0123 456 789'),
      ],
    ));
  }



  void _showHelp(BuildContext context) {
    _showSheet(context, title: 'Help & Support', icon: '💬', child: Column(
      children: [
        _contactTile(icon: Icons.chat_bubble_outline_rounded, label: 'Live Chat', sub: 'Available 24/7', color: kAccentGreen),
        const SizedBox(height: 10),
        _contactTile(icon: Icons.phone_outlined, label: 'Call Us', sub: '0800-HANAN-DATA (toll free)', color: kPrimaryNavy),
        const SizedBox(height: 10),
        _contactTile(icon: Icons.email_outlined, label: 'Email Us', sub: 'support@hanandata.ng', color: kPrimaryBlue),
        const SizedBox(height: 10),
        _contactTile(icon: Icons.question_answer_outlined, label: 'FAQ', sub: 'Common questions answered', color: const Color(0xFF9B59B6)),
      ],
    ));
  }

  void _showRating(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const _RatingSheet(),
    );
  }

  void _showAbout(BuildContext context) {
    _showSheet(context, title: 'About HananData', icon: 'ℹ️', child: Column(
      children: [
        Center(
          child: Container(
            width: 72, height: 72,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [kAccentGreen, kAccentGreen2],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            alignment: Alignment.center,
            child: Text('H', style: dFont(size: 32, weight: FontWeight.w900, color: Colors.white)),
          ),
        ),
        const SizedBox(height: 16),
        Center(child: Text('HananData', style: dFont(size: 22, weight: FontWeight.w800))),
        const SizedBox(height: 4),
        Center(child: Text('Version 2.4.1', style: dFont(size: 13, color: kMutedText))),
        const SizedBox(height: 24),
        _infoRow('Developer', 'HananData Technologies'),
        const Divider(height: 1, color: kCardBorder),
        _infoRow('Support Email', 'support@hanandata.ng'),
        const Divider(height: 1, color: kCardBorder),
        _infoRow('Terms of Service', 'View →'),
        const Divider(height: 1, color: kCardBorder),
        _infoRow('Privacy Policy', 'View →'),
      ],
    ));
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  void _showSheet(BuildContext context, {
    required String title,
    required String icon,
    required Widget child,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _ProfileSheet(title: title, icon: icon, child: child),
    );
  }

  static Widget _infoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 0, vertical: 14),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: dFont(size: 13, color: kMutedText)),
          Text(value, style: dFont(size: 13, weight: FontWeight.w600, color: kPrimaryDark)),
        ],
      ),
    );
  }



  static Widget _contactTile({
    required IconData icon,
    required String label,
    required String sub,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withValues(alpha: 0.2)),
      ),
      child: Row(
        children: [
          Container(
            width: 44, height: 44,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 22),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: dFont(size: 14, weight: FontWeight.w700, color: kPrimaryDark)),
                Text(sub, style: dFont(size: 12, color: kMutedText)),
              ],
            ),
          ),
          Icon(Icons.chevron_right_rounded, color: color, size: 20),
        ],
      ),
    );
  }
}

// ─── Generic profile bottom sheet ─────────────────────────────────────────────

class _ProfileSheet extends StatelessWidget {
  final String title;
  final String icon;
  final Widget child;
  const _ProfileSheet({required this.title, required this.icon, required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
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
            decoration: BoxDecoration(
              color: kCardBorder, borderRadius: BorderRadius.circular(2),
            ),
          ),
          Flexible(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(24, 20, 24, 32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(icon, style: const TextStyle(fontSize: 24)),
                      const SizedBox(width: 10),
                      Text(title, style: dFont(size: 20, weight: FontWeight.w800)),
                    ],
                  ),
                  const SizedBox(height: 20),
                  child,
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}



// ─── Rating sheet ─────────────────────────────────────────────────────────────

class _RatingSheet extends StatefulWidget {
  const _RatingSheet();
  @override
  State<_RatingSheet> createState() => _RatingSheetState();
}

class _RatingSheetState extends State<_RatingSheet> {
  int _stars = 0;

  @override
  Widget build(BuildContext context) {
    return Container(
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
            padding: const EdgeInsets.fromLTRB(24, 24, 24, 40),
            child: Column(
              children: [
                const Text('⭐', style: TextStyle(fontSize: 48)),
                const SizedBox(height: 12),
                Text('Rate HananData', style: dFont(size: 22, weight: FontWeight.w800)),
                const SizedBox(height: 6),
                Text('How satisfied are you with our service?',
                  style: dFont(size: 13, color: kMutedText), textAlign: TextAlign.center),
                const SizedBox(height: 28),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(5, (i) {
                    final filled = i < _stars;
                    return GestureDetector(
                      onTap: () => setState(() => _stars = i + 1),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 6),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 150),
                          child: Icon(
                            filled ? Icons.star_rounded : Icons.star_border_rounded,
                            color: filled ? const Color(0xFFFFCC00) : kCardBorder,
                            size: 44,
                          ),
                        ),
                      ),
                    );
                  }),
                ),
                const SizedBox(height: 28),
                PrimaryBtn(
                  label: _stars == 0 ? 'Select a rating' : 'Submit Rating',
                  disabled: _stars == 0,
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
          ),
        ],
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
  final VoidCallback onTap;
  const _MenuItem({
    required this.icon,
    required this.label,
    required this.sub,
    this.highlight = false,
    required this.onTap,
  });
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
        onTap: item.onTap,
      ),
    );
  }
}

// ─── Dark Mode toggle tile (inline — no sub-screen) ───────────────────────────

class _DarkModeTile extends StatelessWidget {
  final bool value;
  final ValueChanged<bool> onChanged;
  const _DarkModeTile({required this.value, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      decoration: BoxDecoration(
        color: value ? const Color(0xFF1B3A6B).withValues(alpha: 0.08) : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: value ? kPrimaryNavy.withValues(alpha: 0.3) : const Color(0xFFF0F4FA),
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Row(
          children: [
            Text(value ? '🌙' : '☀️', style: const TextStyle(fontSize: 20)),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Dark Mode',
                    style: dFont(size: 14, weight: FontWeight.w600, color: kPrimaryDark)),
                  Text(value ? 'Dark theme enabled' : 'Light theme active',
                    style: dFont(size: 12, color: kMutedText)),
                ],
              ),
            ),
            Switch(
              value: value,
              onChanged: onChanged,
              activeTrackColor: kPrimaryNavy,
              thumbColor: WidgetStateProperty.all(Colors.white),
            ),
          ],
        ),
      ),
    );
  }
}
