// lib/screens/data_screen.dart
import 'package:flutter/material.dart';
import '../constants/app_data.dart';
import '../models/txn_data.dart';
import '../widgets/shared_widgets.dart';
import '../services/api_service.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../utils/phone_utils.dart';

class DataScreen extends StatefulWidget {
  const DataScreen({super.key});
  @override
  State<DataScreen> createState() => _DataScreenState();
}


class _DataScreenState extends State<DataScreen> {
  int _netIdx = 0;
  String? _selectedPlanId;
  String? _selectedDataType;
  final _phoneCtrl = TextEditingController();
  
  List<dynamic> _apiPlans = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _phoneCtrl.addListener(_onPhoneChanged);
    _loadUserPhone();
    _fetchPlans();
  }

  void _onPhoneChanged() {
    final detected = PhoneUtils.detectNetworkIndex(_phoneCtrl.text);
    if (detected != null && detected != _netIdx) {
      setState(() {
        _netIdx = detected;
        _selectedPlanId = null;
        _selectedDataType = null;
      });
    }
  }

  Future<void> _loadUserPhone() async {
    final prefs = await SharedPreferences.getInstance();
    final userStr = prefs.getString('userData');
    if (userStr != null) {
      final user = jsonDecode(userStr);
      if (user['phone'] != null) {
        setState(() {
          _phoneCtrl.text = PhoneUtils.normalizePhone(user['phone']);
        });
      }
    }
  }
  
  Future<void> _fetchPlans() async {
    setState(() => _loading = true);
    final res = await ApiService.getPricing('data');
    if (res['success'] == true && mounted) {
      setState(() {
        _apiPlans = res['data'];
        _loading = false;
      });
    } else if (mounted) {
      setState(() => _loading = false);
    }
  }

  @override
  void dispose() {
    _phoneCtrl.removeListener(_onPhoneChanged);
    _phoneCtrl.dispose();
    super.dispose();
  }

  NetworkInfo get _net => kNetworks[_netIdx];

  List<String> get _availableDataTypes {
    final netPlans = _apiPlans.where((p) => (p['network'] as String).toLowerCase() == _net.name.toLowerCase());
    return netPlans.map((p) => (p['planType'] as String?) ?? 'SME').toSet().toList();
  }

  List<dynamic> get _plans {
    if (_selectedDataType == null) return [];
    return _apiPlans.where((p) {
      final matchesNet = (p['network'] as String).toLowerCase() == _net.name.toLowerCase();
      final matchesType = ((p['planType'] as String?) ?? 'SME').toLowerCase() == _selectedDataType!.toLowerCase();
      return matchesNet && matchesType;
    }).toList();
  }

  void _onNetworkTap(int i) {
    setState(() {
      _netIdx = i;
      _selectedPlanId = null;
      _selectedDataType = null;
    });
  }

  void _proceed() {
    final plan = _plans.firstWhere((p) => p['_id'] == _selectedPlanId);
    final price = plan['userPrice'] ?? 0;
    final planName = plan['planName'] ?? 'Data Plan';
    final normalized = PhoneUtils.normalizePhone(_phoneCtrl.text);
    final txn = TxnData(
      type: 'Data Bundle',
      network: _net.name,
      networkColor: '#${(_net.color.toARGB32() & 0xFFFFFF).toRadixString(16).padLeft(6, '0').toUpperCase()}',
      recipient: normalized,
      plan: planName,
      planId: plan['planId'],
      amount: price,
      fee: 0,
      total: price,
      description: '${_net.name} $planName',
      refId: genRef(),
    );
    Navigator.pushNamed(context, '/confirm', arguments: txn);
  }

  @override
  Widget build(BuildContext context) {
    final normalized = PhoneUtils.normalizePhone(_phoneCtrl.text);
    final canProceed = _selectedPlanId != null && normalized.length == 11;

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: SafeArea(
        child: Column(
          children: [
            BackHeader(title: 'Buy Data', onBack: () => Navigator.pop(context)),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // ── 1. Phone ──────────────────────────────────────────
                    const SectionLabel('Phone Number'),
                    const SizedBox(height: 8),
                    _styledTextField(controller: _phoneCtrl, type: TextInputType.phone),
                    const SizedBox(height: 20),

                    // ── 2. Network (logo chips) ────────────────────────────
                    const SectionLabel('Network'),
                    const SizedBox(height: 10),
                    Row(
                      children: kNetworks.asMap().entries.map((e) {
                        final i = e.key; final n = e.value;
                        final on = i == _netIdx;
                        return Expanded(
                          child: Padding(
                            padding: EdgeInsets.only(right: i < kNetworks.length - 1 ? 10 : 0),
                            child: NetworkLogoChip(
                              letter: n.logoLetter,
                              label: n.name,
                              logoUrl: n.logoUrl,
                              brandColor: n.color,
                              bgColor: n.bg,
                              textColor: n.text,
                              selected: on,
                              onTap: () => _onNetworkTap(i),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 20),

                    // ── 3. Data Type Dropdown ──────────────────────────────
                    if (!_loading && _availableDataTypes.isNotEmpty) ...[
                      const SectionLabel('Data Type'),
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        decoration: BoxDecoration(
                          color: Theme.of(context).cardColor,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: Theme.of(context).dividerColor, width: 2),
                        ),
                        child: DropdownButtonHideUnderline(
                          child: DropdownButton<String>(
                            dropdownColor: Theme.of(context).cardColor,
                            value: _selectedDataType,
                            hint: Text('Select Data Type', style: dFont(size: 15, weight: FontWeight.w600, color: Theme.of(context).brightness == Brightness.dark ? Colors.white54 : kMutedText)),
                            isExpanded: true,
                            icon: Icon(Icons.keyboard_arrow_down, color: Theme.of(context).brightness == Brightness.dark ? Colors.white : kPrimaryDark),
                            items: _availableDataTypes.map((type) {
                              return DropdownMenuItem<String>(
                                value: type,
                                child: Text(type, style: dFont(size: 15, weight: FontWeight.w600, color: Theme.of(context).brightness == Brightness.dark ? Colors.white : kPrimaryDark)),
                              );
                            }).toList(),
                            onChanged: (val) {
                              setState(() {
                                _selectedDataType = val;
                                _selectedPlanId = null;
                              });
                            },
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                    ],

                    // ── 4. Plan cards ─────────────────────────────────────
                    if (_loading)
                      const Center(child: Padding(padding: EdgeInsets.all(20), child: BrandLoader())),
                    
                    if (!_loading && _selectedDataType != null && _plans.isNotEmpty) ...[
                      const SectionLabel('Available Plans'),
                      const SizedBox(height: 8),
                      ..._plans.map((p) {
                        final on = _selectedPlanId == p['_id'];
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 10),
                          child: GestureDetector(
                            onTap: () => setState(() => _selectedPlanId = p['_id']),
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 150),
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: Theme.of(context).cardColor,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color: on ? _net.color : kCardBorder, width: 2,
                                ),
                              ),
                              child: Row(
                                children: [
                                  AnimatedContainer(
                                    duration: const Duration(milliseconds: 150),
                                    width: 18, height: 18,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: on ? _net.color : Colors.transparent,
                                      border: Border.all(
                                        color: on ? _net.color : const Color(0xFFB8C4D9), width: 2,
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
                                        Text(p['planName'] ?? 'Unknown Plan',
                                            style: dFont(size: 15, weight: FontWeight.w700)),
                                      ],
                                    ),
                                  ),
                                  Text('₦${fmtNaira(p['userPrice'] ?? 0)}',
                                      style: dFont(size: 16, weight: FontWeight.w800, color: kPrimaryNavy)),
                                ],
                              ),
                            ),
                          ),
                        );
                      }),
                    ],

                    // Empty state
                    if (!_loading && _plans.isEmpty) ...[
                      const SizedBox(height: 20),
                      Center(
                        child: Text('No plans available for this network.',
                            style: dFont(size: 13, color: Theme.of(context).brightness == Brightness.dark ? Colors.white54 : kMutedText)),
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
                disabled: !canProceed,
                onPressed: _proceed,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _styledTextField({required TextEditingController controller, required TextInputType type}) {
    return TextField(
      controller: controller,
      keyboardType: type,
      style: dFont(size: 15, weight: FontWeight.w600),
      decoration: InputDecoration(
        filled: true, fillColor: Theme.of(context).cardColor,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(color: kCardBorder, width: 2)),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(color: kCardBorder, width: 2)),
        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(color: kPrimaryNavy, width: 2)),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),
    );
  }
}


