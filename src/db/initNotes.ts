import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';

const sqliteDir = `${FileSystem.documentDirectory}SQLite`;
export const notesDb = SQLite.openDatabaseSync('notes.db');

export async function initNotesDb() {
    try {
        // Ensure the SQLite directory exists
        const dirInfo = await FileSystem.getInfoAsync(sqliteDir);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(sqliteDir, { intermediates: true });
        }

        // Create notes table
        notesDb.execSync(`
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

    } catch (err) {
        console.error('Error initializing notes database:', err);
    }
}
