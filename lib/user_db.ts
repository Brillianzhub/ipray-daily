import * as SQLite from 'expo-sqlite';
const userDb = SQLite.openDatabaseSync('user_data.db');

// types.ts (or at the top of your file)
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
        // console.log('Favorite added successfully!');
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
        console.log('Comment added successfully!');
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
        // console.log('Comment updated successfully!');
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
