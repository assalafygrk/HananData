// lib/screens/exam_pin_screen.dart
import 'package:flutter/material.dart';
import '../constants/app_data.dart';
import '../models/txn_data.dart';
import '../services/api_service.dart';
import '../widgets/shared_widgets.dart';

class ExamPinScreen extends StatefulWidget {
  const ExamPinScreen({super.key});
  @override
  State<ExamPinScreen> createState() => _ExamPinScreenState();
}

class _ExamPinScreenState extends State<ExamPinScreen> {
  String _selectedBoard = 'WAEC';
  int _quantity = 1;
  bool _loading = true;
  List<dynamic> _pricingList = [];

  final List<Map<String, dynamic>> _examBoards = [
    {
      'id': 'WAEC',
      'name': 'WAEC Result Checker',
      'sub': 'West African Examinations Council',
      'icon': Icons.school_rounded,
      'color': const Color(0xFF00C896),
    },
    {
      'id': 'NECO',
      'name': 'NECO Result Checker',
      'sub': 'National Examinations Council',
      'icon': Icons.menu_book_rounded,
      'color': const Color(0xFF2952A3),
    },
  ];

  @override
  void initState() {
    super.initState();
    _fetchPricing();
  }

  Future<void> _fetchPricing() async {
    try {
      final res = await ApiService.getPricing('exam-pin');
      if (res['success'] == true && mounted) {
        setState(() {
          _pricingList = res['data'] ?? [];
          _loading = false;
        });
      } else {
        if (mounted) setState(() => _loading = false);
      }
    } catch (_) {
      if (mounted) setState(() => _loading = false);
    }
  }

  String _getEduCode(String board, int qty) {
    final prefix = board == 'WAEC' ? 'WA' : 'NE';
    final numbers = ['ONE', 'TWO', 'THR', 'FOUR', 'FIVE'];
    final idx = (qty - 1).clamp(0, 4);
    return '$prefix${numbers[idx]}';
  }

  int _getUnitPrice() {
    final singleCode = _getEduCode(_selectedBoard, 1);
    final item = _pricingList.firstWhere(
      (p) => p['category'] == 'exam-pin' && p['planId'] == singleCode,
      orElse: () => null,
    );
    if (item != null && item['userPrice'] != null) {
      return (item['userPrice'] as num).toInt();
    }
    // Fallbacks
    return _selectedBoard == 'WAEC' ? 3450 : 2150;
  }

  int _getTotalPrice() {
    final exactCode = _getEduCode(_selectedBoard, _quantity);
    final item = _pricingList.firstWhere(
      (p) => p['category'] == 'exam-pin' && p['planId'] == exactCode,
      orElse: () => null,
    );
    if (item != null && item['userPrice'] != null) {
      return (item['userPrice'] as num).toInt();
    }
    return _getUnitPrice() * _quantity;
  }

  void _proceed() {
    final eduCode = _getEduCode(_selectedBoard, _quantity);
    final total = _getTotalPrice();
    final unit = _getUnitPrice();

    final txn = TxnData(
      type: 'Exam PIN',
      provider: _selectedBoard,
      network: _selectedBoard,
      recipient: 'In-App Token Result',
      amount: total,
      fee: 0,
      total: total,
      description: '$_selectedBoard Result Checker ($_quantity PIN${_quantity > 1 ? "s" : ""})',
      plan: '$_quantity x ₦${fmtNaira(unit)}',
      planId: eduCode,
      refId: genRef(),
    );

    Navigator.pushNamed(context, '/confirm', arguments: txn);
  }

