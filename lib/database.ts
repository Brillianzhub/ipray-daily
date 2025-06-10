import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { Platform } from 'react-native';

export interface Verse {
    id: number;
    book_name: string;
    chapter_number: number;
    verse_number: number;
    text: string;
}

export interface BibleBook {
    id: string;
    name: string;
    chapters: number;
    testament: 'old' | 'new';
}

export type BibleVersion = 'KJV' | 'AMP' | 'NIV';

const versionToDbName: Record<BibleVersion, string> = {
    'KJV': 'bible.db',
    'AMP': 'amp.db',
    'NIV': 'niv.db'
};

const versionToAsset = {
    'KJV': require('../assets/databases/bible.db'),
    'AMP': require('../assets/databases/amp.db'),
    'NIV': require('../assets/databases/niv.db')
} as const;


export async function openDatabase(version: BibleVersion): Promise<SQLite.SQLiteDatabase> {
    const sqliteDir = `${FileSystem.documentDirectory}SQLite`;
    const dbFileName = versionToDbName[version];
    const dbPath = `${sqliteDir}/${dbFileName}`;

    // Make sure the SQLite directory exists
    const sqliteDirInfo = await FileSystem.getInfoAsync(sqliteDir);
    if (!sqliteDirInfo.exists) {
        await FileSystem.makeDirectoryAsync(sqliteDir, { intermediates: true });
    }

    // Helper: Check if DB file is valid
    const isDbValid = async (path: string) => {
        const info = await FileSystem.getInfoAsync(path);
        return info.exists && info.size > 1024;
    };

    if (!(await isDbValid(dbPath))) {
        try {
            const asset = Asset.fromModule(versionToAsset[version]);
            await asset.downloadAsync();

            if (!asset.localUri) {
                throw new Error(`Invalid local URI for asset`);
            }

            await FileSystem.copyAsync({
                from: asset.localUri,
                to: dbPath,
            });

            // Verify copy
            if (!(await isDbValid(dbPath))) {
                throw new Error('Database copy failed');
            }
        } catch (error) {
            console.error('Database initialization failed:', error);
            throw new Error(`Could not initialize ${version} database`);
        }
    }

    console.log(`Opening database at: ${dbPath}`);
    return SQLite.openDatabaseSync(
        Platform.OS === 'android' ? dbPath : dbFileName
    );
}

// export async function openDatabase(version: BibleVersion): Promise<SQLite.SQLiteDatabase> {
//     const sqliteDir = `${FileSystem.documentDirectory}SQLite`;
//     const dbFileName = versionToDbName[version];
//     const dbPath = `${sqliteDir}/${dbFileName}`;

//     // Make sure the SQLite directory exists
//     const sqliteDirInfo = await FileSystem.getInfoAsync(sqliteDir);
//     if (!sqliteDirInfo.exists) {
//         await FileSystem.makeDirectoryAsync(sqliteDir, { intermediates: true });
//     }

//     // Debug: list directory contents
//     const files = await FileSystem.readDirectoryAsync(sqliteDir);
//     // console.log('SQLite directory contents:', files);

//     // Helper: Check if DB file is valid (exists and not empty)
//     const isDbValid = async (path: string) => {
//         const info = await FileSystem.getInfoAsync(path);
//         return info.exists && info.size > 1024; // greater than 1KB
//     };

//     const dbIsValid = await isDbValid(dbPath);

//     if (!dbIsValid) {
//         try {
//             const asset = Asset.fromModule(versionToAsset[version]);
//             await asset.downloadAsync();

//             // console.log('Asset local URI:', asset.localUri);

//             if (!asset.localUri || asset.localUri === 'file:' || asset.localUri.length <= 5) {
//                 throw new Error(`Invalid local URI for asset: ${asset.localUri}`);
//             }

//             const assetInfo = await FileSystem.getInfoAsync(asset.localUri);
//             if (assetInfo.exists) {
//                 console.log('Asset size:', assetInfo.size);
//             } else {
//                 console.warn('Asset file does not exist at URI:', asset.localUri);
//             }

//             // console.log(`Copying DB from ${asset.localUri} to ${dbPath}`);
//             await FileSystem.copyAsync({
//                 from: asset.localUri,
//                 to: dbPath,
//             });

