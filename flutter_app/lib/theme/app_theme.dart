import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../widgets/shared_widgets.dart'; // To access brand colors

class ThemeProvider extends ChangeNotifier {
  ThemeMode themeMode = ThemeMode.light;

  ThemeProvider() {
    _loadTheme();
  }

  Future<void> _loadTheme() async {
    final prefs = await SharedPreferences.getInstance();
    final isDark = prefs.getBool('setting_darkMode') ?? false;
    themeMode = isDark ? ThemeMode.dark : ThemeMode.light;
    notifyListeners();
  }

  void toggleTheme(bool isDark) {
    themeMode = isDark ? ThemeMode.dark : ThemeMode.light;
    notifyListeners();
  }
}

class AppTheme {
  // Light Theme (Preserving original colors)
  static final ThemeData lightTheme = ThemeData(
    brightness: Brightness.light,
    scaffoldBackgroundColor: kBackground, // 0xFFF4F6FA
    primaryColor: kPrimaryNavy,
    cardColor: Colors.white,
    dividerColor: const Color(0xFFE2E8F0), // kCardBorder
    colorScheme: const ColorScheme.light(
      primary: kPrimaryNavy,
      secondary: kAccentGreen,
      surface: Colors.white,
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: kBackground,
      elevation: 0,
    ),
  );

  // Dark Theme (Tomorrow Night Blue with preserved brand accents)
  static final ThemeData darkTheme = ThemeData(
    brightness: Brightness.dark,
    scaffoldBackgroundColor: const Color(0xFF002451), // Tomorrow Night Blue
    primaryColor: kPrimaryNavy, // Preserved
    cardColor: const Color(0xFF003066), // Slightly lighter than bg
    dividerColor: const Color(0xFF004488),
    colorScheme: const ColorScheme.dark(
      primary: kPrimaryNavy,
      secondary: kAccentGreen,
      surface: Color(0xFF003066),
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: Color(0xFF002451),
      elevation: 0,
    ),
  );
}
