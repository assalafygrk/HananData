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
  String _validity = 'monthly';
  String? _selectedId;
  final _phoneCtrl = TextEditingController(text: '08012345678');

  @override
  void dispose() {
    _phoneCtrl.dispose();
    super.dispose();
  }

  List<DataPlan> get _plans => kDataPlans[_validity]!;
  NetworkInfo get _net => kNetworks[_netIdx];

  void _proceed() {
    final plan = _plans.firstWhere((p) => p.id == _selectedId);
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
    return Scaffold(
      backgroundColor: kBackground,
      body: SafeArea(
        child: Column(
          children: [
            const AppStatusBar(),
            BackHeader(title: 'Buy Data', onBack: () => Navigator.pop(context)),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Phone
                    const SectionLabel('Phone Number'),
                    const SizedBox(height: 8),
                    _textField(controller: _phoneCtrl),
                    const SizedBox(height: 20),
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
                              onTap: () => setState(() { _netIdx = i; _selectedId = null; }),
                              child: AnimatedContainer(
                                duration: const Duration(milliseconds: 150),
                                padding: const EdgeInsets.symmetric(vertical: 12),
                                decoration: BoxDecoration(
                                  color: on ? n.bg : Colors.white,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(
                                    color: on ? n.dot : kCardBorder, width: 2,
                                  ),
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
                    // Plan type
                    const SectionLabel('Plan Type'),
                    const SizedBox(height: 8),
                    PillSegment(
                      options: const ['daily', 'weekly', 'monthly'],
                      selected: _validity,
                      onSelect: (v) => setState(() { _validity = v; _selectedId = null; }),
                    ),
                    const SizedBox(height: 16),
                    // Plans
                    ..._plans.map((p) {
                      final on = _selectedId == p.id;
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 10),
                        child: GestureDetector(
                          onTap: () => setState(() => _selectedId = p.id),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 150),
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: on ? kPrimaryNavy : kCardBorder, width: 2,
                              ),
                            ),
                            child: Row(
                              children: [
                                AnimatedContainer(
                                  duration: const Duration(milliseconds: 150),
                                  width: 18, height: 18,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: on ? kPrimaryNavy : Colors.transparent,
                                    border: Border.all(
                                      color: on ? kPrimaryNavy : const Color(0xFFB8C4D9), width: 2,
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
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: PrimaryBtn(
                label: 'Proceed',
                disabled: _selectedId == null,
                onPressed: _proceed,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _textField({required TextEditingController controller}) {
    return TextField(
      controller: controller,
      keyboardType: TextInputType.phone,
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
    );
  }
}
