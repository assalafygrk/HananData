// lib/screens/failed_screen.dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_data.dart';
import '../models/txn_data.dart';
import '../widgets/shared_widgets.dart';

class FailedScreen extends StatefulWidget {
  const FailedScreen({super.key});
  @override
  State<FailedScreen> createState() => _FailedScreenState();
}

class _FailedScreenState extends State<FailedScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _scaleAnim;
  late Animation<double> _fadeAnim;
  late Animation<double> _xAnim;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    );

    _scaleAnim = CurvedAnimation(
      parent: _ctrl,
      curve: const Interval(0.0, 0.6, curve: Curves.elasticOut),
    );
    _fadeAnim = CurvedAnimation(
      parent: _ctrl,
      curve: const Interval(0.0, 0.5, curve: Curves.easeOut),
    );
    _xAnim = CurvedAnimation(
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
    final refId = txn.refId ?? 'HND00FAILED';

    final rows = [
      _Row(label: 'Service',         value: txn.description),
      _Row(label: 'Amount',          value: '₦${fmtNaira(txn.total)}'),
      _Row(label: 'Transaction ID',  value: refId, mono: true),
      const _Row(label: 'Wallet Deducted', value: '₦0.00 ✓', success: true),
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
                    // Animated failure icon
                    ScaleTransition(
                      scale: _scaleAnim,
                      child: FadeTransition(
                        opacity: _fadeAnim,
                        child: Container(
                          width: 96, height: 96,
                          decoration: BoxDecoration(
                            color: const Color(0xFFFEE2E2),
                            shape: BoxShape.circle,
                            border: Border.all(color: kErrorRed, width: 3),
                          ),
                          child: AnimatedBuilder(
                            animation: _xAnim,
                            builder: (context, _) {
                              return CustomPaint(
                                painter: _XPainter(progress: _xAnim.value),
                              );
                            },
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'Transaction Failed',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.inter(
                        fontSize: 26, fontWeight: FontWeight.w800, color: kPrimaryDark,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: RichText(
                        textAlign: TextAlign.center,
                        text: TextSpan(
                          style: dFont(size: 14, color: kMutedText),
                          children: [
                            const TextSpan(text: "Don't worry — your money is "),
                            TextSpan(
                              text: 'completely safe',
                              style: GoogleFonts.inter(
                                fontSize: 14, fontWeight: FontWeight.w700, color: kPrimaryDark,
                              ),
                            ),
                            const TextSpan(text: '. No funds were deducted.'),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    // Error explanation
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFEE2E2),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: kErrorRed),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('What went wrong',
                            style: dFont(size: 13, weight: FontWeight.w700, color: kErrorRed)),
                          const SizedBox(height: 6),
                          Text(
                            'The service provider is temporarily unavailable. Please try again in a few minutes. '
                            'If the problem persists, contact our support team.',
                            style: dFont(size: 13, color: const Color(0xFF9B1C1C)),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    // Transaction info card
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: kCardBorder),
                      ),
                      child: Column(
                        children: rows.map((r) => Padding(
                          padding: const EdgeInsets.symmetric(vertical: 6),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(r.label, style: dFont(size: 13, color: kMutedText)),
                              Text(
                                r.value,
                                style: r.mono
                                  ? GoogleFonts.robotoMono(fontSize: 12, fontWeight: FontWeight.w600, color: kPrimaryDark)
                                  : dFont(
                                      size: 13,
                                      weight: FontWeight.w600,
                                      color: r.success ? kAccentGreen : kPrimaryDark,
                                    ),
                              ),
                            ],
                          ),
                        )).toList(),
                      ),
                    ),
                    const SizedBox(height: 24),
                    // Actions
                    PrimaryBtn(
                      label: 'Try Again',
                      onPressed: () => Navigator.pop(context),
                    ),
                    const SizedBox(height: 10),
                    SizedBox(
                      width: double.infinity,
                      height: 54,
                      child: DecoratedBox(
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Color(0xFF00A87D), kAccentGreen],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: TextButton.icon(
                          onPressed: () {},
                          icon: const Icon(Icons.help_outline_rounded, color: Colors.white, size: 18),
                          label: Text('Contact Support',
                            style: dFont(size: 15, weight: FontWeight.w700, color: Colors.white)),
                          style: TextButton.styleFrom(
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    TextButton(
                      onPressed: () => Navigator.pushNamedAndRemoveUntil(
                        context, '/home', (_) => false),
                      child: Text('Go back to Home',
                        style: dFont(size: 14, weight: FontWeight.w500, color: kMutedText)),
                    ),
                    const SizedBox(height: 16),
                    // Security notice
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: const Color(0xFFE8EDF5),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('🔒 Your money is always protected',
                            style: dFont(size: 12, weight: FontWeight.w700, color: kPrimaryNavy)),
                          const SizedBox(height: 4),
                          Text(
                            'HananData uses bank-grade encryption. Failed transactions are automatically '
                            'reversed within seconds. No hidden charges, ever.',
                            style: dFont(size: 11, color: kMediumText),
                          ),
                        ],
                      ),
                    ),
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

// ─── CustomPainter for animated X ────────────────────────────────────────────

class _XPainter extends CustomPainter {
  final double progress;
  _XPainter({required this.progress});

  @override
  void paint(Canvas canvas, Size size) {
    if (progress <= 0) return;
    final paint = Paint()
      ..color = kErrorRed
      ..strokeWidth = 4.0
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    final pad = size.width * 0.28;
    final p1 = Offset(pad, pad);
    final p2 = Offset(size.width - pad, size.height - pad);
    final p3 = Offset(size.width - pad, pad);
    final p4 = Offset(pad, size.height - pad);

    // First stroke: top-left → bottom-right
    if (progress <= 0.5) {
      final t = progress / 0.5;
      canvas.drawLine(p1, Offset(p1.dx + (p2.dx - p1.dx) * t, p1.dy + (p2.dy - p1.dy) * t), paint);
    } else {
      canvas.drawLine(p1, p2, paint);
      // Second stroke: top-right → bottom-left
      final t = (progress - 0.5) / 0.5;
      canvas.drawLine(p3, Offset(p3.dx + (p4.dx - p3.dx) * t, p3.dy + (p4.dy - p3.dy) * t), paint);
    }
  }

  @override
  bool shouldRepaint(covariant _XPainter old) => old.progress != progress;
}

class _Row {
  final String label;
  final String value;
  final bool mono;
  final bool success;
  const _Row({required this.label, required this.value, this.mono = false, this.success = false});
}