//             const copiedInfo = await FileSystem.getInfoAsync(dbPath);
//         } catch (error) {
//             // console.error(`Failed to initialize ${version} database:`, error);
//             throw new Error(`Could not copy ${version} database`);
//         }
//     } else {
//         console.log(`${dbFileName} already exists and is valid at ${dbPath}`);
//     }

//     // Must use just the file name, not full path — works on both platforms
//     return SQLite.openDatabaseSync(dbFileName);
// }



export interface BibleBook {
    id: string;
    name: string;
    chapters: number;
    testament: 'old' | 'new';
}

export async function getBibleBooks(): Promise<BibleBook[]> {
    const db = await openDatabase('KJV');

    try {
        // First get all books with their chapter counts
        const result = await db.getAllAsync<{ book_name: string, max_chapter: number }>(
            `SELECT book_name, MAX(chapter_number) as max_chapter 
             FROM verses 
             GROUP BY book_name`
        );

        // Define the correct order of Bible books
        const canonicalOrder = [
            // Old Testament
            'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
            'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
            '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
            'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
            'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah',
            'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel',
            'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
            'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',

            // New Testament
            'Matthew', 'Mark', 'Luke', 'John', 'Acts',
            'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
            'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
            '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews',
            'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
            'Jude', 'Revelation'
        ];

        // Sort the results according to canonical order
        const sortedBooks = canonicalOrder
            .map(name => {
                const book = result.find(b => b.book_name === name);
                if (!book) return null;
                return {
                    id: name.toLowerCase().replace(/\s/g, '_'),
                    name,
                    chapters: book.max_chapter,
                    testament: isOldTestament(name) ? 'old' : 'new'
                };
            })
            .filter(Boolean) as BibleBook[];

        return sortedBooks;
    } finally {
        await db.closeAsync();
    }
}

function isOldTestament(bookName: string): boolean {
    const oldTestamentBooks = [
        'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
        'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
        '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
        'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
        'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah',
        'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel',
        'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
        'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'
    ];
    return oldTestamentBooks.includes(bookName);
}


export async function getVerse(
    book: string,
    chapter: number,
    verse: number,
    version: BibleVersion = 'KJV'
): Promise<Verse | undefined> {
    const db = await openDatabase(version as BibleVersion);

    try {
        const rows = await db.getAllAsync<Verse>(
            'SELECT * FROM verses WHERE book_name = ? AND chapter_number = ? AND verse_number = ?',
            [book, chapter, verse, version]
        );
        return rows[0];
    } finally {
        await db.closeAsync();
    }
}

export async function getVerseById(
    verseId: number,
    version: BibleVersion = 'KJV'
): Promise<Verse | undefined> {
    const db = await openDatabase(version);

    try {
        const rows = await db.getAllAsync<Verse>(
            'SELECT * FROM verses WHERE id = ?',
            [verseId]
        );
        return rows[0];
    } catch (error) {
        console.error(`Error fetching verse with ID ${verseId}:`, error);
        return undefined;
    } finally {
        await db.closeAsync();
    }
}


export async function getChapter(
    book: string,
    chapter: number,
    version: BibleVersion = 'KJV'
): Promise<Verse[]> {
    const db = await openDatabase(version);


    try {
        const rows = await db.getAllAsync<Verse>(
            'SELECT * FROM verses WHERE book_name = ? AND chapter_number = ? ORDER BY verse_number ASC',
            [book, chapter, version]
        );
        return rows;
    } finally {
        await db.closeAsync();
    }
}


export async function searchVerses(
    query: string,
    limit: number = 20,
    version: BibleVersion = 'KJV'
): Promise<Verse[]> {
    const db = await openDatabase(version as BibleVersion);

    try {
        const rows = await db.getAllAsync<Verse>(
            'SELECT * FROM verses WHERE text LIKE ? LIMIT ?',
            [`%${query}%`, limit]
        );
        return rows;
    } finally {
        await db.closeAsync();
    }
}


export async function getVerseCount(
    book: string,
    chapter: number,
    version: BibleVersion = 'KJV'
): Promise<number> {
    const db = await openDatabase(version as BibleVersion);
    try {
        const result = await db.getFirstAsync<{ count: number }>(
            'SELECT COUNT(*) as count FROM verses WHERE book_name = ? AND chapter_number = ?',
            [book, chapter, version]
        );
        return result?.count || 0;
    } finally {
        await db.closeAsync();
    }
}