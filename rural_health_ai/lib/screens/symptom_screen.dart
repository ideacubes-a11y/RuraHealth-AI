import 'package:flutter/material.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import '../services/api_service.dart';
import '../services/tflite_service.dart';
import '../services/local_db_service.dart';
import 'result_screen.dart';

class SymptomScreen extends StatefulWidget {
  final String type;
  final String language;
  const SymptomScreen({super.key, required this.type, required this.language});

  @override
  State<SymptomScreen> createState() => _SymptomScreenState();
}

class _SymptomScreenState extends State<SymptomScreen> {
  final TextEditingController _controller = TextEditingController();
  late stt.SpeechToText _speech;
  bool _isListening = false;
  bool _isLoading = false;
  bool _isOfflineMode = false;

  @override
  void initState() {
    super.initState();
    _speech = stt.SpeechToText();
  }

  void _listen() async {
    if (!_isListening) {
      bool available = await _speech.initialize(
        onStatus: (val) => print('onStatus: $val'),
        onError: (val) => print('onError: $val'),
      );
      if (available) {
        setState(() => _isListening = true);
        _speech.listen(
          onResult: (val) => setState(() {
            _controller.text = val.recognizedWords;
          }),
        );
      }
    } else {
      setState(() => _isListening = false);
      _speech.stop();
    }
  }

  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.camera);
    if (pickedFile != null) {
      _analyzeImage(File(pickedFile.path));
    }
  }

  Future<void> _analyzeSymptoms() async {
    if (_controller.text.isEmpty) return;
    setState(() => _isLoading = true);
    try {
      Map<String, dynamic> result;
      if (_isOfflineMode) {
        // Simple offline mock for text symptoms
        result = {
          'disease': 'Common Cold (Offline)',
          'probability': 'High',
          'riskLevel': 'Monitor',
          'advice': 'Rest and drink fluids. This is a local detection.',
          'warning': 'Consult a doctor if symptoms persist.'
        };
      } else {
        result = await ApiService.analyzeSymptoms(_controller.text, widget.type, widget.language);
      }
      if (!mounted) return;
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => ResultScreen(
          result: result,
          type: widget.type,
          language: widget.language,
        )),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _analyzeImage(File image) async {
    setState(() => _isLoading = true);
    try {
      Map<String, dynamic> result;
      
      if (_isOfflineMode) {
        // OFFLINE ARCHITECTURE: TFLite -> Local DB
        final diseaseName = await TfLiteService.predictDisease(image);
        final localAdvice = await LocalDbService.getAdviceForDisease(diseaseName);
        
        result = localAdvice ?? {
          'disease': diseaseName,
          'probability': 'Detected (Offline)',
          'advice': 'Basic offline advice: Keep the area clean and monitor symptoms.',
          'warning': 'Connect to internet for detailed AI analysis.'
        };
      } else {
        // ONLINE: API Call
        result = await ApiService.analyzeImage(image, widget.type, widget.language);
      }

      if (!mounted) return;
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => ResultScreen(
          result: result,
          image: image,
          type: widget.type,
          language: widget.language,
        )),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
    } finally {
      setState(() => _isLoading = false);
    }
  }

  // ... (rest of the build method with a toggle for offline mode) ...

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${widget.type[0].toUpperCase()}${widget.type.substring(1)} Health'),
        actions: [
          Row(
            children: [
              const Text('Offline', style: TextStyle(fontSize: 12)),
              Switch(
                value: _isOfflineMode,
                onChanged: (val) => setState(() => _isOfflineMode = val),
                activeColor: Colors.amber,
              ),
            ],
          ),
        ],
      ),
      body: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    maxLines: null,
                    expands: true,
                    style: const TextStyle(fontSize: 20),
                    decoration: const InputDecoration(
                      hintText: 'Describe symptoms...',
                      border: OutlineInputBorder(),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: _pickImage,
                        icon: const Icon(Icons.camera_alt),
                        label: const Text('Camera'),
                        style: ElevatedButton.styleFrom(padding: const EdgeInsets.all(16)),
                      ),
                    ),
                    const SizedBox(width: 16),
                    FloatingActionButton(
                      onPressed: _listen,
                      backgroundColor: _isListening ? Colors.red : Colors.emerald,
                      child: Icon(_isListening ? Icons.mic : Icons.mic_none),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _analyzeSymptoms,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.emerald.shade700,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.all(20),
                    ),
                    child: const Text('Analyze Now', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ),
          if (_isLoading)
            Container(
              color: Colors.black.withOpacity(0.5),
              child: const Center(child: CircularProgressIndicator()),
            ),
        ],
      ),
    );
  }
}
