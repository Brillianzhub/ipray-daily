import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';

const sqliteDir = `${FileSystem.documentDirectory}SQLite`;
export const prayersDb = SQLite.openDatabaseSync('user_prayers.db');

export async function initPrayersDb() {
    try {
        // Ensure the SQLite directory exists
        const dirInfo = await FileSystem.getInfoAsync(sqliteDir);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(sqliteDir, { intermediates: true });
        }

        // Create prayers table
        prayersDb.execSync(`
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

        // console.log('Prayers table initialized.');
    } catch (err) {
        console.error('Error initializing prayers DB:', err);
    }
}
