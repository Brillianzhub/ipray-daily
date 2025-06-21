// usePrayers.ts
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback } from 'react';

export interface Prayer {
    prayer_number: number;
    prayer_category: string;
    prayer: string;
    prayer_scripture: string;
    featured: number;
}

export function usePrayerDatabase() {
    const db = useSQLiteContext();

    const fetchCategories = useCallback(async () => {
        const rows = await db.getAllAsync<{ prayer_category: string }>(
            'SELECT DISTINCT prayer_category FROM prayers ORDER BY prayer_category'
        );
        return rows;
    }, [db]);

    const fetchPrayersByCategory = useCallback(async (category: string) => {
        const rows = await db.getAllAsync(
            'SELECT * FROM prayers WHERE prayer_category = ? ORDER BY prayer_number',
            [category]
        );
        return rows as Prayer[];
    }, [db]);


    const fetchFeaturedPrayers = useCallback(async () => {
        const rows = await db.getAllAsync(
            'SELECT * FROM prayers WHERE featured = 1 ORDER BY prayer_number'
        );
        return rows;
    }, [db]);

    const getDailyFeaturedPrayer = useCallback(async (): Promise<Prayer | null> => {
        const featuredPrayers = await db.getAllAsync<Prayer>(
            'SELECT * FROM prayers WHERE featured = 1 ORDER BY prayer_number'
        );

        if (featuredPrayers.length === 0) return null;

        const today = new Date();
        const start = new Date(today.getFullYear(), 0, 0);
        const diff = today.getTime() - start.getTime();
        const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

        const index = dayOfYear % featuredPrayers.length;
        return featuredPrayers[index] as Prayer;  
    }, [db]);


    const countPrayers = useCallback(async () => {
        const result = await db.getFirstAsync<{ count: number }>(
            'SELECT COUNT(*) as count FROM prayers'
        );
        return result?.count || 0;
    }, [db]);

    return {
        fetchCategories,
        fetchPrayersByCategory,
        fetchFeaturedPrayers,
        getDailyFeaturedPrayer,
        countPrayers,
    };
}
