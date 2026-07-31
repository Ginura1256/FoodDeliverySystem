import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'menu_item.dart';

class ApiService {
  // Base URLs supporting Windows/Web (localhost), Android Emulator (10.0.2.2), and iOS
  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:5158/api';
    } else if (Platform.isAndroid) {
      return 'http://10.0.2.2:5158/api';
    } else {
      return 'http://localhost:5158/api';
    }
  }

  // Fallback port (5000) URL
  static String get fallbackUrl {
    if (kIsWeb) {
      return 'http://localhost:5000/api';
    } else if (Platform.isAndroid) {
      return 'http://10.0.2.2:5000/api';
    } else {
      return 'http://localhost:5000/api';
    }
  }

  // Asynchronous GET request to retrieve menu items from backend API
  Future<List<MenuItem>> fetchMenuItems() async {
    final Uri uri = Uri.parse('$baseUrl/menuitems');
    
    try {
      final response = await http.get(uri);

      if (response.statusCode == 200) {
        final List<dynamic> jsonList = json.decode(response.body);
        return jsonList.map((json) => MenuItem.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load menu items. Server returned status code: ${response.statusCode}');
      }
    } catch (e) {
      // Try fallback URL (port 5000) if primary port fails
      try {
        final Uri fallbackUri = Uri.parse('$fallbackUrl/menuitems');
        final response = await http.get(fallbackUri);
        if (response.statusCode == 200) {
          final List<dynamic> jsonList = json.decode(response.body);
          return jsonList.map((json) => MenuItem.fromJson(json)).toList();
        }
      } catch (_) {}
      
      rethrow;
    }
  }
}
