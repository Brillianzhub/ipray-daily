import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';

const sqliteDir = `${FileSystem.documentDirectory}SQLite`;
const PRAYERS_DB_NAME = 'user_prayers.db';

export async function initPrayersDb(): Promise<SQLite.SQLiteDatabase> {
  try {
    // Ensure the SQLite directory exists
    const dirInfo = await FileSystem.getInfoAsync(sqliteDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(sqliteDir, { intermediates: true });
    }

    // Open the prayers DB with a new clean connection
    const db = await SQLite.openDatabaseAsync(PRAYERS_DB_NAME, {
      useNewConnection: true,
    });

    // Create the prayers table
    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS prayers (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT,
        date TEXT,
        isAnswered INTEGER,
        isFavorite INTEGER
      );
    `);

    return db;
  } catch (err) {
    console.error('❌ Error initializing prayers DB:', err);
    throw err;
  }
}
