// lib/screens/history_screen.dart
import 'package:flutter/material.dart';
import '../constants/app_data.dart';
import '../widgets/shared_widgets.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});
  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  String _filter = 'All';

  static const _filters = ['All', 'Data', 'Airtime', 'Cable', 'Electricity', 'Wallet'];

  List<HistoryItem> get _filtered {
    if (_filter == 'All') return kHistoryItems;
    return kHistoryItems
        .where((t) => t.type.toLowerCase() == _filter.toLowerCase())
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
            const AppStatusBar(),
            // Header
            Container(
              color: Colors.white,
              padding: const EdgeInsets.fromLTRB(20, 6, 20, 14),
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
            // List
            Expanded(
              child: items.isEmpty
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
                      itemBuilder: (ctx, i) => TxnRow(txn: items[i]),
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
