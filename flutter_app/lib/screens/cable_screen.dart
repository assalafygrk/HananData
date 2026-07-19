// lib/screens/cable_screen.dart
import 'package:flutter/material.dart';
import '../constants/app_data.dart';
import '../models/txn_data.dart';
import '../widgets/shared_widgets.dart';

class CableScreen extends StatefulWidget {
  const CableScreen({super.key});
  @override
  State<CableScreen> createState() => _CableScreenState();
}

class _CableScreenState extends State<CableScreen> {
  int _provIdx = 0;
  final _smartcardCtrl = TextEditingController(text: '0123456789');
  String? _selectedId;

  CableProvider get _prov => kCableProviders[_provIdx];
  List<CablePackage> get _packages => kCablePackages[_prov.id]!;

  @override
  void dispose() {
    _smartcardCtrl.dispose();
    super.dispose();
  }

  void _proceed() {
    final pkg = _packages.firstWhere((p) => p.id == _selectedId);
    final txn = TxnData(
      type: 'Cable TV',
      provider: _prov.name,
      recipient: 'Smartcard: ${_smartcardCtrl.text}',
      amount: pkg.price,
      fee: 0,
      total: pkg.price,
      description: '${_prov.name} ${pkg.name}',
      plan: '${pkg.name} · ${pkg.channels}',
      refId: genRef(),
    );
    Navigator.pushNamed(context, '/confirm', arguments: txn);
  }

  bool get _canProceed => _selectedId != null && _smartcardCtrl.text.length >= 8;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBackground,
      body: SafeArea(
        child: Column(
          children: [
            BackHeader(title: 'Cable TV', onBack: () => Navigator.pop(context)),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Provider — rounded logo chips
                    const SectionLabel('Provider'),
                    const SizedBox(height: 10),
                    Row(
                      children: kCableProviders.asMap().entries.map((e) {
                        final i = e.key; final p = e.value;
                        final on = i == _provIdx;
                        return Expanded(
                          child: Padding(
                            padding: EdgeInsets.only(right: i < kCableProviders.length - 1 ? 10 : 0),
                            child: NetworkLogoChip(
                              letter: p.logoLetter,
                              label: p.name,
                              brandColor: p.color,
                              bgColor: p.bg,
                              textColor: p.color,
                              selected: on,
                              onTap: () => setState(() { _provIdx = i; _selectedId = null; }),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 20),
                    // Smartcard
                    const SectionLabel('Smartcard / IUC Number'),
                    const SizedBox(height: 8),
                    TextField(
                      controller: _smartcardCtrl,
                      keyboardType: TextInputType.number,
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
                    ),
                    const SizedBox(height: 20),
                    // Packages
                    const SectionLabel('Select Package'),
                    const SizedBox(height: 8),
                    ..._packages.map((pkg) {
                      final on = _selectedId == pkg.id;
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 10),
                        child: GestureDetector(
                          onTap: () => setState(() => _selectedId = pkg.id),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 150),
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: on ? _prov.color : kCardBorder, width: 2,
                              ),
                            ),
                            child: Row(
                              children: [
                                AnimatedContainer(
                                  duration: const Duration(milliseconds: 150),
                                  width: 18, height: 18,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: on ? _prov.color : Colors.transparent,
                                    border: Border.all(
                                      color: on ? _prov.color : const Color(0xFFB8C4D9), width: 2,
                                    ),
                                  ),
                                  child: on
                                    ? const Icon(Icons.check, color: Colors.white, size: 10)
                                    : null,
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(pkg.name,
                                        style: dFont(size: 14, weight: FontWeight.w700)),
                                      Text(pkg.channels,
                                        style: dFont(size: 12, color: kMutedText)),
                                    ],
                                  ),
                                ),
                                Text('₦${fmtNaira(pkg.price)}',
                                  style: dFont(size: 15, weight: FontWeight.w800, color: kPrimaryNavy)),
                              ],
                            ),
                          ),
                        ),
                      );
                    }),
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
