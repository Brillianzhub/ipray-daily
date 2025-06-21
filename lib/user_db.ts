import * as SQLite from 'expo-sqlite';


export interface Favorite {
    id: number;
    verse_id: number;
    created_at: string;
}

export interface Comment {
    id: number;
    verse_id: number;
    comment: string;
    created_at: string;
}

export interface ReadChapter {
    id: number;
    book_name: string;
    chapter_number: number;
    read_at: string;
}

const USER_DB_NAME = 'user_data.db';
let userDb: SQLite.SQLiteDatabase | null = null;

export async function getUserDb(): Promise<SQLite.SQLiteDatabase> {
    if (!userDb) {
        userDb = await SQLite.openDatabaseAsync(USER_DB_NAME, {
            useNewConnection: true,
        });
    }
    return userDb;
}


export async function addFavorite(verseId: number): Promise<void> {
    try {
        const db = await getUserDb();
        await db.runAsync(
            'INSERT INTO favorites (verse_id) VALUES (?)',
            [verseId]
        );
    } catch (err) {
        console.error('❌ Error adding favorite:', err);
        throw err;
    }
}

export async function addComment(verseId: number, commentText: string): Promise<void> {
    try {
        const db = await getUserDb();
        await db.runAsync(
            'INSERT INTO comments (verse_id, comment) VALUES (?, ?)',
            [verseId, commentText]
        );
    } catch (err) {
        console.error('❌ Error adding comment:', err);
        throw err;
    }
}

export async function addFavoriteHymn(hymnId: number): Promise<void> {
    try {
        const db = await getUserDb();
        await db.runAsync(
            'INSERT INTO favorite_hymns (hymn_id) VALUES (?)',
            [hymnId]
        );
    } catch (err) {
        console.error('❌ Error adding favorite hymn:', err);
        throw err;
    }
}

export async function removeFavoriteHymn(hymnId: number): Promise<void> {
    try {
        const db = await getUserDb();
        await db.runAsync(
            'DELETE FROM favorite_hymns WHERE hymn_id = ?',
            [hymnId]
        );
    } catch (err) {
        console.error('❌ Error removing favorite hymn:', err);
        throw err;
    }
}

export async function getFavoriteHymnIds(): Promise<number[]> {
    try {
        const db = await getUserDb();
        const results = await db.getAllAsync<{ hymn_id: number }>(
            'SELECT hymn_id FROM favorite_hymns'
        );
        return results.map(row => row.hymn_id);
    } catch (err) {
        console.error('❌ Error getting favorite hymn IDs:', err);
        return [];
    }
}

export async function getAllFavorites(): Promise<Favorite[]> {
    try {
        const db = await getUserDb();
        const results = await db.getAllAsync<Favorite>('SELECT * FROM favorites');
        return results;
    } catch (err) {
        console.error('❌ Error fetching favorites:', err);
        return [];
    }
}

export async function getCommentsForVerse(): Promise<Comment[]> {
    try {
        const db = await getUserDb();
        const results = await db.getAllAsync<Comment>('SELECT * FROM comments');
        return results;
    } catch (err) {
        console.error('❌ Error fetching comments:', err);
        return [];
    }
}


export async function updateComment(commentId: number, newText: string): Promise<void> {
    try {
        const db = await getUserDb();
        await db.runAsync(
            'UPDATE comments SET comment = ? WHERE id = ?',
            [newText, commentId]
        );
    } catch (err) {
        console.error('❌ Error updating comment:', err);
        throw err;
    }
}

export async function removeFavorite(id: number): Promise<void> {
    try {
        const db = await getUserDb();
        await db.runAsync('DELETE FROM favorites WHERE id = ?', [id]);
    } catch (err) {
        console.error('❌ Error removing favorite:', err);
        throw err;
    }
}


export async function markChapterAsRead(bookName: string, chapterNumber: number): Promise<void> {
    try {
        const db = await getUserDb();

        const existing = await db.getAllAsync<ReadChapter>(
            'SELECT * FROM read_chapters WHERE book_name = ? AND chapter_number = ?',
            [bookName, chapterNumber]
        );

        if (existing.length === 0) {
            await db.runAsync(
                'INSERT INTO read_chapters (book_name, chapter_number) VALUES (?, ?)',
                [bookName, chapterNumber]
            );
        }
    } catch (err) {
        console.error('❌ Error marking chapter as read:', err);
        throw err;
    }
}

export async function getAllReadChapters(): Promise<ReadChapter[]> {
    try {
        const db = await getUserDb();
        const results = await db.getAllAsync<ReadChapter>(
            'SELECT * FROM read_chapters ORDER BY read_at DESC'
        );
        return results;
    } catch (err) {
        console.error('❌ Error fetching read chapters:', err);
        return [];
    }
}

export async function getReadChaptersByBook(bookName: string): Promise<ReadChapter[]> {
    try {
        const db = await getUserDb();
        const results = await db.getAllAsync<ReadChapter>(
            'SELECT * FROM read_chapters WHERE book_name = ? ORDER BY chapter_number',
            [bookName]
        );
        return results;
    } catch (err) {
        console.error('❌ Error fetching read chapters by book:', err);
        return [];
    }
}

export async function isChapterRead(bookName: string, chapterNumber: number): Promise<boolean> {
    try {
        const db = await getUserDb();
        const results = await db.getAllAsync<ReadChapter>(
            'SELECT * FROM read_chapters WHERE book_name = ? AND chapter_number = ?',
            [bookName, chapterNumber]
        );
        return results.length > 0;
    } catch (err) {
        console.error('❌ Error checking if chapter is read:', err);
        return false;
    }
}

// Add this to your database functions:
// export function getBookCompletion(bookName: string) {
//     const totalChapters = bibleBooks.find(b => b.name === bookName)?.chapters || 0;
//     const readChapters = getReadChaptersByBook(bookName).length;
//     return totalChapters > 0 ? Math.round((readChapters / totalChapters) * 100) : 0;
// }
