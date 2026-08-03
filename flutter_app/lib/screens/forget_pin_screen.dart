import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../widgets/shared_widgets.dart';
import '../utils/ui_helpers.dart';

class ForgetPinScreen extends StatefulWidget {
  const ForgetPinScreen({super.key});
  @override
  State<ForgetPinScreen> createState() => _ForgetPinScreenState();
}

class _ForgetPinScreenState extends State<ForgetPinScreen> {
  final _otpCtrl = TextEditingController();
  final _newPinCtrl = TextEditingController();
  bool _isLoading = false;
  bool _otpSent = false;
  bool _obscurePin = true;

  @override
  void initState() {
    super.initState();
    // Automatically request OTP when screen opens
    _requestOtp();
  }

  Future<void> _requestOtp() async {
    setState(() => _isLoading = true);
    final res = await ApiService.post('/profile/forgot-pin', {}, requiresAuth: true);
    setState(() => _isLoading = false);

    if (res['success'] == true) {
      setState(() => _otpSent = true);
      if (mounted) UiHelpers.showBanner(context, 'OTP sent successfully!');
    } else {
      if (mounted) UiHelpers.showBanner(context, res['message'] ?? 'Failed to send OTP', isError: true);
    }
  }

  Future<void> _verifyOtp() async {
    final otp = _otpCtrl.text.trim();
    final newPin = _newPinCtrl.text.trim();
    
    if (otp.isEmpty || newPin.isEmpty) {
      UiHelpers.showBanner(context, 'Please fill all fields', isError: true);
      return;
    }
    
    if (newPin.length != 4) {
      UiHelpers.showBanner(context, 'PIN must be 4 digits', isError: true);
      return;
    }
    
    setState(() => _isLoading = true);
    final res = await ApiService.post('/profile/verify-pin-otp', {
      'otp': otp,
      'newPin': newPin,
    }, requiresAuth: true);
    setState(() => _isLoading = false);

    if (res['success'] == true) {
      if (mounted) {
        UiHelpers.showBanner(context, 'PIN reset successfully!');
        Navigator.pop(context);
      }
    } else {
      if (mounted) UiHelpers.showBanner(context, res['message'] ?? 'Verification failed', isError: true);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Reset Transaction PIN')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Forgot PIN',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text(
              'Enter the OTP sent to your email to securely reset your transaction PIN.',
              style: TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 32),
            TextField(
              controller: _otpCtrl,
              decoration: InputDecoration(
                labelText: 'Enter OTP',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                prefixIcon: const Icon(Icons.security),
              ),
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _newPinCtrl,
              obscureText: _obscurePin,
              decoration: InputDecoration(
                labelText: 'New 4-Digit PIN',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                prefixIcon: const Icon(Icons.lock_outline),
                suffixIcon: IconButton(
                  icon: Icon(_obscurePin ? Icons.visibility_off : Icons.visibility),
                  onPressed: () => setState(() => _obscurePin = !_obscurePin),
                ),
              ),
              keyboardType: TextInputType.number,
              maxLength: 4,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _isLoading || !_otpSent ? null : _verifyOtp,
              style: ElevatedButton.styleFrom(
                backgroundColor: kPrimaryNavy,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: _isLoading
                  ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                  : const Text('Reset PIN', style: TextStyle(color: Colors.white, fontSize: 16)),
            ),
            if (!_otpSent) ...[
              const SizedBox(height: 16),
              TextButton(
                onPressed: _isLoading ? null : _requestOtp,
                child: const Text('Resend OTP'),
              )
            ]
          ],
        ),
      ),
    );
  }
}
