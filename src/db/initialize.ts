// import { initUserDb } from './initUserDb';
// import { initPrayersDb } from './initPrayersDb';
// import { initNotesDb } from './initNotes';

// import { openDatabase } from '@/lib/database';

// export async function initializeDatabases() {
//   try {
//     await initUserDb();
//     await initPrayersDb();
//     await initNotesDb();

//     const bibleDb = await openDatabase("KJV");

//     return { bibleDb };
//   } catch (err) {
//     console.error('❌ Failed to initialize databases:', err);
//     throw err;
//   }
// }

import * as SQLite from 'expo-sqlite';


import { initUserDb } from './initUserDb';
import { initPrayersDb } from './initPrayersDb';
import { initNotesDb } from './initNotes';
import { openDatabase } from '@/lib/database';
import type { BibleVersion } from '@/lib/database';

export async function initializeDatabases() {
  try {
    await initUserDb();
    await initPrayersDb();
    await initNotesDb();

    const versions: BibleVersion[] = ['KJV', 'AMP', 'NIV'];
    const bibleDbs = {} as Record<BibleVersion, SQLite.SQLiteDatabase>;

    for (const version of versions) {
      bibleDbs[version] = await openDatabase(version);
    }

    return { bibleDbs }; // access like bibleDbs.KJV
  } catch (err) {
    console.error('❌ Failed to initialize databases:', err);
    throw err;
  }
}


