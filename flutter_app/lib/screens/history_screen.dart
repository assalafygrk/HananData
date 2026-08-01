// lib/screens/history_screen.dart
import 'package:flutter/material.dart';
import '../constants/app_data.dart';
import '../widgets/shared_widgets.dart';
import '../services/api_service.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});
  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}


class _HistoryScreenState extends State<HistoryScreen> {
  String _filter = 'All';
  List<dynamic> _transactions = [];
  bool _loading = true;

  static const _filters = ['All', 'Data', 'Airtime', 'Cable', 'Electricity', 'Wallet'];

  @override
  void initState() {
    super.initState();
    _fetchHistory();
  }

  Future<void> _fetchHistory() async {
    setState(() => _loading = true);
    final res = await ApiService.getUserTransactions();
    if (res['success'] == true && mounted) {
      setState(() {
        _transactions = res['data'];
        _loading = false;
      });
    } else if (mounted) {
      setState(() => _loading = false);
    }
  }

  List<dynamic> get _filtered {
    if (_filter == 'All') return _transactions;
    if (_filter == 'Wallet') {
      return _transactions.where((t) => t['type'] == 'funding' || t['type'] == 'referral_bonus' || t['type'] == 'admin-credit' || t['type'] == 'admin-debit' || t['type'] == 'wallet-funding').toList();
    }
    return _transactions
        .where((t) => (t['type'] as String).toLowerCase() == _filter.toLowerCase())
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    final items = _filtered;

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
                  Text('Transactions',
                    style: dFont(size: 20, weight: FontWeight.w800, color: kPrimaryDark)),
                ],
              ),
            ),
            // Filter chips
            Container(
              color: Colors.white,
              child: Column(
                children: [
                  const Divider(height: 1, color: kCardBorder),
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    child: Row(
                      children: _filters.map((f) {
                        final on = f == _filter;
                        return Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: GestureDetector(
                            onTap: () => setState(() => _filter = f),
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                              decoration: BoxDecoration(
                                color: on ? kPrimaryNavy : kBackground,
                                borderRadius: BorderRadius.circular(99),
                              ),
                              child: Text(
                                f,
                                style: dFont(
                                  size: 13, weight: FontWeight.w600,
                                  color: on ? Colors.white : kMutedText,
                                ),
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                ],
              ),
            ),
            const Divider(height: 1, color: kCardBorder),
            // List — each row tappable showing detail sheet
            Expanded(
              child: _loading 
                ? const Center(child: BrandLoader())
                : items.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.receipt_long_outlined, color: kMutedText.withValues(alpha: 0.4), size: 56),
                          const SizedBox(height: 12),
                          Text('No transactions found',
                            style: dFont(size: 14, color: kMutedText)),
                        ],
                      ),
                    )
                  : ListView.separated(
                      padding: const EdgeInsets.all(16),
                      itemCount: items.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 8),
                      itemBuilder: (ctx, i) => TxnRowApi(txn: items[i]),
                    ),
            ),
            // Bottom nav
            AppBottomNav(
              active: 'history',
              onTap: (id) {
                if (id == 'home') {
                  Navigator.pushNamedAndRemoveUntil(context, '/home', (_) => false);
                } else if (id != 'history') {
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
