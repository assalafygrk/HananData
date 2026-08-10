import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';
import '../utils/ui_helpers.dart';
import '../widgets/shared_widgets.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  Map<String, dynamic>? _userData;
  List<dynamic> _transactions = [];
  bool _isLoading = true;
  bool _hideBalance = false;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final prefs = await SharedPreferences.getInstance();
    final userStr = prefs.getString('userData');
    if (userStr != null) {
      setState(() => _userData = jsonDecode(userStr));
    }
    
    // Refresh from backend
    final profileRes = await ApiService.getProfile();
    if (profileRes['success'] == true && mounted) {
      setState(() => _userData = profileRes['data']);
      if (profileRes['data']['hasTransactionPin'] == false) {
        Navigator.pushNamed(context, '/set_pin');
      }
    }

    final txRes = await ApiService.getUserTransactions();
    if (txRes['success'] == true && mounted) {
      setState(() => _transactions = txRes['data'] ?? []);
    }
    
    if (mounted) setState(() => _isLoading = false);
  }

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good Morning,';
    if (hour < 17) return 'Good Afternoon,';
    return 'Good Evening,';
  }

  @override
  Widget build(BuildContext context) {
    final quickActions = [
      const _QuickAction(label: 'Buy Data',      icon: Icons.signal_cellular_alt_rounded, route: '/data'),
      const _QuickAction(label: 'Buy Airtime',   icon: Icons.phone_android_rounded,       route: '/airtime'),
      const _QuickAction(label: 'Cable TV',      icon: Icons.tv_rounded,                  route: '/cable'),
      const _QuickAction(label: 'Electricity',   icon: Icons.bolt_rounded,                route: '/electricity'),
      const _QuickAction(label: 'Airtime→Cash',  icon: Icons.swap_horiz_rounded,          route: '/airtimecash'),
      const _QuickAction(label: 'Exam PIN',      icon: Icons.school_rounded,              route: '/exam-pin'),
      const _QuickAction(label: 'Fund Wallet',   icon: Icons.account_balance_wallet_outlined, route: '/wallet'),
      const _QuickAction(label: 'Coming Soon',   icon: Icons.auto_awesome_rounded,        route: '/coming-soon'),
    ];

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: Stack(
        children: [
          Column(
            children: [
          // Header with gradient
          // Header without harsh gradient box
          Container(
            color: Colors.transparent,
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
                            Text(_getGreeting(),
                              style: dFont(size: 12, color: Theme.of(context).brightness == Brightness.dark ? const Color(0xFF7BAED4) : kMutedText)),
                            const SizedBox(height: 2),
                            Text('${_userData?['name']?.split(' ')[0] ?? 'User'} 👋',
                              style: GoogleFonts.inter(
                                fontSize: 20, fontWeight: FontWeight.w700, 
                                color: Theme.of(context).brightness == Brightness.dark ? Colors.white : kPrimaryDark,
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
                                  color: Theme.of(context).cardColor,
                                  shape: BoxShape.circle,
                                  border: Border.all(color: Theme.of(context).dividerColor),
                                ),
                                child: Icon(Icons.notifications_outlined,
                                  color: Theme.of(context).brightness == Brightness.dark ? Colors.white : kPrimaryNavy, size: 22),
                              ),
                              // Unread badge
                              if ((_userData?['unreadNotificationsCount'] ?? 0) > 0)
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
                        gradient: const LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [Color(0xFF0D1B35), Color(0xFF1B3A6B)],
                        ),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('Wallet Balance',
                                style: dFont(size: 11, weight: FontWeight.w600, color: const Color(0xFF7BAED4))),
                              Row(
                                children: [
                                  GestureDetector(
                                    onTap: () => setState(() => _hideBalance = !_hideBalance),
                                    child: Icon(
                                      _hideBalance ? Icons.visibility_off : Icons.visibility,
                                      color: const Color(0xFF7BAED4),
                                      size: 18,
                                    ),
                                  ),
                                  const SizedBox(width: 16),
                                  GestureDetector(
                                    onTap: () {
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        const SnackBar(content: Text('Refreshing balance...'), duration: Duration(seconds: 1)),
                                      );
                                      _loadData();
                                    },
                                    child: const Icon(
                                      Icons.refresh,
                                      color: Color(0xFF7BAED4),
                                      size: 18,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(_hideBalance ? '₦****' : '₦${(_userData?['walletBalance'] ?? 0).toStringAsFixed(2)}',
                            style: GoogleFonts.inter(
                              fontSize: 30, fontWeight: FontWeight.w800,
                              color: Colors.white, letterSpacing: -0.5,
                            )),
                          const SizedBox(height: 2),
                          GestureDetector(
                            onTap: () async {
                              final va = _userData?['virtualAccount'];
                              final acctNum = (va is Map) ? va['accountNumber'] : null;
                              if (acctNum != null) {
                                Clipboard.setData(ClipboardData(text: acctNum.toString()));
                                UiHelpers.showBanner(context, 'Account Number copied to clipboard', isError: false);
                              } else {
                                setState(() => _isLoading = true);
                                final res = await ApiService.getVirtualAccount();
                                setState(() => _isLoading = false);
                                if (res['success'] == true) {
                                  _loadData();
                                  UiHelpers.showBanner(context, 'Virtual account generated successfully!');
                                } else {
                                  UiHelpers.showBanner(context, res['message'] ?? 'Failed to generate account', isError: true);
                                }
                              }
                            },
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(() {
                                  final va = _userData?['virtualAccount'];
                                  if (va is Map && va['accountNumber'] != null) {
                                    return '${va['accountNumber']} · ${va['bankName'] ?? 'Bank'}';
                                  }
                                  return 'Tap to generate virtual account';
                                }(),
                                  style: dFont(size: 11, color: const Color(0xFF7BAED4))),
                                const SizedBox(width: 4),
                                if (_userData?['virtualAccount'] is Map && _userData?['virtualAccount']['accountNumber'] != null)
                                  const Icon(Icons.copy_rounded, color: Color(0xFF7BAED4), size: 12),
                                if (!(_userData?['virtualAccount'] is Map) || _userData?['virtualAccount']['accountNumber'] == null)
                                  const Icon(Icons.refresh_rounded, color: Color(0xFF7BAED4), size: 12),
                              ],
                            ),
                          ),
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
                                onTap: () => Navigator.pushNamed(context, '/my-referral'),
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
            child: RefreshIndicator(
              onRefresh: _loadData,
              color: kPrimaryNavy,
              backgroundColor: Colors.white,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
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
                          crossAxisCount: 4,
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
                        if (_transactions.isEmpty && !_isLoading)
                          Padding(
                            padding: const EdgeInsets.symmetric(vertical: 20),
                            child: Text('No recent transactions', style: dFont(size: 14, color: Colors.grey)),
                          )
                        else
                          ..._transactions.take(4).map((t) => Padding(
                            padding: const EdgeInsets.only(bottom: 8),
                            child: TxnRowApi(txn: t), // using a new widget that expects the JSON map directly
                          )),
                      ],
                    ),
                  ),
                ],
              ),
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
      if (_isLoading && _transactions.isEmpty)
        Container(
          color: Theme.of(context).scaffoldBackgroundColor.withValues(alpha: 0.8),
          child: const Center(child: BrandLoader()),
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
          color: Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Theme.of(context).dividerColor),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 40, height: 40,
              decoration: BoxDecoration(
                color: Theme.of(context).brightness == Brightness.dark 
                    ? Colors.white.withValues(alpha: 0.1) 
                    : const Color(0xFFF0F4FA),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(qa.icon, color: Theme.of(context).brightness == Brightness.dark ? Colors.white : kPrimaryNavy, size: 20),
            ),
            const SizedBox(height: 8),
            Text(
              qa.label,
              textAlign: TextAlign.center,
              style: dFont(size: 11, weight: FontWeight.w600, color: Theme.of(context).brightness == Brightness.dark ? Colors.white70 : kMediumText),
            ),
          ],
        ),
      ),
    );
  }
}
