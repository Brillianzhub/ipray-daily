import * as SQLite from 'expo-sqlite';
const notesDb = SQLite.openDatabaseSync('notes.db');

export interface Note {
    id: number;
    title: string;
    content: string;
    category: string;
    date: string; // ISO format
    tags: string[]; // Stored as JSON
    is_favorite: boolean;
}


export interface RawNote {
    id: number;
    title: string;
    content: string;
    category: string;
    date: string;
    tags: string; // stored as JSON string
    is_favorite: number; // 0 or 1
}

export function insertNotes(notes: Omit<Note, 'id'>[]): void {
    try {
        for (const note of notes) {
            notesDb.runSync(
                `INSERT INTO notes (title, content, category, date, tags, is_favorite)
         VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    note.title,
                    note.content,
                    note.category,
                    note.date,
                    JSON.stringify(note.tags),
                    note.is_favorite ? 1 : 0,
                ]
            );
        }
    } catch (err) {
        console.error('Error inserting notes:', err);
    }
}


export function updateNote(
    id: number,
    updatedNote: {
        title: string;
        content: string;
        category: string;
        tags: string[];
        date?: string; 
    }
): void {
    try {
        const { title, content, category, tags, date } = updatedNote;

        notesDb.runSync(
            `
      UPDATE notes
      SET 
        title = ?, 
        content = ?, 
        category = ?, 
        tags = ?, 
        date = ?
      WHERE id = ?
      `,
            [
                title,
                content,
                category,
                JSON.stringify(tags),
                date || new Date().toISOString(),
                id
            ]
        );
    } catch (err) {
        console.error('Error updating note:', err);
    }
}


export function getAllNotes(): Note[] {
    try {
        const results: RawNote[] = notesDb.getAllSync<RawNote>(
            'SELECT * FROM notes ORDER BY date DESC'
        );

        return results.map((note): Note => ({
            id: note.id,
            title: note.title,
            content: note.content,
            category: note.category,
            date: note.date,
            tags: JSON.parse(note.tags),
            is_favorite: !!note.is_favorite,
        }));
    } catch (err) {
        console.error('Error fetching notes:', err);
        return [];
    }
}

export function deleteNote(id: number): void {
    try {
        notesDb.runSync('DELETE FROM notes WHERE id = ?', [id]);
    } catch (err) {
        console.error('Error deleting note:', err);
    }
}

export function toggleFavorite(id: number, isFavorite: boolean): void {
    try {
        notesDb.runSync(
            'UPDATE notes SET is_favorite = ? WHERE id = ?',
            [isFavorite ? 1 : 0, id]
        );
    } catch (err) {
        console.error('Error updating favorite status:', err);
    }
}
