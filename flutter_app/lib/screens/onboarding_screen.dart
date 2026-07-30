import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFF0F172A), Color(0xFF1E875D)], // Dark blue to green gradient
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // Top Logo
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 28, height: 28,
                      decoration: BoxDecoration(
                        color: const Color(0xFF00C896),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      alignment: Alignment.center,
                      child: Text('H', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w900, color: Colors.white)),
                    ),
                    const SizedBox(width: 10),
                    Text(
                      'HananData',
                      style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.w700, color: Colors.white),
                    ),
                  ],
                ),
                const Spacer(flex: 2),

                // Illustration Placeholder (Network / Connections)
                Container(
                  width: 250, height: 250,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.white.withOpacity(0.05),
                    border: Border.all(color: Colors.white.withOpacity(0.1), width: 1),
                  ),
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      Icon(Icons.map_rounded, size: 120, color: Colors.white.withOpacity(0.2)),
                      Positioned(top: 50, left: 50, child: _nodeIcon(Icons.phone_iphone_rounded)),
                      Positioned(bottom: 50, right: 50, child: _nodeIcon(Icons.wifi_rounded)),
                      Positioned(top: 100, right: 30, child: _nodeIcon(Icons.electric_bolt_rounded)),
                      Positioned(bottom: 80, left: 40, child: _nodeIcon(Icons.tv_rounded)),
                      Positioned(child: _nodeIcon(Icons.currency_exchange_rounded, isLarge: true)),
                    ],
                  ),
                ),

                const Spacer(flex: 2),

                // Text Content
                Text(
                  'Fast & Reliable VTU',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.inter(
                    fontSize: 32,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                    letterSpacing: -0.5,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  'Instant airtime, data, and bill\npayments across Nigeria.',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.inter(
                    fontSize: 16,
                    color: Colors.white.withOpacity(0.8),
                    height: 1.5,
                  ),
                ),

                const Spacer(),

                // Buttons
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pushNamed(context, '/signup');
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF229E6A),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
                      elevation: 0,
                    ),
                    child: Text(
                      'Get Started',
                      style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w700, color: Colors.white),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: OutlinedButton(
                    onPressed: () {
                      Navigator.pushNamed(context, '/login');
                    },
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: Colors.white, width: 1.5),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
                    ),
                    child: Text(
                      'Login',
                      style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w700, color: Colors.white),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _nodeIcon(IconData icon, {bool isLarge = false}) {
    return Container(
      padding: EdgeInsets.all(isLarge ? 12 : 8),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        shape: BoxShape.circle,
        border: Border.all(color: const Color(0xFF00C896), width: 2),
        boxShadow: [
          BoxShadow(color: const Color(0xFF00C896).withOpacity(0.3), blurRadius: 10),
        ],
      ),
      child: Icon(icon, color: Colors.white, size: isLarge ? 24 : 16),
    );
  }
}
