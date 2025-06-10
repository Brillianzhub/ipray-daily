import * as SQLite from 'expo-sqlite';
const userDb = SQLite.openDatabaseSync('user_data.db');

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


export function addFavorite(verseId: number): void {
    try {
        userDb.runSync(
            'INSERT INTO favorites (verse_id) VALUES (?)',
            [verseId]
        );
    } catch (err) {
        console.error('Error adding favorite:', err);
    }
}

export function addComment(verseId: number, commentText: string): void {
    try {
        userDb.runSync(
            'INSERT INTO comments (verse_id, comment) VALUES (?, ?)',
            [verseId, commentText]
        );
    } catch (err) {
        console.error('Error adding comment:', err);
    }
}

export function getAllFavorites(): Favorite[] {
    try {
        const results = userDb.getAllSync<Favorite>('SELECT * FROM favorites');
        return results;
    } catch (err) {
        console.error('Error fetching favorites:', err);
        return [];
    }
}

export function getCommentsForVerse(): Comment[] {
    try {
        const results = userDb.getAllSync<Comment>('SELECT * FROM comments');
        return results;
    } catch (err) {
        console.error('Error fetching comments:', err);
        return [];
    }
}


export function updateComment(commentId: number, newText: string): void {
    try {
        userDb.runSync(
            'UPDATE comments SET comment = ? WHERE id = ?',
            [newText, commentId]
        );
    } catch (err) {
        console.error('Error updating comment:', err);
    }
}

export function removeFavorite(id: number): void {
    try {
        userDb.runSync(
            'DELETE FROM favorites WHERE id = ?',
            [id]
        );
    } catch (err) {
        console.error('Error removing favorite:', err);
    }
}

export function markChapterAsRead(bookName: string, chapterNumber: number): void {
    try {
        // First check if this chapter is already marked as read
        const existing = userDb.getAllSync<ReadChapter>(
            'SELECT * FROM read_chapters WHERE book_name = ? AND chapter_number = ?',
            [bookName, chapterNumber]
        );

        if (existing.length === 0) {
            userDb.runSync(
                'INSERT INTO read_chapters (book_name, chapter_number) VALUES (?, ?)',
                [bookName, chapterNumber]
            );
        }
    } catch (err) {
        console.error('Error marking chapter as read:', err);
    }
}

export function getAllReadChapters(): ReadChapter[] {
    try {
        const results = userDb.getAllSync<ReadChapter>(
            'SELECT * FROM read_chapters ORDER BY read_at DESC'
        );
        return results;
    } catch (err) {
        console.error('Error fetching read chapters:', err);
        return [];
    }
}

export function getReadChaptersByBook(bookName: string): ReadChapter[] {
    try {
        const results = userDb.getAllSync<ReadChapter>(
            'SELECT * FROM read_chapters WHERE book_name = ? ORDER BY chapter_number',
            [bookName]
        );
        return results;
    } catch (err) {
        console.error('Error fetching read chapters by book:', err);
        return [];
    }
}

export function isChapterRead(bookName: string, chapterNumber: number): boolean {
    try {
        const results = userDb.getAllSync<ReadChapter>(
            'SELECT * FROM read_chapters WHERE book_name = ? AND chapter_number = ?',
            [bookName, chapterNumber]
        );
        return results.length > 0;
    } catch (err) {
        console.error('Error checking if chapter is read:', err);
        return false;
    }
}

// Add this to your database functions:
// export function getBookCompletion(bookName: string) {
//     const totalChapters = bibleBooks.find(b => b.name === bookName)?.chapters || 0;
//     const readChapters = getReadChaptersByBook(bookName).length;
//     return totalChapters > 0 ? Math.round((readChapters / totalChapters) * 100) : 0;
// }
