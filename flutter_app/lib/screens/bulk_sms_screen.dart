import 'package:flutter/material.dart';
import '../widgets/shared_widgets.dart';

class BulkSmsScreen extends StatefulWidget {
  const BulkSmsScreen({super.key});
  @override
  State<BulkSmsScreen> createState() => _BulkSmsScreenState();
}

class _BulkSmsScreenState extends State<BulkSmsScreen> {
  final TextEditingController _senderIdCtrl = TextEditingController();
  final TextEditingController _numbersCtrl = TextEditingController();
  final TextEditingController _messageCtrl = TextEditingController();
  final int _smsCostPerPage = 3;

  @override
  void initState() {
    super.initState();
    _numbersCtrl.addListener(() => setState(() {}));
    _messageCtrl.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _senderIdCtrl.dispose();
    _numbersCtrl.dispose();
    _messageCtrl.dispose();
    super.dispose();
  }

  int get _recipientCount {
    if (_numbersCtrl.text.trim().isEmpty) return 0;
    return _numbersCtrl.text.split(RegExp(r'[,\n]+')).where((s) => s.trim().isNotEmpty).length;
  }

  int get _pageCount {
    final len = _messageCtrl.text.length;
    if (len == 0) return 0;
    return (len / 160).ceil(); // standard 160 chars per SMS page
  }

  int get _totalAmount {
    return _recipientCount * _pageCount * _smsCostPerPage;
  }

  @override
  Widget build(BuildContext context) {
    final bool isValid = _senderIdCtrl.text.isNotEmpty && _recipientCount > 0 && _pageCount > 0;

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: SafeArea(
        child: Column(
          children: [
            BackHeader(title: 'Bulk SMS', onBack: () => Navigator.pop(context)),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SectionLabel('Sender ID'),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: kCardBorder),
                      ),
                      child: TextField(
                        controller: _senderIdCtrl,
                        maxLength: 11,
                        style: dFont(size: 15, weight: FontWeight.w600),
                        decoration: InputDecoration(
                          hintText: 'e.g. HANAN DATA (Max 11 chars)',
                          hintStyle: dFont(size: 14, color: kMutedText),
                          border: InputBorder.none,
                          counterText: '',
                        ),
                        onChanged: (_) => setState(() {}),
                      ),
                    ),
                    const SizedBox(height: 24),

                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const SectionLabel('Recipients'),
                        Text('$_recipientCount Numbers', style: dFont(size: 13, weight: FontWeight.w700, color: kPrimaryNavy)),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: kCardBorder),
                      ),
                      child: TextField(
                        controller: _numbersCtrl,
                        maxLines: 4,
                        style: dFont(size: 14),
                        decoration: InputDecoration(
                          hintText: 'Enter phone numbers separated by comma or new line.\ne.g. 08012345678, 08087654321',
                          hintStyle: dFont(size: 14, color: kMutedText),
                          border: InputBorder.none,
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),

                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const SectionLabel('Message'),
                        Text('$_pageCount Page(s) | ${_messageCtrl.text.length} chars', style: dFont(size: 13, color: kMutedText)),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: kCardBorder),
                      ),
                      child: TextField(
                        controller: _messageCtrl,
                        maxLines: 6,
                        style: dFont(size: 14),
                        decoration: InputDecoration(
                          hintText: 'Type your message here...',
                          hintStyle: dFont(size: 14, color: kMutedText),
                          border: InputBorder.none,
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text('Cost: ₦$_smsCostPerPage per page per number.', style: dFont(size: 12, color: kMutedText)),
                    
                    const SizedBox(height: 32),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(color: const Color(0xFFF5F0FF), borderRadius: BorderRadius.circular(16)),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Total Cost', style: dFont(size: 14, color: kMutedText)),
                          Text('₦$_totalAmount', style: dFont(size: 18, weight: FontWeight.w800, color: const Color(0xFF7B2FBE))),
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
                label: 'Send SMS',
                disabled: !isValid,
                onPressed: () {
                  Navigator.pushNamed(context, '/confirm', arguments: {
                    'title': 'Bulk SMS',
                    'details': [
                      {'label': 'Sender ID', 'value': _senderIdCtrl.text},
                      {'label': 'Recipients', 'value': '$_recipientCount Numbers'},
                      {'label': 'Pages per SMS', 'value': '$_pageCount Pages'},
                      {'label': 'Total Cost', 'value': '₦$_totalAmount'},
                    ],
                    'amount': _totalAmount,
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
