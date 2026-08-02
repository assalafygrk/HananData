// lib/screens/cable_screen.dart
import 'package:flutter/material.dart';
import '../constants/app_data.dart';
import '../models/txn_data.dart';
import '../widgets/shared_widgets.dart';
import '../services/api_service.dart';
import '../utils/phone_utils.dart';

class CableScreen extends StatefulWidget {
  const CableScreen({super.key});
  @override
  State<CableScreen> createState() => _CableScreenState();
}


class _CableScreenState extends State<CableScreen> {
  int _provIdx = 0;
  final _smartcardCtrl = TextEditingController();
  String? _selectedId;
  
  List<dynamic> _apiPlans = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _smartcardCtrl.addListener(_onSmartcardChanged);
    _fetchPlans();
  }

  void _onSmartcardChanged() {
    final detected = PhoneUtils.detectCableProviderIndex(_smartcardCtrl.text);
    if (detected != null && detected != _provIdx) {
      setState(() {
        _provIdx = detected;
        _selectedId = null;
      });
    }
  }
  
  Future<void> _fetchPlans() async {
    setState(() => _loading = true);
    final res = await ApiService.getPricing('cable');
    if (res['success'] == true && mounted) {
      setState(() {
        _apiPlans = res['data'];
        _loading = false;
      });
    } else if (mounted) {
      setState(() => _loading = false);
    }
  }

  CableProvider get _prov => kCableProviders[_provIdx];
  List<dynamic> get _packages => _apiPlans.where((p) => (p['network'] as String).toLowerCase() == _prov.name.toLowerCase()).toList();

  @override
  void dispose() {
    _smartcardCtrl.removeListener(_onSmartcardChanged);
    _smartcardCtrl.dispose();
    super.dispose();
  }

  void _proceed() {
    final pkg = _packages.firstWhere((p) => p['_id'] == _selectedId);
    final price = pkg['userPrice'] ?? 0;
    final planName = pkg['planName'] ?? 'Cable Plan';
    final txn = TxnData(
      type: 'Cable TV',
      provider: _prov.name,
      recipient: 'Smartcard: ${_smartcardCtrl.text}',
      amount: price,
      fee: 0,
      total: price,
      description: '${_prov.name} $planName',
      plan: planName,
      planId: pkg['planId'],
      refId: genRef(),
    );
    Navigator.pushNamed(context, '/confirm', arguments: txn);
  }

  bool get _canProceed => _selectedId != null && _smartcardCtrl.text.length >= 8;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
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
                              logoUrl: p.logoUrl,
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
                    if (_loading)
                      const Center(child: Padding(padding: EdgeInsets.all(20), child: BrandLoader())),
                    
                    if (!_loading && _packages.isNotEmpty) ...[
                      const SectionLabel('Select Package'),
                      const SizedBox(height: 8),
                      ..._packages.map((pkg) {
                        final on = _selectedId == pkg['_id'];
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 10),
                          child: GestureDetector(
                            onTap: () => setState(() => _selectedId = pkg['_id']),
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
                                        Text(pkg['planName'] ?? 'Unknown Package',
                                          style: dFont(size: 14, weight: FontWeight.w700)),
                                      ],
                                    ),
                                  ),
                                  Text('₦${fmtNaira(pkg['userPrice'] ?? 0)}',
                                    style: dFont(size: 15, weight: FontWeight.w800, color: kPrimaryNavy)),
                                ],
                              ),
                            ),
                          ),
                        );
                      }),
                    ],

                    if (!_loading && _packages.isEmpty) ...[
                      const SizedBox(height: 20),
                      Center(
                        child: Text('No packages available for this provider.',
                            style: dFont(size: 13, color: kMutedText)),
                      ),
                    ],
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
