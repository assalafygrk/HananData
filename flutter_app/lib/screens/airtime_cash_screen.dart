// lib/screens/airtime_cash_screen.dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_data.dart';
import '../models/txn_data.dart';
import '../widgets/shared_widgets.dart';

class AirtimeCashScreen extends StatefulWidget {
  const AirtimeCashScreen({super.key});
  @override
  State<AirtimeCashScreen> createState() => _AirtimeCashScreenState();
}

class _AirtimeCashScreenState extends State<AirtimeCashScreen> {
  int _netIdx = 0;
  final _amountCtrl = TextEditingController();

  NetworkInfo get _net => kNetworks[_netIdx];

  int get _num => int.tryParse(_amountCtrl.text) ?? 0;
  int get _cash => (_num * 0.75).floor();

  @override
  void dispose() {
    _amountCtrl.dispose();
    super.dispose();
  }

  void _proceed() {
    final txn = TxnData(
      type: 'Airtime to Cash',
      network: _net.name,
      networkColor: '#${(_net.color.toARGB32() & 0xFFFFFF).toRadixString(16).padLeft(6, '0').toUpperCase()}',
      recipient: 'HananData Wallet',
      amount: _num,
      fee: _num - _cash,
      total: _cash,
      description: '${_net.name} Airtime → Cash',
      plan: '25% conversion fee',
      refId: genRef(),
    );
    Navigator.pushNamed(context, '/confirm', arguments: txn);
  }

  @override
  Widget build(BuildContext context) {
    final showSummary = _num >= 100;

    return Scaffold(
      backgroundColor: kBackground,
      body: SafeArea(
        child: Column(
          children: [
            const AppStatusBar(),
            BackHeader(title: 'Airtime to Cash', onBack: () => Navigator.pop(context)),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Network
                    const SectionLabel('Network'),
                    const SizedBox(height: 8),
                    Row(
                      children: kNetworks.asMap().entries.map((e) {
                        final i = e.key; final n = e.value;
                        final on = i == _netIdx;
                        return Expanded(
                          child: Padding(
                            padding: EdgeInsets.only(right: i < 3 ? 8 : 0),
                            child: GestureDetector(
                              onTap: () => setState(() => _netIdx = i),
                              child: AnimatedContainer(
                                duration: const Duration(milliseconds: 150),
                                padding: const EdgeInsets.symmetric(vertical: 12),
                                decoration: BoxDecoration(
                                  color: on ? n.bg : Colors.white,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: on ? n.dot : kCardBorder, width: 2),
                                ),
                                alignment: Alignment.center,
                                child: Text(n.name,
                                  style: dFont(size: 12, weight: FontWeight.w700,
                                    color: on ? n.text : kMutedText)),
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 20),
                    // Amount
                    const SectionLabel('Airtime Amount'),
                    const SizedBox(height: 8),
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
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
                                hintText: 'Minimum ₦100',
                                hintStyle: dFont(size: 16, color: const Color(0xFFB8C4D9)),
                                border: InputBorder.none,
                                contentPadding: const EdgeInsets.symmetric(horizontal: 8, vertical: 14),
                              ),
                              onChanged: (v) {
                                final clean = v.replaceAll(RegExp(r'[^0-9]'), '');
                                if (clean != v) _amountCtrl.value = _amountCtrl.value.copyWith(text: clean);
                                setState(() {});
                              },
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    // Conversion summary (animated)
                    AnimatedSwitcher(
                      duration: const Duration(milliseconds: 300),
                      child: showSummary
                          ? _ConversionSummary(num: _num, cash: _cash)
                          : const SizedBox.shrink(),
                    ),
                    if (showSummary) const SizedBox(height: 16),
                    // Instructions notice
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFEF3E2),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFFF6A623)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Before submitting:',
                            style: dFont(size: 12, weight: FontWeight.w700,
                              color: const Color(0xFFF6A623))),
                          const SizedBox(height: 4),
                          RichText(
                            text: TextSpan(
                              style: dFont(size: 12, color: kMediumText),
                              children: [
                                const TextSpan(text: 'Send airtime to '),
                                TextSpan(text: '08123456789',
                                  style: GoogleFonts.inter(fontWeight: FontWeight.w700, fontSize: 12, color: kPrimaryDark)),
                                const TextSpan(text: ' (MTN) or '),
                                TextSpan(text: '08012345678',
                                  style: GoogleFonts.inter(fontWeight: FontWeight.w700, fontSize: 12, color: kPrimaryDark)),
                                const TextSpan(text: ' (others), then enter the amount above.'),
                              ],
                            ),
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
              child: PrimaryBtn(
                label: 'Proceed',
                disabled: _num < 100,
                onPressed: _proceed,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ConversionSummary extends StatelessWidget {
  final int num;
  final int cash;
  const _ConversionSummary({required this.num, required this.cash});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: kCardBorder),
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SectionLabel('Conversion Summary'),
                const SizedBox(height: 12),
                _row('Airtime submitted', '₦${fmtNaira(num)}', kPrimaryDark),
                const SizedBox(height: 8),
                _row('Conversion fee (25%)', '-₦${fmtNaira(num - cash)}', kErrorRed),
                const SizedBox(height: 8),
                const Divider(color: kCardBorder),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Cash received',
                      style: dFont(size: 15, weight: FontWeight.w700)),
                    Text('₦${fmtNaira(cash)}',
                      style: dFont(size: 20, weight: FontWeight.w800, color: kAccentGreen)),
                  ],
                ),
              ],
            ),
          ),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            decoration: const BoxDecoration(
              color: Color(0xFFE6F9F4),
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(16),
                bottomRight: Radius.circular(16),
              ),
            ),
            child: Text(
              'Credited to your HananData wallet instantly',
              style: dFont(size: 12, weight: FontWeight.w500, color: kAccentGreen2),
            ),
          ),
        ],
      ),
    );
  }

  Widget _row(String label, String value, Color valColor) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: dFont(size: 14, color: kMutedText)),
        Text(value, style: dFont(size: 14, weight: FontWeight.w600, color: valColor)),
      ],
    );
  }
}
