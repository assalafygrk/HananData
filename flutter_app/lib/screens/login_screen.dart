// lib/screens/login_screen.dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widgets/shared_widgets.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _phoneCtrl = TextEditingController();
  String _pin = '';
  bool _onPin = false;

  @override
  void dispose() {
    _phoneCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final phoneValid = _phoneCtrl.text.length >= 10;

    return Scaffold(
      backgroundColor: kBackground,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const AppStatusBar(),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 24),
                    // Logo mark
                    Container(
                      width: 48, height: 48,
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF00C896), Color(0xFF00A87D)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        'H',
                        style: GoogleFonts.inter(
                          fontSize: 20, fontWeight: FontWeight.w900, color: Colors.white,
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'Welcome back',
                      style: GoogleFonts.inter(
                        fontSize: 28, fontWeight: FontWeight.w800, color: kPrimaryDark,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Sign in to your HananData account',
                      style: dFont(size: 14, color: kMutedText),
                    ),
                    const SizedBox(height: 28),
                    // Phone field
                    const SectionLabel('Phone Number'),
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
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                            child: Text(
                              '🇳🇬 +234',
                              style: dFont(size: 15, weight: FontWeight.w600, color: kMediumText),
                            ),
                          ),
                          Container(width: 1, height: 24, color: kCardBorder),
                          Expanded(
                            child: TextField(
                              controller: _phoneCtrl,
                              keyboardType: TextInputType.phone,
                              maxLength: 10,
                              style: dFont(size: 15, weight: FontWeight.w600),
                              decoration: InputDecoration(
                                hintText: '8012345678',
                                hintStyle: dFont(size: 15, color: const Color(0xFFB8C4D9)),
                                border: InputBorder.none,
                                counterText: '',
                                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                              ),
                              onChanged: (_) => setState(() {}),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                    if (!_onPin) ...[
                      PrimaryBtn(
                        label: 'Continue',
                        disabled: !phoneValid,
                        onPressed: () => setState(() => _onPin = true),
                      ),
                    ] else ...[
                      const SizedBox(height: 8),
                      const SectionLabel('Enter PIN'),
                      const SizedBox(height: 8),
                      PINDots(value: _pin),
                      const SizedBox(height: 16),
                      NumPad(
                        value: _pin,
                        onChanged: (v) {
                          setState(() => _pin = v);
                          if (v.length == 6) {
                            final nav = Navigator.of(context);
                            Future.delayed(const Duration(milliseconds: 120), () {
                              if (mounted) nav.pushReplacementNamed('/home');
                            });
                          }
                        },
                      ),
                      const SizedBox(height: 16),
                      PrimaryBtn(
                        label: 'Sign In',
                        disabled: _pin.length < 6,
                        onPressed: () => Navigator.pushReplacementNamed(context, '/home'),
                      ),
                      const SizedBox(height: 12),
                      Center(
                        child: TextButton(
                          onPressed: () {},
                          child: Text('Forgot PIN?', style: dFont(size: 13, color: kMutedText)),
                        ),
                      ),
                    ],
                    const SizedBox(height: 20),
                    Center(
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text('New to HananData?  ', style: dFont(size: 14, color: kMutedText)),
                          GestureDetector(
                            onTap: () => Navigator.pushNamed(context, '/signup'),
                            child: Text(
                              'Sign up',
                              style: dFont(size: 14, weight: FontWeight.w700, color: kPrimaryNavy),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 32),
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
