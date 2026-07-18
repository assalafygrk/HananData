// lib/screens/airtime_screen.dart
import 'package:flutter/material.dart';
import '../constants/app_data.dart';
import '../models/txn_data.dart';
import '../widgets/shared_widgets.dart';

class AirtimeScreen extends StatefulWidget {
  const AirtimeScreen({super.key});
  @override
  State<AirtimeScreen> createState() => _AirtimeScreenState();
}

class _AirtimeScreenState extends State<AirtimeScreen> {
  int _netIdx = 0;
  final _phoneCtrl = TextEditingController(text: '08012345678');
  final _amountCtrl = TextEditingController();
  String _quickAmt = '';

  final _quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  NetworkInfo get _net => kNetworks[_netIdx];

  @override
  void dispose() {
    _phoneCtrl.dispose();
    _amountCtrl.dispose();
    super.dispose();
  }

  void _proceed() {
    final amt = int.tryParse(_amountCtrl.text) ?? 0;
    final txn = TxnData(
      type: 'Airtime',
      network: _net.name,
      networkColor: '#${(_net.color.toARGB32() & 0xFFFFFF).toRadixString(16).padLeft(6, '0').toUpperCase()}',
      recipient: '+234${_phoneCtrl.text.substring(1)}',
      amount: amt,
      fee: 0,
      total: amt,
      description: '${_net.name} ₦${fmtNaira(amt)} Airtime',
      refId: genRef(),
    );
    Navigator.pushNamed(context, '/confirm', arguments: txn);
  }

  bool get _canProceed {
    final amt = int.tryParse(_amountCtrl.text) ?? 0;
    return amt >= 50 && _phoneCtrl.text.length >= 10;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBackground,
      body: SafeArea(
        child: Column(
          children: [
            const AppStatusBar(),
            BackHeader(title: 'Buy Airtime', onBack: () => Navigator.pop(context)),
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
                    // Phone
                    const SectionLabel('Phone Number'),
                    const SizedBox(height: 8),
                    _styledTextField(controller: _phoneCtrl, type: TextInputType.phone),
                    const SizedBox(height: 20),
                    // Amount
                    const SectionLabel('Amount'),
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
                    const SizedBox(height: 12),
                    // Quick amounts 3x2
                    const SectionLabel('Quick Select'),
                    const SizedBox(height: 8),
                    GridView.count(
                      crossAxisCount: 3,
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      mainAxisSpacing: 8,
                      crossAxisSpacing: 8,
                      childAspectRatio: 2.6,
                      children: _quickAmounts.map((a) {
                        final on = _quickAmt == a.toString();
                        return GestureDetector(
                          onTap: () {
                            setState(() { _quickAmt = a.toString(); });
                            _amountCtrl.text = a.toString();
                          },
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 150),
                            decoration: BoxDecoration(
                              color: on ? const Color(0xFFE8EDF5) : Colors.white,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: on ? kPrimaryNavy : kCardBorder),
                            ),
                            alignment: Alignment.center,
                            child: Text('₦${fmtNaira(a)}',
                              style: dFont(size: 13, weight: FontWeight.w700,
                                color: on ? kPrimaryNavy : kMediumText)),
                          ),
                        );
                      }).toList(),
                    ),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: PrimaryBtn(
                label: 'Proceed',
                disabled: !_canProceed,
                onPressed: _proceed,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _styledTextField({
    required TextEditingController controller,
    required TextInputType type,
  }) {
    return TextField(
      controller: controller,
      keyboardType: type,
      style: dFont(size: 15, weight: FontWeight.w600),
      decoration: InputDecoration(
        filled: true, fillColor: Colors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: kCardBorder, width: 2),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: kCardBorder, width: 2),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: kPrimaryNavy, width: 2),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),
      onChanged: (_) => setState(() {}),
    );
  }
}
