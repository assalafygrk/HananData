// lib/screens/airtime_cash_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_data.dart';
import '../models/txn_data.dart';
import '../widgets/shared_widgets.dart';

class AirtimeCashScreen extends StatefulWidget {
  const AirtimeCashScreen({super.key});
  @override
  State<AirtimeCashScreen> createState() => _AirtimeCashScreenState();
}

class _AirtimeCashScreenState extends State<AirtimeCashScreen> {
  int _netIdx = 0;
  final _senderCtrl   = TextEditingController(text: '08012345678'); // number that sent airtime
  final _recipientCtrl = TextEditingController(text: '08012345678'); // number to receive cash (wallet linked)
  final _amountCtrl   = TextEditingController();
  bool _confirmed = false;  // "I have sent the airtime" checkbox

  NetworkInfo get _net => kNetworks[_netIdx];

  int get _num  => int.tryParse(_amountCtrl.text) ?? 0;
  int get _cash => (_num * 0.75).floor();
  int get _fee  => _num - _cash;

  String get _transferNumber => kAirtimeTransferNumbers[_net.id] ?? '—';

  bool get _canProceed => _num >= 100 && _confirmed;

  @override
  void dispose() {
    _senderCtrl.dispose();
    _recipientCtrl.dispose();
    _amountCtrl.dispose();
    super.dispose();
  }

  void _proceed() {
    final txn = TxnData(
      type: 'Airtime to Cash',
      network: _net.name,
      networkColor: '#${(_net.color.toARGB32() & 0xFFFFFF).toRadixString(16).padLeft(6, '0').toUpperCase()}',
      recipient: 'HananData Wallet (${_recipientCtrl.text})',
      amount: _num,
      fee: _fee,
      total: _cash,
      description: '${_net.name} Airtime → Cash',
      plan: '25% conversion fee',
      refId: genRef(),
    );
    Navigator.pushNamed(context, '/confirm', arguments: txn);
  }

