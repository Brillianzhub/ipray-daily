import { initUserDb } from './initUserDb';
import { openDatabase } from '@/lib/database';

export async function initializeDatabases() {
    try {
        await initUserDb();

        const bibleDb = await openDatabase("KJV");

        console.log('All databases initialized successfully.');
        return { bibleDb };
    } catch (err) {
        console.error('Failed to initialize databases:', err);
        throw err;
    }
}
