import { initUserDb } from './initUserDb';
import { initHymnsDb } from './initHymnsDb';
import { initPrayersDb } from './initPrayersDb';


import { openDatabase } from '@/lib/database';


export async function initializeDatabases() {
    try {
        await initUserDb();
        await initHymnsDb();
        await initPrayersDb();

        const bibleDb = await openDatabase("KJV");

        return { bibleDb };
    } catch (err) {
        console.error('Failed to initialize databases:', err);
        throw err;
    }
}


// export async function initializeDatabases() {
//     try {
//         // Initialize all databases sequentially
//         await initUserDb();
//         await initHymnsDb();
//         await initPrayersDb();

//         // Initialize Bible database
//         const bibleDb = await openDatabase("KJV");
        
//         // Verify connection (using async wrapper)
//         await new Promise<void>((resolve, reject) => {
//             bibleDb.exec([{ sql: 'SELECT 1', args: [] }], false, (err) => {
//                 if (err) reject(err);
//                 else resolve();
//             });
//         });

//         return { bibleDb };
//     } catch (err) {
//         console.error('Database initialization failed:', err);
//         throw new Error(`Database initialization failed: ${err instanceof Error ? err.message : String(err)}`);
//     }
// }