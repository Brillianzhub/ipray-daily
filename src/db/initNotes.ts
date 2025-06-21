import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';

const sqliteDir = `${FileSystem.documentDirectory}SQLite`;
const NOTES_DB_NAME = 'notes.db';

export async function initNotesDb(): Promise<SQLite.SQLiteDatabase> {
    // Ensure SQLite directory exists
    const dirInfo = await FileSystem.getInfoAsync(sqliteDir);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(sqliteDir, { intermediates: true });
    }

    // Open the notes.db with a fresh connection
    const db = await SQLite.openDatabaseAsync(NOTES_DB_NAME, {
        useNewConnection: true, // avoid stale/GC issues
    });

    try {
        // Create the notes table
        await db.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        tags TEXT, -- Stored as JSON string
        is_favorite INTEGER DEFAULT 0
      );
    `);

        return db;
    } catch (err) {
        console.error('❌ Error initializing notes database:', err);
        throw err;
    }
}
