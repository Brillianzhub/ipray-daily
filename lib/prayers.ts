import { openPrayerDatabase } from '@/src/db/initPrayers';

export interface Prayer {
    prayer_number: number;
    prayer_category: string;
    prayer: string;
    prayer_scripture: string;
    featured: number;
}

export interface Category {
    prayer_category: string;
}

export const DatabaseService = {
    async fetchCategories(): Promise<Category[]> {
        const db = await openPrayerDatabase();
        const rows = await db.getAllAsync<Category>(
            'SELECT DISTINCT prayer_category FROM prayers ORDER BY prayer_category'
        );
        await db.closeAsync();
        return rows;
    },


    async fetchPrayersByCategory(category: string): Promise<Prayer[]> {
        const db = await openPrayerDatabase();

        const tables = await db.getAllAsync(
            "SELECT name FROM sqlite_master WHERE type='table'"
        );

        const rows = await db.getAllAsync<Prayer>(
            'SELECT * FROM prayers WHERE prayer_category = ? ORDER BY prayer_number',
            [category]
        );

        await db.closeAsync();
        return rows;
    },


    async fetchFeaturedPrayers(): Promise<Prayer[]> {
        const db = await openPrayerDatabase();
        const rows = await db.getAllAsync<Prayer>(
            'SELECT * FROM prayers WHERE featured = 1 ORDER BY prayer_number'
        );
        await db.closeAsync();
        return rows;
    }
};
