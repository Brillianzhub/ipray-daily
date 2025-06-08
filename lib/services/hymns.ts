import { hymnsDb } from "../hymnDb";

type DbHymnRow = {
    id: string;
    title: string;
    author: string;
    year: number;
    favorite: number;
};

export type Hymn = {
    id: string;
    title: string;
    author: string;
    year: number;
    favorite: boolean;
};

// hymnsDb.execSync(`
//   INSERT OR REPLACE INTO hymns (id, title, author, year, favorite, has_chorus, chorus)
//   VALUES ('001', 'Amazing Grace', 'John Newton', 1779, 0, 0, NULL);
// `);


// const count = hymnsDb.getFirstSync(`SELECT COUNT(*) as count FROM hymns`);
// console.log('Total hymns in DB:', count);


export function getBasicHymnList(): Hymn[] {
    try {
        const dbRows = hymnsDb.getAllSync(
            `SELECT id, title, author, year, favorite FROM hymns ORDER BY title ASC`
        ) as DbHymnRow[];

        return dbRows.map(row => ({
            id: row.id,
            title: row.title,
            author: row.author,
            year: row.year,
            favorite: Boolean(row.favorite)
        }));
    } catch (error) {
        console.error('Failed to fetch hymns:', error);
        return [];
    }
}