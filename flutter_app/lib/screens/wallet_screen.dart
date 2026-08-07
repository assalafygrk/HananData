// lib/screens/wallet_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_data.dart';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../widgets/shared_widgets.dart';
import '../services/api_service.dart';

class WalletScreen extends StatefulWidget {
  const WalletScreen({super.key});
  @override
  State<WalletScreen> createState() => _WalletScreenState();
}

class _WalletScreenState extends State<WalletScreen> {
  final _amountCtrl = TextEditingController();
  String _quickAmt = '';
  String? _method;   // 'bank' | 'card' | 'ussd'

  final _quickAmounts = [1000, 5000, 10000, 20000];

  Map<String, dynamic>? _userData;
  Map<String, dynamic>? _virtualAccount;
  bool _loadingVA = false;
  
  @override
  void initState() {
    super.initState();
    _loadBalance();
    _fetchVirtualAccount();
  }

  Future<void> _loadBalance() async {
    final prefs = await SharedPreferences.getInstance();
    final userStr = prefs.getString('userData');
    if (userStr != null) {
      setState(() => _userData = jsonDecode(userStr));
    }
  }

  Future<void> _fetchVirtualAccount() async {
    setState(() => _loadingVA = true);
    try {
      final res = await ApiService.getVirtualAccount();
      if (res['success'] == true && res['data'] != null && mounted) {
        setState(() => _virtualAccount = Map<String, dynamic>.from(res['data']));
      }
    } catch (_) {}
    if (mounted) setState(() => _loadingVA = false);
  }

