// hooks/useHymnsDatabase.ts
import { useCallback } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { addFavoriteHymn, removeFavoriteHymn, getFavoriteHymnIds } from '@/lib/user_db';

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

export function useHymnsDatabase() {
    const db = useSQLiteContext();

    const fetchHymns = useCallback(async (): Promise<BasicHymn[]> => {
        try {
            const rows = await db.getAllAsync<BasicHymn>('SELECT * FROM hymns ORDER BY title COLLATE NOCASE ASC');
            return rows;
        } catch (error) {
            console.error('Failed to fetch hymns:', error);
            return [];
        }
    }, [db]);

    const countHymns = useCallback(async (): Promise<number> => {
        try {
            const result = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM hymns');
            return result?.count || 0;
        } catch (error) {
            console.error('Failed to count hymns:', error);
            return 0;
        }
    }, [db]);

    const fetchHymnDetails = useCallback(async (hymnId: number): Promise<HymnWithStanzas | null> => {
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
    }, [db]);

    const toggleFavoriteHymn = useCallback((hymnId: number, currentlyFavorite: boolean): void => {
        if (currentlyFavorite) {
            removeFavoriteHymn(hymnId);
        } else {
            addFavoriteHymn(hymnId);
        }
    }, []);

    const getAllFavoriteHymnIds = useCallback((): number[] => {
        try {
            const rows = getFavoriteHymnIds(); // uses userDb outside SQLiteProvider
            return rows;
        } catch (err) {
            console.error('Error fetching favorite hymn IDs:', err);
            return [];
        }
    }, []);

    return {
        fetchHymns,
        countHymns,
        fetchHymnDetails,
        toggleFavoriteHymn,
        getAllFavoriteHymnIds,
    };
}
