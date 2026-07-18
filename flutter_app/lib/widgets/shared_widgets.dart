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

// ─── StatusBar ────────────────────────────────────────────────────────────────

class AppStatusBar extends StatelessWidget {
  final bool dark;
  const AppStatusBar({super.key, this.dark = false});

  @override
  Widget build(BuildContext context) {
    final color = dark ? Colors.white.withValues(alpha: 0.8) : kPrimaryDark;
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 14, 20, 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text('9:41', style: dFont(size: 11, weight: FontWeight.w700, color: color)),
          Row(
            children: [
              _SignalIcon(color: color),
              const SizedBox(width: 6),
              _WifiIcon(color: color),
              const SizedBox(width: 6),
              _BatteryIcon(color: color),
            ],
          ),
        ],
      ),
    );
  }
}

class _SignalIcon extends StatelessWidget {
  final Color color;
  const _SignalIcon({required this.color});
  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        for (final h in [4.0, 6.0, 9.0, 11.0])
          Padding(
            padding: const EdgeInsets.only(left: 1.5),
            child: Container(
              width: 3, height: h,
              decoration: BoxDecoration(
                color: color.withValues(alpha: h < 9 ? 0.5 : 1.0),
                borderRadius: BorderRadius.circular(1),
              ),
            ),
          ),
      ],
    );
  }
}

class _WifiIcon extends StatelessWidget {
  final Color color;
  const _WifiIcon({required this.color});
  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      size: const Size(15, 11),
      painter: _WifiPainter(color: color),
    );
  }
}

class _WifiPainter extends CustomPainter {
  final Color color;
  _WifiPainter({required this.color});
  @override
  void paint(Canvas canvas, Size size) {
    final p = Paint()..color = color..strokeWidth = 1.6..style = PaintingStyle.stroke..strokeCap = StrokeCap.round;
    final w = size.width; final h = size.height;
    canvas.drawArc(Rect.fromLTRB(0, 0, w, h * 1.4), 3.93, 2.51, false, p);
    canvas.drawArc(Rect.fromLTRB(w * .2, h * .2, w * .8, h * 1.15), 3.93, 2.51, false, p);
    canvas.drawArc(Rect.fromLTRB(w * .38, h * .4, w * .62, h * .97), 3.93, 2.51, false, p);
    canvas.drawCircle(Offset(w / 2, h * .97), 1.5, Paint()..color = color);
  }
  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _BatteryIcon extends StatelessWidget {
  final Color color;
  const _BatteryIcon({required this.color});
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 24, height: 12,
      child: Stack(
        alignment: Alignment.centerLeft,
        children: [
          Container(
            width: 22, height: 11,
            decoration: BoxDecoration(
              border: Border.all(color: color.withValues(alpha: 0.4), width: 1),
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          Positioned(
            left: 2, top: 2,
            child: Container(
              width: 15, height: 7,
              decoration: BoxDecoration(
                color: color,
                borderRadius: BorderRadius.circular(1),
              ),
            ),
          ),
          Positioned(
            right: 0,
            child: Container(width: 2, height: 5, color: color.withValues(alpha: 0.6)),
          ),
        ],
      ),
    );
  }
}

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
        id: '', name: network,
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

// ─── TxnRow ───────────────────────────────────────────────────────────────────

class TxnRow extends StatelessWidget {
  final HistoryItem txn;
  const TxnRow({super.key, required this.txn});

  @override
  Widget build(BuildContext context) {
    final isPos = txn.amount > 0;
    final icon = _txnIcon(txn.type);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFF0F4FA)),
      ),
      child: Row(
        children: [
          Container(
            width: 40, height: 40,
            decoration: BoxDecoration(
              color: const Color(0xFFF0F4FA),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: kPrimaryNavy, size: 20),
          ),
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
