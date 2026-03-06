import 'package:flutter/material.dart';
import '../widgets/big_button.dart';
import 'symptom_screen.dart';
import 'library_screen.dart';
import 'community_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String _selectedLanguage = 'English';
  final List<String> _languages = [
    'English', 'Hindi', 'Bengali', 'Marathi', 'Telugu', 'Tamil', 'Odia', 'Bhojpuri', 'Assamese'
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F8E9),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'RuraHealth AI',
                    style: TextStyle(
                      fontSize: 36,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1B5E20),
                    ),
                  ),
                  DropdownButton<String>(
                    value: _selectedLanguage,
                    onChanged: (String? newValue) {
                      setState(() {
                        _selectedLanguage = newValue!;
                      });
                    },
                    items: _languages.map<DropdownMenuItem<String>>((String value) {
                      return DropdownMenuItem<String>(
                        value: value,
                        child: Text(value, style: const TextStyle(fontSize: 12)),
                      );
                    }).toList(),
                  ),
                ],
              ),
              const SizedBox(height: 32),
              BigButton(
                label: 'Crop Disease',
                icon: Icons.grass,
                color: Colors.lightGreen.shade700,
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => SymptomScreen(type: 'crop', language: _selectedLanguage)),
                ),
              ),
              BigButton(
                label: 'Animal Health',
                icon: Icons.pets,
                color: Colors.orange.shade800,
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => SymptomScreen(type: 'animal', language: _selectedLanguage)),
                ),
              ),
              const SizedBox(height: 16),
              BigButton(
                label: 'Offline Library',
                icon: Icons.library_books,
                color: Colors.teal.shade700,
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const LibraryScreen()),
                ),
              ),
              const SizedBox(height: 16),
              BigButton(
                label: 'Community Feed',
                icon: Icons.forum,
                color: Colors.indigo.shade700,
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const CommunityScreen()),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
