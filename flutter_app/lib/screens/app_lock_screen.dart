import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:local_auth/local_auth.dart';
import '../widgets/shared_widgets.dart';

class AppLockScreen extends StatefulWidget {
  const AppLockScreen({super.key});
  @override
  State<AppLockScreen> createState() => _AppLockScreenState();
}

class _AppLockScreenState extends State<AppLockScreen> {
  String _pin = '';
  String? _savedPin;
  bool _isSettingPin = false;
  String _confirmPin = '';
  final LocalAuthentication auth = LocalAuthentication();

  @override
  void initState() {
    super.initState();
    _checkSetup();
  }

  Future<void> _checkSetup() async {
    final prefs = await SharedPreferences.getInstance();
    final saved = prefs.getString('app_lock_pin');
    if (saved == null || saved.isEmpty) {
      setState(() => _isSettingPin = true);
    } else {
      setState(() => _savedPin = saved);
      final biometricsEnabled = prefs.getBool('setting_biometrics') ?? false;
      if (biometricsEnabled) {
        _authenticateBiometrics();
      }
    }
  }

  Future<void> _authenticateBiometrics() async {
    try {
      final canAuth = await auth.canCheckBiometrics || await auth.isDeviceSupported();
      if (!canAuth) return;
      final didAuth = await auth.authenticate(
        localizedReason: 'Unlock HananData',
        persistAcrossBackgrounding: true,
        biometricOnly: true,
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
    if (_isSettingPin) {
      if (_confirmPin.isEmpty) {
        setState(() {
          _confirmPin = _pin;
          _pin = '';
        });
      } else {
        if (_confirmPin == _pin) {
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('app_lock_pin', _pin);
          if (mounted) Navigator.pushReplacementNamed(context, '/home');
        } else {
          showTopBanner(context, 'PINs do not match. Try again.', isError: true);
          setState(() {
            _confirmPin = '';
            _pin = '';
          });
        }
      }
    } else {
      if (_pin == _savedPin) {
        Navigator.pushReplacementNamed(context, '/home');
      } else {
        showTopBanner(context, 'Incorrect PIN', isError: true);
        setState(() => _pin = '');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    String title = 'Enter your 6-digit Account PIN';
    if (_isSettingPin) {
      title = _confirmPin.isEmpty ? 'Set a 6-digit Account PIN' : 'Confirm your 6-digit PIN';
    }

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: SafeArea(
        child: Column(
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
            Text(title, style: dFont(size: 18, weight: FontWeight.w700)),
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
            if (!_isSettingPin) ...[
              const SizedBox(height: 20),
              TextButton(
                onPressed: _authenticateBiometrics,
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
        ),
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
