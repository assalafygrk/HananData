// lib/screens/electricity_screen.dart
import 'package:flutter/material.dart';
import '../constants/app_data.dart';
import '../models/txn_data.dart';
import '../widgets/shared_widgets.dart';

class ElectricityScreen extends StatefulWidget {
  const ElectricityScreen({super.key});
  @override
  State<ElectricityScreen> createState() => _ElectricityScreenState();
}

class _ElectricityScreenState extends State<ElectricityScreen> {
  int _discoIdx = 0;
  String _meterType = 'prepaid';
  final _meterCtrl  = TextEditingController(text: '12345678901');
  final _amountCtrl = TextEditingController();
  String _quickAmt  = '';

  final _quickAmounts = [1000, 2000, 5000, 10000];

  @override
  void dispose() {
    _meterCtrl.dispose();
    _amountCtrl.dispose();
    super.dispose();
  }

  bool get _canProceed {
    final amt = int.tryParse(_amountCtrl.text) ?? 0;
    return amt >= 500 && _meterCtrl.text.length >= 10;
  }

  void _proceed() {
    final amt = int.tryParse(_amountCtrl.text) ?? 0;
    final disco = kDiscos[_discoIdx];
    final txn = TxnData(
      type: 'Electricity',
      provider: disco,
      recipient: _meterType == 'prepaid'
          ? 'Prepaid · ${_meterCtrl.text}'
          : 'Postpaid · ${_meterCtrl.text}',
      meterNumber: _meterCtrl.text,
      amount: amt,
      fee: 100,
      total: amt + 100,
      description: disco.split(' (')[0],
      plan: '${_meterType[0].toUpperCase()}${_meterType.substring(1)} · Meter ${_meterCtrl.text}',
      refId: genRef(),
    );
    Navigator.pushNamed(context, '/confirm', arguments: txn);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBackground,
      body: SafeArea(
        child: Column(
          children: [
            const AppStatusBar(),
            BackHeader(title: 'Electricity', onBack: () => Navigator.pop(context)),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Meter type
                    const SectionLabel('Meter Type'),
                    const SizedBox(height: 8),
                    PillSegment(
                      options: const ['prepaid', 'postpaid'],
                      selected: _meterType,
                      onSelect: (v) => setState(() => _meterType = v),
                    ),
                    const SizedBox(height: 20),
                    // Disco selector
                    const SectionLabel('Distribution Company'),
                    const SizedBox(height: 8),
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: kCardBorder, width: 2),
                      ),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<int>(
                          value: _discoIdx,
                          isExpanded: true,
                          icon: const Padding(
                            padding: EdgeInsets.only(right: 12),
                            child: Icon(Icons.keyboard_arrow_down_rounded, color: kMutedText),
                          ),
                          style: dFont(size: 14, color: kPrimaryDark),
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          borderRadius: BorderRadius.circular(16),
                          items: kDiscos.asMap().entries.map((e) =>
                            DropdownMenuItem(
                              value: e.key,
                              child: Text(e.value, style: dFont(size: 14)),
                            ),
                          ).toList(),
                          onChanged: (v) => setState(() => _discoIdx = v!),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    // Meter number
                    const SectionLabel('Meter Number'),
                    const SizedBox(height: 8),
                    TextField(
                      controller: _meterCtrl,
                      keyboardType: TextInputType.number,
                      maxLength: 13,
                      style: dFont(size: 15, weight: FontWeight.w600),
                      decoration: InputDecoration(
                        hintText: 'Enter 11-digit meter number',
                        hintStyle: dFont(size: 14, color: const Color(0xFFB8C4D9)),
                        filled: true, fillColor: Colors.white,
                        counterText: '',
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
                    ),
                    const SizedBox(height: 20),
                    // Amount
                    const SectionLabel('Amount (₦)'),
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
                                  color: on ? const Color(0xFFE8EDF5) : Colors.white,
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
                    const SizedBox(height: 16),
                    // Fee notice
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: const Color(0xFFE6F9F4),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: kAccentGreen),
                      ),
                      child: Text(
                        'Service fee: ₦100 · Token delivered instantly to meter',
                        style: dFont(size: 12, weight: FontWeight.w500, color: kAccentGreen2),
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
                disabled: !_canProceed,
                onPressed: _proceed,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
