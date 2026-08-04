// lib/screens/coming_soon_screen.dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_data.dart';
import '../services/api_service.dart';
import '../widgets/shared_widgets.dart';

class ComingSoonScreen extends StatefulWidget {
  const ComingSoonScreen({super.key});
  @override
  State<ComingSoonScreen> createState() => _ComingSoonScreenState();
}

class _ComingSoonScreenState extends State<ComingSoonScreen> {
  bool _loading = true;
  List<dynamic> _services = [];
  final Set<String> _notifiedIds = {};

  @override
  void initState() {
    super.initState();
    _fetchServices();
  }

  Future<void> _fetchServices() async {
    try {
      final res = await ApiService.getUpcomingServices();
      if (res['success'] == true && mounted) {
        setState(() {
          _services = res['data'] ?? [];
          _loading = false;
        });
      } else {
        if (mounted) setState(() => _loading = false);
      }
    } catch (_) {
      if (mounted) setState(() => _loading = false);
    }
  }

  IconData _getIconData(String? iconName) {
    switch (iconName) {
      case 'card_giftcard':
        return Icons.card_giftcard_rounded;
      case 'public':
        return Icons.public_rounded;
      case 'sim_card':
        return Icons.sim_card_rounded;
      case 'autorenew':
        return Icons.autorenew_rounded;
      case 'attach_money':
        return Icons.attach_money_rounded;
      case 'business':
        return Icons.business_rounded;
      case 'school':
        return Icons.school_rounded;
      case 'savings':
        return Icons.savings_rounded;
      case 'currency_exchange':
        return Icons.currency_exchange_rounded;
      case 'account_balance':
        return Icons.account_balance_rounded;
      default:
        return Icons.auto_awesome_rounded;
    }
  }

  Map<String, dynamic> _getStatusBadge(String? status) {
    switch (status) {
      case 'testing':
        return {
          'label': 'Testing Phase',
          'color': const Color(0xFFE65100),
          'bg': const Color(0xFFFFF3E0),
        };
      case 'in_development':
        return {
          'label': 'In Development',
          'color': kPrimaryBlue,
          'bg': const Color(0xFFE8F0FE),
        };
      case 'released':
        return {
          'label': 'Releasing Soon',
          'color': kAccentGreen,
          'bg': const Color(0xFFE6F9F4),
        };
      default:
        return {
          'label': 'Planned',
          'color': kMutedText,
          'bg': const Color(0xFFF1F3F4),
        };
    }
  }

