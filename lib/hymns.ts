// db/hymns.ts
import * as SQLite from 'expo-sqlite';
import { initHymnsDatabase } from '@/src/db/initHymns';
import { addFavoriteHymn, removeFavoriteHymn, getFavoriteHymnIds } from './user_db';
const userDb = SQLite.openDatabaseSync('user_data.db');


export interface BasicHymn {
    id: number;
    title: string;
    author: string | null;
    year: number | null;
    has_chorus: boolean;
    chorus: string | null;
    favorite: boolean;
}

export interface Stanza {
    stanza_number: number;
    text: string;
}

export interface HymnWithStanzas extends BasicHymn {
    stanzas: Stanza[];
}

// Use BasicHymn for basic hymn records without stanzas
export async function fetchHymns(): Promise<BasicHymn[]> {
    const db = await initHymnsDatabase();
    const sql = 'SELECT * FROM hymns ORDER BY title COLLATE NOCASE ASC';

    try {
        const result = await db.getAllAsync<BasicHymn>(sql);
        // console.log('[fetchHymns] raw result:', result);
        return result;
    } catch (error) {
        console.error('Failed to fetch hymns:', error);
        return [];
    }
}

export async function countHymns(): Promise<number> {
    const db = await initHymnsDatabase();
    const result = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM hymns');
    return result?.count || 0;
}


export async function fetchHymnDetails(hymnId: number): Promise<HymnWithStanzas | null> {
    const db = await initHymnsDatabase();

    try {
        const hymn = await db.getFirstAsync<BasicHymn>('SELECT * FROM hymns WHERE id = ?', [hymnId]);
        if (!hymn) return null;

        const stanzas = await db.getAllAsync<Stanza>(
            'SELECT stanza_number, text FROM stanzas WHERE hymn_id = ? ORDER BY stanza_number ASC',
            [hymnId]
        );

        return { ...hymn, stanzas };
    } catch (error) {
        console.error(`Failed to fetch hymn ${hymnId}:`, error);
        return null;
    }
}

export function toggleFavoriteHymn(hymnId: number, currentlyFavorite: boolean): void {
    if (currentlyFavorite) {
        removeFavoriteHymn(hymnId);
    } else {
        addFavoriteHymn(hymnId);
    }
}


export function getAllFavoriteHymnIds(): number[] {
    try {
        const results = userDb.getAllSync<{ hymn_id: number }>(
            'SELECT hymn_id FROM favorite_hymns'
        );
        return results.map(row => row.hymn_id);
    } catch (err) {
        console.error('Error fetching favorite hymn IDs:', err);
        return [];
    }
}
