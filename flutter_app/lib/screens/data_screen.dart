// lib/screens/data_screen.dart
import 'package:flutter/material.dart';
import '../constants/app_data.dart';
import '../models/txn_data.dart';
import '../widgets/shared_widgets.dart';

class DataScreen extends StatefulWidget {
  const DataScreen({super.key});
  @override
  State<DataScreen> createState() => _DataScreenState();
}

class _DataScreenState extends State<DataScreen> {
  int _netIdx = 0;
  String? _dataTypeId;        // selected data type
  String _validity = 'monthly';
  String? _selectedPlanId;
  final _phoneCtrl = TextEditingController(text: '08012345678');

  @override
  void dispose() {
    _phoneCtrl.dispose();
    super.dispose();
  }

  NetworkInfo get _net => kNetworks[_netIdx];

  List<DataType> get _dataTypes => kDataTypes[_net.id] ?? [];

  String get _planKey => '${_net.id}-${_dataTypeId ?? ''}';

  Map<String, List<DataPlan>> get _plansByValidity =>
      kNetworkDataPlans[_planKey] ?? {};

  List<DataPlan> get _plans => _plansByValidity[_validity] ?? [];

  List<String> get _availableValidities => _plansByValidity.keys.toList();

  void _onNetworkTap(int i) {
    setState(() {
      _netIdx = i;
      _dataTypeId = null;
      _selectedPlanId = null;
    });
  }

  void _onDataTypeTap(String id) {
    setState(() {
      _dataTypeId = id;
      _selectedPlanId = null;
      // Set default validity to first available
      final avail = (kNetworkDataPlans['${_net.id}-$id'] ?? {}).keys.toList();
      _validity = avail.contains('monthly') ? 'monthly' : (avail.isNotEmpty ? avail.first : 'monthly');
    });
  }

  void _proceed() {
    final plan = _plans.firstWhere((p) => p.id == _selectedPlanId);
    final txn = TxnData(
      type: 'Data Bundle',
      network: _net.name,
      networkColor: '#${(_net.color.toARGB32() & 0xFFFFFF).toRadixString(16).padLeft(6, '0').toUpperCase()}',
      recipient: '+234${_phoneCtrl.text.substring(1)}',
      plan: '${plan.size} · ${plan.validity}',
      amount: plan.price,
      fee: 0,
      total: plan.price,
      description: '${_net.name} ${plan.size} Data',
      refId: genRef(),
    );
    Navigator.pushNamed(context, '/confirm', arguments: txn);
  }

  @override
  Widget build(BuildContext context) {
    final canProceed = _selectedPlanId != null;

    return Scaffold(
      backgroundColor: kBackground,
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

                    // ── 3. Data Type dropdown (only show after network selected) ──
                    const SectionLabel('Data Type'),
                    const SizedBox(height: 8),
                    _DataTypeDropdown(
                      types: _dataTypes,
                      selectedId: _dataTypeId,
                      brandColor: _net.color,
                      onSelect: _onDataTypeTap,
                    ),

                    // ── 4. Plan Type tabs (only after data type chosen) ───
                    if (_dataTypeId != null && _availableValidities.isNotEmpty) ...[
                      const SizedBox(height: 20),
                      const SectionLabel('Plan Type'),
                      const SizedBox(height: 8),
                      PillSegment(
                        options: _availableValidities,
                        selected: _validity,
                        onSelect: (v) => setState(() {
                          _validity = v;
                          _selectedPlanId = null;
                        }),
                      ),
                    ],

                    // ── 5. Plan cards ─────────────────────────────────────
                    if (_dataTypeId != null && _plans.isNotEmpty) ...[
                      const SizedBox(height: 16),
                      ..._plans.map((p) {
                        final on = _selectedPlanId == p.id;
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 10),
                          child: GestureDetector(
                            onTap: () => setState(() => _selectedPlanId = p.id),
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 150),
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: Colors.white,
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
                                        Text(p.size,
                                            style: dFont(size: 15, weight: FontWeight.w700)),
                                        Text(p.validity,
                                            style: dFont(size: 12, color: kMutedText)),
                                      ],
                                    ),
                                  ),
                                  Text('₦${fmtNaira(p.price)}',
                                      style: dFont(size: 16, weight: FontWeight.w800, color: kPrimaryNavy)),
                                ],
                              ),
                            ),
                          ),
                        );
                      }),
                    ],

                    // Empty state when data type selected but no plans
                    if (_dataTypeId != null && _plans.isEmpty) ...[
                      const SizedBox(height: 20),
                      Center(
                        child: Text('No plans available for this selection.',
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
        filled: true, fillColor: Colors.white,
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

// ─── Data Type Dropdown ───────────────────────────────────────────────────────

class _DataTypeDropdown extends StatelessWidget {
  final List<DataType> types;
  final String? selectedId;
  final Color brandColor;
  final ValueChanged<String> onSelect;

  const _DataTypeDropdown({
    required this.types,
    required this.selectedId,
    required this.brandColor,
    required this.onSelect,
  });

  @override
  Widget build(BuildContext context) {
    final selected = types.firstWhere(
      (t) => t.id == selectedId,
      orElse: () => const DataType(id: '', name: 'Select data type', description: ''),
    );

    return GestureDetector(
      onTap: () => _showPicker(context),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: selectedId != null ? brandColor : kCardBorder, width: 2,
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 34, height: 34,
              decoration: BoxDecoration(
                color: selectedId != null ? brandColor.withValues(alpha: 0.12) : kBackground,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(
                Icons.data_usage_rounded,
                color: selectedId != null ? brandColor : kMutedText, size: 18,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    selected.name,
                    style: dFont(
                      size: 14,
                      weight: FontWeight.w600,
                      color: selectedId != null ? kPrimaryDark : kMutedText,
                    ),
                  ),
                  if (selectedId != null && selected.description.isNotEmpty)
                    Text(selected.description,
                        style: dFont(size: 11, color: kMutedText)),
                ],
              ),
            ),
            Icon(Icons.keyboard_arrow_down_rounded,
                color: selectedId != null ? brandColor : kMutedText, size: 22),
          ],
        ),
      ),
    );
  }

  void _showPicker(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => Container(
        margin: const EdgeInsets.only(top: 60),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              margin: const EdgeInsets.only(top: 12),
              width: 40, height: 4,
              decoration: BoxDecoration(color: kCardBorder, borderRadius: BorderRadius.circular(2)),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
              child: Text('Select Data Type',
                  style: dFont(size: 18, weight: FontWeight.w800)),
            ),
            ...types.map((t) {
              final on = t.id == selectedId;
              return ListTile(
                onTap: () {
                  Navigator.pop(context);
                  onSelect(t.id);
                },
                leading: Container(
                  width: 40, height: 40,
                  decoration: BoxDecoration(
                    color: on ? brandColor.withValues(alpha: 0.12) : kBackground,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(Icons.data_usage_rounded,
                      color: on ? brandColor : kMutedText, size: 20),
                ),
                title: Text(t.name,
                    style: dFont(size: 14, weight: FontWeight.w700,
                        color: on ? brandColor : kPrimaryDark)),
                subtitle: Text(t.description,
                    style: dFont(size: 12, color: kMutedText)),
                trailing: on
                    ? Icon(Icons.check_circle_rounded, color: brandColor, size: 20)
                    : null,
              );
            }),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}
