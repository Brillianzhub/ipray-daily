import * as SQLite from 'expo-sqlite';

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
    tags: string; // Stored as JSON string
    is_favorite: number; // 0 or 1
}

const NOTES_DB_NAME = 'notes.db';
let notesDb: SQLite.SQLiteDatabase | null = null;

export async function getNotesDb(): Promise<SQLite.SQLiteDatabase> {
    if (!notesDb) {
        notesDb = await SQLite.openDatabaseAsync(NOTES_DB_NAME, { useNewConnection: true });
    }
    return notesDb;
}

export async function insertNotes(notes: Omit<Note, 'id'>[]): Promise<void> {
    try {
        const db = await getNotesDb();

        for (const note of notes) {
            await db.runAsync(
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
        console.error('❌ Error inserting notes:', err);
        throw err;
    }
}


export async function updateNote(
    id: number,
    updatedNote: {
        title: string;
        content: string;
        category: string;
        tags: string[];
        date?: string;
    }
): Promise<void> {
    try {
        const db = await getNotesDb();
        const { title, content, category, tags, date } = updatedNote;

        await db.runAsync(
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
                id,
            ]
        );
    } catch (err) {
        console.error('❌ Error updating note:', err);
        throw err;
    }
}


export async function getAllNotes(): Promise<Note[]> {
    try {
        const db = await getNotesDb();
        const results: RawNote[] = await db.getAllAsync<RawNote>(
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
        console.error('❌ Error fetching notes:', err);
        return [];
    }
}


export async function deleteNote(id: number): Promise<void> {
    try {
        const db = await getNotesDb();
        await db.runAsync('DELETE FROM notes WHERE id = ?', [id]);
    } catch (err) {
        console.error('❌ Error deleting note:', err);
        throw err;
    }
}

export async function toggleFavorite(id: number, isFavorite: boolean): Promise<void> {
    try {
        const db = await getNotesDb();
        await db.runAsync('UPDATE notes SET is_favorite = ? WHERE id = ?', [
            isFavorite ? 1 : 0,
            id,
        ]);
    } catch (err) {
        console.error('❌ Error updating favorite status:', err);
        throw err;
    }
}
