import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';

const sqliteDir = `${FileSystem.documentDirectory}SQLite`;
const userDb = SQLite.openDatabaseSync('user_data.db');

export async function initUserDb() {
  try {
    // Ensure the SQLite directory exists
    const dirInfo = await FileSystem.getInfoAsync(sqliteDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(sqliteDir, { intermediates: true });
    }

    userDb.execSync(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        verse_id INTEGER UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Initialize comments table
    userDb.execSync(`
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        verse_id INTEGER NOT NULL,
        comment TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Initialize read_chapters table
    userDb.execSync(`
      CREATE TABLE IF NOT EXISTS read_chapters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_name TEXT NOT NULL,
        chapter_number INTEGER NOT NULL,
        read_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(book_name, chapter_number)
      );
    `);

  } catch (err) {
    console.error('Error initializing user database:', err);
  }
}
