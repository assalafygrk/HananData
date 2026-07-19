// lib/screens/splash_screen.dart
import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});
  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with TickerProviderStateMixin {

  // Logo pulse
  late AnimationController _pulseCtrl;
  late Animation<double> _pulseScale;
  late Animation<double> _pulseOpacity;

  // Progress bar
  late AnimationController _progressCtrl;
  late Animation<double> _progress;

  // Rotating ring
  late AnimationController _ringCtrl;
  late Animation<double> _ringAngle;

  // Particle shimmer (3 dots)
  late AnimationController _dotCtrl;
  late Animation<double> _dotAnim;

  // Tagline fade
  late AnimationController _fadeCtrl;
  late Animation<double> _fadeOpacity;
  late Animation<Offset> _fadeSlide;

  @override
  void initState() {
    super.initState();

    // ── Pulse ─────────────────────────────────────────────────────────────
    _pulseCtrl = AnimationController(
      vsync: this, duration: const Duration(milliseconds: 1800),
    )..repeat(reverse: true);
    _pulseScale = Tween<double>(begin: 0.92, end: 1.06).animate(
      CurvedAnimation(parent: _pulseCtrl, curve: Curves.easeInOut));
    _pulseOpacity = Tween<double>(begin: 0.7, end: 1.0).animate(
      CurvedAnimation(parent: _pulseCtrl, curve: Curves.easeInOut));

    // ── Rotating ring ─────────────────────────────────────────────────────
    _ringCtrl = AnimationController(
      vsync: this, duration: const Duration(milliseconds: 2400),
    )..repeat();
    _ringAngle = Tween<double>(begin: 0, end: 2 * pi).animate(
      CurvedAnimation(parent: _ringCtrl, curve: Curves.linear));

    // ── Progress bar ──────────────────────────────────────────────────────
    _progressCtrl = AnimationController(
      vsync: this, duration: const Duration(milliseconds: 2400),
    );
    _progress = CurvedAnimation(parent: _progressCtrl, curve: Curves.easeInOut);
    _progressCtrl.forward();

    // ── Dot shimmer ───────────────────────────────────────────────────────
    _dotCtrl = AnimationController(
      vsync: this, duration: const Duration(milliseconds: 900),
    )..repeat(reverse: true);
    _dotAnim = CurvedAnimation(parent: _dotCtrl, curve: Curves.easeInOut);

    // ── Tagline ────────────────────────────────────────────────────────────
    _fadeCtrl = AnimationController(
      vsync: this, duration: const Duration(milliseconds: 700),
    );
    _fadeOpacity = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _fadeCtrl, curve: Curves.easeOut));
    _fadeSlide = Tween<Offset>(begin: const Offset(0, 0.3), end: Offset.zero).animate(
      CurvedAnimation(parent: _fadeCtrl, curve: Curves.easeOutCubic));

    // Stagger tagline after 500ms
    Future.delayed(const Duration(milliseconds: 500), () {
      if (mounted) _fadeCtrl.forward();
    });

    // Navigate after 3s
    Timer(const Duration(milliseconds: 3000), () {
      if (mounted) Navigator.pushReplacementNamed(context, '/onboarding');
    });
  }

  @override
  void dispose() {
    _pulseCtrl.dispose();
    _ringCtrl.dispose();
    _progressCtrl.dispose();
    _dotCtrl.dispose();
    _fadeCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF0D1B35), Color(0xFF1B3A6B), Color(0xFF2952A3)],
            stops: [0.0, 0.55, 1.0],
          ),
        ),
        child: SafeArea(
          child: Stack(
            children: [
              // Background decorative circles
              Positioned(
                top: -60, right: -60,
                child: Container(
                  width: 200, height: 200,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.white.withValues(alpha: 0.04),
                  ),
                ),
              ),
              Positioned(
                bottom: -80, left: -60,
                child: Container(
                  width: 250, height: 250,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.white.withValues(alpha: 0.03),
                  ),
                ),
              ),
              // Main content
              Column(
                children: [
                  const Spacer(flex: 2),
                  // Logo + ring animation
                  Center(
                    child: SizedBox(
                      width: 140, height: 140,
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          // Outer glow ring
                          AnimatedBuilder(
                            animation: _pulseCtrl,
                            builder: (_, __) => Opacity(
                              opacity: 0.15 + _pulseOpacity.value * 0.1,
                              child: Container(
                                width: 130, height: 130,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: const Color(0xFF00C896), width: 1.5,
                                  ),
                                ),
                              ),
                            ),
                          ),
                          // Rotating arc
                          AnimatedBuilder(
                            animation: _ringAngle,
                            builder: (_, __) => Transform.rotate(
                              angle: _ringAngle.value,
                              child: CustomPaint(
                                size: const Size(112, 112),
                                painter: _ArcPainter(),
                              ),
                            ),
                          ),
                          // Logo box — pulsing
                          AnimatedBuilder(
                            animation: _pulseCtrl,
                            builder: (_, __) => Transform.scale(
                              scale: _pulseScale.value,
                              child: Container(
                                width: 88, height: 88,
                                decoration: BoxDecoration(
                                  gradient: const LinearGradient(
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                    colors: [Color(0xFF00C896), Color(0xFF00A87D)],
                                  ),
                                  borderRadius: BorderRadius.circular(26),
                                  boxShadow: [
                                    BoxShadow(
                                      color: const Color(0xFF00C896).withValues(alpha: 0.45),
                                      blurRadius: 28,
                                      offset: const Offset(0, 8),
                                    ),
                                  ],
                                ),
                                alignment: Alignment.center,
                                child: Text(
                                  'H',
                                  style: GoogleFonts.inter(
                                    fontSize: 40,
                                    fontWeight: FontWeight.w900,
                                    color: Colors.white,
                                    letterSpacing: -1,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 28),
                  // App name
                  Text(
                    'HananData',
                    style: GoogleFonts.inter(
                      fontSize: 32,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: 8),
                  // Tagline with fade+slide
                  SlideTransition(
                    position: _fadeSlide,
                    child: FadeTransition(
                      opacity: _fadeOpacity,
                      child: Text(
                        'Your pocket VTU companion',
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          color: const Color(0xFF7BAED4),
                          letterSpacing: 0.2,
                        ),
                      ),
                    ),
                  ),
                  const Spacer(flex: 2),
                  // Progress area
                  Padding(
                    padding: const EdgeInsets.fromLTRB(48, 0, 48, 16),
                    child: Column(
                      children: [
                        // Animated progress bar
                        ClipRRect(
                          borderRadius: BorderRadius.circular(99),
                          child: AnimatedBuilder(
                            animation: _progress,
                            builder: (_, __) => LinearProgressIndicator(
                              value: _progress.value,
                              minHeight: 3,
                              backgroundColor: Colors.white.withValues(alpha: 0.12),
                              valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF00C896)),
                            ),
                          ),
                        ),
                        const SizedBox(height: 20),
                        // Animated 3-dot shimmer
                        AnimatedBuilder(
                          animation: _dotAnim,
                          builder: (_, __) => Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: List.generate(3, (i) {
                              final delay = i * 0.33;
                              final val = (_dotAnim.value - delay).clamp(0.0, 1.0);
                              return Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 4),
                                child: AnimatedContainer(
                                  duration: const Duration(milliseconds: 80),
                                  width: 6 + val * 2,
                                  height: 6 + val * 2,
                                  decoration: BoxDecoration(
                                    color: Color.lerp(
                                      Colors.white.withValues(alpha: 0.3),
                                      const Color(0xFF00C896),
                                      val,
                                    )!,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                              );
                            }),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ─── Rotating arc painter ─────────────────────────────────────────────────────

class _ArcPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..shader = const SweepGradient(
        colors: [Color(0xFF00C896), Colors.transparent],
        startAngle: 0,
        endAngle: pi,
      ).createShader(Rect.fromCircle(
        center: Offset(size.width / 2, size.height / 2),
        radius: size.width / 2,
      ))
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.5
      ..strokeCap = StrokeCap.round;

    canvas.drawArc(
      Rect.fromCircle(
        center: Offset(size.width / 2, size.height / 2),
        radius: size.width / 2,
      ),
      -pi / 2,
      pi * 1.5,
      false,
      paint,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