  @override
  Widget build(BuildContext context) {
    final showSummary = _num >= 100;

    return Scaffold(
      backgroundColor: kBackground,
      body: SafeArea(
        child: Column(
          children: [
            BackHeader(title: 'Airtime to Cash', onBack: () => Navigator.pop(context)),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [

                    // ── Step 1: How it works banner ───────────────────────
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [kPrimaryNavy.withValues(alpha: 0.08), kPrimaryBlue.withValues(alpha: 0.04)],
                        ),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: kPrimaryNavy.withValues(alpha: 0.15)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('How it works', style: dFont(size: 12, weight: FontWeight.w800, color: kPrimaryNavy)),
                          const SizedBox(height: 8),
                          _howRow('1', 'Select your network and enter the airtime amount'),
                          _howRow('2', 'Send airtime to the number shown below'),
                          _howRow('3', 'Confirm and receive 75% as cash in your wallet'),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),

                    // ── Step 2: Network ───────────────────────────────────
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
                              onTap: () => setState(() => _netIdx = i),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 20),

                    // ── Step 3: Sender phone (the phone sending airtime) ──
                    const SectionLabel('Sender Phone Number'),
                    const SizedBox(height: 4),
                    Text('The number that will send the airtime',
                        style: dFont(size: 11, color: kMutedText)),
                    const SizedBox(height: 8),
                    _phoneField(controller: _senderCtrl),
                    const SizedBox(height: 16),

                    // ── Transfer instructions card ─────────────────────────
                    AnimatedSwitcher(
                      duration: const Duration(milliseconds: 250),
                      child: _TransferCard(
                        key: ValueKey(_netIdx),
                        net: _net,
                        transferNumber: _transferNumber,
                        senderPhone: _senderCtrl.text,
                      ),
                    ),
                    const SizedBox(height: 20),

                    // ── Step 4: Airtime amount ─────────────────────────────
                    const SectionLabel('Airtime Amount Sent'),
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
                              inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                              style: dFont(size: 22, weight: FontWeight.w800),
                              decoration: InputDecoration(
                                hintText: 'Minimum ₦100',
                                hintStyle: dFont(size: 16, color: const Color(0xFFB8C4D9)),
                                border: InputBorder.none,
                                contentPadding: const EdgeInsets.symmetric(horizontal: 8, vertical: 14),
                              ),
                              onChanged: (_) => setState(() {}),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // ── Step 5: Wallet phone (where cash goes) ─────────────
                    const SectionLabel('Wallet Phone Number'),
                    const SizedBox(height: 4),
                    Text('Where the cash will be credited',
                        style: dFont(size: 11, color: kMutedText)),
                    const SizedBox(height: 8),
                    _phoneField(controller: _recipientCtrl),
                    const SizedBox(height: 16),

                    // ── Conversion summary ────────────────────────────────
                    AnimatedSwitcher(
                      duration: const Duration(milliseconds: 300),
                      child: showSummary
                          ? _ConversionSummary(num: _num, cash: _cash, fee: _fee)
                          : const SizedBox.shrink(),
                    ),
                    if (showSummary) const SizedBox(height: 16),

                    // ── Confirmation checkbox ─────────────────────────────
                    GestureDetector(
                      onTap: () => setState(() => _confirmed = !_confirmed),
                      child: Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: _confirmed ? const Color(0xFFE6F9F4) : Colors.white,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(
                            color: _confirmed ? kAccentGreen : kCardBorder, width: 2,
                          ),
                        ),
                        child: Row(
                          children: [
                            AnimatedContainer(
                              duration: const Duration(milliseconds: 150),
                              width: 24, height: 24,
                              decoration: BoxDecoration(
                                color: _confirmed ? kAccentGreen : Colors.white,
                                borderRadius: BorderRadius.circular(7),
                                border: Border.all(
                                  color: _confirmed ? kAccentGreen : kCardBorder, width: 2,
                                ),
                              ),
                              child: _confirmed
                                  ? const Icon(Icons.check_rounded, color: Colors.white, size: 14)
                                  : null,
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                'I confirm I have already sent the airtime to the number above',
                                style: dFont(size: 13, weight: FontWeight.w500,
                                    color: _confirmed ? kAccentGreen2 : kMediumText),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),

                    // Warning
                    if (!_confirmed)
                      Padding(
                        padding: const EdgeInsets.only(top: 4),
                        child: Text(
                          '⚠️ You must send the airtime first before proceeding.',
                          style: dFont(size: 11, color: const Color(0xFFF6A623)),
                        ),
                      ),
                    const SizedBox(height: 8),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: PrimaryBtn(
                label: 'Submit Request',
                disabled: !_canProceed,
                onPressed: _proceed,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _howRow(String step, String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 18, height: 18,
            decoration: BoxDecoration(
              color: kPrimaryNavy,
              borderRadius: BorderRadius.circular(9),
            ),
            alignment: Alignment.center,
            child: Text(step,
                style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.white)),
          ),
          const SizedBox(width: 8),
          Expanded(child: Text(text, style: dFont(size: 12, color: kMediumText))),
        ],
      ),
    );
  }

  Widget _phoneField({required TextEditingController controller}) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: kCardBorder, width: 2),
      ),
      child: Row(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
            child: Text('🇳🇬 +234',
                style: dFont(size: 13, weight: FontWeight.w600, color: kMediumText)),
          ),
          Container(width: 1, height: 24, color: kCardBorder),
          Expanded(
            child: TextField(
              controller: controller,
              keyboardType: TextInputType.phone,
              maxLength: 11,
              style: dFont(size: 15, weight: FontWeight.w600),
              decoration: InputDecoration(
                hintText: '08012345678',
                hintStyle: dFont(size: 15, color: const Color(0xFFB8C4D9)),
                border: InputBorder.none,
                counterText: '',
                contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
              ),
              onChanged: (_) => setState(() {}),
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Transfer instructions card ───────────────────────────────────────────────

class _TransferCard extends StatelessWidget {
  final NetworkInfo net;
  final String transferNumber;
  final String senderPhone;
  const _TransferCard({super.key, required this.net, required this.transferNumber, required this.senderPhone});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: net.bg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: net.color.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              // Network logo circle
              Container(
                width: 32, height: 32,
                decoration: BoxDecoration(
                  color: net.color,
                  shape: BoxShape.circle,
                ),
                alignment: Alignment.center,
                child: net.logoUrl != null
                    ? Image.network(net.logoUrl!, width: 22, height: 22, fit: BoxFit.contain,
                        errorBuilder: (_, __, ___) => Text(net.logoLetter,
                            style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w900, color: Colors.white)))
                    : Text(net.logoLetter,
                        style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w900, color: Colors.white)),
              ),
              const SizedBox(width: 10),
              Text('${net.name} Transfer Instructions',
                  style: dFont(size: 13, weight: FontWeight.w700, color: net.text)),
            ],
          ),
          const SizedBox(height: 12),
          _instructionRow('Step', 'From $senderPhone, dial or send airtime to:'),
          const SizedBox(height: 8),
          // Transfer number — tappable to copy
          GestureDetector(
            onTap: () {
              Clipboard.setData(ClipboardData(text: transferNumber.replaceAll(' ', '')));
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Number copied!'), duration: Duration(seconds: 1)),
              );
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: net.color),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.phone_forwarded_rounded, color: net.color, size: 16),
                  const SizedBox(width: 8),
                  Text(transferNumber,
                      style: GoogleFonts.inter(
                          fontSize: 18, fontWeight: FontWeight.w800, color: net.text,
                          letterSpacing: 1)),
                  const SizedBox(width: 8),
                  Icon(Icons.copy_rounded, color: net.text.withValues(alpha: 0.5), size: 14),
                ],
              ),
            ),
          ),
          const SizedBox(height: 8),
          Text('Tap the number to copy it',
              style: dFont(size: 11, color: net.text.withValues(alpha: 0.6))),
        ],
      ),
    );
  }

  Widget _instructionRow(String label, String text) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('$label: ', style: dFont(size: 12, weight: FontWeight.w700, color: kMutedText)),
        Expanded(child: Text(text, style: dFont(size: 12, color: kMediumText))),
      ],
    );
  }
}

