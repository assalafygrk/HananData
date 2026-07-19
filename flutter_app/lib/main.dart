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

void main() {
  WidgetsFlutterBinding.ensureInitialized();
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
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF1B3A6B),
          brightness: Brightness.light,
        ),
        textTheme: GoogleFonts.interTextTheme(),
        useMaterial3: true,
        // Remove default splash & highlight
        splashColor: Colors.transparent,
        highlightColor: Colors.transparent,
      ),
      // ─── Named Routes ──────────────────────────────────────────────────────
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
};
