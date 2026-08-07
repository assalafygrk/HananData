import 'package:flutter/material.dart';
import '../constants/app_data.dart';
import '../widgets/shared_widgets.dart';

class NotificationDetailScreen extends StatelessWidget {
  const NotificationDetailScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final notif = ModalRoute.of(context)!.settings.arguments as AppNotification;

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Container(
              color: Theme.of(context).cardColor,
              padding: const EdgeInsets.fromLTRB(20, 16, 16, 14),
              child: Row(
                children: [
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: Container(
                      width: 36, height: 36,
                      decoration: BoxDecoration(
                        color: kBackground,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(Icons.chevron_left_rounded, size: 22, color: Theme.of(context).brightness == Brightness.dark ? Colors.white : kPrimaryDark),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Text('Notification Details',
                    style: dFont(size: 18, weight: FontWeight.w800, color: Theme.of(context).brightness == Brightness.dark ? Colors.white : kPrimaryDark)),
                ],
              ),
            ),
            const Divider(height: 1, color: kCardBorder),
            
            // Content
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Theme.of(context).cardColor,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: Theme.of(context).dividerColor),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 46, height: 46,
                            decoration: const BoxDecoration(
                              color: kBackground,
                              shape: BoxShape.circle,
                            ),
                            alignment: Alignment.center,
                            child: Text(notif.icon, style: const TextStyle(fontSize: 20)),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  notif.title,
                                  style: dFont(size: 16, weight: FontWeight.w700, color: Theme.of(context).brightness == Brightness.dark ? Colors.white : kPrimaryDark),
                                ),
                                const SizedBox(height: 4),
                                Row(
                                  children: [
                                    Icon(Icons.access_time_rounded, size: 14, color: Theme.of(context).brightness == Brightness.dark ? Colors.white54 : kMutedText.withValues(alpha: 0.6)),
                                    const SizedBox(width: 4),
                                    Text(notif.time, style: dFont(size: 12, color: Theme.of(context).brightness == Brightness.dark ? Colors.white54 : kMutedText)),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                      const Divider(color: kCardBorder, height: 1),
                      const SizedBox(height: 20),
                      Text(
                        notif.body,
                        style: dFont(size: 15, color: kMediumText, height: 1.6),
                      ),
                      const SizedBox(height: 30),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
