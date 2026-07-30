import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class UiHelpers {
  static void showBanner(BuildContext context, String message, {bool isError = false}) {
    final overlay = Overlay.of(context);
    final overlayEntry = OverlayEntry(
      builder: (context) => _TopBanner(message: message, isError: isError),
    );

    overlay.insert(overlayEntry);

    Future.delayed(const Duration(seconds: 3), () {
      if (overlayEntry.mounted) {
        overlayEntry.remove();
      }
    });
  }
}

class _TopBanner extends StatefulWidget {
  final String message;
  final bool isError;

  const _TopBanner({required this.message, required this.isError});

  @override
  State<_TopBanner> createState() => _TopBannerState();
}

class _TopBannerState extends State<_TopBanner> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<Offset> _offsetAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );

    _offsetAnimation = Tween<Offset>(
      begin: const Offset(0.0, -1.0),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOut,
    ));

    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Positioned(
      top: MediaQuery.of(context).padding.top + 10,
      left: 16,
      right: 16,
      child: Material(
        color: Colors.transparent,
        child: SlideTransition(
          position: _offsetAnimation,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: widget.isError ? const Color(0xFFFFEBEE) : const Color(0xFFE8F5E9),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: widget.isError ? const Color(0xFFEF5350) : const Color(0xFF66BB6A),
                width: 1,
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              children: [
                Icon(
                  widget.isError ? Icons.error_outline_rounded : Icons.check_circle_outline_rounded,
                  color: widget.isError ? const Color(0xFFE53935) : const Color(0xFF43A047),
                  size: 24,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    widget.message,
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: widget.isError ? const Color(0xFFC62828) : const Color(0xFF2E7D32),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