  @override
  Widget build(BuildContext context) {
    final unitPrice = _getUnitPrice();
    final totalPrice = _getTotalPrice();

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: SafeArea(
        child: Column(
          children: [
            BackHeader(title: 'Exam PIN Purchase', onBack: () => Navigator.pop(context)),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Header Card
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [kPrimaryDark, kPrimaryNavy],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.15),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.verified_outlined, color: Colors.white, size: 28),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Instant Result Checker PINs',
                                  style: dFont(size: 15, weight: FontWeight.w700, color: Colors.white),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  'Get official WAEC and NECO result tokens instantly.',
                                  style: dFont(size: 12, color: Colors.white70),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    // 1. Select Board
                    const SectionLabel('Select Exam Board'),
                    const SizedBox(height: 12),

                    Row(
                      children: _examBoards.map((board) {
                        final bool isSelected = _selectedBoard == board['id'];
                        final Color boardColor = board['color'] as Color;

                        return Expanded(
                          child: Padding(
                            padding: EdgeInsets.only(
                              right: board['id'] == 'WAEC' ? 8 : 0,
                              left: board['id'] == 'NECO' ? 8 : 0,
                            ),
                            child: GestureDetector(
                              onTap: () => setState(() => _selectedBoard = board['id'] as String),
                              child: AnimatedContainer(
                                duration: const Duration(milliseconds: 200),
                                padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 14),
                                decoration: BoxDecoration(
                                  color: isSelected
                                      ? boardColor.withValues(alpha: 0.08)
                                      : Colors.white,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(
                                    color: isSelected ? boardColor : kCardBorder,
                                    width: isSelected ? 2 : 1,
                                  ),
                                  boxShadow: isSelected
                                      ? [
                                          BoxShadow(
                                            color: boardColor.withValues(alpha: 0.15),
                                            blurRadius: 10,
                                            offset: const Offset(0, 4),
                                          ),
                                        ]
                                      : [],
                                ),
                                child: Column(
                                  children: [
                                    Icon(
                                      board['icon'] as IconData,
                                      color: isSelected ? boardColor : kMutedText,
                                      size: 32,
                                    ),
                                    const SizedBox(height: 10),
                                    Text(
                                      board['id'] as String,
                                      style: dFont(
                                        size: 16,
                                        weight: FontWeight.w800,
                                        color: isSelected ? boardColor : kPrimaryDark,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      '₦${fmtNaira(board['id'] == _selectedBoard ? unitPrice : (board['id'] == 'WAEC' ? 3450 : 2150))}/PIN',
                                      style: dFont(
                                        size: 12,
                                        weight: FontWeight.w600,
                                        color: kMutedText,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 24),

                    // 2. Select Quantity
                    const SectionLabel('Quantity (Number of PINs)'),
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
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '$_selectedBoard Tokens',
                                style: dFont(size: 15, weight: FontWeight.w700, color: kPrimaryDark),
                              ),
                              Text(
                                '₦${fmtNaira(unitPrice)} per token',
                                style: dFont(size: 12, color: kMutedText),
                              ),
                            ],
                          ),
                          Row(
                            children: [
                              IconButton(
                                onPressed: _quantity > 1
                                    ? () => setState(() => _quantity--)
                                    : null,
                                icon: const Icon(Icons.remove_circle_outline_rounded),
                                color: _quantity > 1 ? kPrimaryBlue : kMutedText,
                                iconSize: 28,
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                                decoration: BoxDecoration(
                                  color: kBackground,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  '$_quantity',
                                  style: dFont(size: 18, weight: FontWeight.w800, color: kPrimaryDark),
                                ),
                              ),
                              IconButton(
                                onPressed: _quantity < 5
                                    ? () => setState(() => _quantity++)
                                    : null,
                                icon: const Icon(Icons.add_circle_outline_rounded),
                                color: _quantity < 5 ? kPrimaryBlue : kMutedText,
                                iconSize: 28,
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Pricing summary card
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: kPrimaryNavy.withValues(alpha: 0.05),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: kPrimaryNavy.withValues(alpha: 0.12)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Total Payable', style: dFont(size: 13, color: kMutedText)),
                              const SizedBox(height: 2),
                              Text(
                                '₦${fmtNaira(totalPrice)}',
                                style: dFont(size: 22, weight: FontWeight.w800, color: kPrimaryNavy),
                              ),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              color: kAccentGreen.withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              'Instant Delivery',
                              style: dFont(size: 12, weight: FontWeight.w700, color: kAccentGreen),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Submit Button
            Padding(
              padding: const EdgeInsets.all(20),
              child: PrimaryBtn(
                label: _loading ? 'Loading Prices...' : 'Proceed to Payment',
                disabled: _loading,
                onPressed: _proceed,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
