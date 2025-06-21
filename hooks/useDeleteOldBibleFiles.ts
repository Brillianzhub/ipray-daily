import * as FileSystem from 'expo-file-system';

const BIBLE_DB_NAMES = ['bible.db', 'amp.db', 'niv.db'];

export async function deleteBibleDatabases() {
    const sqliteDir = `${FileSystem.documentDirectory}SQLite`;

    for (const dbFile of BIBLE_DB_NAMES) {
        const dbPath = `${sqliteDir}/${dbFile}`;
        try {
            const fileInfo = await FileSystem.getInfoAsync(dbPath);
            if (fileInfo.exists) {
                await FileSystem.deleteAsync(dbPath, { idempotent: true });
                console.log(`✅ Deleted: ${dbFile}`);
            } else {
                console.log(`ℹ️ Not found: ${dbFile}`);
            }
        } catch (err) {
            console.error(`❌ Error deleting ${dbFile}:`, err);
        }
    }
}
