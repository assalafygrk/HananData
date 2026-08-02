import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:share_plus/share_plus.dart';
import '../services/api_service.dart';
import '../widgets/shared_widgets.dart';

class MyReferralScreen extends StatefulWidget {
  const MyReferralScreen({super.key});

  @override
  State<MyReferralScreen> createState() => _MyReferralScreenState();
}

class _MyReferralScreenState extends State<MyReferralScreen> {
  List<dynamic> _referrals = [];
  bool _isLoading = true;
  String _referralCode = 'Loading...';

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final prefs = await SharedPreferences.getInstance();
    final userStr = prefs.getString('userData');
    if (userStr != null) {
      final data = jsonDecode(userStr);
      if (mounted) setState(() => _referralCode = data['referralCode'] ?? 'HANAN-UNKNOWN');
    }

    final res = await ApiService.getReferrals();
    if (res['success'] == true && mounted) {
      setState(() {
        _referrals = res['data'] ?? [];
        _isLoading = false;
      });
    } else {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: SafeArea(
        child: Column(
          children: [
            BackHeader(title: 'My Referral', onBack: () => Navigator.pop(context)),
            Expanded(
              child: SingleChildScrollView(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      // Banner Illustration
                      Container(
                        width: 80, height: 80,
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Color(0xFF7B2FBE), Color(0xFF9B59B6)],
                            begin: Alignment.topLeft, end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(24),
                        ),
                        child: const Icon(Icons.card_giftcard_rounded, color: Colors.white, size: 40),
                      ),
                      const SizedBox(height: 20),
                      Text('Invite & Earn Rewards', style: dFont(size: 22, weight: FontWeight.w800, color: kPrimaryDark)),
                      const SizedBox(height: 8),
                      Text(
                        'Share your referral code. You and your friend both earn ₦200 when they make their first transaction.',
                        style: dFont(size: 14, color: kMutedText),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 32),
                      
                      // Referral Code Box
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF5F0FF),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: const Color(0xFF7B2FBE).withValues(alpha: 0.3)),
                        ),
                        child: Column(
                          children: [
                            Text('Your Referral Code', style: dFont(size: 13, color: kMutedText)),
                            const SizedBox(height: 8),
                            Text(_referralCode,
                              style: dFont(size: 28, weight: FontWeight.w900, color: const Color(0xFF7B2FBE), letterSpacing: 2)),
                            const SizedBox(height: 16),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                GestureDetector(
                                  onTap: () {
                                    Clipboard.setData(ClipboardData(text: _referralCode));
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(content: Text('Code copied!', style: dFont(size: 14)), backgroundColor: const Color(0xFF7B2FBE)),
                                    );
                                  },
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFF7B2FBE),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Row(
                                      children: [
                                        const Icon(Icons.copy_rounded, color: Colors.white, size: 16),
                                        const SizedBox(width: 8),
                                        Text('Copy Code', style: dFont(size: 14, weight: FontWeight.w700, color: Colors.white)),
                                      ],
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 12),
                                GestureDetector(
                                  onTap: () {
                                    Share.share('Sign up on HananData using my referral code $_referralCode and we both get ₦200!');
                                  },
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(12),
                                      border: Border.all(color: const Color(0xFF7B2FBE)),
                                    ),
                                    child: Row(
                                      children: [
                                        const Icon(Icons.share_rounded, color: Color(0xFF7B2FBE), size: 16),
                                        const SizedBox(width: 8),
                                        Text('Share', style: dFont(size: 14, weight: FontWeight.w700, color: Color(0xFF7B2FBE))),
                                      ],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 32),
                      
                      // Stats
                      Row(
                        children: [
                          Expanded(
                            child: _StatCard(title: 'Total Referrals', value: '${_referrals.length}', icon: Icons.group_rounded, color: kAccentGreen),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: _StatCard(title: 'Total Earned', value: '₦${_referrals.where((r) => r['status'] == 'completed').length * 200}', icon: Icons.account_balance_wallet_rounded, color: const Color(0xFFF6A623)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 32),
                      
                      // Referred Users List
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Recent Referrals', style: dFont(size: 16, weight: FontWeight.w700)),
                          Text('See All', style: dFont(size: 13, weight: FontWeight.w600, color: kPrimaryNavy)),
                        ],
                      ),
                      const SizedBox(height: 16),
                      if (_isLoading)
                        const BrandLoader()
                      else if (_referrals.isEmpty)
                        Text('No referrals yet.', style: dFont(size: 14, color: kMutedText))
                      else
                        ..._referrals.map((r) => _ReferralRow(
                          name: r['referredUser']?['name'] ?? 'Unknown',
                          date: 'Recently', // format r['createdAt']
                          status: r['status'] ?? 'pending',
                          reward: (r['status'] == 'completed') ? '+₦200' : '₦0',
                        )),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color color;

  const _StatCard({required this.title, required this.value, required this.icon, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: kCardBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(height: 12),
          Text(title, style: dFont(size: 12, color: kMutedText)),
          const SizedBox(height: 4),
          Text(value, style: dFont(size: 18, weight: FontWeight.w800, color: kPrimaryDark)),
        ],
      ),
    );
  }
}

class _ReferralRow extends StatelessWidget {
  final String name;
  final String date;
  final String status;
  final String reward;

  const _ReferralRow({required this.name, required this.date, required this.status, required this.reward});

  @override
  Widget build(BuildContext context) {
    final bool isCompleted = status == 'Completed';
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: kCardBorder),
      ),
      child: Row(
        children: [
          Container(
            width: 44, height: 44,
            decoration: BoxDecoration(
              color: kPrimaryNavy.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            alignment: Alignment.center,
            child: Text(name[0], style: dFont(size: 16, weight: FontWeight.w800, color: kPrimaryNavy)),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: dFont(size: 14, weight: FontWeight.w700, color: kPrimaryDark)),
                const SizedBox(height: 4),
                Text(date, style: dFont(size: 12, color: kMutedText)),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(reward, style: dFont(size: 14, weight: FontWeight.w700, color: isCompleted ? kAccentGreen : kMutedText)),
              const SizedBox(height: 4),
              Text(status, style: dFont(size: 12, weight: FontWeight.w600, color: isCompleted ? kAccentGreen : const Color(0xFFF6A623))),
            ],
          ),
        ],
      ),
    );
  }
}
