import * as SQLite from 'expo-sqlite';

export interface Prayer {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  isAnswered: boolean;
  isFavorite: boolean;
}

const PRAYERS_DB_NAME = 'user_prayers.db';
let prayersDb: SQLite.SQLiteDatabase | null = null;

export async function getPrayersDb(): Promise<SQLite.SQLiteDatabase> {
  if (!prayersDb) {
    prayersDb = await SQLite.openDatabaseAsync(PRAYERS_DB_NAME, {
      useNewConnection: true,
    });
  }
  return prayersDb;
}

export async function insertPrayer(prayer: Prayer): Promise<void> {
  try {
    const db = await getPrayersDb();
    await db.runAsync(
      `INSERT OR REPLACE INTO prayers 
       (id, title, description, category, date, isAnswered, isFavorite)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        prayer.id,
        prayer.title,
        prayer.description,
        prayer.category,
        prayer.date,
        prayer.isAnswered ? 1 : 0,
        prayer.isFavorite ? 1 : 0,
      ]
    );
  } catch (err) {
    console.error('❌ Failed to insert prayer:', err);
    throw err;
  }
}

export async function getAllPrayers(): Promise<Prayer[]> {
  try {
    const db = await getPrayersDb();
    const results = await db.getAllAsync<any>('SELECT * FROM prayers');

    return results.map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      date: row.date,
      isAnswered: !!row.isAnswered,
      isFavorite: !!row.isFavorite,
    }));
  } catch (err) {
    console.error('❌ Error fetching prayers:', err);
    return [];
  }
}

export async function deletePrayer(id: string): Promise<void> {
  try {
    const db = await getPrayersDb();
    await db.runAsync('DELETE FROM prayers WHERE id = ?', [id]);
  } catch (err) {
    console.error('❌ Failed to delete prayer:', err);
    throw err;
  }
}
