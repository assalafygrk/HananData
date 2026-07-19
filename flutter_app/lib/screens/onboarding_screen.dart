// lib/screens/onboarding_screen.dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widgets/shared_widgets.dart';

class _Slide {
  final String title;
  final String body;
  final IconData icon;
  const _Slide({required this.title, required this.body, required this.icon});
}

const _slides = [
  _Slide(
    title: 'Fast, instant top-ups',
    body: 'Buy data and airtime for any Nigerian network in under 10 seconds — no queues, no stress.',
    icon: Icons.signal_cellular_alt_rounded,
  ),
  _Slide(
    title: 'Bills sorted in one tap',
    body: 'Pay for DStv, GOtv, PHCN electricity and more. Keep the lights on and the TV running.',
    icon: Icons.bolt_rounded,
  ),
  _Slide(
    title: 'Turn airtime into cash',
    body: 'Have unused airtime? Convert it to wallet cash instantly at the best available rates.',
    icon: Icons.swap_horiz_rounded,
  ),
];

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});
  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen>
    with SingleTickerProviderStateMixin {
  int _slide = 0;
  late AnimationController _fadeCtrl;
  late Animation<double> _fadeAnim;

  @override
  void initState() {
    super.initState();
    _fadeCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 350));
    _fadeAnim = CurvedAnimation(parent: _fadeCtrl, curve: Curves.easeOut);
    _fadeCtrl.forward();
  }

  void _goToSlide(int idx) {
    _fadeCtrl.forward(from: 0);
    setState(() => _slide = idx);
  }

  @override
  void dispose() {
    _fadeCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final s = _slides[_slide];
    return Scaffold(
      backgroundColor: kBackground,
      body: SafeArea(
        child: Column(
          children: [
            // Content
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 32),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Icon circle
                    Container(
                      width: 96, height: 96,
                      decoration: BoxDecoration(
                        color: const Color(0xFFE8EDF5),
                        borderRadius: BorderRadius.circular(28),
                      ),
                      child: Icon(s.icon, color: kPrimaryNavy, size: 40),
                    ),
                    const SizedBox(height: 36),
                    // Text with fade
                    FadeTransition(
                      opacity: _fadeAnim,
                      child: Column(
                        children: [
                          Text(
                            s.title,
                            textAlign: TextAlign.center,
                            style: GoogleFonts.inter(
                              fontSize: 26, fontWeight: FontWeight.w800,
                              color: kPrimaryDark, height: 1.2,
                            ),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            s.body,
                            textAlign: TextAlign.center,
                            style: dFont(size: 15, color: kMutedText, letterSpacing: 0),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            // Dots
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(_slides.length, (i) {
                final active = i == _slide;
                return GestureDetector(
                  onTap: () => _goToSlide(i),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    width: active ? 28 : 8,
                    height: 8,
                    margin: const EdgeInsets.symmetric(horizontal: 3),
                    decoration: BoxDecoration(
                      color: active ? kPrimaryNavy : const Color(0xFFB8C4D9),
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
                );
              }),
            ),
            const SizedBox(height: 28),
            // Buttons
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 28),
              child: _slide < 2
                  ? Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () => Navigator.pushReplacementNamed(context, '/login'),
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              side: const BorderSide(color: kCardBorder, width: 2),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                            ),
                            child: Text('Skip', style: dFont(size: 15, weight: FontWeight.w600, color: kMediumText)),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          flex: 2,
                          child: DecoratedBox(
                            decoration: BoxDecoration(
                              gradient: const LinearGradient(
                                colors: [kPrimaryNavy, kPrimaryBlue],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              ),
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: TextButton(
                              onPressed: () => _goToSlide(_slide + 1),
                              style: TextButton.styleFrom(
                                padding: const EdgeInsets.symmetric(vertical: 16),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                              ),
                              child: Text('Next →', style: dFont(size: 15, weight: FontWeight.w700, color: Colors.white)),
                            ),
                          ),
                        ),
                      ],
                    )
                  : PrimaryBtn(
                      label: 'Get Started',
                      onPressed: () => Navigator.pushReplacementNamed(context, '/login'),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
