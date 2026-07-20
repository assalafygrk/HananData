// lib/screens/legal_screen.dart
import 'package:flutter/material.dart';
import '../widgets/shared_widgets.dart';

class LegalScreen extends StatefulWidget {
  const LegalScreen({super.key});
  @override
  State<LegalScreen> createState() => _LegalScreenState();
}

class _LegalScreenState extends State<LegalScreen> {
  String? _expanded; // id of expanded section

  final List<_LegalDoc> _docs = const [
    _LegalDoc(
      id: 'terms',
      icon: Icons.gavel_rounded,
      title: 'Terms of Service',
      version: 'Version 3.1 · Updated Jan 2025',
      color: Color(0xFF1B3A6B),
      summary: 'By using HananData, you agree to our terms including lawful use of the platform, account security responsibilities, and payment obligations.',
      sections: [
        _Section('1. Acceptance of Terms',
          'By accessing HananData, you agree to be bound by these Terms of Service. If you do not agree, do not use our services.'),
        _Section('2. Use of Service',
          'You may only use HananData for lawful purposes. You must not use the service for fraud, money laundering, or any illegal activities.'),
        _Section('3. Account Security',
          'You are responsible for keeping your PIN and account credentials secure. HananData will never ask for your PIN via phone or email.'),
        _Section('4. Transactions',
          'All transactions are final once confirmed. Refunds are only processed for failed transactions within 24–72 hours. Contact support for disputes.'),
        _Section('5. Termination',
          'HananData reserves the right to suspend or terminate accounts that violate our terms, without prior notice.'),
      ],
    ),
    _LegalDoc(
      id: 'privacy',
      icon: Icons.privacy_tip_rounded,
      title: 'Privacy Policy',
      version: 'Version 2.4 · Updated Mar 2025',
      color: Color(0xFF00897B),
      summary: 'We collect only the data necessary to provide our services. We never sell your data to third parties.',
      sections: [
        _Section('1. Data We Collect',
          'We collect your name, phone number, email, BVN (for verification), transaction history, and device information.'),
        _Section('2. How We Use Your Data',
          'Your data is used to process transactions, verify your identity, send notifications, and improve our services.'),
        _Section('3. Data Sharing',
          'We share data only with payment processors, regulatory bodies when required by law, and verification partners. We never sell your personal data.'),
        _Section('4. Data Security',
          'All data is encrypted using AES-256. We use HTTPS for all communications. Regular security audits are conducted.'),
        _Section('5. Your Rights',
          'You have the right to access, correct, or delete your data. Contact support@hanandata.ng to exercise these rights.'),
      ],
    ),
    _LegalDoc(
      id: 'cookie',
      icon: Icons.cookie_outlined,
      title: 'Cookie Policy',
      version: 'Version 1.2 · Updated Jan 2025',
      color: Color(0xFFF6A623),
      summary: 'We use cookies to improve app performance and your user experience.',
      sections: [
        _Section('1. What Are Cookies',
          'Cookies are small data files stored on your device that help us remember your preferences and improve performance.'),
        _Section('2. Types We Use',
          'Essential cookies (required for app function), Analytics cookies (anonymous usage data), and Preference cookies (remember your settings).'),
        _Section('3. Managing Cookies',
          'You can clear app storage in your device settings at any time. Note that essential cookies cannot be disabled.'),
      ],
    ),
    _LegalDoc(
      id: 'refund',
      icon: Icons.currency_exchange_rounded,
      title: 'Refund Policy',
      version: 'Version 2.0 · Updated Nov 2024',
      color: Color(0xFF7B2FBE),
      summary: 'Failed transactions are automatically refunded within 24–72 hours to your wallet.',
      sections: [
        _Section('1. Automatic Refunds',
          'If a transaction fails after deduction, the amount is automatically refunded to your HananData wallet within 24–72 hours.'),
        _Section('2. Manual Refund Requests',
          'For disputed transactions, contact support within 7 days with your reference ID. Investigations take 3–10 business days.'),
        _Section('3. Non-Refundable Cases',
          'Successfully delivered services (data, airtime, cable, electricity tokens) are non-refundable once delivered to the recipient.'),
        _Section('4. Wallet Withdrawals',
          'Wallet balance refunds back to bank accounts are processed within 1–3 business days subject to verification.'),
      ],
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBackground,
      body: SafeArea(
        child: Column(
          children: [
            BackHeader(title: 'Legal', onBack: () => Navigator.pop(context)),
            Expanded(
              child: ListView(
                padding: const EdgeInsets.all(20),
                children: [
                  // Header
                  Container(
                    padding: const EdgeInsets.all(16),
                    margin: const EdgeInsets.only(bottom: 20),
                    decoration: BoxDecoration(
                      color: kPrimaryNavy.withValues(alpha: 0.05),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: kPrimaryNavy.withValues(alpha: 0.15)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.balance_rounded, color: kPrimaryNavy, size: 28),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                            Text('HananData Legal Center',
                                style: dFont(size: 14, weight: FontWeight.w700, color: kPrimaryNavy)),
                            Text('All our policies and agreements in one place.',
                                style: dFont(size: 12, color: kMutedText)),
                          ]),
                        ),
                      ],
                    ),
                  ),
                  // Docs
                  ..._docs.map((doc) => _DocCard(
                    doc: doc,
                    expanded: _expanded == doc.id,
                    onToggle: () => setState(() => _expanded = _expanded == doc.id ? null : doc.id),
                  )),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _DocCard extends StatelessWidget {
  final _LegalDoc doc;
  final bool expanded;
  final VoidCallback onToggle;
  const _DocCard({required this.doc, required this.expanded, required this.onToggle});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: expanded ? doc.color : kCardBorder, width: expanded ? 2 : 1),
        ),
        child: Column(
          children: [
            // Header — tap to expand
            GestureDetector(
              onTap: onToggle,
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Container(
                      width: 42, height: 42,
                      decoration: BoxDecoration(
                        color: doc.color.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(doc.icon, color: doc.color, size: 22),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        Text(doc.title,
                            style: dFont(size: 15, weight: FontWeight.w700, color: kPrimaryDark)),
                        Text(doc.version, style: dFont(size: 11, color: kMutedText)),
                      ]),
                    ),
                    Icon(
                      expanded ? Icons.keyboard_arrow_up_rounded : Icons.keyboard_arrow_down_rounded,
                      color: kMutedText, size: 22,
                    ),
                  ],
                ),
              ),
            ),
            // Expanded content
            if (expanded) ...[
              const Divider(height: 1, color: kCardBorder),
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Summary
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: doc.color.withValues(alpha: 0.06),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(doc.summary,
                          style: dFont(size: 13, color: doc.color, weight: FontWeight.w500)),
                    ),
                    const SizedBox(height: 16),
                    // Sections
                    ...doc.sections.map((s) => Padding(
                      padding: const EdgeInsets.only(bottom: 14),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(s.title,
                              style: dFont(size: 13, weight: FontWeight.w700, color: kPrimaryDark)),
                          const SizedBox(height: 4),
                          Text(s.body,
                              style: dFont(size: 12, color: kMediumText, letterSpacing: 0.1)),
                        ],
                      ),
                    )),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _LegalDoc {
  final String id;
  final IconData icon;
  final String title;
  final String version;
  final Color color;
  final String summary;
  final List<_Section> sections;
  const _LegalDoc({required this.id, required this.icon, required this.title,
      required this.version, required this.color, required this.summary, required this.sections});
}

class _Section {
  final String title;
  final String body;
  const _Section(this.title, this.body);
}
