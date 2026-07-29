import 'package:flutter/material.dart';
import '../widgets/shared_widgets.dart';

class ExamPinScreen extends StatefulWidget {
  const ExamPinScreen({super.key});
  @override
  State<ExamPinScreen> createState() => _ExamPinScreenState();
}

class _ExamPinScreenState extends State<ExamPinScreen> {
  String? _selectedExam;
  int _quantity = 1;
  final Map<String, int> _examPrices = {
    'WAEC': 3500,
    'NECO': 1200,
    'NABTEB': 1000,
    'JAMB': 6200,
  };

  @override
  Widget build(BuildContext context) {
    final int amount = (_examPrices[_selectedExam] ?? 0) * _quantity;
    final bool isValid = _selectedExam != null && _quantity > 0;

    return Scaffold(
      backgroundColor: kBackground,
      body: SafeArea(
        child: Column(
          children: [
            BackHeader(title: 'Exam PIN', onBack: () => Navigator.pop(context)),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SectionLabel('Select Exam Board'),
                    const SizedBox(height: 12),
                    ..._examPrices.keys.map((exam) {
                      final bool isSelected = _selectedExam == exam;
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: GestureDetector(
                          onTap: () => setState(() => _selectedExam = exam),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: isSelected ? const Color(0xFFF5F0FF) : Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: isSelected ? const Color(0xFF7B2FBE) : kCardBorder,
                                width: isSelected ? 2 : 1,
                              ),
                            ),
                            child: Row(
                              children: [
                                Container(
                                  width: 44, height: 44,
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF7B2FBE).withValues(alpha: 0.1),
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(Icons.school_rounded, color: Color(0xFF7B2FBE), size: 24),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text('$exam Result Checker', style: dFont(size: 15, weight: FontWeight.w700, color: kPrimaryDark)),
                                      Text('₦${_examPrices[exam]}/PIN', style: dFont(size: 13, color: kMutedText)),
                                    ],
                                  ),
                                ),
                                if (isSelected)
                                  const Icon(Icons.check_circle_rounded, color: Color(0xFF7B2FBE), size: 24)
                                else
                                  Icon(Icons.radio_button_unchecked_rounded, color: kCardBorder, size: 24),
                              ],
                            ),
                          ),
                        ),
                      );
                    }),
                    
                    if (_selectedExam != null) ...[
                      const SizedBox(height: 24),
                      const SectionLabel('Quantity'),
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: kCardBorder),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('Number of PINs', style: dFont(size: 14, weight: FontWeight.w600, color: kPrimaryDark)),
                            Row(
                              children: [
                                GestureDetector(
                                  onTap: () {
                                    if (_quantity > 1) setState(() => _quantity--);
                                  },
                                  child: Container(
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(color: const Color(0xFFF0F4FA), borderRadius: BorderRadius.circular(8)),
                                    child: const Icon(Icons.remove, size: 16, color: kPrimaryDark),
                                  ),
                                ),
                                Padding(
                                  padding: const EdgeInsets.symmetric(horizontal: 20),
                                  child: Text('$_quantity', style: dFont(size: 18, weight: FontWeight.w700)),
                                ),
                                GestureDetector(
                                  onTap: () => setState(() => _quantity++),
                                  child: Container(
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(color: const Color(0xFFF0F4FA), borderRadius: BorderRadius.circular(8)),
                                    child: const Icon(Icons.add, size: 16, color: kPrimaryDark),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(color: const Color(0xFFF5F0FF), borderRadius: BorderRadius.circular(16)),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('Total Amount', style: dFont(size: 14, color: kMutedText)),
                            Text('₦$amount', style: dFont(size: 18, weight: FontWeight.w800, color: const Color(0xFF7B2FBE))),
                          ],
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: PrimaryBtn(
                label: 'Purchase PIN',
                disabled: !isValid,
                onPressed: () {
                  Navigator.pushNamed(context, '/confirm', arguments: {
                    'title': 'Exam PIN Purchase',
                    'details': [
                      {'label': 'Exam Board', 'value': _selectedExam},
                      {'label': 'Quantity', 'value': '$_quantity'},
                      {'label': 'Total Amount', 'value': '₦$amount'},
                    ],
                    'amount': amount,
                  });
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
