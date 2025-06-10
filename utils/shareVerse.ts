import { Share } from 'react-native';
import type { Verse } from '@/lib/database';


export const shareVerse = async (
    verse: Verse | null,
    resetPressedVerse?: () => void
) => {
    if (!verse) {
        console.warn('No verse selected to share.');
        return;
    }

    const { book_name, chapter_number, verse_number, text } = verse;
    const message = `${book_name} ${chapter_number}:${verse_number} - "${text}"`;

    try {
        await Share.share({ message });

        if (resetPressedVerse) {
            resetPressedVerse(); // Reset after sharing
        }
    } catch (error) {
        console.error('Error sharing verse:', error);
    }
};
