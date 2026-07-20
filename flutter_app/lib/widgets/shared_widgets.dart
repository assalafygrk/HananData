// lib/widgets/shared_widgets.dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_data.dart';

// ─── Design Tokens ────────────────────────────────────────────────────────────

const kPrimaryDark  = Color(0xFF0D1B35);
const kPrimaryNavy  = Color(0xFF1B3A6B);
const kPrimaryBlue  = Color(0xFF2952A3);
const kAccentGreen  = Color(0xFF00C896);
const kAccentGreen2 = Color(0xFF00A87D);
const kBackground   = Color(0xFFF4F6FA);
const kCardBorder   = Color(0xFFE2E8F4);
const kMutedText    = Color(0xFF6B7A99);
const kMediumText   = Color(0xFF3D4F6E);
const kErrorRed     = Color(0xFFE53E3E);

TextStyle dFont({
  double size = 14,
  FontWeight weight = FontWeight.w400,
  Color color = kPrimaryDark,
  double? letterSpacing,
}) =>
    GoogleFonts.inter(
      fontSize: size,
      fontWeight: weight,
      color: color,
      letterSpacing: letterSpacing,
    );

// ─── BottomNav ────────────────────────────────────────────────────────────────

class AppBottomNav extends StatelessWidget {
  final String active;
  final void Function(String) onTap;

  const AppBottomNav({super.key, required this.active, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final items = [
      const _NavItem(id: 'home',    label: 'Home'),
      const _NavItem(id: 'history', label: 'History'),
      const _NavItem(id: 'wallet',  label: 'Wallet'),
      const _NavItem(id: 'profile', label: 'Profile'),
    ];
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: kCardBorder)),
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.only(top: 10, bottom: 4),
          child: Row(
            children: items.map((item) {
              final on = active == item.id;
              final c = on ? kPrimaryNavy : kMutedText;
              return Expanded(
                child: GestureDetector(
                  onTap: () => onTap(item.id),
                  behavior: HitTestBehavior.opaque,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      _navIcon(item.id, c),
                      const SizedBox(height: 4),
                      Text(
                        item.label,
                        style: dFont(size: 10, weight: FontWeight.w700, color: c),
                      ),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
        ),
      ),
    );
  }

  Widget _navIcon(String id, Color c) {
    switch (id) {
      case 'home':
        return Icon(Icons.home_outlined, color: c, size: 22);
      case 'history':
        return Icon(Icons.access_time_rounded, color: c, size: 22);
      case 'wallet':
        return Icon(Icons.account_balance_wallet_outlined, color: c, size: 22);
      case 'profile':
        return Icon(Icons.person_outline_rounded, color: c, size: 22);
      default:
        return Icon(Icons.circle, color: c, size: 22);
    }
  }
}

class _NavItem {
  final String id;
  final String label;
  const _NavItem({required this.id, required this.label});
}

// ─── BackHeader ───────────────────────────────────────────────────────────────

class BackHeader extends StatelessWidget {
  final String title;
  final VoidCallback onBack;

  const BackHeader({super.key, required this.title, required this.onBack});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: kCardBorder)),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      child: Row(
        children: [
          GestureDetector(
            onTap: onBack,
            child: Container(
              width: 36, height: 36,
              decoration: BoxDecoration(
                color: kBackground,
                borderRadius: BorderRadius.circular(18),
              ),
              child: const Icon(Icons.chevron_left_rounded, color: kPrimaryDark, size: 22),
            ),
          ),
          const SizedBox(width: 12),
          Text(title, style: dFont(size: 17, weight: FontWeight.w800, color: kPrimaryDark)),
        ],
      ),
    );
  }
}

// ─── PrimaryBtn ───────────────────────────────────────────────────────────────

