// lib/screens/success_screen.dart
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_data.dart';
import '../models/txn_data.dart';
import '../widgets/shared_widgets.dart';

class SuccessScreen extends StatefulWidget {
  const SuccessScreen({super.key});
  @override
  State<SuccessScreen> createState() => _SuccessScreenState();
}

class _SuccessScreenState extends State<SuccessScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _scaleAnim;
  late Animation<double> _circleAnim;
  late Animation<double> _checkAnim;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    );

    _scaleAnim = CurvedAnimation(
      parent: _ctrl,
      curve: const Interval(0.0, 0.55, curve: Curves.elasticOut),
    );
    _circleAnim = CurvedAnimation(
      parent: _ctrl,
      curve: const Interval(0.0, 0.55, curve: Curves.easeOut),
    );
    _checkAnim = CurvedAnimation(
      parent: _ctrl,
      curve: const Interval(0.45, 1.0, curve: Curves.easeOut),
    );

    _ctrl.forward();
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final txn = ModalRoute.of(context)!.settings.arguments as TxnData;
    final refId = txn.refId ?? genRef();

    final receiptRows = [
      _ReceiptRow(label: 'Service',   value: txn.description),
      if (txn.plan      != null) _ReceiptRow(label: 'Detail',    value: txn.plan!),
      if (txn.recipient != null) _ReceiptRow(label: 'Recipient', value: txn.recipient!),
      _ReceiptRow(label: 'Amount',  value: '₦${fmtNaira(txn.total)}'),
      _ReceiptRow(label: 'Ref ID',  value: refId),
      const _ReceiptRow(label: 'Date',    value: 'Jul 18, 2026 · 9:41 AM'),
      const _ReceiptRow(label: 'Status',  value: '✓ Successful', isStatus: true),
    ];

    return Scaffold(
      backgroundColor: kBackground,
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 32),
                child: Column(
                  children: [
                    // Animated success icon
                    ScaleTransition(
                      scale: _scaleAnim,
                      child: SizedBox(
                        width: 96, height: 96,
                        child: AnimatedBuilder(
                          animation: _ctrl,
                          builder: (context, _) {
                            return CustomPaint(
                              painter: _SuccessPainter(
                                circleProgress: _circleAnim.value,
                                checkProgress: _checkAnim.value,
                              ),
                            );
                          },
                        ),
                      ),
                    ),
                    const SizedBox(height: 28),
                    Text(
                      'Transaction Successful!',
                      style: GoogleFonts.inter(
                        fontSize: 26, fontWeight: FontWeight.w800, color: kPrimaryDark,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Your payment was processed successfully',
                      textAlign: TextAlign.center,
                      style: dFont(size: 14, color: kMutedText),
                    ),
                    const SizedBox(height: 28),
                    // Receipt card
                    Container(
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: kCardBorder),
                      ),
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SectionLabel('Receipt'),
                          const SizedBox(height: 12),
                          ...receiptRows.map((r) => Padding(
                            padding: const EdgeInsets.symmetric(vertical: 6),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(r.label, style: dFont(size: 13, color: kMutedText)),
                                const SizedBox(width: 16),
                                Flexible(
                                  child: Text(
                                    r.value,
                                    textAlign: TextAlign.right,
                                    style: dFont(
                                      size: 13,
                                      weight: FontWeight.w600,
                                      color: r.isStatus ? kAccentGreen : kPrimaryDark,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          )),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                    // Share Receipt button
                    SizedBox(
                      width: double.infinity,
                      height: 54,
                      child: OutlinedButton.icon(
                        onPressed: () {},
                        icon: const Icon(Icons.share_outlined, size: 18),
                        label: Text('Share Receipt',
                          style: dFont(size: 15, weight: FontWeight.w700, color: kPrimaryNavy)),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: kPrimaryNavy,
                          side: const BorderSide(color: kPrimaryNavy, width: 2),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    PrimaryBtn(
                      label: 'Back to Home',
                      onPressed: () => Navigator.pushNamedAndRemoveUntil(
                        context, '/home', (_) => false),
                    ),
                    const SizedBox(height: 16),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── CustomPainter for circle draw-in + checkmark draw-in ────────────────────

class _SuccessPainter extends CustomPainter {
  final double circleProgress;
  final double checkProgress;

  _SuccessPainter({required this.circleProgress, required this.checkProgress});

  @override
  void paint(Canvas canvas, Size size) {
    final cx = size.width / 2;
    final cy = size.height / 2;
    final r = size.width / 2 - 3;

    // Background circle fill
    final fillPaint = Paint()..color = const Color(0xFFE6F9F4)..style = PaintingStyle.fill;
    canvas.drawCircle(Offset(cx, cy), r, fillPaint);

    // Animated circle stroke (draw-in)
    final circlePaint = Paint()
      ..color = kAccentGreen
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3.0
      ..strokeCap = StrokeCap.round;

    final sweepAngle = 2 * pi * circleProgress;
    canvas.drawArc(
      Rect.fromCircle(center: Offset(cx, cy), radius: r),
      -pi / 2,
      sweepAngle,
      false,
      circlePaint,
    );

    // Animated checkmark draw-in
    if (checkProgress > 0) {
      final checkPaint = Paint()
        ..color = kAccentGreen
        ..style = PaintingStyle.stroke
        ..strokeWidth = 4.5
        ..strokeCap = StrokeCap.round
        ..strokeJoin = StrokeJoin.round;

      // Checkmark: 28,48 → 42,62 → 68,36  (in 96x96 space)
      final p1 = Offset(size.width * 0.292, size.height * 0.5);
      final p2 = Offset(size.width * 0.438, size.height * 0.646);
      final p3 = Offset(size.width * 0.708, size.height * 0.375);

      final totalLen = (p2 - p1).distance + (p3 - p2).distance;
      final drawn = totalLen * checkProgress;

      final path = Path();
      path.moveTo(p1.dx, p1.dy);

      final seg1Len = (p2 - p1).distance;
      if (drawn <= seg1Len) {
        final t = drawn / seg1Len;
        path.lineTo(
          p1.dx + (p2.dx - p1.dx) * t,
          p1.dy + (p2.dy - p1.dy) * t,
        );
      } else {
        path.lineTo(p2.dx, p2.dy);
        final rem = drawn - seg1Len;
        final seg2Len = (p3 - p2).distance;
        final t = (rem / seg2Len).clamp(0.0, 1.0);
        path.lineTo(
          p2.dx + (p3.dx - p2.dx) * t,
          p2.dy + (p3.dy - p2.dy) * t,
        );
      }

      canvas.drawPath(path, checkPaint);
    }
  }

  @override
  bool shouldRepaint(covariant _SuccessPainter old) =>
      old.circleProgress != circleProgress || old.checkProgress != checkProgress;
}

class _ReceiptRow {
  final String label;
  final String value;
  final bool isStatus;
  const _ReceiptRow({required this.label, required this.value, this.isStatus = false});
}
