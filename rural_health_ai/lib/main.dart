import 'package:flutter/material.dart';
import 'screens/home_screen.dart';

void main() {
  runApp(const RuraHealthApp());
}

class RuraHealthApp extends StatelessWidget {
  const RuraHealthApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'RuraHealth AI',
      theme: ThemeData(
        primarySwatch: Colors.emerald,
        useMaterial3: true,
        fontFamily: 'Roboto',
      ),
      home: const HomeScreen(),
    );
  }
}