class PrimaryBtn extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final bool disabled;

  const PrimaryBtn({
    super.key,
    required this.label,
    required this.onPressed,
    this.disabled = false,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 54,
      child: DecoratedBox(
        decoration: BoxDecoration(
          gradient: disabled
              ? null
              : const LinearGradient(
                  colors: [kPrimaryNavy, kPrimaryBlue],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
          color: disabled ? kCardBorder : null,
          borderRadius: BorderRadius.circular(16),
        ),
        child: TextButton(
          onPressed: disabled ? null : onPressed,
          style: TextButton.styleFrom(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          ),
          child: Text(
            label,
            style: dFont(
              size: 16,
              weight: FontWeight.w700,
              color: disabled ? kMutedText : Colors.white,
            ),
          ),
        ),
      ),
    );
  }
}

// ─── PINDots ──────────────────────────────────────────────────────────────────

class PINDots extends StatelessWidget {
  final String value;
  final int max;

  const PINDots({super.key, required this.value, this.max = 6});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(max, (i) {
        final filled = value.length > i;
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 6),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 150),
            width: 44, height: 44,
            decoration: BoxDecoration(
              color: filled ? const Color(0xFFE8EDF5) : Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: filled ? kPrimaryNavy : kCardBorder,
                width: 2,
              ),
            ),
            child: filled
                ? Center(
                    child: Container(
                      width: 10, height: 10,
                      decoration: const BoxDecoration(
                        color: kPrimaryNavy,
                        shape: BoxShape.circle,
                      ),
                    ),
                  )
                : null,
          ),
        );
      }),
    );
  }
}

// ─── NumPad ───────────────────────────────────────────────────────────────────

class NumPad extends StatelessWidget {
  final String value;
  final ValueChanged<String> onChanged;
  final int max;

  const NumPad({super.key, required this.value, required this.onChanged, this.max = 6});

  @override
  Widget build(BuildContext context) {
    final keys = ['1','2','3','4','5','6','7','8','9','','0','⌫'];
    return GridView.count(
      crossAxisCount: 3,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 8,
      crossAxisSpacing: 8,
      childAspectRatio: 1.6,
      children: keys.map((k) {
        if (k.isEmpty) return const SizedBox();
        return GestureDetector(
          onTap: () {
            if (k == '⌫') {
              if (value.isNotEmpty) onChanged(value.substring(0, value.length - 1));
            } else if (value.length < max) {
              onChanged(value + k);
            }
          },
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 80),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: kCardBorder),
            ),
            alignment: Alignment.center,
            child: Text(
              k,
              style: dFont(size: 18, weight: FontWeight.w600, color: kPrimaryDark),
            ),
          ),
        );
      }).toList(),
    );
  }
}

// ─── NetworkBadge ─────────────────────────────────────────────────────────────

class NetworkBadge extends StatelessWidget {
  final String network;
  const NetworkBadge({super.key, required this.network});

  @override
  Widget build(BuildContext context) {
    final n = kNetworks.firstWhere(
      (x) => x.name == network || x.id == network.toLowerCase(),
      orElse: () => NetworkInfo(
        id: '', name: network, logoLetter: network.isNotEmpty ? network[0] : '?',
        color: kMutedText, bg: kBackground,
        text: kMutedText, dot: kMutedText,
      ),
    );
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: n.bg,
        borderRadius: BorderRadius.circular(99),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(width: 6, height: 6, decoration: BoxDecoration(color: n.dot, shape: BoxShape.circle)),
          const SizedBox(width: 4),
          Text(n.name, style: dFont(size: 11, weight: FontWeight.w600, color: n.text)),
        ],
      ),
    );
  }
}

// ─── NetworkLogoChip ──────────────────────────────────────────────────────────
// Circular logo for network / cable provider selection

class NetworkLogoChip extends StatelessWidget {
  final String letter;
  final String label;
  final String? logoUrl;
  final Color brandColor;
  final Color bgColor;
  final Color textColor;
  final bool selected;
  final VoidCallback onTap;

