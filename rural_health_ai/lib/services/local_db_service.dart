import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class LocalDbService {
  static Database? _database;

  static Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDb();
    return _database!;
  }

  static Future<Database> _initDb() async {
    String path = join(await getDatabasesPath(), 'health_advice.db');
    return await openDatabase(
      path,
      version: 1,
      onCreate: (db, version) async {
        await db.execute('''
          CREATE TABLE advice (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            disease TEXT,
            probability TEXT,
            advice TEXT,
            warning TEXT
          )
        ''');
        
        // Seed some initial data for offline use
        await db.insert('advice', {
          'disease': 'Late Blight',
          'probability': 'High (Offline Scan)',
          'advice': 'Remove infected leaves immediately. Apply copper-based fungicide if available.',
          'warning': 'Consult an agricultural expert if the infection spreads to more than 20% of the crop.'
        });
        
        await db.insert('advice', {
          'disease': 'Foot and Mouth Disease',
          'probability': 'Medium (Offline Scan)',
          'advice': 'Isolate the infected animal. Clean the area with disinfectant. Provide soft feed.',
          'warning': 'Contact your local veterinarian immediately. This disease is highly contagious.'
        });
      },
    );
  }

  static Future<Map<String, dynamic>?> getAdviceForDisease(String disease) async {
    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query(
      'advice',
      where: 'disease = ?',
      whereArgs: [disease],
    );

    if (maps.isNotEmpty) {
      return maps.first;
    }
    return null;
  }
}
