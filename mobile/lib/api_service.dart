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
        throw Exception('Failed to load menu items. Server status: ${response.statusCode}');
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

  // Asynchronous HTTP POST request to submit a customer order
  Future<bool> submitOrder(List<MenuItem> cartItems) async {
    if (cartItems.isEmpty) return false;

    // Calculate total price
    final double totalPrice = cartItems.fold(0.0, (sum, item) => sum + item.price);

    // Format payload for backend Order entity (CustomerId: 2)
    final Map<String, dynamic> payload = {
      'customerId': 2, // Hardcoded customerId for Customer App
      'totalAmount': double.parse(totalPrice.toStringAsFixed(2)),
      'status': 'Pending',
    };

    final headers = {'Content-Type': 'application/json'};

    try {
      final Uri uri = Uri.parse('$baseUrl/orders');
      final response = await http.post(
        uri,
        headers: headers,
        body: json.encode(payload),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return true;
      }
    } catch (e) {
      // Attempt fallback URL port 5000
      try {
        final Uri fallbackUri = Uri.parse('$fallbackUrl/orders');
        final response = await http.post(
          fallbackUri,
          headers: headers,
          body: json.encode(payload),
        );
        if (response.statusCode == 200 || response.statusCode == 201) {
          return true;
        }
      } catch (_) {}
    }

    return false;
  }
}