  const NetworkLogoChip({
    super.key,
    required this.letter,
    required this.label,
    this.logoUrl,
    required this.brandColor,
    required this.bgColor,
    required this.textColor,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 6),
        decoration: BoxDecoration(
          color: selected ? bgColor : Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: selected ? brandColor : kCardBorder,
            width: 2,
          ),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Circular logo — real image when URL provided, letter fallback
            AnimatedContainer(
              duration: const Duration(milliseconds: 150),
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: selected ? brandColor : brandColor.withValues(alpha: 0.15),
                shape: BoxShape.circle,
              ),
              alignment: Alignment.center,
              child: Text(
                letter,
                style: GoogleFonts.inter(
                  fontSize: 18,
                  fontWeight: FontWeight.w900,
                  color: selected ? Colors.white : brandColor,
                ),
              ),
            ),
            const SizedBox(height: 6),
            Text(
              label,
              style: dFont(
                size: 11,
                weight: FontWeight.w700,
                color: selected ? textColor : kMutedText,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}

// ─── DiscoLogoChip (Electricity) — shows logo + name ─────────────────────────

class DiscoLogoChip extends StatelessWidget {
  final String shortName;
  final Color brandColor;
  final bool selected;
  final VoidCallback onTap;

  const DiscoLogoChip({
    super.key,
    required this.shortName,
    required this.brandColor,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        margin: const EdgeInsets.only(right: 10),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: selected ? brandColor.withValues(alpha: 0.12) : Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: selected ? brandColor : kCardBorder,
            width: 2,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Round logo circle
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: selected ? brandColor : brandColor.withValues(alpha: 0.15),
                shape: BoxShape.circle,
              ),
              alignment: Alignment.center,
              child: Text(
                shortName[0],
                style: GoogleFonts.inter(
                  fontSize: 15,
                  fontWeight: FontWeight.w900,
                  color: selected ? Colors.white : brandColor,
                ),
              ),
            ),
            const SizedBox(width: 8),
            // Name
            Text(
              shortName,
              style: dFont(
                size: 12,
                weight: FontWeight.w700,
                color: selected ? brandColor : kMediumText,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── TxnRow ───────────────────────────────────────────────────────────────────

class TxnRow extends StatelessWidget {
  final HistoryItem txn;
  final bool tappable;
  const TxnRow({super.key, required this.txn, this.tappable = true});

  @override
  Widget build(BuildContext context) {
    final isPos = txn.amount > 0;

    return GestureDetector(
      onTap: tappable ? () => _showDetail(context) : null,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFF0F4FA)),
        ),
        child: Row(
          children: [
            // Company logo circle
            _TxnLogo(txn: txn),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(txn.desc,
                    overflow: TextOverflow.ellipsis,
                    style: dFont(size: 14, weight: FontWeight.w600, color: kPrimaryDark)),
                  const SizedBox(height: 3),
                  Row(
                    children: [
                      if (txn.network != null) ...[
                        NetworkBadge(network: txn.network!),
                        const SizedBox(width: 6),
                      ],
                      Text(txn.date, style: dFont(size: 11, color: kMutedText)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  '${isPos ? '+' : ''}₦${fmtNaira(txn.amount.abs())}',
                  style: dFont(
                    size: 14, weight: FontWeight.w700,
                    color: isPos ? kAccentGreen2 : kPrimaryDark,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  txn.status.toUpperCase(),
                  style: dFont(
                    size: 10, weight: FontWeight.w700,
                    color: txn.status == 'success' ? kAccentGreen : kErrorRed,
                    letterSpacing: 0.5,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _showDetail(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => TxnDetailSheet(txn: txn),
    );
  }
}

// ─── TxnLogo ─────────────────────────────────────────────────────────────────

class _TxnLogo extends StatelessWidget {
  final HistoryItem txn;
  const _TxnLogo({required this.txn});

  @override
  Widget build(BuildContext context) {
    // For network-based types (data, airtime, airtimecash)
    if (txn.network != null) {
      final net = kNetworks.firstWhere(
        (n) => n.name == txn.network || n.id == txn.network!.toLowerCase(),
        orElse: () => NetworkInfo(
          id: '', name: txn.network!, logoLetter: txn.network![0],
          color: kMutedText, bg: kBackground, text: kMutedText, dot: kMutedText,
        ),
      );
      return Container(
        width: 44, height: 44,
        decoration: BoxDecoration(
          color: net.color.withValues(alpha: 0.15),
          shape: BoxShape.circle,
        ),
        alignment: Alignment.center,
        child: Text(
          net.logoLetter,
          style: GoogleFonts.inter(
            fontSize: 18, fontWeight: FontWeight.w900, color: net.color,
          ),
        ),
      );
    }

    // For cable TV
    if (txn.type == 'cable' && txn.provider != null) {
      final prov = kCableProviders.firstWhere(
        (p) => p.name == txn.provider,
        orElse: () => CableProvider(
          id: '', name: txn.provider!, logoLetter: txn.provider![0],
          color: kPrimaryNavy, bg: kBackground,
        ),
      );
      return Container(
        width: 44, height: 44,
        decoration: BoxDecoration(
          color: prov.color.withValues(alpha: 0.15),
          shape: BoxShape.circle,
        ),
        alignment: Alignment.center,
        child: Text(
          prov.logoLetter,
          style: GoogleFonts.inter(
            fontSize: 18, fontWeight: FontWeight.w900, color: prov.color,
          ),
        ),
      );
    }

    // For electricity
    if (txn.type == 'electricity' && txn.provider != null) {
      final c = discoColor(txn.provider!);
      return Container(
        width: 44, height: 44,
        decoration: BoxDecoration(
          color: c.withValues(alpha: 0.15),
          shape: BoxShape.circle,
        ),
        alignment: Alignment.center,
        child: Text(
          txn.provider![0],
          style: GoogleFonts.inter(
            fontSize: 18, fontWeight: FontWeight.w900, color: c,
          ),
        ),
      );
    }

    // Wallet
    if (txn.type == 'wallet') {
      return Container(
        width: 44, height: 44,
        decoration: BoxDecoration(
          color: kAccentGreen.withValues(alpha: 0.15),
          shape: BoxShape.circle,
        ),
        alignment: Alignment.center,
        child: const Icon(Icons.account_balance_wallet_outlined, color: kAccentGreen, size: 20),
      );
    }

    // Fallback generic icon
    return Container(
      width: 44, height: 44,
      decoration: BoxDecoration(
        color: const Color(0xFFF0F4FA),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Icon(_txnIcon(txn.type), color: kPrimaryNavy, size: 20),
    );
  }

  IconData _txnIcon(String type) {
    switch (type) {
      case 'data':        return Icons.signal_cellular_alt_rounded;
      case 'airtime':     return Icons.phone_android_rounded;
      case 'cable':       return Icons.tv_rounded;
      case 'electricity': return Icons.bolt_rounded;
      case 'airtimecash': return Icons.swap_horiz_rounded;
      case 'wallet':      return Icons.account_balance_wallet_outlined;
      default:            return Icons.receipt_long_rounded;
    }
  }
}

// ─── TxnDetailSheet ───────────────────────────────────────────────────────────

class TxnDetailSheet extends StatelessWidget {
  final HistoryItem txn;
  const TxnDetailSheet({super.key, required this.txn});

  @override
  Widget build(BuildContext context) {
    final isPos = txn.amount > 0;
    final statusColor = txn.status == 'success' ? kAccentGreen : kErrorRed;
    final statusBg = txn.status == 'success' ? const Color(0xFFE6F9F4) : const Color(0xFFFEE2E2);

    return Container(
      margin: const EdgeInsets.only(top: 60),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Handle
          Container(
            margin: const EdgeInsets.only(top: 12),
            width: 40, height: 4,
            decoration: BoxDecoration(
              color: kCardBorder,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          Flexible(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(24, 20, 24, 32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header with logo + title
                  Row(
                    children: [
                      _TxnLogo(txn: txn),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(txn.desc,
                              style: dFont(size: 16, weight: FontWeight.w800, color: kPrimaryDark)),
                            const SizedBox(height: 2),
                            Text(txn.date, style: dFont(size: 12, color: kMutedText)),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  // Amount display
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: isPos
                            ? [const Color(0xFF00C896), const Color(0xFF00A87D)]
                            : [kPrimaryNavy, kPrimaryBlue],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Column(
                      children: [
                        Text(
                          isPos ? 'Amount Received' : 'Amount Paid',
                          style: dFont(size: 12, color: Colors.white.withValues(alpha: 0.8)),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          '${isPos ? '+' : '−'}₦${fmtNaira(txn.amount.abs())}',
                          style: GoogleFonts.inter(
                            fontSize: 32, fontWeight: FontWeight.w900, color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                  // Status badge
                  Center(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                      decoration: BoxDecoration(
                        color: statusBg,
                        borderRadius: BorderRadius.circular(99),
                        border: Border.all(color: statusColor),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            txn.status == 'success'
                                ? Icons.check_circle_rounded
                                : Icons.cancel_rounded,
                            color: statusColor, size: 16,
                          ),
                          const SizedBox(width: 6),
                          Text(
                            txn.status == 'success' ? 'Transaction Successful' : 'Transaction Failed',
                            style: dFont(size: 13, weight: FontWeight.w700, color: statusColor),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  // Details card
                  Container(
                    decoration: BoxDecoration(
                      color: kBackground,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: kCardBorder),
                    ),
                    child: Column(
                      children: [
                        _detailRow('Type', txn.type.toUpperCase()),
                        const Divider(height: 1, color: kCardBorder),
                        if (txn.network != null) ...[
                          _detailRow('Network', txn.network!),
                          const Divider(height: 1, color: kCardBorder),
                        ],
                        if (txn.provider != null) ...[
                          _detailRow('Provider', txn.provider!),
                          const Divider(height: 1, color: kCardBorder),
                        ],
                        if (txn.plan != null) ...[
                          _detailRow('Plan / Package', txn.plan!),
                          const Divider(height: 1, color: kCardBorder),
                        ],
                        _detailRow('Date', txn.date),
                        const Divider(height: 1, color: kCardBorder),
                        _detailRow('Reference', txn.refId,
                          valueColor: kPrimaryNavy,
                          valueBold: true,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  // Share receipt button
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: OutlinedButton.icon(
                      onPressed: () => Navigator.pop(context),
                      icon: const Icon(Icons.share_rounded, size: 18),
                      label: const Text('Share Receipt'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: kPrimaryNavy,
                        side: const BorderSide(color: kCardBorder, width: 2),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        textStyle: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _detailRow(
    String label,
    String value, {
    Color? valueColor,
    bool valueBold = false,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: dFont(size: 13, color: kMutedText)),
          const SizedBox(width: 16),
          Flexible(
            child: Text(
              value,
              textAlign: TextAlign.end,
              style: dFont(
                size: 13,
                weight: valueBold ? FontWeight.w700 : FontWeight.w600,
                color: valueColor ?? kPrimaryDark,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Section Label ────────────────────────────────────────────────────────────

class SectionLabel extends StatelessWidget {
  final String label;
  const SectionLabel(this.label, {super.key});

  @override
  Widget build(BuildContext context) => Text(
    label.toUpperCase(),
    style: dFont(size: 11, weight: FontWeight.w700, color: kMutedText, letterSpacing: 1.2),
  );
}

// ─── Amount Input Field ───────────────────────────────────────────────────────

class AmountField extends StatelessWidget {
  final TextEditingController controller;
  final String placeholder;

  const AmountField({super.key, required this.controller, this.placeholder = '0'});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: kCardBorder, width: 2),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: Row(
        children: [
          Text('₦', style: dFont(size: 22, weight: FontWeight.w700, color: const Color(0xFFB8C4D9))),
          const SizedBox(width: 8),
          Expanded(
            child: TextField(
              controller: controller,
              keyboardType: TextInputType.number,
              style: GoogleFonts.inter(fontSize: 22, fontWeight: FontWeight.w800, color: kPrimaryDark),
              decoration: InputDecoration(
                hintText: placeholder,
                hintStyle: GoogleFonts.inter(fontSize: 22, color: const Color(0xFFB8C4D9)),
                border: InputBorder.none,
                isDense: true,
                contentPadding: const EdgeInsets.symmetric(vertical: 12),
              ),
              onChanged: (v) {
                final clean = v.replaceAll(RegExp(r'[^0-9]'), '');
                if (clean != v) controller.value = controller.value.copyWith(text: clean);
              },
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Quick Amount Chips ───────────────────────────────────────────────────────

class QuickAmountChips extends StatelessWidget {
  final List<int> amounts;
  final String current;
  final ValueChanged<String> onSelect;

  const QuickAmountChips({
    super.key,
    required this.amounts,
    required this.current,
    required this.onSelect,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: amounts.map((a) {
        final selected = current == a.toString();
        return Expanded(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 3),
            child: GestureDetector(
              onTap: () => onSelect(a.toString()),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 150),
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  color: selected ? const Color(0xFFE8EDF5) : Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: selected ? kPrimaryNavy : kCardBorder,
                  ),
                ),
                alignment: Alignment.center,
                child: Text(
                  '₦${fmtNaira(a)}',
                  style: dFont(
                    size: 11, weight: FontWeight.w700,
                    color: selected ? kPrimaryNavy : kMediumText,
                  ),
                ),
              ),
            ),
          ),
        );
      }).toList(),
    );
  }
}

// ─── Pill Segmented Control ───────────────────────────────────────────────────

class PillSegment extends StatelessWidget {
  final List<String> options;
  final String selected;
  final ValueChanged<String> onSelect;

  const PillSegment({
    super.key,
    required this.options,
    required this.selected,
    required this.onSelect,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: kCardBorder),
      ),
      child: Row(
        children: options.map((opt) {
          final on = selected == opt;
          return Expanded(
            child: GestureDetector(
              onTap: () => onSelect(opt),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  color: on ? kPrimaryNavy : Colors.transparent,
                  borderRadius: BorderRadius.circular(12),
                ),
                alignment: Alignment.center,
                child: Text(
                  opt,
                  style: dFont(
                    size: 13, weight: FontWeight.w700,
                    color: on ? Colors.white : kMutedText,
                  ),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}

// ─── AppLoader ────────────────────────────────────────────────────────────────

class AppLoader extends StatefulWidget {
  final String? message;
  const AppLoader({super.key, this.message});

  @override
  State<AppLoader> createState() => _AppLoaderState();
}

class _AppLoaderState extends State<AppLoader>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _rotate;
  late Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat();
    _rotate = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _ctrl, curve: Curves.linear),
    );
    _scale = Tween<double>(begin: 0.9, end: 1.1).animate(
      CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        AnimatedBuilder(
          animation: _ctrl,
          builder: (_, __) => Transform.scale(
            scale: _scale.value,
            child: Stack(
              alignment: Alignment.center,
              children: [
                // Outer spinning ring
                Transform.rotate(
                  angle: _rotate.value * 2 * 3.14159,
                  child: const SizedBox(
                    width: 54, height: 54,
                    child: CircularProgressIndicator(
                      value: 0.75,
                      strokeWidth: 3,
                      backgroundColor: kCardBorder,
                      valueColor: AlwaysStoppedAnimation<Color>(kAccentGreen),
                      strokeCap: StrokeCap.round,
                    ),
                  ),
                ),
                // Inner logo
                Container(
                  width: 38, height: 38,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [kPrimaryNavy, kPrimaryBlue],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  alignment: Alignment.center,
                  child: Text('H',
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      fontWeight: FontWeight.w900,
                      color: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
        if (widget.message != null) ...[
          const SizedBox(height: 16),
          Text(
            widget.message!,
            style: dFont(size: 14, color: kMutedText),
            textAlign: TextAlign.center,
          ),
        ],
      ],
    );
  }
}

// Full-screen loading overlay
class AppLoadingOverlay extends StatelessWidget {
  final String? message;
  const AppLoadingOverlay({super.key, this.message});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      width: double.infinity,
      height: double.infinity,
      child: Center(
        child: AppLoader(message: message),
      ),
    );
  }
}
