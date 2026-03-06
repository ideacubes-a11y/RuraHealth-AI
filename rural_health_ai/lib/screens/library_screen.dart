import 'package:flutter/material.dart';

class LibraryScreen extends StatelessWidget {
  const LibraryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Offline Knowledge Library')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildSection(
            'Crop Diseases',
            Colors.lightGreen.shade700,
            [
              {'title': 'Wheat Rust', 'desc': 'Apply fungicide, ensure good drainage.'},
              {'title': 'Rice Blight', 'desc': 'Use resistant varieties, avoid excess nitrogen.'},
            ],
          ),
          const SizedBox(height: 16),
          _buildSection(
            'Animal Health',
            Colors.orange.shade800,
            [
              {'title': 'Foot and Mouth Disease', 'desc': 'Isolate animal, contact vet immediately.'},
              {'title': 'Mastitis', 'desc': 'Improve hygiene, milk affected quarters last.'},
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSection(String title, Color color, List<Map<String, String>> items) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: color)),
            const SizedBox(height: 12),
            ...items.map((item) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(item['title']!, style: const TextStyle(fontWeight: FontWeight.bold)),
                  Text(item['desc']!, style: TextStyle(color: Colors.grey[700])),
                ],
              ),
            )),
          ],
        ),
      ),
    );
  }
}
