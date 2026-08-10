// lib/screens/confirm_screen.dart
// import 'dart:math';
import 'package:flutter/material.dart';
import '../constants/app_data.dart';
import '../models/txn_data.dart';
import '../services/api_service.dart';
import '../widgets/shared_widgets.dart';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/notification_service.dart';

class ConfirmScreen extends StatefulWidget {
  const ConfirmScreen({super.key});
  @override
  State<ConfirmScreen> createState() => _ConfirmScreenState();
}

class _ConfirmScreenState extends State<ConfirmScreen> {
  String _pin = '';
  bool _isLoading = false;
  Map<String, dynamic>? _userData;
  bool _requirePin = true;

  @override
  void initState() {
    super.initState();
    _loadBalance();
  }

  Future<void> _loadBalance() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _requirePin = prefs.getBool('setting_txnPin') ?? true;
    });
    final userStr = prefs.getString('userData');
    if (userStr != null && mounted) {
      try {
        final decoded = jsonDecode(userStr);
        final map = (decoded is Map<String, dynamic> && decoded.containsKey('data'))
            ? decoded['data']
            : decoded;
        if (map is Map<String, dynamic>) {
          setState(() => _userData = map);
        }
      } catch (_) {}
    }
    final res = await ApiService.getProfile();
    if (res['success'] == true && mounted) {
      final freshData = res['data'] is Map<String, dynamic> ? res['data'] as Map<String, dynamic> : null;
      if (freshData != null) {
        setState(() {
          _userData = freshData;
        });
        await prefs.setString('userData', jsonEncode(freshData));
      }
    }
  }

  Future<void> _confirm(TxnData txn) async {
    final prefs = await SharedPreferences.getInstance();
    final lockoutEnd = prefs.getInt('pin_lockout_end') ?? 0;
    if (DateTime.now().millisecondsSinceEpoch < lockoutEnd) {
      _showLockoutDialog();
      return;
    }

    setState(() => _isLoading = true);

    // Map TxnData to backend API payload
    String apiType = txn.type.toLowerCase();
    if (apiType.contains('wallet')) {
      // For wallet funding, mock for now or use fund wallet
      await Future.delayed(const Duration(seconds: 1));
      if (mounted)
        Navigator.pushReplacementNamed(context, '/success', arguments: txn);
      return;
    } else if (apiType.contains('data')) {
      apiType = 'data';
    } else if (apiType.contains('airtime')) {
      apiType = 'airtime';
    } else if (apiType.contains('cable')) {
      apiType = 'cable';
    } else if (apiType.contains('electricity')) {
      apiType = 'electricity';
    } else if (apiType.contains('exam')) {
      apiType = 'exam-pin';
    }

    String phoneToSend = txn.recipient ?? '';
    if (apiType == 'electricity' && txn.meterNumber != null) {
      phoneToSend = txn.meterNumber!;
    } else if (apiType == 'cable' && txn.recipient != null) {
      phoneToSend = txn.recipient!.replaceAll(RegExp(r'\D'), '');
    }

    final payload = {
      'network': txn.network,
      'amount': txn.amount,
      'phone': phoneToSend,
      'planId': txn.planId ?? txn.plan,
      'provider': txn.provider,
      'pin': _pin,
    };

    final res = await ApiService.purchaseService(apiType, payload);
    setState(() => _isLoading = false);

    if (!mounted) return;

    if (res['success'] == true) {
      // Reset attempts on success
      final prefs = await SharedPreferences.getInstance();
      await prefs.setInt('pin_attempts', 0);
      
      NotificationService().showNotification(
        id: DateTime.now().millisecondsSinceEpoch.remainder(100000),
        title: 'Transaction Successful',
        body:
            'Your purchase of ${txn.network ?? ''} ${txn.type} for ₦${txn.amount} was successful.',
      );

      final returnedToken = (res['data'] != null && res['data']['token'] != null)
          ? res['data']['token'].toString()
          : null;

      final finalTxn = returnedToken != null
          ? txn.copyWith(failureReason: returnedToken)
          : txn;

      Navigator.pushReplacementNamed(context, '/success', arguments: finalTxn);
    } else {
      final errorMsg = res['message'] ?? 'Transaction failed';
      
      if (errorMsg.contains('Please set a transaction PIN')) {
        Navigator.pushNamed(context, '/set_pin');
        return;
      }
      
      if (errorMsg.contains('Incorrect transaction PIN')) {
        final prefs = await SharedPreferences.getInstance();
        int attempts = prefs.getInt('pin_attempts') ?? 0;
        attempts++;
        await prefs.setInt('pin_attempts', attempts);
        
        if (attempts >= 3) {
          final lockoutEnd = DateTime.now().add(const Duration(minutes: 3)).millisecondsSinceEpoch;
          await prefs.setInt('pin_lockout_end', lockoutEnd);
          _showLockoutDialog();
        } else {
          _showPinErrorDialog(3 - attempts);
        }
        
        setState(() => _pin = '');
        return;
      }

      NotificationService().showNotification(
        id: DateTime.now().millisecondsSinceEpoch.remainder(100000),
        title: 'Transaction Failed',
        body:
            'Your purchase of ${txn.network ?? ''} ${txn.type} for ₦${txn.amount} failed.',
      );
      showTopBanner(context, errorMsg, isError: true);
    }
  }

  void _showPinErrorDialog(int remaining) {
    showDialog(
      context: context,
      barrierColor: Colors.black.withOpacity(0.5),
      builder: (ctx) => Dialog(
        backgroundColor: Colors.transparent,
        elevation: 0,
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.9),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: Colors.white, width: 2),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.lock_outline, color: Colors.redAccent, size: 48),
              const SizedBox(height: 16),
              const Text('Incorrect PIN', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              Text('You have $remaining attempt(s) remaining.', textAlign: TextAlign.center, style: const TextStyle(fontSize: 16)),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () => Navigator.pop(ctx),
                style: ElevatedButton.styleFrom(backgroundColor: kPrimaryNavy, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                child: const Text('Try Again', style: TextStyle(color: Colors.white)),
              )
            ],
          ),
        ),
      ),
    );
  }

  void _showLockoutDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      barrierColor: Colors.black.withOpacity(0.5),
      builder: (ctx) => Dialog(
        backgroundColor: Colors.transparent,
        elevation: 0,
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.9),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: Colors.white, width: 2),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.block, color: Colors.redAccent, size: 48),
              const SizedBox(height: 16),
              const Text('Too Many Attempts', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              const Text('For your security, PIN entry is locked for 3 minutes.', textAlign: TextAlign.center, style: TextStyle(fontSize: 16)),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  TextButton(
                    onPressed: () {
                      Navigator.pop(ctx);
                      Navigator.pop(context); // Go back from confirm screen
                    },
                    child: const Text('Cancel'),
                  ),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.pop(ctx);
                      Navigator.pushNamed(context, '/forget_pin');
                    },
                    style: ElevatedButton.styleFrom(backgroundColor: kPrimaryNavy, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                    child: const Text('Forgot PIN?', style: TextStyle(color: Colors.white)),
                  )
                ],
              )
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final txn = ModalRoute.of(context)!.settings.arguments as TxnData;

    // Derive api type from txn.type for label logic
    final String apiType = txn.type.toLowerCase().contains('cable')
        ? 'cable'
        : txn.type.toLowerCase().contains('electricity')
            ? 'electricity'
            : txn.type.toLowerCase();

    // Build detail rows matching the React reference
    final rows = <_DetailRow>[
      _DetailRow(label: 'Service', value: txn.type),
      if (txn.network != null)
        _DetailRow(label: 'Network', value: txn.network!),
      if (txn.provider != null)
        _DetailRow(label: 'Provider', value: txn.provider!),
      _DetailRow(label: 'Recipient', value: txn.recipient ?? '—'),
      if (txn.plan != null)
        _DetailRow(
          label: (apiType == 'cable' || apiType == 'electricity') ? 'Plan' : 'Detail',
          value: txn.plan!,
        ),
      _DetailRow(label: 'Amount', value: '₦${fmtNaira(txn.amount)}'),
      if (txn.fee > 0) _DetailRow(label: 'Fee', value: '₦${fmtNaira(txn.fee)}'),
    ];

    final num rawBal = _userData?['walletBalance'] ?? _userData?['balance'] ?? _userData?['data']?['walletBalance'] ?? 0;
    final num currentBalance = num.tryParse(rawBal.toString()) ?? 0;
    final num diff = currentBalance - txn.total;

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
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
                                      padding:
                                          const EdgeInsets.only(bottom: 10),
                                      child: Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.spaceBetween,
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(r.label,
                                              style: dFont(
                                                  size: 13, color: kMutedText)),
                                          const SizedBox(width: 16),
                                          Flexible(
                                            child: Text(r.value,
                                                textAlign: TextAlign.right,
                                                style: dFont(
                                                    size: 13,
                                                    weight: FontWeight.w600)),
                                          ),
                                        ],
                                      ),
                                    )),
                                const Divider(color: kCardBorder, height: 24),
                                // Total
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text('Total Debit',
                                        style: dFont(
                                            size: 15, weight: FontWeight.w700)),
                                    Text('₦${fmtNaira(txn.total)}',
                                        style: dFont(
                                            size: 22,
                                            weight: FontWeight.w800,
                                            color: kPrimaryNavy)),
                                  ],
                                ),
                              ],
                            ),
                          ),
                          // Balance after footer
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 20, vertical: 12),
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
                                Text(
                                  _userData == null
                                      ? 'Loading...'
                                      : (diff < 0
                                          ? 'Insufficient Balance'
                                          : '₦${fmtNaira(diff.toInt())}'),
                                  style: dFont(
                                      size: 12,
                                      weight: FontWeight.w700,
                                      color: (_userData != null && diff < 0)
                                          ? Colors.red
                                          : kMediumText),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                    // PIN entry
                    if (_requirePin)
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
                                  Future.delayed(
                                      const Duration(milliseconds: 120), () {
                                    if (mounted) _confirm(txn);
                                  });
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
                  ? const Center(child: BrandLoader())
                  : PrimaryBtn(
                      label: 'Confirm & Pay',
                      disabled: _requirePin ? _pin.length < 4 : false,
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
