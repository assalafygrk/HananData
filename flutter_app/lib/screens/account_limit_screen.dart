// lib/screens/account_limit_screen.dart
import 'package:flutter/material.dart';
import '../widgets/shared_widgets.dart';

class AccountLimitScreen extends StatelessWidget {
  const AccountLimitScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBackground,
      body: SafeArea(
        child: Column(
          children: [
            BackHeader(title: 'Account Limit', onBack: () => Navigator.pop(context)),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Current tier card
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [kPrimaryNavy, kPrimaryBlue],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('Current Tier',
                                  style: dFont(size: 12, color: Colors.white.withValues(alpha: 0.7))),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                                decoration: BoxDecoration(
                                  color: kAccentGreen,
                                  borderRadius: BorderRadius.circular(99),
                                ),
                                child: Text('TIER 2',
                                    style: dFont(size: 11, weight: FontWeight.w700, color: Colors.white)),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text('Verified Account',
                              style: dFont(size: 22, weight: FontWeight.w800, color: Colors.white)),
                          const SizedBox(height: 4),
                          Text('BVN linked · ID verified',
                              style: dFont(size: 12, color: Colors.white.withValues(alpha: 0.7))),
                          const SizedBox(height: 16),
                          // Progress to Tier 3
                          Text('Progress to Tier 3',
                              style: dFont(size: 11, color: Colors.white.withValues(alpha: 0.7))),
                          const SizedBox(height: 6),
                          ClipRRect(
                            borderRadius: BorderRadius.circular(99),
                            child: LinearProgressIndicator(
                              value: 0.6,
                              minHeight: 6,
                              backgroundColor: Colors.white.withValues(alpha: 0.2),
                              valueColor: const AlwaysStoppedAnimation<Color>(kAccentGreen),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text('1 step remaining: NIN verification',
                              style: dFont(size: 11, color: Colors.white.withValues(alpha: 0.7))),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Limits comparison
                    const SectionLabel('Account Limits by Tier'),
                    const SizedBox(height: 12),
                    const _TierCard(
                      tier: 'Tier 1',
                      label: 'Basic',
                      color: kMutedText,
                      isActive: false,
                      requirements: 'Phone number only',
                      limits: [
                        _LimitRow(label: 'Daily transaction', value: '₦20,000'),
                        _LimitRow(label: 'Single transaction', value: '₦5,000'),
                        _LimitRow(label: 'Monthly limit', value: '₦100,000'),
                        _LimitRow(label: 'Wallet balance', value: '₦20,000'),
                      ],
                    ),
                    const SizedBox(height: 12),
                    const _TierCard(
                      tier: 'Tier 2',
                      label: 'Verified',
                      color: kPrimaryNavy,
                      isActive: true,
                      requirements: 'BVN + ID card',
                      limits: [
                        _LimitRow(label: 'Daily transaction', value: '₦200,000'),
                        _LimitRow(label: 'Single transaction', value: '₦100,000'),
                        _LimitRow(label: 'Monthly limit', value: '₦1,000,000'),
                        _LimitRow(label: 'Wallet balance', value: '₦500,000'),
                      ],
                    ),
                    const SizedBox(height: 12),
                    const _TierCard(
                      tier: 'Tier 3',
                      label: 'Premium',
                      color: Color(0xFF7B2FBE),
                      isActive: false,
                      requirements: 'BVN + NIN + Address proof',
                      limits: [
                        _LimitRow(label: 'Daily transaction', value: '₦5,000,000'),
                        _LimitRow(label: 'Single transaction', value: '₦1,000,000'),
                        _LimitRow(label: 'Monthly limit', value: 'Unlimited'),
                        _LimitRow(label: 'Wallet balance', value: '₦5,000,000'),
                      ],
                    ),
                    const SizedBox(height: 24),

                    // Upgrade CTA
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF5F0FF),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFF7B2FBE).withValues(alpha: 0.3)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Upgrade to Tier 3',
                              style: dFont(size: 15, weight: FontWeight.w700, color: const Color(0xFF7B2FBE))),
                          const SizedBox(height: 4),
                          Text('Verify your NIN to unlock unlimited monthly transactions.',
                              style: dFont(size: 13, color: kMediumText)),
                          const SizedBox(height: 12),
                          PrimaryBtn(label: 'Start Verification', onPressed: () {}),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _TierCard extends StatelessWidget {
  final String tier;
  final String label;
  final Color color;
  final bool isActive;
  final String requirements;
  final List<_LimitRow> limits;
  const _TierCard({required this.tier, required this.label, required this.color,
      required this.isActive, required this.requirements, required this.limits});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: isActive ? color : kCardBorder, width: isActive ? 2 : 1),
      ),
      child: Column(
        children: [
          // Header
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: isActive ? color.withValues(alpha: 0.08) : kBackground,
              borderRadius: const BorderRadius.vertical(top: Radius.circular(15)),
            ),
            child: Row(
              children: [
                Container(
                  width: 36, height: 36,
                  decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(10)),
                  alignment: Alignment.center,
                  child: Text(tier.split(' ')[1],
                      style: dFont(size: 14, weight: FontWeight.w900, color: Colors.white)),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text('$tier — $label',
                        style: dFont(size: 14, weight: FontWeight.w700, color: color)),
                    Text(requirements, style: dFont(size: 11, color: kMutedText)),
                  ]),
                ),
                if (isActive)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(99)),
                    child: Text('ACTIVE', style: dFont(size: 9, weight: FontWeight.w700, color: Colors.white)),
                  ),
              ],
            ),
          ),
          // Limits
          ...limits.asMap().entries.map((e) => Column(
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(e.value.label, style: dFont(size: 13, color: kMutedText)),
                    Text(e.value.value, style: dFont(size: 13, weight: FontWeight.w700, color: kPrimaryDark)),
                  ],
                ),
              ),
              if (e.key < limits.length - 1)
                const Divider(height: 1, color: kCardBorder, indent: 16, endIndent: 16),
            ],
          )),
        ],
      ),
    );
  }
}

class _LimitRow {
  final String label;
  final String value;
  const _LimitRow({required this.label, required this.value});
}
