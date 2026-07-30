// lib/screens/confirm_screen.dart
import 'dart:math';
import 'package:flutter/material.dart';
import '../constants/app_data.dart';
import '../models/txn_data.dart';
import '../services/api_service.dart';
import '../widgets/shared_widgets.dart';

class ConfirmScreen extends StatefulWidget {
  const ConfirmScreen({super.key});
  @override
  State<ConfirmScreen> createState() => _ConfirmScreenState();
}

class _ConfirmScreenState extends State<ConfirmScreen> {
  String _pin = '';
  bool _isLoading = false;

  Future<void> _confirm(TxnData txn) async {
    setState(() => _isLoading = true);

    // Map TxnData to backend API payload
    String apiType = txn.type.toLowerCase();
    if (apiType.contains('wallet')) {
      // For wallet funding, mock for now or use fund wallet
      await Future.delayed(const Duration(seconds: 1));
      if (mounted) Navigator.pushReplacementNamed(context, '/success', arguments: txn);
      return;
    } else if (apiType.contains('data')) {
      apiType = 'data';
    } else if (apiType.contains('airtime')) {
      apiType = 'airtime';
    } else if (apiType.contains('cable')) {
      apiType = 'cable';
    } else if (apiType.contains('electricity')) {
      apiType = 'electricity';
    }

    final payload = {
      'network': txn.network,
      'amount': txn.amount,
      'phone': txn.recipient,
      'planId': txn.plan,
      'provider': txn.provider,
    };

    final res = await ApiService.purchaseService(apiType, payload);
    setState(() => _isLoading = false);

    if (!mounted) return;

    if (res['success'] == true) {
      Navigator.pushReplacementNamed(context, '/success', arguments: txn);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(res['message'] ?? 'Transaction failed')));
      // Still navigate to failed screen for UI demo if you want, or just stay here.
      Navigator.pushReplacementNamed(context, '/failed', arguments: txn);
    }
  }

  @override
  Widget build(BuildContext context) {
    final txn = ModalRoute.of(context)!.settings.arguments as TxnData;

    // Build detail rows matching the React reference
    final rows = <_DetailRow>[
      _DetailRow(label: 'Service',   value: txn.type),
      if (txn.network  != null) _DetailRow(label: 'Network',  value: txn.network!),
      if (txn.provider != null) _DetailRow(label: 'Provider', value: txn.provider!),
      _DetailRow(label: 'Recipient', value: txn.recipient ?? '—'),
      if (txn.plan != null)    _DetailRow(label: 'Detail',    value: txn.plan!),
      _DetailRow(label: 'Amount',    value: '₦${fmtNaira(txn.amount)}'),
      if (txn.fee > 0)         _DetailRow(label: 'Fee',       value: '₦${fmtNaira(txn.fee)}'),
    ];

    final balanceAfter = (48750 - txn.total).clamp(0, 999999);

    return Scaffold(
      backgroundColor: kBackground,
      body: SafeArea(
        child: Column(
          children: [
            BackHeader(
              title: 'Confirm Transaction',
              onBack: () => Navigator.pop(context),
            ),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    // Transaction detail card
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: kCardBorder),
                      ),
                      child: Column(
                        children: [
                          Padding(
                            padding: const EdgeInsets.all(20),
                            child: Column(
                              children: [
                                // Rows
                                ...rows.map((r) => Padding(
                                  padding: const EdgeInsets.only(bottom: 10),
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(r.label, style: dFont(size: 13, color: kMutedText)),
                                      const SizedBox(width: 16),
                                      Flexible(
                                        child: Text(r.value,
                                          textAlign: TextAlign.right,
                                          style: dFont(size: 13, weight: FontWeight.w600)),
                                      ),
                                    ],
                                  ),
                                )),
                                const Divider(color: kCardBorder, height: 24),
                                // Total
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text('Total Debit',
                                      style: dFont(size: 15, weight: FontWeight.w700)),
                                    Text('₦${fmtNaira(txn.total)}',
                                      style: dFont(size: 22, weight: FontWeight.w800, color: kPrimaryNavy)),
                                  ],
                                ),
                              ],
                            ),
                          ),
                          // Balance after footer
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                            decoration: const BoxDecoration(
                              color: Color(0xFFF0F4FA),
                              borderRadius: BorderRadius.only(
                                bottomLeft: Radius.circular(20),
                                bottomRight: Radius.circular(20),
                              ),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text('Wallet balance after',
                                  style: dFont(size: 12, color: kMutedText)),
                                Text('₦${fmtNaira(balanceAfter)}',
                                  style: dFont(size: 12, weight: FontWeight.w700, color: kMediumText)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                    // PIN entry
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: kCardBorder),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SectionLabel('Transaction PIN'),
                          const SizedBox(height: 4),
                          PINDots(value: _pin, max: 4),
                          const SizedBox(height: 16),
                          NumPad(
                            value: _pin,
                            max: 4,
                            onChanged: (v) {
                              setState(() => _pin = v);
                              if (v.length == 4) {
                                Future.delayed(const Duration(milliseconds: 120),
                                  () { if (mounted) _confirm(txn); });
                              }
                            },
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: _isLoading 
                ? const Center(child: CircularProgressIndicator())
                : PrimaryBtn(
                    label: 'Confirm & Pay',
                    disabled: _pin.length < 4,
                    onPressed: () => _confirm(txn),
                  ),
            ),
          ],
        ),
      ),
    );
  }
}

class _DetailRow {
  final String label;
  final String value;
  const _DetailRow({required this.label, required this.value});
}
