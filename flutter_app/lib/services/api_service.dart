import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static String get baseUrl {
    if (kIsWeb) return 'http://127.0.0.1:5000/api'; // or dynamically resolve based on window
    if (defaultTargetPlatform == TargetPlatform.android) return 'http://10.0.2.2:5000/api';
    return 'http://127.0.0.1:5000/api';
  }

  static Future<Map<String, String>> _getHeaders() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('userToken') ?? '';
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };
  }

  // --- Auth ---
  static Future<Map<String, dynamic>> checkUserExists(String phoneOrEmail) async {
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/auth/check'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'identifier': phoneOrEmail})
      );
      return jsonDecode(res.body);
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> login(String phoneOrEmail, String password) async {
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'phoneOrEmail': phoneOrEmail,
          'password': password
        })
      );
      final data = jsonDecode(res.body);
      if (res.statusCode == 200 && data['success'] == true) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('userToken', data['token']);
        await prefs.setString('userData', jsonEncode(data['data']));
      }
      return data;
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> signup(Map<String, dynamic> body) async {
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/auth/signup'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(body)
      );
      return jsonDecode(res.body);
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('userToken');
    await prefs.remove('userData');
  }

  // --- User / Wallet ---
  static Future<Map<String, dynamic>> getProfile() async {
    try {
      final headers = await _getHeaders();
      final res = await http.get(Uri.parse('$baseUrl/profile'), headers: headers);
      final data = jsonDecode(res.body);
      if (data['success'] == true) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('userData', jsonEncode(data['data']));
      }
      return data;
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> getUserTransactions() async {
    try {
      final headers = await _getHeaders();
      final res = await http.get(Uri.parse('$baseUrl/transactions/history'), headers: headers);
      return jsonDecode(res.body);
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> purchaseService(String type, Map<String, dynamic> body) async {
    try {
      final headers = await _getHeaders();
      final res = await http.post(
        Uri.parse('$baseUrl/services/$type'),
        headers: headers,
        body: jsonEncode(body)
      );
      return jsonDecode(res.body);
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> getNotifications() async {
    try {
      final headers = await _getHeaders();
      final res = await http.get(Uri.parse('$baseUrl/notifications'), headers: headers);
      return jsonDecode(res.body);
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> getReferrals() async {
    try {
      final headers = await _getHeaders();
      final res = await http.get(Uri.parse('$baseUrl/referrals/my-history'), headers: headers);
      return jsonDecode(res.body);
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }
}
