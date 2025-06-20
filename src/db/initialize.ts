import { initUserDb } from './initUserDb';
import { initPrayersDb } from './initPrayersDb';
import { openPrayerDatabase } from './initPrayers';
import { initHymnsDatabase } from './initHymns';
import { initNotesDb } from './initNotes';

import { openDatabase } from '@/lib/database';

export async function initializeDatabases() {
  try {
    await initUserDb();
    await initPrayersDb();
    await initNotesDb();

    const bibleDb = await openDatabase("KJV");
    const prayerDb = await openPrayerDatabase();
    const hymnDb = await initHymnsDatabase();

    return { bibleDb, prayerDb, hymnDb };
  } catch (err) {
    console.error('❌ Failed to initialize databases:', err);
    throw err;
  }
}



