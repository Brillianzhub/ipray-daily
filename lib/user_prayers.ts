import * as SQLite from 'expo-sqlite';
const prayersDb = SQLite.openDatabaseSync('user_prayers.db');


export interface Prayer {
    id: string;
    title: string;
    description: string;
    category: string;
    date: string;
    isAnswered: boolean;
    isFavorite: boolean;
}

export function insertPrayer(prayer: Prayer): void {
    try {
        prayersDb.runSync(
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
        console.log('Prayer inserted.');
    } catch (err) {
        console.error('Failed to insert prayer:', err);
    }
}



export function getAllPrayers(): any[] {
    try {
        return prayersDb.getAllSync('SELECT * FROM prayers');
    } catch (err) {
        console.error('Error fetching prayers:', err);
        return [];
    }
}

