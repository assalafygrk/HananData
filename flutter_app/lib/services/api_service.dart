import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../main.dart'; // To access navigatorKey
class ApiService {
  static String? _customBaseUrl;

  static Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    _customBaseUrl = prefs.getString('customApiUrl');
  }

  static Future<void> setCustomBaseUrl(String url) async {
    final prefs = await SharedPreferences.getInstance();
    if (url.isEmpty) {
      await prefs.remove('customApiUrl');
      _customBaseUrl = null;
    } else {
      final formattedUrl = url.startsWith('http') ? url : 'http://$url:5000/api';
      await prefs.setString('customApiUrl', formattedUrl);
      _customBaseUrl = formattedUrl;
    }
  }

  static String get baseUrl {
    if (_customBaseUrl != null && _customBaseUrl!.isNotEmpty) {
      return _customBaseUrl!;
    }
    if (kIsWeb) {
      final host = Uri.base.host;
      if (host.isNotEmpty && host != 'localhost') {
        return 'http://$host:5000/api';
      }
      return 'http://127.0.0.1:5000/api';
    }
    if (defaultTargetPlatform == TargetPlatform.android) return 'http://192.168.0.105:5000/api';
    return 'http://127.0.0.1:5000/api';
  }

  static Future<Map<String, String>> _getHeaders() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('userToken') ?? '';
    return {
      'Content-Type': 'application/json',
      'Bypass-Tunnel-Reminder': 'true', // Required to bypass localtunnel warning page
      'Authorization': 'Bearer $token',
    };
  }

  static dynamic _handleResponse(http.Response res) {
    try {
      final data = jsonDecode(res.body);
      if (res.statusCode == 403 && data['message'] == 'ACCOUNT_RESTRICTED') {
        logout().then((_) {
          navigatorKey.currentState?.pushNamedAndRemoveUntil('/restricted', (route) => false);
        });
        return {'success': false, 'message': 'Account Suspended'};
      }
      return data;
    } catch (e) {
      return {'success': false, 'message': 'Invalid response from server'};
    }
  }

  static Future<Map<String, dynamic>> post(String path, Map<String, dynamic> body, {bool requiresAuth = false}) async {
    try {
      final headers = requiresAuth ? await _getHeaders() : {
        'Content-Type': 'application/json',
        'Bypass-Tunnel-Reminder': 'true'
      };
      final res = await http.post(
        Uri.parse('$baseUrl$path'),
        headers: headers,
        body: jsonEncode(body)
      );
      return _handleResponse(res);
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  // --- Auth ---
  static Future<Map<String, dynamic>> checkUserExists(String phoneOrEmail) async {
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/auth/check'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'identifier': phoneOrEmail})
      );
      return _handleResponse(res);
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
          'identifier': phoneOrEmail,
          'password': password
        })
      );
      final data = _handleResponse(res);
      if (res.statusCode == 200 && data['success'] == true) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('userToken', data['data']['token']);
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
      return _handleResponse(res);
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
      final data = _handleResponse(res);
      if (data['success'] == true) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('userData', jsonEncode(data['data']));
      }
      return data;
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> updateProfile(Map<String, dynamic> data) async {
    try {
      final headers = await _getHeaders();
      final res = await http.put(Uri.parse('$baseUrl/profile'), headers: headers, body: jsonEncode(data));
      return _handleResponse(res);
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> setTransactionPin(String pin, {String? oldPin}) async {
    try {
      final headers = await _getHeaders();
      final body = <String, dynamic>{'pin': pin};
      if (oldPin != null && oldPin.isNotEmpty) {
        body['oldPin'] = oldPin;
      }
      final res = await http.post(
        Uri.parse('$baseUrl/profile/pin'),
        headers: headers,
        body: jsonEncode(body)
      );
      return _handleResponse(res);
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> getUserTransactions() async {
    try {
      final headers = await _getHeaders();
      final res = await http.get(Uri.parse('$baseUrl/transactions/history'), headers: headers);
      return _handleResponse(res);
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
      return _handleResponse(res);
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> getNotifications() async {
    try {
      final headers = await _getHeaders();
      final res = await http.get(Uri.parse('$baseUrl/notifications'), headers: headers);
      return _handleResponse(res);
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> getReferrals() async {
    try {
      final headers = await _getHeaders();
      final res = await http.get(Uri.parse('$baseUrl/referrals/my-history'), headers: headers);
      return _handleResponse(res);
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }
  static Future<Map<String, dynamic>> getPricing(String category) async {
    try {
      final headers = await _getHeaders();
      final res = await http.get(Uri.parse('$baseUrl/services/pricing?category=$category'), headers: headers);
      return _handleResponse(res);
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }
  static Future<Map<String, dynamic>> markNotificationRead(String id) async {
    try {
      final headers = await _getHeaders();
      final res = await http.post(Uri.parse('$baseUrl/notifications/$id/read'), headers: headers);
      return _handleResponse(res);
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }
  static Future<Map<String, dynamic>> sendChatMessage(String message) async {
    try {
      final headers = await _getHeaders();
      final res = await http.post(
        Uri.parse('$baseUrl/chat/message'),
        headers: headers,
        body: jsonEncode({'message': message})
      );
      return _handleResponse(res);
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> getUpcomingServices() async {
    try {
      final headers = await _getHeaders();
      final res = await http.get(Uri.parse('$baseUrl/services/upcoming'), headers: headers);
      return _handleResponse(res);
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> subscribeUpcomingService(String id) async {
    try {
      final headers = await _getHeaders();
      final res = await http.post(Uri.parse('$baseUrl/services/upcoming/$id/notify'), headers: headers);
      return _handleResponse(res);
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> getVirtualAccount() async {
    try {
      final headers = await _getHeaders();
      final res = await http.get(Uri.parse('$baseUrl/wallet/virtual-account'), headers: headers);
      return _handleResponse(res);
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }
}
