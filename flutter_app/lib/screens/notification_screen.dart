// lib/screens/notification_screen.dart
import 'package:flutter/material.dart';
import '../constants/app_data.dart';
import '../widgets/shared_widgets.dart';

class NotificationScreen extends StatefulWidget {
  const NotificationScreen({super.key});
  @override
  State<NotificationScreen> createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {
  // Local copy so we can mark as read
  late List<_NotifItem> _items;

  @override
  void initState() {
    super.initState();
    _items = kNotifications
        .map((n) => _NotifItem(notif: n, isRead: n.isRead))
        .toList();
  }

  int get _unreadCount => _items.where((n) => !n.isRead).length;

  void _markAll() {
    setState(() {
      for (final item in _items) {
        item.isRead = true;
      }
    });
  }

  void _tap(_NotifItem item) {
    setState(() => item.isRead = true);
    final route = item.notif.route;
    if (route != null && route.isNotEmpty) {
      Navigator.pop(context);
      Future.delayed(const Duration(milliseconds: 200), () {
        if (mounted) return;
        // Navigate is done after pop
      });
      Navigator.pushNamed(context, route);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBackground,
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Container(
              color: Colors.white,
              padding: const EdgeInsets.fromLTRB(20, 16, 16, 14),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      GestureDetector(
                        onTap: () => Navigator.pop(context),
                        child: Container(
                          width: 36, height: 36,
                          decoration: BoxDecoration(
                            color: kBackground,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(Icons.chevron_left_rounded, size: 22, color: kPrimaryDark),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Notifications',
                            style: dFont(size: 18, weight: FontWeight.w800, color: kPrimaryDark)),
                          if (_unreadCount > 0)
                            Text('$_unreadCount unread',
                              style: dFont(size: 12, color: kAccentGreen, weight: FontWeight.w600)),
                        ],
                      ),
                    ],
                  ),
                  if (_unreadCount > 0)
                    GestureDetector(
                      onTap: _markAll,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: const Color(0xFFE6F9F4),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Text('Mark all read',
                          style: dFont(size: 12, weight: FontWeight.w600, color: kAccentGreen2)),
                      ),
                    ),
                ],
              ),
            ),
            const Divider(height: 1, color: kCardBorder),
            // Notification list
            Expanded(
              child: _items.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.notifications_off_outlined,
                            color: kMutedText.withValues(alpha: 0.3), size: 56),
                          const SizedBox(height: 12),
                          Text('No notifications yet',
                            style: dFont(size: 14, color: kMutedText)),
                        ],
                      ),
                    )
                  : ListView.separated(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      itemCount: _items.length,
                      separatorBuilder: (_, __) =>
                          const Divider(height: 1, color: kCardBorder, indent: 72),
                      itemBuilder: (ctx, i) => _NotifTile(
                        item: _items[i],
                        onTap: () => _tap(_items[i]),
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Notification item (local mutable copy) ───────────────────────────────────

class _NotifItem {
  final AppNotification notif;
  bool isRead;
  _NotifItem({required this.notif, required this.isRead});
}

// ─── Notification tile ────────────────────────────────────────────────────────

class _NotifTile extends StatelessWidget {
  final _NotifItem item;
  final VoidCallback onTap;
  const _NotifTile({required this.item, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final n = item.notif;
    final unread = !item.isRead;

    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        color: unread ? const Color(0xFFF0F6FF) : Colors.white,
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Icon circle
            Container(
              width: 46, height: 46,
              decoration: BoxDecoration(
                color: unread
                    ? kPrimaryNavy.withValues(alpha: 0.1)
                    : kBackground,
                shape: BoxShape.circle,
              ),
              alignment: Alignment.center,
              child: Text(n.icon, style: const TextStyle(fontSize: 20)),
            ),
            const SizedBox(width: 14),
            // Content
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          n.title,
                          style: dFont(
                            size: 14,
                            weight: unread ? FontWeight.w700 : FontWeight.w600,
                            color: kPrimaryDark,
                          ),
                        ),
                      ),
                      // Unread dot
                      if (unread)
                        Container(
                          width: 8, height: 8,
                          margin: const EdgeInsets.only(left: 8),
                          decoration: const BoxDecoration(
                            color: kAccentGreen,
                            shape: BoxShape.circle,
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    n.body,
                    style: dFont(size: 13, color: kMutedText),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      Icon(Icons.access_time_rounded, size: 12, color: kMutedText.withValues(alpha: 0.6)),
                      const SizedBox(width: 4),
                      Text(n.time, style: dFont(size: 11, color: kMutedText)),
                      if (n.route != null) ...[
                        const SizedBox(width: 10),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: kPrimaryNavy.withValues(alpha: 0.08),
                            borderRadius: BorderRadius.circular(99),
                          ),
                          child: Text('View →',
                            style: dFont(size: 11, weight: FontWeight.w600, color: kPrimaryNavy)),
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
