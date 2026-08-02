// lib/screens/settings_screen.dart
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../widgets/shared_widgets.dart';
import '../services/api_service.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});
  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _darkMode       = false;
  bool _biometrics     = false;
  bool _txnPin         = true;
  bool _pushNotifs     = true;
  bool _smsNotifs      = true;
  bool _emailNotifs    = false;
  bool _promoNotifs    = true;
  String _language     = 'English';
  String _currency     = 'NGN (₦)';

  @override
  void initState() {
    super.initState();
    _loadSettings();
  }

  Future<void> _loadSettings() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _darkMode    = prefs.getBool('setting_darkMode') ?? false;
      _biometrics  = prefs.getBool('setting_biometrics') ?? false;
      _txnPin      = prefs.getBool('setting_txnPin') ?? true;
      _pushNotifs  = prefs.getBool('setting_pushNotifs') ?? true;
      _smsNotifs   = prefs.getBool('setting_smsNotifs') ?? true;
      _emailNotifs = prefs.getBool('setting_emailNotifs') ?? false;
      _promoNotifs = prefs.getBool('setting_promoNotifs') ?? true;
      _language    = prefs.getString('setting_language') ?? 'English';
      _currency    = prefs.getString('setting_currency') ?? 'NGN (₦)';
    });
  }

  Future<void> _saveBool(String key, bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(key, value);

    if (key == 'setting_pushNotifs') {
      await ApiService.updateProfile({'pushNotifs': value});
    } else if (key == 'setting_smsNotifs') {
      await ApiService.updateProfile({'smsNotifs': value});
    } else if (key == 'setting_emailNotifs') {
      await ApiService.updateProfile({'emailNotifs': value});
    }
  }

  Future<void> _saveString(String key, String value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(key, value);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBackground,
      body: SafeArea(
        child: Column(
          children: [
            BackHeader(title: 'Settings', onBack: () => Navigator.pop(context)),
            Expanded(
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [

                    // ── Appearance ─────────────────────────────────────────
                    const _SectionHeader(label: 'Appearance', icon: Icons.palette_outlined),
                    _SettingGroup(children: [
                      _ToggleTile(
                        icon: Icons.dark_mode_rounded,
                        iconColor: const Color(0xFF5C4FC8),
                        label: 'Dark Mode',
                        sub: 'Switch to dark theme',
                        value: _darkMode,
                        onChanged: (v) { setState(() => _darkMode = v); _saveBool('setting_darkMode', v); },
                      ),
                      const _Divider(),
                      _TapTile(
                        icon: Icons.language_rounded,
                        iconColor: kPrimaryBlue,
                        label: 'Language',
                        sub: _language,
                        onTap: () => _pickOption(
                          title: 'Select Language',
                          options: ['English', 'Hausa', 'Yoruba', 'Igbo'],
                          current: _language,
                          onSelect: (v) { setState(() => _language = v); _saveString('setting_language', v); },
                        ),
                      ),
                      const _Divider(),
                      _TapTile(
                        icon: Icons.attach_money_rounded,
                        iconColor: kAccentGreen,
                        label: 'Currency Display',
                        sub: _currency,
                        onTap: () => _pickOption(
                          title: 'Select Currency',
                          options: ['NGN (₦)', 'USD (\$)', 'GBP (£)', 'EUR (€)'],
                          current: _currency,
                          onSelect: (v) { setState(() => _currency = v); _saveString('setting_currency', v); },
                        ),
                      ),
                    ]),

                    // ── Security ───────────────────────────────────────────
                    const _SectionHeader(label: 'Security', icon: Icons.security_rounded),
                    _SettingGroup(children: [
                      _ToggleTile(
                        icon: Icons.fingerprint_rounded,
                        iconColor: const Color(0xFF00897B),
                        label: 'Biometric Login',
                        sub: 'Use fingerprint or face ID',
                        value: _biometrics,
                        onChanged: (v) { setState(() => _biometrics = v); _saveBool('setting_biometrics', v); },
                      ),
                      const _Divider(),
                      _ToggleTile(
                        icon: Icons.pin_outlined,
                        iconColor: kPrimaryNavy,
                        label: 'Require PIN for Payments',
                        sub: 'Always verify with PIN',
                        value: _txnPin,
                        onChanged: (v) { setState(() => _txnPin = v); _saveBool('setting_txnPin', v); },
                      ),
                      const _Divider(),
                      _TapTile(
                        icon: Icons.lock_reset_rounded,
                        iconColor: kErrorRed,
                        label: 'Change Login PIN',
                        sub: 'Update your 6-digit PIN',
                        onTap: () => _showChangePIN(context),
                        showArrow: true,
                      ),
                      const _Divider(),
                      _TapTile(
                        icon: Icons.history_rounded,
                        iconColor: kMediumText,
                        label: 'Login Activity',
                        sub: 'View recent sessions',
                        onTap: () => _showComingSoon(context),
                        showArrow: true,
                      ),
                    ]),

                    // ── Notifications ──────────────────────────────────────
                    const _SectionHeader(label: 'Notifications', icon: Icons.notifications_outlined),
                    _SettingGroup(children: [
                      _ToggleTile(
                        icon: Icons.phone_android_rounded,
                        iconColor: kPrimaryNavy,
                        label: 'Push Notifications',
                        sub: 'App alerts on device',
                        value: _pushNotifs,
                        onChanged: (v) { setState(() => _pushNotifs = v); _saveBool('setting_pushNotifs', v); },
                      ),
                      const _Divider(),
                      _ToggleTile(
                        icon: Icons.sms_outlined,
                        iconColor: const Color(0xFF00897B),
                        label: 'SMS Alerts',
                        sub: 'Text message notifications',
                        value: _smsNotifs,
                        onChanged: (v) { setState(() => _smsNotifs = v); _saveBool('setting_smsNotifs', v); },
                      ),
                      const _Divider(),
                      _ToggleTile(
                        icon: Icons.email_outlined,
                        iconColor: kPrimaryBlue,
                        label: 'Email Notifications',
                        sub: 'Receive updates by email',
                        value: _emailNotifs,
                        onChanged: (v) { setState(() => _emailNotifs = v); _saveBool('setting_emailNotifs', v); },
                      ),
                      const _Divider(),
                      _ToggleTile(
                        icon: Icons.local_offer_outlined,
                        iconColor: const Color(0xFFF6A623),
                        label: 'Promotional Offers',
                        sub: 'Deals and special offers',
                        value: _promoNotifs,
                        onChanged: (v) { setState(() => _promoNotifs = v); _saveBool('setting_promoNotifs', v); },
                      ),
                    ]),

                    // ── Data & Privacy ─────────────────────────────────────
                    const _SectionHeader(label: 'Data & Privacy', icon: Icons.privacy_tip_outlined),
                    _SettingGroup(children: [
                      _TapTile(
                        icon: Icons.download_outlined,
                        iconColor: kPrimaryBlue,
                        label: 'Download My Data',
                        sub: 'Export account data',
                        onTap: () => _showComingSoon(context),
                        showArrow: true,
                      ),
                      const _Divider(),
                      _TapTile(
                        icon: Icons.delete_outline_rounded,
                        iconColor: kErrorRed,
                        label: 'Delete Account',
                        sub: 'Permanently remove account',
                        onTap: () => _confirmDelete(context),
                        showArrow: true,
                      ),
                    ]),

                    // ── App Info ───────────────────────────────────────────
                    const _SectionHeader(label: 'App Information', icon: Icons.info_outline_rounded),
                    _SettingGroup(children: [
                      _TapTile(
                        icon: Icons.system_update_rounded,
                        iconColor: kAccentGreen,
                        label: 'App Version',
                        sub: '2.4.1 (latest)',
                        onTap: () => _showComingSoon(context),
                      ),
                      const _Divider(),
                      _TapTile(
                        icon: Icons.cached_rounded,
                        iconColor: kMediumText,
                        label: 'Clear Cache',
                        sub: 'Free up storage space',
                        onTap: () => _showComingSoon(context),
                        showArrow: true,
                      ),
                    ]),
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

  void _showComingSoon(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Feature coming soon!', style: dFont(size: 14)),
        backgroundColor: kPrimaryNavy,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _showChangePIN(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => Container(
        margin: const EdgeInsets.only(top: 60),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(margin: const EdgeInsets.only(top: 12), width: 40, height: 4, decoration: BoxDecoration(color: kCardBorder, borderRadius: BorderRadius.circular(2))),
            Flexible(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(24, 20, 24, 32),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(children: [
                      const Text('🔐', style: TextStyle(fontSize: 24)),
                      const SizedBox(width: 10),
                      Text('Change PIN', style: dFont(size: 20, weight: FontWeight.w800)),
                    ]),
                    const SizedBox(height: 20),
                    Text('Enter your current PIN, then set a new one.', style: dFont(size: 13, color: kMutedText)),
                    const SizedBox(height: 20),
                    _pinField(label: 'Current PIN'),
                    const SizedBox(height: 16),
                    _pinField(label: 'New PIN'),
                    const SizedBox(height: 16),
                    _pinField(label: 'Confirm New PIN'),
                    const SizedBox(height: 24),
                    PrimaryBtn(label: 'Update PIN', onPressed: () => Navigator.pop(context)),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _pinField({required String label, int max = 6}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: dFont(size: 12, weight: FontWeight.w600, color: kMutedText)),
        const SizedBox(height: 6),
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: kCardBorder, width: 2),
          ),
          child: TextField(
            obscureText: true,
            maxLength: max,
            keyboardType: TextInputType.number,
            style: dFont(size: 20, letterSpacing: 4),
            decoration: InputDecoration(
              hintText: '•' * max,
              hintStyle: dFont(size: 20, color: kCardBorder, letterSpacing: 4),
              border: InputBorder.none,
              counterText: '',
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            ),
          ),
        ),
      ],
    );
  }

  void _pickOption({
    required String title,
    required List<String> options,
    required String current,
    required ValueChanged<String> onSelect,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => Container(
        margin: const EdgeInsets.only(top: 60),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(margin: const EdgeInsets.only(top: 12), width: 40, height: 4,
                decoration: BoxDecoration(color: kCardBorder, borderRadius: BorderRadius.circular(2))),
            Padding(padding: const EdgeInsets.fromLTRB(20, 16, 20, 4),
                child: Text(title, style: dFont(size: 18, weight: FontWeight.w800))),
            ...options.map((opt) {
              final on = opt == current;
              return ListTile(
                onTap: () { Navigator.pop(context); onSelect(opt); },
                title: Text(opt, style: dFont(size: 14, weight: FontWeight.w600,
                    color: on ? kPrimaryNavy : kPrimaryDark)),
                trailing: on ? const Icon(Icons.check_circle_rounded, color: kPrimaryNavy, size: 20) : null,
              );
            }),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  void _confirmDelete(BuildContext context) {
    showModalBottomSheet(
      context: context, isScrollControlled: true, backgroundColor: Colors.transparent,
      builder: (_) => Container(
        margin: const EdgeInsets.only(top: 60),
        decoration: const BoxDecoration(color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(24, 24, 24, 40),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(width: 64, height: 64,
                decoration: BoxDecoration(color: const Color(0xFFFEE2E2), borderRadius: BorderRadius.circular(20)),
                child: const Icon(Icons.delete_forever_rounded, color: kErrorRed, size: 32)),
              const SizedBox(height: 16),
              Text('Delete Account?', style: dFont(size: 20, weight: FontWeight.w800)),
              const SizedBox(height: 8),
              Text('This action is irreversible. All your data, transactions, and wallet balance will be permanently deleted.',
                  style: dFont(size: 13, color: kMutedText), textAlign: TextAlign.center),
              const SizedBox(height: 24),
              Row(children: [
                Expanded(child: OutlinedButton(
                  onPressed: () => Navigator.pop(context),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: kCardBorder),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  child: Text('Cancel', style: dFont(size: 14, weight: FontWeight.w700, color: kMediumText)),
                )),
                const SizedBox(width: 12),
                Expanded(child: ElevatedButton(
                  onPressed: () { Navigator.pop(context); },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: kErrorRed,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  child: Text('Delete', style: dFont(size: 14, weight: FontWeight.w700, color: Colors.white)),
                )),
              ]),
            ],
          ),
        ),
      ),
    );
  }
}

// ─── Reusable setting tiles ───────────────────────────────────────────────────

class _SectionHeader extends StatelessWidget {
  final String label;
  final IconData icon;
  const _SectionHeader({required this.label, required this.icon});
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.fromLTRB(20, 20, 20, 8),
    child: Row(
      children: [
        Icon(icon, size: 16, color: kMutedText),
        const SizedBox(width: 6),
        Text(label.toUpperCase(),
          style: dFont(size: 11, weight: FontWeight.w700, color: kMutedText, letterSpacing: 1.2)),
      ],
    ),
  );
}

class _SettingGroup extends StatelessWidget {
  final List<Widget> children;
  const _SettingGroup({required this.children});
  @override
  Widget build(BuildContext context) => Container(
    margin: const EdgeInsets.symmetric(horizontal: 20),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(16),
      border: Border.all(color: kCardBorder),
    ),
    child: Column(children: children),
  );
}

class _Divider extends StatelessWidget {
  const _Divider();
  @override
  Widget build(BuildContext context) =>
      const Divider(height: 1, color: kCardBorder, indent: 56);
}

class _ToggleTile extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String label;
  final String sub;
  final bool value;
  final ValueChanged<bool> onChanged;
  const _ToggleTile({required this.icon, required this.iconColor, required this.label,
      required this.sub, required this.value, required this.onChanged});
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
    child: Row(
      children: [
        Container(width: 36, height: 36,
          decoration: BoxDecoration(color: iconColor.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(10)),
          child: Icon(icon, color: iconColor, size: 18)),
        const SizedBox(width: 12),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(label, style: dFont(size: 14, weight: FontWeight.w600)),
          Text(sub, style: dFont(size: 12, color: kMutedText)),
        ])),
        Switch(value: value, onChanged: onChanged,
          activeTrackColor: kAccentGreen,
          thumbColor: WidgetStateProperty.all(Colors.white)),
      ],
    ),
  );
}

class _TapTile extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String label;
  final String sub;
  final VoidCallback onTap;
  final bool showArrow;
  const _TapTile({required this.icon, required this.iconColor, required this.label,
      required this.sub, required this.onTap, this.showArrow = false});
  @override
  Widget build(BuildContext context) => ListTile(
    onTap: onTap,
    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
    leading: Container(width: 36, height: 36,
      decoration: BoxDecoration(color: iconColor.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(10)),
      child: Icon(icon, color: iconColor, size: 18)),
    title: Text(label, style: dFont(size: 14, weight: FontWeight.w600)),
    subtitle: Text(sub, style: dFont(size: 12, color: kMutedText)),
    trailing: showArrow
        ? const Icon(Icons.chevron_right_rounded, color: kCardBorder, size: 20)
        : null,
  );
}