  void _toggleNotify(String id, String title) {
    setState(() {
      if (_notifiedIds.contains(id)) {
        _notifiedIds.remove(id);
      } else {
        _notifiedIds.add(id);
        showTopBanner(context, 'You will be notified when $title launches!', isError: false);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: SafeArea(
        child: Column(
          children: [
            BackHeader(title: 'Upcoming Features', onBack: () => Navigator.pop(context)),
            Expanded(
              child: _loading
                  ? const Center(child: CircularProgressIndicator())
                  : SingleChildScrollView(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Header Banner
                          Container(
                            width: double.infinity,
                            padding: const EdgeInsets.all(20),
                            decoration: BoxDecoration(
                              gradient: const LinearGradient(
                                colors: [Color(0xFF1B3A6B), Color(0xFF2A5A9E)],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              ),
                              borderRadius: BorderRadius.circular(20),
                              boxShadow: [
                                BoxShadow(
                                  color: kPrimaryNavy.withValues(alpha: 0.2),
                                  blurRadius: 15,
                                  offset: const Offset(0, 6),
                                ),
                              ],
                            ),
                            child: Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: Colors.white.withValues(alpha: 0.15),
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(Icons.rocket_launch_rounded, color: Colors.white, size: 30),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'Exciting Services Ahead!',
                                        style: GoogleFonts.inter(
                                          fontSize: 16,
                                          fontWeight: FontWeight.w800,
                                          color: Colors.white,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        'We are continuously building new products to power your transactions.',
                                        style: dFont(size: 12, color: Colors.white70),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 24),
                          const SectionLabel('In-Progress Pipeline'),
                          const SizedBox(height: 12),

                          if (_services.isEmpty)
                            Container(
                              width: double.infinity,
                              padding: const EdgeInsets.all(32),
                              alignment: Alignment.center,
                              child: Text(
                                'No upcoming services listed yet.',
                                textAlign: TextAlign.center,
                                style: dFont(size: 14, color: kMutedText),
                              ),
                            )
                          else
                            ..._services.map((svc) {
                              final id = svc['_id']?.toString() ?? svc['title'].toString();
                              final title = svc['title'] ?? 'Upcoming Feature';
                              final desc = svc['description'] ?? '';
                              final progress = ((svc['progress'] ?? 50) as num).toInt();
                              final expectedDate = svc['expectedDate'] ?? 'Soon';
                              final statusBadge = _getStatusBadge(svc['status']);
                              final isNotified = _notifiedIds.contains(id);

                              return Container(
                                margin: const EdgeInsets.only(bottom: 16),
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(color: kCardBorder),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withValues(alpha: 0.03),
                                      blurRadius: 10,
                                      offset: const Offset(0, 3),
                                    ),
                                  ],
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.all(10),
                                          decoration: BoxDecoration(
                                            color: kPrimaryBlue.withValues(alpha: 0.1),
                                            borderRadius: BorderRadius.circular(12),
                                          ),
                                          child: Icon(
                                            _getIconData(svc['icon']),
                                            color: kPrimaryBlue,
                                            size: 24,
                                          ),
                                        ),
                                        const SizedBox(width: 12),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                title,
                                                style: dFont(size: 15, weight: FontWeight.w800, color: kPrimaryDark),
                                              ),
                                              Text(
                                                'Est. Release: $expectedDate',
                                                style: dFont(size: 11, color: kMutedText),
                                              ),
                                            ],
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                          decoration: BoxDecoration(
                                            color: statusBadge['bg'] as Color,
                                            borderRadius: BorderRadius.circular(20),
                                          ),
                                          child: Text(
                                            statusBadge['label'] as String,
                                            style: dFont(
                                              size: 11,
                                              weight: FontWeight.w700,
                                              color: statusBadge['color'] as Color,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 12),
                                    Text(
                                      desc,
                                      style: dFont(size: 13, color: kPrimaryDark.withValues(alpha: 0.8)),
                                    ),
                                    const SizedBox(height: 16),

                                    // Progress Bar
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text('Development Progress', style: dFont(size: 11, color: kMutedText)),
                                        Text('$progress%', style: dFont(size: 12, weight: FontWeight.w800, color: kPrimaryNavy)),
                                      ],
                                    ),
                                    const SizedBox(height: 6),
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(10),
                                      child: LinearProgressIndicator(
                                        value: progress / 100.0,
                                        minHeight: 8,
                                        backgroundColor: kBackground,
                                        valueColor: AlwaysStoppedAnimation<Color>(
                                          progress > 80 ? kAccentGreen : kPrimaryBlue,
                                        ),
                                      ),
                                    ),
                                    const SizedBox(height: 14),

                                    // Notify Me Button
                                    Align(
                                      alignment: Alignment.centerRight,
                                      child: InkWell(
                                        onTap: () => _toggleNotify(id, title),
                                        borderRadius: BorderRadius.circular(12),
                                        child: AnimatedContainer(
                                          duration: const Duration(milliseconds: 200),
                                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                                          decoration: BoxDecoration(
                                            color: isNotified
                                                ? kAccentGreen.withValues(alpha: 0.12)
                                                : kPrimaryNavy.withValues(alpha: 0.06),
                                            borderRadius: BorderRadius.circular(12),
                                            border: Border.all(
                                              color: isNotified ? kAccentGreen : kPrimaryNavy.withValues(alpha: 0.2),
                                            ),
                                          ),
                                          child: Row(
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              Icon(
                                                isNotified ? Icons.notifications_active_rounded : Icons.notifications_none_rounded,
                                                size: 16,
                                                color: isNotified ? kAccentGreen : kPrimaryNavy,
                                              ),
                                              const SizedBox(width: 6),
                                              Text(
                                                isNotified ? 'Subscribed' : 'Notify Me',
                                                style: dFont(
                                                  size: 12,
                                                  weight: FontWeight.w700,
                                                  color: isNotified ? kAccentGreen : kPrimaryNavy,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            }),
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
