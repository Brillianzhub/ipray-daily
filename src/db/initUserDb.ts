import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';

const sqliteDir = `${FileSystem.documentDirectory}SQLite`;
const USER_DB_NAME = 'user_data.db';

export async function initUserDb(): Promise<SQLite.SQLiteDatabase> {
  try {
    // Ensure the SQLite directory exists
    const dirInfo = await FileSystem.getInfoAsync(sqliteDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(sqliteDir, { intermediates: true });
    }

    // Open the user database with a fresh connection
    const db = await SQLite.openDatabaseAsync(USER_DB_NAME, {
      useNewConnection: true,
    });

    // Create all necessary tables
    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        verse_id INTEGER UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS favorite_hymns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hymn_id INTEGER UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        verse_id INTEGER NOT NULL,
        comment TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS read_chapters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_name TEXT NOT NULL,
        chapter_number INTEGER NOT NULL,
        read_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(book_name, chapter_number)
      );
    `);

    return db;
  } catch (err) {
    console.error('❌ Error initializing user database:', err);
    throw err;
  }
}
