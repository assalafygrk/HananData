import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../widgets/shared_widgets.dart';
import '../utils/ui_helpers.dart';

class ForgetPasswordScreen extends StatefulWidget {
  const ForgetPasswordScreen({super.key});
  @override
  State<ForgetPasswordScreen> createState() => _ForgetPasswordScreenState();
}

class _ForgetPasswordScreenState extends State<ForgetPasswordScreen> {
  final _identifierCtrl = TextEditingController();
  final _otpCtrl = TextEditingController();
  final _newPasswordCtrl = TextEditingController();
  bool _isLoading = false;
  bool _otpSent = false;
  bool _obscurePwd = true;

  Future<void> _requestOtp() async {
    final identifier = _identifierCtrl.text.trim();
    if (identifier.isEmpty) {
      UiHelpers.showBanner(context, 'Please enter your email or phone number', isError: true);
      return;
    }
    setState(() => _isLoading = true);
    final res = await ApiService.post('/auth/forgot-password', {'identifier': identifier});
    setState(() => _isLoading = false);

    if (res['success'] == true) {
      setState(() => _otpSent = true);
      if (mounted) UiHelpers.showBanner(context, 'OTP sent successfully!');
    } else {
      if (mounted) UiHelpers.showBanner(context, res['message'] ?? 'Failed to send OTP', isError: true);
    }
  }

  Future<void> _verifyOtp() async {
    final identifier = _identifierCtrl.text.trim();
    final otp = _otpCtrl.text.trim();
    final newPassword = _newPasswordCtrl.text;
    
    if (otp.isEmpty || newPassword.isEmpty) {
      UiHelpers.showBanner(context, 'Please fill all fields', isError: true);
      return;
    }
    
    setState(() => _isLoading = true);
    final res = await ApiService.post('/auth/verify-otp', {
      'identifier': identifier,
      'otp': otp,
      'newPassword': newPassword,
    });
    setState(() => _isLoading = false);

    if (res['success'] == true) {
      if (mounted) {
        UiHelpers.showBanner(context, 'Password reset successful. You can now login.');
        Navigator.pop(context);
      }
    } else {
      if (mounted) UiHelpers.showBanner(context, res['message'] ?? 'Verification failed', isError: true);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Reset Password')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Forgot Password',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              _otpSent ? 'Enter the OTP sent to your contact and a new password.' : 'Enter your email or phone number to receive an OTP.',
              style: const TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 32),
            if (!_otpSent) ...[
              TextField(
                controller: _identifierCtrl,
                decoration: InputDecoration(
                  labelText: 'Email or Phone',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  prefixIcon: const Icon(Icons.person_outline),
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _isLoading ? null : _requestOtp,
                style: ElevatedButton.styleFrom(
                  backgroundColor: kPrimaryNavy,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: _isLoading
                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Text('Send OTP', style: TextStyle(color: Colors.white, fontSize: 16)),
              ),
            ] else ...[
              TextField(
                controller: _identifierCtrl,
                enabled: false,
                decoration: InputDecoration(
                  labelText: 'Email or Phone',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  prefixIcon: const Icon(Icons.person_outline),
                ),
              ),
              const SizedBox(height: 16),
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
                controller: _newPasswordCtrl,
                obscureText: _obscurePwd,
                decoration: InputDecoration(
                  labelText: 'New Password',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  prefixIcon: const Icon(Icons.lock_outline),
                  suffixIcon: IconButton(
                    icon: Icon(_obscurePwd ? Icons.visibility_off : Icons.visibility),
                    onPressed: () => setState(() => _obscurePwd = !_obscurePwd),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _isLoading ? null : _verifyOtp,
                style: ElevatedButton.styleFrom(
                  backgroundColor: kPrimaryNavy,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: _isLoading
                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Text('Reset Password', style: TextStyle(color: Colors.white, fontSize: 16)),
              ),
            ]
          ],
        ),
      ),
    );
  }
}
