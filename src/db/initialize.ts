import { initUserDb } from './initUserDb';
import { initHymnsDb } from './initHymnsDb';
import { initPrayersDb } from './initPrayersDb';


import { openDatabase } from '@/lib/database';

// import { syncHymnsToLocalDb } from "@/lib/sync/hymnsSync"

export async function initializeDatabases() {
    try {
        await initUserDb();
        await initHymnsDb();
        await initPrayersDb();
        // await syncHymnsToLocalDb();

        const bibleDb = await openDatabase("KJV");

        // console.log('All databases initialized successfully.');
        return { bibleDb };
    } catch (err) {
        console.error('Failed to initialize databases:', err);
        throw err;
    }
}
