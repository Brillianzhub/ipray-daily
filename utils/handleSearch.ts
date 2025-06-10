// utils/handleSearch.ts

import { searchVerses, Verse } from '@/lib/database';

export async function handleSearch(
    query: string,
    setResults: (results: Verse[]) => void,
    setLoading: (loading: boolean) => void
): Promise<void> {
    if (!query.trim()) return;
    setLoading(true);
    try {
        const verses = await searchVerses(query);
        setResults(verses);
    } catch (error) {
        console.error('Search error:', error);
    } finally {
        setLoading(false);
    }
}