// ─── Conversion summary ───────────────────────────────────────────────────────

class _ConversionSummary extends StatelessWidget {
  final int num;
  final int cash;
  final int fee;
  const _ConversionSummary({required this.num, required this.cash, required this.fee});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: kCardBorder),
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SectionLabel('Conversion Summary'),
                const SizedBox(height: 12),
                _row('Airtime submitted', '₦${fmtNaira(num)}', kPrimaryDark),
                const SizedBox(height: 8),
                _row('Conversion fee (25%)', '-₦${fmtNaira(fee)}', kErrorRed),
                const SizedBox(height: 8),
                const Divider(color: kCardBorder),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('You receive', style: dFont(size: 15, weight: FontWeight.w700)),
                    Text('₦${fmtNaira(cash)}',
                        style: dFont(size: 22, weight: FontWeight.w900, color: kAccentGreen)),
                  ],
                ),
              ],
            ),
          ),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            decoration: const BoxDecoration(
              color: Color(0xFFE6F9F4),
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(16),
                bottomRight: Radius.circular(16),
              ),
            ),
            child: Row(
              children: [
                const Icon(Icons.account_balance_wallet_outlined, color: kAccentGreen2, size: 16),
                const SizedBox(width: 8),
                Text('Credited to HananData wallet instantly',
                    style: dFont(size: 12, weight: FontWeight.w500, color: kAccentGreen2)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _row(String label, String value, Color valColor) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: dFont(size: 14, color: kMutedText)),
        Text(value, style: dFont(size: 14, weight: FontWeight.w600, color: valColor)),
      ],
    );
  }
}
