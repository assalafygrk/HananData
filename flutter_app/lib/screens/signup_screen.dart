// lib/screens/signup_screen.dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widgets/shared_widgets.dart';
import '../services/api_service.dart';
import '../utils/ui_helpers.dart';

class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});
  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  int _step = 0;
  final _nameCtrl  = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _referralCtrl = TextEditingController();
  String _pin     = '';
  String _confirm = '';
  bool _isLoading = false;

  @override
  void dispose() {
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _phoneCtrl.dispose();
    _referralCtrl.dispose();
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
      _handleSignup();
    }
  }

  Future<void> _handleSignup() async {
    if (_pin != _confirm) {
      UiHelpers.showBanner(context, 'PINs do not match', isError: true);
      return;
    }
    setState(() => _isLoading = true);
    final body = {
      'name': _nameCtrl.text.trim(),
      'email': _emailCtrl.text.trim(),
      'phone': _phoneCtrl.text.trim(),
      'password': _pin, // We use pin as password for simplicity
      'referralCode': _referralCtrl.text.trim(),
    };
    final res = await ApiService.signup(body);
    setState(() => _isLoading = false);
    if (res['success'] == true) {
      if (mounted) {
        UiHelpers.showBanner(context, 'Account created! Please sign in.');
        Navigator.pop(context); // go back to login
      }
    } else {
      if (mounted) UiHelpers.showBanner(context, res['message'] ?? 'Error', isError: true);
    }
  }

  Future<void> _checkExistingUser() async {
    setState(() => _isLoading = true);
    final identifier = _emailCtrl.text.trim().isNotEmpty ? _emailCtrl.text.trim() : _phoneCtrl.text.trim();
    final res = await ApiService.checkUserExists(identifier);
    setState(() => _isLoading = false);

    if (res['success'] == true) {
      if (res['data']['exists'] == true) {
        if (mounted) {
          UiHelpers.showBanner(context, 'Account already exists. Please log in.', isError: true);
          Future.delayed(const Duration(seconds: 2), () {
            if (mounted) Navigator.pushReplacementNamed(context, '/login');
          });
        }
      } else {
        setState(() => _step = 1);
      }
    } else {
      if (mounted) UiHelpers.showBanner(context, res['message'] ?? 'Network error', isError: true);
    }
  }

  bool get _emailValid {
    final email = _emailCtrl.text.trim();
    return RegExp(r'^[\w\-.]+@[\w\-]+\.\w{2,}$').hasMatch(email);
  }

  bool get _step0Valid =>
      _nameCtrl.text.trim().isNotEmpty &&
      _emailValid &&
      _phoneCtrl.text.length >= 10;

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

                    if (_step == 0) ...[
                      Row(
                        children: [
                          Text('Your details',
                            style: GoogleFonts.inter(fontSize: 22, fontWeight: FontWeight.w800, color: kPrimaryDark)),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: kPrimaryNavy.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: kPrimaryNavy.withValues(alpha: 0.3)),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.shield_rounded, color: kPrimaryNavy, size: 12),
                                const SizedBox(width: 4),
                                Text('SECURE', style: dFont(size: 10, weight: FontWeight.w700, color: kPrimaryNavy)),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text('Tell us a bit about yourself', style: dFont(size: 14, color: kMutedText)),
                      const SizedBox(height: 24),
                      // Full Name
                      const SectionLabel('Full Name'),
                      const SizedBox(height: 8),
                      _inputField(
                        controller: _nameCtrl,
                        hint: 'Amaka Okonkwo',
                        icon: Icons.person_outline_rounded,
                      ),
                      const SizedBox(height: 16),
                      // Email Address (new)
                      const SectionLabel('Email Address'),
                      const SizedBox(height: 8),
                      _inputField(
                        controller: _emailCtrl,
                        hint: 'amaka@email.com',
                        icon: Icons.email_outlined,
                        type: TextInputType.emailAddress,
                        suffix: _emailCtrl.text.isNotEmpty
                            ? Icon(
                                _emailValid ? Icons.check_circle_rounded : Icons.cancel_rounded,
                                color: _emailValid ? kAccentGreen : kErrorRed, size: 18)
                            : null,
                      ),
                      const SizedBox(height: 16),
                      // Phone Number
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
                                maxLength: 11,
                                style: dFont(size: 15, weight: FontWeight.w600),
                                decoration: InputDecoration(
                                  hintText: '08012345678',
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
                      const SizedBox(height: 16),
                      // Referral Code
                      const SectionLabel('Referral Code (Optional)'),
                      const SizedBox(height: 8),
                      _inputField(
                        controller: _referralCtrl,
                        hint: 'e.g. REF123XYZ',
                        icon: Icons.card_giftcard_rounded,
                      ),
                      const SizedBox(height: 24),
                      PrimaryBtn(
                        label: _isLoading ? 'Checking...' : 'Continue Securely',
                        disabled: !_step0Valid || _isLoading,
                        onPressed: _checkExistingUser,
                      ),
                      const SizedBox(height: 24),
                      Center(
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.lock_rounded, color: kMutedText, size: 14),
                            const SizedBox(width: 6),
                            Text('End-to-End Encrypted', style: dFont(size: 12, color: kMutedText)),
                          ],
                        ),
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
                        label: _step == 1 ? 'Continue' : (_isLoading ? 'Creating...' : 'Create Account'),
                        disabled: _activePin.length < 6 || _isLoading,
                        onPressed: () {
                          if (_step == 1) {
                            setState(() { _step = 2; _confirm = ''; });
                          } else {
                            _handleSignup();
                          }
                        },
                      ),
                      const SizedBox(height: 20),
                      if (_step == 2)
                        Center(
                          child: Text(
                            'By creating an account, you agree to our Terms and Privacy Policy.',
                            textAlign: TextAlign.center,
                            style: dFont(size: 11, color: kMutedText),
                          ),
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

  Widget _inputField({
    required TextEditingController controller,
    required String hint,
    required IconData icon,
    TextInputType type = TextInputType.text,
    Widget? suffix,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: kCardBorder, width: 2),
      ),
      child: Row(
        children: [
          Padding(
            padding: const EdgeInsets.only(left: 14),
            child: Icon(icon, color: kMutedText, size: 20),
          ),
          Expanded(
            child: TextField(
              controller: controller,
              keyboardType: type,
              style: dFont(size: 15, weight: FontWeight.w600),
              decoration: InputDecoration(
                hintText: hint,
                hintStyle: dFont(size: 15, color: const Color(0xFFB8C4D9)),
                border: InputBorder.none,
                suffixIcon: suffix != null ? Padding(padding: const EdgeInsets.only(right: 12), child: suffix) : null,
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
