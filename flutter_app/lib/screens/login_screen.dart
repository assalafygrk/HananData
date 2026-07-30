// lib/screens/login_screen.dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widgets/shared_widgets.dart';
import '../services/api_service.dart';
import '../utils/ui_helpers.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _phoneCtrl = TextEditingController();
  final _phoneFocus = FocusNode();
  String _pin = '';
  bool _onPin = false;
  bool _isLoading = false;
  bool _useEmail = false;

  @override
  void dispose() {
    _phoneCtrl.dispose();
    _phoneFocus.dispose();
    super.dispose();
  }

  Future<void> _goToPin() async {
    _phoneFocus.unfocus();
    FocusScope.of(context).unfocus();

    setState(() => _isLoading = true);
    final res = await ApiService.checkUserExists(_phoneCtrl.text.trim());
    setState(() => _isLoading = false);

    if (res['success'] == true) {
      if (res['data']['exists'] == true) {
        setState(() => _onPin = true);
      } else {
        if (mounted) {
          UiHelpers.showBanner(context, 'Account not found. Please sign up.', isError: true);
          Future.delayed(const Duration(seconds: 2), () {
            if (mounted) Navigator.pushReplacementNamed(context, '/signup');
          });
        }
      }
    } else {
      if (mounted) UiHelpers.showBanner(context, res['message'] ?? 'Network error', isError: true);
    }
  }

  Future<void> _handleLogin() async {
    setState(() => _isLoading = true);
    // Optionally format phone if needed, but backend probably expects whatever user inputs.
    final res = await ApiService.login(_phoneCtrl.text, _pin);
    setState(() => _isLoading = false);
    if (res['success'] == true) {
      if (mounted) {
        UiHelpers.showBanner(context, 'Welcome back!');
        Navigator.pushReplacementNamed(context, '/home');
      }
    } else {
      if (mounted) {
        UiHelpers.showBanner(context, res['message'] ?? 'Login failed', isError: true);
        setState(() => _pin = '');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final identifierValid = _useEmail
        ? RegExp(r'^[\w\-.]+@[\w\-]+\.\w{2,}$').hasMatch(_phoneCtrl.text.trim())
        : _phoneCtrl.text.length >= 10;

    return Scaffold(
      backgroundColor: kBackground,
      // Prevent bottom resize when keyboard shows — we manage it manually
      resizeToAvoidBottomInset: true,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 32),
                    // Logo mark
                    Container(
                      width: 56, height: 56,
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF00C896), Color(0xFF00A87D)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [
                          BoxShadow(
                            color: kAccentGreen.withValues(alpha: 0.3),
                            blurRadius: 16,
                            offset: const Offset(0, 6),
                          ),
                        ],
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        'H',
                        style: GoogleFonts.inter(
                          fontSize: 24, fontWeight: FontWeight.w900, color: Colors.white,
                        ),
                      ),
                    ),
                    const SizedBox(height: 28),
                    Row(
                      children: [
                        Text(
                          'Welcome back',
                          style: GoogleFonts.inter(
                            fontSize: 28, fontWeight: FontWeight.w800, color: kPrimaryDark,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: kAccentGreen.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: kAccentGreen.withValues(alpha: 0.3)),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.lock_rounded, color: kAccentGreen, size: 12),
                              const SizedBox(width: 4),
                              Text('SECURE', style: dFont(size: 10, weight: FontWeight.w700, color: kAccentGreen)),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Sign in securely to your HananData account',
                      style: dFont(size: 14, color: kMutedText),
                    ),
                    const SizedBox(height: 32),
                    // Phone field (only shown when not on PIN phase)
                    if (!_onPin) ...[
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          SectionLabel(_useEmail ? 'Email Address' : 'Phone Number'),
                          GestureDetector(
                            onTap: () {
                              setState(() {
                                _useEmail = !_useEmail;
                                _phoneCtrl.clear();
                              });
                            },
                            child: Text(
                              'Use ${_useEmail ? 'Phone' : 'Email'}',
                              style: dFont(size: 13, weight: FontWeight.w700, color: kPrimaryNavy),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: kCardBorder, width: 2),
                        ),
                        child: Row(
                          children: [
                            if (!_useEmail) ...[
                              Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                                child: Text(
                                  '🇳🇬 +234',
                                  style: dFont(size: 15, weight: FontWeight.w600, color: kMediumText),
                                ),
                              ),
                              Container(width: 1, height: 24, color: kCardBorder),
                            ] else ...[
                              const Padding(
                                padding: EdgeInsets.only(left: 16, right: 8, top: 14, bottom: 14),
                                child: Icon(Icons.email_outlined, color: kMutedText, size: 20),
                              ),
                            ],
                            Expanded(
                              child: TextField(
                                controller: _phoneCtrl,
                                focusNode: _phoneFocus,
                                keyboardType: _useEmail ? TextInputType.emailAddress : TextInputType.phone,
                                maxLength: _useEmail ? null : 10,
                                style: dFont(size: 15, weight: FontWeight.w600),
                                decoration: InputDecoration(
                                  hintText: _useEmail ? 'you@email.com' : '8012345678',
                                  hintStyle: dFont(size: 15, color: const Color(0xFFB8C4D9)),
                                  border: InputBorder.none,
                                  counterText: '',
                                  contentPadding: EdgeInsets.symmetric(horizontal: _useEmail ? 8 : 16, vertical: 14),
                                ),
                                onChanged: (_) => setState(() {}),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 20),
                      PrimaryBtn(
                        label: _isLoading ? 'Checking...' : 'Secure Login',
                        disabled: !identifierValid || _isLoading,
                        onPressed: _goToPin,
                      ),
                      const SizedBox(height: 24),
                      // Security badge
                      Center(
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.verified_user_rounded, color: kAccentGreen, size: 16),
                            const SizedBox(width: 6),
                            Text('256-bit Encryption Active', style: dFont(size: 12, color: kMutedText, weight: FontWeight.w600)),
                          ],
                        ),
                      ),
                    ] else ...[
                      // PIN entry — no system keyboard, only custom NumPad
                      Row(
                        children: [
                          GestureDetector(
                            onTap: () => setState(() { _onPin = false; _pin = ''; }),
                            child: Container(
                              width: 36, height: 36,
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(10),
                                border: Border.all(color: kCardBorder),
                              ),
                              child: const Icon(Icons.chevron_left_rounded, color: kPrimaryDark, size: 22),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Enter your PIN',
                                style: dFont(size: 18, weight: FontWeight.w800, color: kPrimaryDark)),
                              Text('+234 ${_phoneCtrl.text}',
                                style: dFont(size: 13, color: kMutedText)),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 28),
                      PINDots(value: _pin),
                      const SizedBox(height: 24),
                      // Custom NUM PAD — system keyboard is dismissed
                      NumPad(
                        value: _pin,
                        onChanged: (v) {
                          setState(() => _pin = v);
                          if (v.length == 6) {
                            _handleLogin();
                          }
                        },
                      ),
                      const SizedBox(height: 16),
                      PrimaryBtn(
                        label: _isLoading ? 'Authenticating...' : 'Sign In',
                        disabled: _pin.length < 6 || _isLoading,
                        onPressed: _handleLogin,
                      ),
                      const SizedBox(height: 16),
                      // Biometric Mock
                      GestureDetector(
                        onTap: () {
                          // Mock biometric success
                          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Biometric auth coming soon')));
                        },
                        child: Center(
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                            decoration: BoxDecoration(
                              color: kPrimaryNavy.withValues(alpha: 0.05),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(Icons.fingerprint_rounded, color: kPrimaryNavy, size: 20),
                                const SizedBox(width: 8),
                                Text('Use Biometrics', style: dFont(size: 14, weight: FontWeight.w700, color: kPrimaryNavy)),
                              ],
                            ),
                          ),
                        ),
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
