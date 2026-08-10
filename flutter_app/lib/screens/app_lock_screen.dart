import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:local_auth/local_auth.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widgets/shared_widgets.dart';

class AppLockScreen extends StatefulWidget {
  const AppLockScreen({super.key});
  @override
  State<AppLockScreen> createState() => _AppLockScreenState();
}

class _AppLockScreenState extends State<AppLockScreen> {
  String _pin = '';
  String? _savedPin;
  bool _biometricsEnabled = false;
  bool _showPinScreen = false;
  final LocalAuthentication auth = LocalAuthentication();

  @override
  void initState() {
    super.initState();
    _checkSetup();
  }

  Future<void> _checkSetup() async {
    final prefs = await SharedPreferences.getInstance();
    _savedPin = prefs.getString('account_pin'); // changed from app_lock_pin to be unified if needed, but we'll check whatever is saved
    if (_savedPin == null || _savedPin!.isEmpty) {
      // If no PIN is saved (e.g. from login), just bypass or force login
      // We will fallback to whatever is saved or just bypass if none.
      // But we should have saved it at login/signup.
    }
    
    _biometricsEnabled = prefs.getBool('setting_biometrics') ?? false;
    
    if (_biometricsEnabled) {
      _authenticateBiometrics();
    } else {
      setState(() => _showPinScreen = true);
    }
  }

  Future<void> _authenticateBiometrics() async {
    try {
      final canAuth = await auth.canCheckBiometrics || await auth.isDeviceSupported();
      if (!canAuth) return;
      final didAuth = await auth.authenticate(
        localizedReason: 'Unlock HananData',
        options: const AuthenticationOptions(
          biometricOnly: true,
          stickyAuth: true,
        ),
      );
      if (didAuth && mounted) {
        Navigator.pushReplacementNamed(context, '/home');
      }
    } catch (e) {
      debugPrint('Biometrics error: $e');
    }
  }

  void _onKey(String val) {
    if (_pin.length < 6) {
      setState(() => _pin += val);
      if (_pin.length == 6) {
        Future.delayed(const Duration(milliseconds: 200), _processPin);
      }
    }
  }

  void _onDelete() {
    if (_pin.isNotEmpty) {
      setState(() => _pin = _pin.substring(0, _pin.length - 1));
    }
  }

  void _processPin() async {
    // In a real app, you might verify this PIN with the backend. 
    // Here we verify with the locally saved pin if it exists, or just let them in if we haven't synced it yet for simplicity, but let's check local storage.
    final prefs = await SharedPreferences.getInstance();
    final saved = prefs.getString('account_pin') ?? prefs.getString('app_lock_pin');
    
    if (saved != null && saved.isNotEmpty) {
      if (_pin == saved) {
        if (mounted) Navigator.pushReplacementNamed(context, '/home');
      } else {
        if (mounted) showTopBanner(context, 'Incorrect PIN', isError: true);
        setState(() => _pin = '');
      }
    } else {
      // If no PIN was ever saved locally, let them through (fallback)
      if (mounted) Navigator.pushReplacementNamed(context, '/home');
    }
  }

  Widget _buildBiometricScreen() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Spacer(),
        GestureDetector(
          onTap: _authenticateBiometrics,
          child: Container(
            width: 100, height: 100,
            decoration: BoxDecoration(
              color: kAccentGreen.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.fingerprint_rounded, color: kAccentGreen, size: 60),
          ),
        ),
        const SizedBox(height: 24),
        Text('Unlock with Biometrics', style: dFont(size: 20, weight: FontWeight.w700)),
        const SizedBox(height: 8),
        Text('Tap the icon to authenticate', style: dFont(size: 14, color: kMutedText)),
        const Spacer(),
        Padding(
          padding: const EdgeInsets.all(24.0),
          child: SizedBox(
            width: double.infinity,
            child: OutlinedButton(
              onPressed: () => setState(() => _showPinScreen = true),
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                side: const BorderSide(color: kPrimaryNavy),
              ),
              child: Text('Use Account PIN', style: dFont(size: 16, weight: FontWeight.w700, color: kPrimaryNavy)),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildPinScreen() {
    return Column(
      children: [
        const SizedBox(height: 60),
        Container(
          width: 80, height: 80,
          decoration: BoxDecoration(
            color: kPrimaryNavy.withValues(alpha: 0.1),
            shape: BoxShape.circle,
          ),
          child: const Icon(Icons.lock_rounded, color: kPrimaryNavy, size: 40),
        ),
        const SizedBox(height: 24),
        Text('Enter your 6-digit PIN', style: dFont(size: 18, weight: FontWeight.w700)),
        const SizedBox(height: 8),
        Text('Welcome back to HananData', style: dFont(size: 14, color: kMutedText)),
        const SizedBox(height: 40),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(6, (index) {
            return Container(
              margin: const EdgeInsets.symmetric(horizontal: 8),
              width: 16, height: 16,
              decoration: BoxDecoration(
                color: _pin.length > index ? kPrimaryNavy : Colors.transparent,
                shape: BoxShape.circle,
                border: Border.all(color: _pin.length > index ? kPrimaryNavy : Colors.grey.shade400, width: 2),
              ),
            );
          }),
        ),
        if (_biometricsEnabled) ...[
          const SizedBox(height: 20),
          TextButton(
            onPressed: () => setState(() => _showPinScreen = false),
            child: Text('Use Biometrics', style: dFont(size: 15, color: kPrimaryBlue, weight: FontWeight.w600)),
          )
        ],
        const Spacer(),
        // Numpad
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 20),
          child: Column(
            children: [
              for (var i = 0; i < 3; i++)
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: List.generate(3, (j) {
                    final num = i * 3 + j + 1;
                    return _NumpadBtn(text: num.toString(), onTap: () => _onKey(num.toString()));
                  }),
                ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  const _NumpadBtn(text: '', onTap: null, isEmpty: true),
                  _NumpadBtn(text: '0', onTap: () => _onKey('0')),
                  _NumpadBtn(text: '⌫', onTap: _onDelete, isIcon: true),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: SafeArea(
        child: _showPinScreen ? _buildPinScreen() : _buildBiometricScreen(),
      ),
    );
  }
}

class _NumpadBtn extends StatelessWidget {
  final String text;
  final VoidCallback? onTap;
  final bool isEmpty;
  final bool isIcon;
  const _NumpadBtn({required this.text, this.onTap, this.isEmpty = false, this.isIcon = false});

  @override
  Widget build(BuildContext context) {
    if (isEmpty) return const SizedBox(width: 72, height: 72);
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 72, height: 72,
        alignment: Alignment.center,
        child: Text(text, style: dFont(size: isIcon ? 28 : 28, weight: FontWeight.w600)),
      ),
    );
  }
}
