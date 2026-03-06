import 'dart:convert';
import 'package:http/http.dart' as http;
import 'dart:io';

class ApiService {
  // Replace with your actual backend URL
  static const String baseUrl = 'https://YOUR_APP_URL/api';

  static Future<Map<String, dynamic>> analyzeSymptoms(String symptoms, String type, String language) async {
    final response = await http.post(
      Uri.parse('$baseUrl/analyze-symptoms'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'symptoms': symptoms, 'type': type, 'language': language}),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to analyze symptoms');
    }
  }

  static Future<Map<String, dynamic>> analyzeImage(File image, String type, String language) async {
    var request = http.MultipartRequest('POST', Uri.parse('$baseUrl/analyze-image'));
    request.fields['type'] = type;
    request.fields['language'] = language;
    request.files.add(await http.MultipartFile.fromPath('image', image.path));

    var response = await request.send();
    if (response.statusCode == 200) {
      final respStr = await response.stream.bytesToString();
      return jsonDecode(respStr);
    } else {
      throw Exception('Failed to analyze image');
    }
  }

  static Future<List<dynamic>> getCommunityPosts() async {
    final response = await http.get(Uri.parse('$baseUrl/community/posts'));
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to fetch community posts');
    }
  }

  static Future<void> shareWithCommunity(File image, String type, String disease, String advice, String language) async {
    var request = http.MultipartRequest('POST', Uri.parse('$baseUrl/community/posts'));
    request.fields['type'] = type;
    request.fields['disease'] = disease;
    request.fields['advice'] = advice;
    request.fields['language'] = language;
    request.files.add(await http.MultipartFile.fromPath('image', image.path));

    var response = await request.send();
    if (response.statusCode != 201) {
      throw Exception('Failed to share with community');
    }
  }

  static Future<void> voteOnPost(int postId, String voteType) async {
    final response = await http.post(
      Uri.parse('$baseUrl/community/posts/$postId/vote'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'voteType': voteType}),
    );
    if (response.statusCode != 200) {
      throw Exception('Failed to vote');
    }
  }
}