  @override
  void dispose() {
    _amountCtrl.dispose();
    super.dispose();
  }



  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Container(
              color: Theme.of(context).cardColor,
              padding: const EdgeInsets.fromLTRB(20, 6, 20, 14),
              child: Row(
                children: [
                  Text('Fund Wallet',
                    style: dFont(size: 20, weight: FontWeight.w800, color: kPrimaryDark)),
                ],
              ),
            ),
            const Divider(height: 1, color: kCardBorder),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Balance card
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF0D1B35), Color(0xFF1B3A6B)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Available Balance',
                            style: dFont(size: 11, weight: FontWeight.w600,
                              color: const Color(0xFF7BAED4))),
                          const SizedBox(height: 6),
                          Text('₦${(_userData?['walletBalance'] ?? 0).toStringAsFixed(2)}',
                            style: GoogleFonts.inter(
                              fontSize: 28, fontWeight: FontWeight.w800, color: Colors.white,
                              letterSpacing: -0.5,
                            )),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                    // Amount to fund
                    const SectionLabel('Amount to Fund'),
                    const SizedBox(height: 8),
                    Container(
                      decoration: BoxDecoration(
                        color: Theme.of(context).cardColor,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: kCardBorder, width: 2),
                      ),
                      child: Row(
                        children: [
                          Padding(
                            padding: const EdgeInsets.only(left: 16),
                            child: Text('₦',
                              style: dFont(size: 22, weight: FontWeight.w700,
                                color: const Color(0xFFB8C4D9))),
                          ),
                          Expanded(
                            child: TextField(
                              controller: _amountCtrl,
                              keyboardType: TextInputType.number,
                              style: dFont(size: 22, weight: FontWeight.w800),
                              decoration: InputDecoration(
                                hintText: '0',
                                hintStyle: dFont(size: 22, weight: FontWeight.w800,
                                  color: const Color(0xFFB8C4D9)),
                                border: InputBorder.none,
                                contentPadding: const EdgeInsets.symmetric(horizontal: 8, vertical: 14),
                              ),
                              onChanged: (v) {
                                final clean = v.replaceAll(RegExp(r'[^0-9]'), '');
                                if (clean != v) _amountCtrl.value = _amountCtrl.value.copyWith(text: clean);
                                setState(() => _quickAmt = clean);
                              },
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 10),
                    // Quick amounts
                    Row(
                      children: _quickAmounts.map((a) {
                        final on = _quickAmt == a.toString();
                        return Expanded(
                          child: Padding(
                            padding: EdgeInsets.only(right: a != _quickAmounts.last ? 8 : 0),
                            child: GestureDetector(
                              onTap: () {
                                setState(() => _quickAmt = a.toString());
                                _amountCtrl.text = a.toString();
                              },
                              child: AnimatedContainer(
                                duration: const Duration(milliseconds: 150),
                                padding: const EdgeInsets.symmetric(vertical: 10),
                                decoration: BoxDecoration(
                                  color: on ? const Color(0xFFE8EDF5) : Theme.of(context).cardColor,
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: on ? kPrimaryNavy : kCardBorder),
                                ),
                                alignment: Alignment.center,
                                child: Text('₦${fmtNaira(a)}',
                                  style: dFont(size: 11, weight: FontWeight.w700,
                                    color: on ? kPrimaryNavy : kMutedText)),
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 24),
                    // Funding methods
                    const SectionLabel('Funding Method'),
                    const SizedBox(height: 12),
                    _FundingMethod(
                      id: 'bank',
                      title: 'Bank Transfer',
                      subtitle: 'Transfer from any Nigerian bank',
                      emoji: '🏦',
                      selected: _method == 'bank',
                      onTap: () => setState(() => _method = _method == 'bank' ? null : 'bank'),
                      expandedContent: _buildBankDetail(),
                    ),
                  ],
                ),
              ),
            ),
            AppBottomNav(
              active: 'wallet',
              onTap: (id) {
                if (id == 'home') {
                  Navigator.pushNamedAndRemoveUntil(context, '/home', (_) => false);
                } else if (id != 'wallet') {
                  Navigator.pushNamed(context, '/$id');
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBankDetail() {
    if (_loadingVA) {
      return Container(
        margin: const EdgeInsets.only(top: 12),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: const Color(0xFFE8EDF5),
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Center(child: SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))),
      );
    }

    // Gateway not configured — no virtual account available
    if (_virtualAccount == null) {
      return Container(
        margin: const EdgeInsets.only(top: 12),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: const Color(0xFFFFF8E1),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFFFFE082)),
        ),
        child: Row(
          children: [
            const Icon(Icons.info_outline_rounded, color: Color(0xFFE65100), size: 22),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                'Bank transfer is not available yet. Please check back later or use another funding method.',
                style: dFont(size: 12, color: const Color(0xFFE65100)),
              ),
            ),
          ],
        ),
      );
    }

    final bankName = _virtualAccount!['bankName'] ?? '';
    final accountNumber = _virtualAccount!['accountNumber'] ?? '—';
    final accountName = _virtualAccount!['accountName'] ?? 'HananData - ${_userData?['name'] ?? ''}';

    final rows = [
      ['Account Name', accountName],
      ['Account No.', accountNumber],
      ['Bank', bankName],
    ];
    return Container(
      margin: const EdgeInsets.only(top: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFE8EDF5),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Transfer to this dedicated account:',
            style: dFont(size: 12, color: kMutedText)),
          const SizedBox(height: 8),
          ...rows.map((r) => Padding(
            padding: const EdgeInsets.only(bottom: 6),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(r[0], style: dFont(size: 13, color: kMutedText)),
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(r[1], style: dFont(size: 13, weight: FontWeight.w700)),
                    if (r[0] == 'Account No.' && accountNumber != '—') ...[
                      const SizedBox(width: 6),
                      GestureDetector(
                        onTap: () {
                          Clipboard.setData(ClipboardData(text: accountNumber));
                          showTopBanner(context, 'Account number copied!', isError: false);
                        },
                        child: Container(
                          padding: const EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color: kPrimaryNavy.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: const Icon(Icons.copy_rounded, size: 14, color: kPrimaryNavy),
                        ),
                      ),
                    ],
                  ],
                ),
              ],
            ),
          )),
          const SizedBox(height: 4),
          Text('Wallet funded automatically within seconds',
            style: dFont(size: 11, color: kMutedText)),
        ],
      ),
    );
  }
}

// ─── Funding Method Accordion Tile ───────────────────────────────────────────

class _FundingMethod extends StatelessWidget {
  final String id;
  final String title;
  final String subtitle;
  final String emoji;
  final bool selected;
  final VoidCallback onTap;
  final Widget expandedContent;

  const _FundingMethod({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.emoji,
    required this.selected,
    required this.onTap,
    required this.expandedContent,
  });

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: selected ? kPrimaryNavy : kCardBorder, width: 2),
      ),
      child: Column(
        children: [
          GestureDetector(
            onTap: onTap,
            behavior: HitTestBehavior.opaque,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Text(emoji, style: const TextStyle(fontSize: 24)),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(title, style: dFont(size: 14, weight: FontWeight.w700)),
                        Text(subtitle, style: dFont(size: 12, color: kMutedText)),
                      ],
                    ),
                  ),
                  AnimatedRotation(
                    turns: selected ? 0.25 : 0,
                    duration: const Duration(milliseconds: 200),
                    child: const Icon(Icons.chevron_right_rounded, color: Color(0xFFB8C4D9), size: 22),
                  ),
                ],
              ),
            ),
          ),
          if (selected)
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              child: expandedContent,
            ),
        ],
      ),
    );
  }
}
