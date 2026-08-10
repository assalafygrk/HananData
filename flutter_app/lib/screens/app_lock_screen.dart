import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:local_auth/local_auth.dart';
// import 'package:google_fonts/google_fonts.dart';
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
    _savedPin = prefs.getString(
        'account_pin'); // changed from app_lock_pin to be unified if needed, but we'll check whatever is saved
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
      final canAuth =
          await auth.canCheckBiometrics || await auth.isDeviceSupported();
      if (!canAuth) return;
      final didAuth = await auth.authenticate(
        localizedReason: 'Unlock HananData',
        biometricOnly: true,
        // stickyAuth: true,
      );
      if (didAuth && mounted) {
        Navigator.pushReplacementNamed(context, '/home');
      }
    } catch (e) {
      debugPrint('Biometrics error: $e');
    }
  }

  void _processPin() async {
    final prefs = await SharedPreferences.getInstance();
    
    // Check lockout
    final lockoutTimeStr = prefs.getString('app_lock_lockout_time');
    if (lockoutTimeStr != null) {
      final lockoutTime = DateTime.parse(lockoutTimeStr);
      if (DateTime.now().isBefore(lockoutTime)) {
        final diff = lockoutTime.difference(DateTime.now()).inMinutes;
        if (mounted) showTopBanner(context, 'Locked out. Try again in $diff minutes.', isError: true);
        setState(() => _pin = '');
        return;
      } else {
        await prefs.remove('app_lock_lockout_time');
        await prefs.remove('app_lock_failed_attempts');
      }
    }

    final saved = prefs.getString('accountPin');
    
    // Fallback: If no accountPin saved, don't let them in! Force them to login screen so it gets saved next time.
    if (saved == null || saved.isEmpty) {
      await ApiService.logout();
      if (mounted) {
        Navigator.pushReplacementNamed(context, '/login');
      }
      return;
    }

    if (_pin == saved) {
      await prefs.remove('app_lock_failed_attempts');
      if (mounted) Navigator.pushReplacementNamed(context, '/home');
    } else {
      int attempts = prefs.getInt('app_lock_failed_attempts') ?? 0;
      attempts++;
      if (attempts >= 5) {
        final lockoutTime = DateTime.now().add(const Duration(minutes: 3));
        await prefs.setString('app_lock_lockout_time', lockoutTime.toIso8601String());
        if (mounted) showTopBanner(context, 'Too many attempts. Locked out for 3 minutes.', isError: true);
      } else {
        await prefs.setInt('app_lock_failed_attempts', attempts);
        if (mounted) showTopBanner(context, 'Incorrect PIN. ${5 - attempts} attempts left.', isError: true);
      }
      setState(() => _pin = '');
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
            width: 100,
            height: 100,
            decoration: BoxDecoration(
              color: kAccentGreen.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.fingerprint_rounded,
                color: kAccentGreen, size: 60),
          ),
        ),
        const SizedBox(height: 24),
        Text('Unlock with Biometrics',
            style: dFont(size: 20, weight: FontWeight.w700)),
        const SizedBox(height: 8),
        Text('Tap the icon to authenticate',
            style: dFont(size: 14, color: kMutedText)),
        const Spacer(),
        Padding(
          padding: const EdgeInsets.all(24.0),
          child: SizedBox(
            width: double.infinity,
            child: OutlinedButton(
              onPressed: () => setState(() => _showPinScreen = true),
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16)),
                side: const BorderSide(color: kPrimaryNavy),
              ),
              child: Text('Use Account PIN',
                  style: dFont(
                      size: 16, weight: FontWeight.w700, color: kPrimaryNavy)),
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
        Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text('Enter your PIN',
              style: dFont(size: 22, weight: FontWeight.w800, color: Theme.of(context).brightness == Brightness.dark ? Colors.white : kPrimaryDark)),
            const SizedBox(height: 8),
            Text('Welcome back to HananData',
              style: dFont(size: 14, color: Theme.of(context).brightness == Brightness.dark ? Colors.white54 : kMutedText)),
          ],
        ),
        const SizedBox(height: 40),
        PINDots(value: _pin),
        if (_biometricsEnabled) ...[
          const SizedBox(height: 20),
          TextButton(
            onPressed: () => setState(() => _showPinScreen = false),
            child: Text('Use Biometrics',
                style: dFont(
                    size: 15, color: kPrimaryBlue, weight: FontWeight.w600)),
          )
        ],
        const Spacer(),
        NumPad(
          value: _pin,
          onChanged: (v) {
            setState(() => _pin = v);
            if (v.length == 6) {
              Future.delayed(const Duration(milliseconds: 100), _processPin);
            }
          },
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
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: _showPinScreen ? _buildPinScreen() : _buildBiometricScreen(),
        ),
      ),
    );
  }
}

