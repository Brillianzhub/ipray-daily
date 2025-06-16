// import * as SQLite from 'expo-sqlite';
// import * as FileSystem from 'expo-file-system';
// import { Asset } from 'expo-asset';

// const HYMNS_DB_NAME = 'hymns.db';
// const HYMNS_ASSET = require('../../assets/databases/hymns.db');

// export async function initHymnsDatabase(): Promise<SQLite.SQLiteDatabase> {
//     const sqliteDir = `${FileSystem.documentDirectory}SQLite`;
//     const dbPath = `${sqliteDir}/${HYMNS_DB_NAME}`;

//     const dirInfo = await FileSystem.getInfoAsync(sqliteDir);

//     if (!dirInfo.exists) {
//         await FileSystem.makeDirectoryAsync(sqliteDir, { intermediates: true });
//     }

//     const isDbValid = async (path: string): Promise<boolean> => {
//         try {
//             const info = await FileSystem.getInfoAsync(path);
//             return info.exists && info.size > 1024;
//         } catch (error) {
//             return false;
//         }
//     };

//     if (!(await isDbValid(dbPath))) {
//         const asset = Asset.fromModule(HYMNS_ASSET);
//         await asset.downloadAsync();

//         if (!asset.localUri) throw new Error('Asset download failed');

//         await FileSystem.copyAsync({ from: asset.localUri, to: dbPath });
//     } else {
//         console.log('[initHymnsDatabase] DB already valid at:', dbPath);
//     }

//     const db = SQLite.openDatabaseAsync(HYMNS_DB_NAME);
//     return db;
// }


import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

const HYMNS_DB_NAME = 'hymns.db';
const HYMNS_ASSET = require('../../assets/databases/hymns.db');

export async function initHymnsDatabase(): Promise<SQLite.SQLiteDatabase> {
    const sqliteDir = `${FileSystem.documentDirectory}SQLite`;
    const dbPath = `${sqliteDir}/${HYMNS_DB_NAME}`;

    try {
        const dirInfo = await FileSystem.getInfoAsync(sqliteDir);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(sqliteDir, { intermediates: true });
        }

        const dbExists = await FileSystem.getInfoAsync(dbPath);

        if (!dbExists.exists || dbExists.size < 1024) {
            const asset = Asset.fromModule(HYMNS_ASSET);
            await asset.downloadAsync();

            if (!asset.localUri) {
                throw new Error('Asset download failed or localUri missing');
            }

            await FileSystem.copyAsync({
                from: asset.localUri,
                to: dbPath,
            });
        } else if (__DEV__) { 
            console.log('[initHymnsDatabase] DB already exists at:', dbPath);
        }

        return await SQLite.openDatabaseAsync(HYMNS_DB_NAME);
    } catch (error) {
        console.error('Failed to initialize hymns database:', error);
        throw error;
    }
}