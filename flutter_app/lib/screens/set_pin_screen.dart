import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../widgets/shared_widgets.dart';
import '../utils/ui_helpers.dart';

class SetPinScreen extends StatefulWidget {
  const SetPinScreen({super.key});
  @override
  State<SetPinScreen> createState() => _SetPinScreenState();
}

class _SetPinScreenState extends State<SetPinScreen> {
  String _pin = '';
  String _confirmPin = '';
  bool _isConfirmStep = false;
  bool _isLoading = false;

  Future<void> _submitPin() async {
    if (_pin != _confirmPin) {
      UiHelpers.showBanner(context, 'PINs do not match', isError: true);
      setState(() {
        _pin = '';
        _confirmPin = '';
        _isConfirmStep = false;
      });
      return;
    }

    setState(() => _isLoading = true);
    final res = await ApiService.post('/profile/pin', {'newPin': _pin}, requiresAuth: true);
    setState(() => _isLoading = false);

    if (res['success'] == true) {
      if (mounted) {
        UiHelpers.showBanner(context, 'Transaction PIN set successfully!');
        if (Navigator.canPop(context)) {
          Navigator.pop(context);
        } else {
          Navigator.pushReplacementNamed(context, '/home');
        }
      }
    } else {
      if (mounted) {
        UiHelpers.showBanner(context, res['message'] ?? 'Failed to set PIN', isError: true);
        setState(() {
          _pin = '';
          _confirmPin = '';
          _isConfirmStep = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final currentPin = _isConfirmStep ? _confirmPin : _pin;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Set Transaction PIN'),
        automaticallyImplyLeading: false, // Force them to set it if needed, or we can allow back
      ),
      body: SafeArea(
        child: Column(
          children: [
            const SizedBox(height: 40),
            Text(
              _isConfirmStep ? 'Confirm your PIN' : 'Create a 4-digit PIN',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Theme.of(context).brightness == Brightness.dark ? Colors.white : kPrimaryDark),
            ),
            const SizedBox(height: 12),
            const Text(
              'This PIN will be required to authorize all your transactions.',
              style: TextStyle(color: Colors.grey),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 40),
            PINDots(value: currentPin, max: 4),
            const Spacer(),
            if (_isLoading)
              const CircularProgressIndicator()
            else
              NumPad(
                value: currentPin,
                max: 4,
                onChanged: (v) {
                  if (_isConfirmStep) {
                    setState(() => _confirmPin = v);
                    if (v.length == 4) _submitPin();
                  } else {
                    setState(() => _pin = v);
                    if (v.length == 4) {
                      Future.delayed(const Duration(milliseconds: 300), () {
                        setState(() => _isConfirmStep = true);
                      });
                    }
                  }
                },
              ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}
