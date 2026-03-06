import 'package:flutter/material.dart';
import 'dart:io';
import '../services/api_service.dart';

class ResultScreen extends StatefulWidget {
  final Map<String, dynamic> result;
  final File? image;
  final String? type;
  final String? language;
  const ResultScreen({super.key, required this.result, this.image, this.type, this.language});

  @override
  State<ResultScreen> createState() => _ResultScreenState();
}

class _ResultScreenState extends State<ResultScreen> {
  bool _isSharing = false;

  Widget _buildRiskBadge(String? level) {
    Color color;
    String label;
    String emoji;

    switch (level) {
      case 'Safe':
        color = Colors.green;
        label = 'Safe';
        emoji = '🟢';
        break;
      case 'Monitor':
        color = Colors.orange;
        label = 'Monitor';
        emoji = '🟡';
        break;
      case 'Urgent':
        color = Colors.red;
        label = 'Urgent';
        emoji = '🔴';
        break;
      default:
        color = Colors.grey;
        label = 'Unknown';
        emoji = '⚪';
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        border: Border.all(color: color.withOpacity(0.5)),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        '$emoji $label',
        style: TextStyle(color: color, fontWeight: FontWeight.bold),
      ),
    );
  }

  Future<void> _share() async {
    if (widget.image == null) return;
    setState(() => _isSharing = true);
    try {
      await ApiService.shareWithCommunity(
        widget.image!,
        widget.type ?? 'general',
        widget.result['disease'] ?? 'Unknown',
        widget.result['advice'] ?? '',
        widget.language ?? 'English',
      );
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Shared with community!')));
      Navigator.popUntil(context, (route) => route.isFirst);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
    } finally {
      setState(() => _isSharing = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Analysis Result')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Card(
              elevation: 4,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Possible Condition:', style: TextStyle(fontSize: 16, color: Colors.grey)),
                    Text(
                      widget.result['disease'] ?? 'Unknown',
                      style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.emerald),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _buildRiskBadge(widget.result['riskLevel']),
                        Text('Confidence: ${widget.result['probability']}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500)),
                      ],
                    ),
                    const Divider(height: 32),
                    const Text('Advice:', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    Text(widget.result['advice'] ?? '', style: const TextStyle(fontSize: 18)),
                    if (widget.result['warning'] != null && widget.result['warning'].isNotEmpty) ...[
                      const SizedBox(height: 24),
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.red.shade50,
                          border: Border.all(color: Colors.red.shade200, width: 2),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.warning, color: Colors.red),
                            const SizedBox(width: 12),
                            Expanded(child: Text(widget.result['warning'], style: const TextStyle(color: Colors.red, fontWeight: FontWeight.bold))),
                          ],
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
            const SizedBox(height: 32),
            if (widget.image != null) ...[
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: _isSharing ? null : _share,
                  icon: _isSharing ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2)) : const Icon(Icons.share),
                  label: const Text('Share with Community', style: TextStyle(fontSize: 18)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.indigo,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.all(16),
                  ),
                ),
              ),
              const SizedBox(height: 12),
            ],
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => Navigator.popUntil(context, (route) => route.isFirst),
                style: ElevatedButton.styleFrom(padding: const EdgeInsets.all(16)),
                child: const Text('Back to Home', style: TextStyle(fontSize: 18)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
