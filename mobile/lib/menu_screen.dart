import 'package:flutter/material.dart';
import 'api_service.dart';
import 'menu_item.dart';

class MenuScreen extends StatefulWidget {
  const MenuScreen({super.key});

  @override
  State<MenuScreen> createState() => _MenuScreenState();
}

class _MenuScreenState extends State<MenuScreen> {
  final ApiService _apiService = ApiService();
  late Future<List<MenuItem>> _menuItemsFuture;

  @override
  void initState() {
    super.initState();
    _refreshMenu();
  }

  void _refreshMenu() {
    setState(() {
      _menuItemsFuture = _apiService.fetchMenuItems();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Row(
          children: [
            Text('🍔 ', style: TextStyle(fontSize: 22)),
            Text(
              'Delicious Menu',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: Color(0xFF0F172A),
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Color(0xFF475569)),
            onPressed: _refreshMenu,
            tooltip: 'Refresh Menu',
          ),
        ],
        backgroundColor: Colors.white,
        elevation: 0.5,
      ),
      body: FutureBuilder<List<MenuItem>>(
        future: _menuItemsFuture,
        builder: (context, snapshot) {
          // Loading State
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(color: Color(0xFFFF6B00)),
                  SizedBox(height: 16),
                  Text(
                    'Fetching menu items from server...',
                    style: TextStyle(color: Color(0xFF64748B), fontWeight: FontWeight.w500),
                  ),
                ],
              ),
            );
          }
          // Error State
          else if (snapshot.hasError) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.error_outline_rounded, color: Colors.redAccent, size: 52),
                    const SizedBox(height: 16),
                    const Text(
                      'Failed to Load Menu',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      snapshot.error.toString(),
                      textAlign: TextAlign.center,
                      style: const TextStyle(color: Color(0xFF64748B), fontSize: 13),
                    ),
                    const SizedBox(height: 20),
                    ElevatedButton.icon(
                      onPressed: _refreshMenu,
                      icon: const Icon(Icons.refresh),
                      label: const Text('Try Again'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFFF6B00),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                  ],
                ),
              ),
            );
          }
          // Empty State
          else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(
              child: Text('No menu items available at this time.', style: TextStyle(color: Color(0xFF64748B))),
            );
          }

          // Success State - Display fetched MenuItems list
          final menuItems = snapshot.data!;

          return ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
            itemCount: menuItems.length,
            itemBuilder: (context, index) {
              final item = menuItems[index];

              return Card(
                elevation: 3,
                shadowColor: Colors.black.withValues(alpha: 0.08),
                margin: const EdgeInsets.only(bottom: 16.0),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16.0),
                ),
                color: Colors.white,
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Food Icon Badge
                          Container(
                            width: 60,
                            height: 60,
                            decoration: BoxDecoration(
                              color: const Color(0xFFFFF7ED),
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(color: const Color(0xFFFFEDD5)),
                            ),
                            child: Center(
                              child: Text(
                                _getFoodEmoji(item.name),
                                style: const TextStyle(fontSize: 30),
                              ),
                            ),
                          ),
                          const SizedBox(width: 14),

                          // Name & Description
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  item.name,
                                  style: const TextStyle(
                                    fontSize: 17,
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFF0F172A),
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  item.description,
                                  style: const TextStyle(
                                    fontSize: 13,
                                    color: Color(0xFF64748B),
                                    height: 1.3,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 14),
                      const Divider(color: Color(0xFFF1F5F9), height: 1),
                      const SizedBox(height: 12),

                      // Price and Prominent 'Add to Cart' Button
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'PRICE',
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF94A3B8),
                                  letterSpacing: 0.5,
                                ),
                              ),
                              Text(
                                '\$${item.price.toStringAsFixed(2)}',
                                style: const TextStyle(
                                  fontSize: 19,
                                  fontWeight: FontWeight.w800,
                                  color: Color(0xFF059669),
                                ),
                              ),
                            ],
                          ),

                          // Prominent 'Add to Cart' Button
                          ElevatedButton.icon(
                            onPressed: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('${item.name} added to cart!'),
                                  duration: const Duration(seconds: 2),
                                  behavior: SnackBarBehavior.floating,
                                  backgroundColor: const Color(0xFF0F172A),
                                ),
                              );
                            },
                            icon: const Icon(Icons.add_shopping_cart_rounded, size: 18),
                            label: const Text('Add to Cart'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFFF6B00),
                              foregroundColor: Colors.white,
                              elevation: 2,
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              textStyle: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }

  // Helper emoji selector based on item name
  String _getFoodEmoji(String name) {
    final lower = name.toLowerCase();
    if (lower.contains('burger')) return '🍔';
    if (lower.contains('pizza')) return '🍕';
    if (lower.contains('pasta')) return '🍝';
    if (lower.contains('sushi')) return '🍣';
    if (lower.contains('salad')) return '🥗';
    return '🍽️';
  }
}
