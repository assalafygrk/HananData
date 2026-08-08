// lib/main.dart
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';

import 'screens/splash_screen.dart';
import 'screens/onboarding_screen.dart';
import 'screens/login_screen.dart';
import 'screens/signup_screen.dart';
import 'screens/home_screen.dart';
import 'screens/data_screen.dart';
import 'screens/airtime_screen.dart';
import 'screens/cable_screen.dart';
import 'screens/electricity_screen.dart';
import 'screens/airtime_cash_screen.dart';
import 'screens/confirm_screen.dart';
import 'screens/success_screen.dart';
import 'screens/failed_screen.dart';
import 'screens/history_screen.dart';
import 'screens/wallet_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/notification_screen.dart';
import 'screens/settings_screen.dart';
import 'screens/legal_screen.dart';
import 'screens/my_referral_screen.dart';
import 'screens/exam_pin_screen.dart';
import 'screens/coming_soon_screen.dart';
import 'screens/notification_detail_screen.dart';
import 'screens/help_support_screen.dart';
import 'screens/forget_password_screen.dart';
import 'screens/forget_pin_screen.dart';
import 'screens/set_pin_screen.dart';
import 'screens/restricted_screen.dart';
import 'services/notification_service.dart';
import 'screens/app_lock_screen.dart';

final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await NotificationService().init();
  // Portrait only — Android-first phone layout
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
    statusBarIconBrightness: Brightness.dark,
  ));
  runApp(const HananDataApp());
}

class HananDataApp extends StatelessWidget {
  const HananDataApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'HananData',
      navigatorKey: navigatorKey,
      debugShowCheckedModeBanner: false,
      themeMode: ThemeMode.light,
      theme: AppTheme.lightTheme.copyWith(
        textTheme: GoogleFonts.interTextTheme(),
      ),
      initialRoute: '/splash',
          routes: {
            '/splash':         (_) => const SplashScreen(),
            '/onboarding':     (_) => const OnboardingScreen(),
            '/login':          (_) => const LoginScreen(),
            '/signup':         (_) => const SignupScreen(),
            '/home':           (_) => const HomeScreen(),
            '/data':           (_) => const DataScreen(),
            '/airtime':        (_) => const AirtimeScreen(),
            '/cable':          (_) => const CableScreen(),
            '/electricity':    (_) => const ElectricityScreen(),
            '/airtimecash':    (_) => const AirtimeCashScreen(),
            '/confirm':        (_) => const ConfirmScreen(),
            '/success':        (_) => const SuccessScreen(),
            '/failed':         (_) => const FailedScreen(),
            '/history':        (_) => const HistoryScreen(),
            '/wallet':         (_) => const WalletScreen(),
            '/profile':        (_) => const ProfileScreen(),
            '/notifications':  (_) => const NotificationScreen(),
            '/settings':       (_) => const SettingsScreen(),
            '/legal':          (_) => const LegalScreen(),
            '/my-referral':    (_) => const MyReferralScreen(),
            '/exam-pin':       (_) => const ExamPinScreen(),
            '/coming-soon':    (_) => const ComingSoonScreen(),
            '/notification-detail': (_) => const NotificationDetailScreen(),
            '/help-support':   (_) => const HelpSupportScreen(),
            '/forget_password':(_) => const ForgetPasswordScreen(),
            '/forget_pin':     (_) => const ForgetPinScreen(),
            '/set_pin':        (_) => const SetPinScreen(),
            '/restricted':     (_) => const RestrictedScreen(),
            '/app_lock':       (_) => const AppLockScreen(),
          },
          // ─── Custom page transitions ───────────────────────────────────────────
          onGenerateRoute: (settings) {
            final builder = _routeBuilders[settings.name];
            if (builder == null) return null;
            return PageRouteBuilder(
              settings: settings,
              pageBuilder: (ctx, animation, _) => builder(ctx),
              transitionsBuilder: (ctx, animation, secondaryAnimation, child) {
                final curved = CurvedAnimation(
                  parent: animation,
                  curve: Curves.easeOutCubic,
                );
                return SlideTransition(
                  position: Tween<Offset>(
                    begin: const Offset(1.0, 0.0),
                    end: Offset.zero,
                  ).animate(curved),
                  child: child,
                );
              },
              transitionDuration: const Duration(milliseconds: 280),
            );
          },
        );
  }
}

// Builders map for onGenerateRoute (same screens — covers argument-passing routes)
final _routeBuilders = <String, WidgetBuilder>{
  '/splash':        (_) => const SplashScreen(),
  '/onboarding':    (_) => const OnboardingScreen(),
  '/login':         (_) => const LoginScreen(),
  '/signup':        (_) => const SignupScreen(),
  '/home':          (_) => const HomeScreen(),
  '/data':          (_) => const DataScreen(),
  '/airtime':       (_) => const AirtimeScreen(),
  '/cable':         (_) => const CableScreen(),
  '/electricity':   (_) => const ElectricityScreen(),
  '/airtimecash':   (_) => const AirtimeCashScreen(),
  '/confirm':       (_) => const ConfirmScreen(),
  '/success':       (_) => const SuccessScreen(),
  '/failed':        (_) => const FailedScreen(),
  '/history':       (_) => const HistoryScreen(),
  '/wallet':        (_) => const WalletScreen(),
  '/profile':       (_) => const ProfileScreen(),
  '/notifications': (_) => const NotificationScreen(),
  '/settings':      (_) => const SettingsScreen(),
  '/legal':         (_) => const LegalScreen(),
  '/my-referral':   (_) => const MyReferralScreen(),
  '/exam-pin':      (_) => const ExamPinScreen(),
  '/coming-soon':   (_) => const ComingSoonScreen(),
  '/forget_password':(_) => const ForgetPasswordScreen(),
  '/forget_pin':    (_) => const ForgetPinScreen(),
  '/set_pin':       (_) => const SetPinScreen(),
  '/restricted':    (_) => const RestrictedScreen(),
  '/app_lock':      (_) => const AppLockScreen(),
};
