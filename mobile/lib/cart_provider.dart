import 'package:flutter/foundation.dart';
import 'menu_item.dart';

class CartProvider extends ChangeNotifier {
  final List<MenuItem> _items = [];

  // Getters
  List<MenuItem> get items => List.unmodifiable(_items);

  int get itemCount => _items.length;

  double get totalPrice {
    return _items.fold(0.0, (sum, item) => sum + item.price);
  }

  // Add an item to the shopping cart
  void addItem(MenuItem item) {
    _items.add(item);
    notifyListeners();
  }

  // Remove a specific item instance from the cart
  void removeItem(MenuItem item) {
    _items.remove(item);
    notifyListeners();
  }

  // Clear all items from the cart
  void clearCart() {
    _items.clear();
    notifyListeners();
  }
}
