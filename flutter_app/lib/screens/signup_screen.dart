// lib/screens/signup_screen.dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widgets/shared_widgets.dart';

class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});
  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  int _step = 0;
  final _nameCtrl  = TextEditingController();
  final _phoneCtrl = TextEditingController();
  String _pin     = '';
  String _confirm = '';

  @override
  void dispose() {
    _nameCtrl.dispose();
    _phoneCtrl.dispose();
    super.dispose();
  }

  String get _activePin => _step == 1 ? _pin : _confirm;

  void _setActivePin(String v) {
    setState(() {
      if (_step == 1) {
        _pin = v;
      } else {
        _confirm = v;
      }
    });
    if (v.length == 6 && _step == 2) {
      Future.delayed(const Duration(milliseconds: 120), () {
        if (mounted) Navigator.pushReplacementNamed(context, '/home');
      });
    }
  }

  bool get _step0Valid => _nameCtrl.text.trim().isNotEmpty && _phoneCtrl.text.length >= 10;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBackground,
      body: SafeArea(
        child: Column(
          children: [
            BackHeader(
              title: 'Create Account',
              onBack: () {
                if (_step == 0) {
                  Navigator.pop(context);
                } else {
                  setState(() { _step--; _pin = ''; _confirm = ''; });
                }
              },
            ),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Progress bar
                    Row(
                      children: List.generate(3, (i) => Expanded(
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 3),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 300),
                            height: 4,
                            decoration: BoxDecoration(
                              color: i <= _step ? kPrimaryNavy : kCardBorder,
                              borderRadius: BorderRadius.circular(4),
                            ),
                          ),
                        ),
                      )),
                    ),
                    const SizedBox(height: 24),

                    // Step 0: Details
                    if (_step == 0) ...[
                      Text('Your details',
                        style: GoogleFonts.inter(fontSize: 22, fontWeight: FontWeight.w800, color: kPrimaryDark)),
                      const SizedBox(height: 4),
                      Text('Tell us a bit about yourself', style: dFont(size: 14, color: kMutedText)),
                      const SizedBox(height: 24),
                      const SectionLabel('Full Name'),
                      const SizedBox(height: 8),
                      TextField(
                        controller: _nameCtrl,
                        style: dFont(size: 15, weight: FontWeight.w600),
                        decoration: InputDecoration(
                          hintText: 'Amaka Okonkwo',
                          hintStyle: dFont(size: 15, color: const Color(0xFFB8C4D9)),
                          filled: true,
                          fillColor: Colors.white,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: const BorderSide(color: kCardBorder, width: 2),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: const BorderSide(color: kCardBorder, width: 2),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: const BorderSide(color: kPrimaryNavy, width: 2),
                          ),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                        ),
                        onChanged: (_) => setState(() {}),
                      ),
                      const SizedBox(height: 16),
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
                              child: Text('🇳🇬 +234',
                                style: dFont(size: 15, weight: FontWeight.w600, color: kMediumText)),
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
                      const SizedBox(height: 24),
                      PrimaryBtn(
                        label: 'Continue',
                        disabled: !_step0Valid,
                        onPressed: () => setState(() => _step = 1),
                      ),
                    ],

                    // Steps 1 & 2: PIN
                    if (_step == 1 || _step == 2) ...[
                      Text(
                        _step == 1 ? 'Create your PIN' : 'Confirm your PIN',
                        style: GoogleFonts.inter(fontSize: 22, fontWeight: FontWeight.w800, color: kPrimaryDark),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _step == 1 ? 'Choose a secure 6-digit PIN' : 'Re-enter to confirm',
                        style: dFont(size: 14, color: kMutedText),
                      ),
                      const SizedBox(height: 20),
                      PINDots(value: _activePin),
                      const SizedBox(height: 16),
                      NumPad(value: _activePin, onChanged: _setActivePin),
                      const SizedBox(height: 16),
                      PrimaryBtn(
                        label: _step == 1 ? 'Continue' : 'Create Account',
                        disabled: _activePin.length < 6,
                        onPressed: () {
                          if (_step == 1) {
                            setState(() { _step = 2; _confirm = ''; });
                          } else {
                            Navigator.pushReplacementNamed(context, '/home');
                          }
                        },
                      ),
                    ],
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
