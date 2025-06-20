// import * as SQLite from 'expo-sqlite';
// import * as FileSystem from 'expo-file-system';
// import { Asset } from 'expo-asset';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const HYMNS_DB_NAME = 'hymns.db';
// const HYMNS_ASSET = require('../../assets/databases/hymns.db');
// const CURRENT_DB_VERSION = 2; // Increment this whenever you update the database

// export async function initHymnsDatabase(): Promise<SQLite.SQLiteDatabase> {
//     const sqliteDir = `${FileSystem.documentDirectory}SQLite`;
//     const dbPath = `${sqliteDir}/${HYMNS_DB_NAME}`;

//     try {
//         // 1. Ensure SQLite directory exists
//         const dirInfo = await FileSystem.getInfoAsync(sqliteDir);
//         if (!dirInfo.exists) {
//             await FileSystem.makeDirectoryAsync(sqliteDir, { intermediates: true });
//         }

//         // 2. Check stored version vs current version
//         const storedVersion = await AsyncStorage.getItem('hymns_db_version');
//         const dbExists = await FileSystem.getInfoAsync(dbPath);

//         // 3. Return existing DB if version matches and DB exists
//         if (storedVersion === CURRENT_DB_VERSION.toString() && dbExists.exists) {
//             if (__DEV__) {
//                 console.log('[initHymnsDatabase] Using existing up-to-date database');
//             }
//             return SQLite.openDatabaseAsync(HYMNS_DB_NAME);
//         }

//         // 4. Prepare new database asset
//         const asset = Asset.fromModule(HYMNS_ASSET);
//         await asset.downloadAsync();

//         if (!asset.localUri) {
//             throw new Error('Failed to download database asset');
//         }

//         // 5. Delete old database if exists
//         if (dbExists.exists) {
//             await FileSystem.deleteAsync(dbPath);
//             if (__DEV__) {
//                 console.log('[initHymnsDatabase] Deleted outdated database');
//             }
//         }

//         // 6. Copy new database
//         await FileSystem.copyAsync({
//             from: asset.localUri,
//             to: dbPath,
//         });

//         // 7. Store new version and open database
//         await AsyncStorage.setItem('hymns_db_version', CURRENT_DB_VERSION.toString());

//         if (__DEV__) {
//             console.log('[initHymnsDatabase] Database updated to version', CURRENT_DB_VERSION);
//         }

//         return SQLite.openDatabaseAsync(HYMNS_DB_NAME);
//     } catch (error) {
//         console.error('Failed to initialize hymns database:', error);

//         // Fallback: Try to open existing DB even if version doesn't match
//         try {
//             const db = await SQLite.openDatabaseAsync(HYMNS_DB_NAME);
//             if (db) {
//                 console.warn('Using existing database despite version mismatch');
//                 return db;
//             }
//         } catch (fallbackError) {
//             console.error('Fallback database open failed:', fallbackError);
//         }

//         throw error;
//     }
// }


// import * as SQLite from 'expo-sqlite';
// import * as FileSystem from 'expo-file-system';
// import { Asset } from 'expo-asset';

// const HYMNS_DB_NAME = 'hymns.db';
// const HYMNS_ASSET = require('../../assets/databases/hymns.db');

// export async function initHymnsDatabase(): Promise<SQLite.SQLiteDatabase> {
//     const sqliteDir = `${FileSystem.documentDirectory}SQLite`;
//     const dbPath = `${sqliteDir}/${HYMNS_DB_NAME}`;

//     try {
//         const dirInfo = await FileSystem.getInfoAsync(sqliteDir);
//         if (!dirInfo.exists) {
//             await FileSystem.makeDirectoryAsync(sqliteDir, { intermediates: true });
//         }

//         const dbExists = await FileSystem.getInfoAsync(dbPath);

//         if (!dbExists.exists || dbExists.size < 1024) {
//             const asset = Asset.fromModule(HYMNS_ASSET);
//             await asset.downloadAsync();

//             if (!asset.localUri) {
//                 throw new Error('Asset download failed or localUri missing');
//             }

//             await FileSystem.copyAsync({
//                 from: asset.localUri,
//                 to: dbPath,
//             });
//         } else if (__DEV__) {
//             console.log('[initHymnsDatabase] DB already exists at:', dbPath);
//         }

//         return await SQLite.openDatabaseAsync(HYMNS_DB_NAME);
//     } catch (error) {
//         console.error('Failed to initialize hymns database:', error);
//         throw error;
//     }
// }


import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const HYMNS_DB_NAME = 'hymns.db';
const HYMNS_ASSET = require('../../assets/databases/hymns.db');
const CURRENT_DB_VERSION = 2; // Increment when DB changes

export async function initHymnsDatabase(): Promise<SQLite.SQLiteDatabase> {
    const sqliteDir = `${FileSystem.documentDirectory}SQLite`;
    const dbPath = `${sqliteDir}/${HYMNS_DB_NAME}`;

    try {
        // 1. Ensure SQLite directory exists
        await ensureDirectoryExists(sqliteDir);

        // 2. Check if we need to update
        if (!(await needsUpdate(dbPath))) {
            return SQLite.openDatabaseAsync(HYMNS_DB_NAME);
        }

        // 3. Prepare and copy new database
        await copyDatabaseFromAssets(dbPath);

        // 4. Store version and open DB
        await AsyncStorage.setItem('hymns_db_version', CURRENT_DB_VERSION.toString());
        return SQLite.openDatabaseAsync(HYMNS_DB_NAME);

    } catch (error) {
        console.error('Database initialization failed:', error);
        return handleFallback(dbPath);
    }
}

// Helper functions
async function ensureDirectoryExists(dirPath: string) {
    const dirInfo = await FileSystem.getInfoAsync(dirPath);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true });
    }
}

async function needsUpdate(dbPath: string): Promise<boolean> {
    try {
        const [storedVersion, dbExists] = await Promise.all([
            AsyncStorage.getItem('hymns_db_version'),
            FileSystem.getInfoAsync(dbPath)
        ]);

        // Skip update if version matches and DB exists
        if (storedVersion === CURRENT_DB_VERSION.toString() && dbExists.exists) {
            if (__DEV__) console.log('Using existing database');
            return false;
        }
        return true;
    } catch (error) {
        console.warn('Version check failed, proceeding with update', error);
        return true;
    }
}

async function copyDatabaseFromAssets(dbPath: string) {
    const asset = Asset.fromModule(HYMNS_ASSET);
    await asset.downloadAsync();

    if (!asset.localUri) {
        throw new Error('Failed to download database asset');
    }

    // Android-specific: Ensure source file exists
    const assetInfo = await FileSystem.getInfoAsync(asset.localUri);
    if (!assetInfo.exists) {
        throw new Error('Asset database file not found');
    }

    // Delete existing DB if present
    const existingDbInfo = await FileSystem.getInfoAsync(dbPath);
    if (existingDbInfo.exists) {
        await FileSystem.deleteAsync(dbPath, { idempotent: true });
    }

    // Copy with Android-specific workaround
    if (Platform.OS === 'android') {
        // Read as base64 and write to destination
        const base64 = await FileSystem.readAsStringAsync(asset.localUri, {
            encoding: FileSystem.EncodingType.Base64
        });
        await FileSystem.writeAsStringAsync(dbPath, base64, {
            encoding: FileSystem.EncodingType.Base64
        });
    } else {
        // Standard copy for iOS
        await FileSystem.copyAsync({
            from: asset.localUri,
            to: dbPath
        });
    }

    // Verify the copy
    const newDbInfo = await FileSystem.getInfoAsync(dbPath);
    if (!newDbInfo.exists || newDbInfo.size === 0) {
        throw new Error('Database copy failed');
    }
}

async function handleFallback(dbPath: string): Promise<SQLite.SQLiteDatabase> {
    try {
        // Try opening existing DB even if update failed
        const existingDbInfo = await FileSystem.getInfoAsync(dbPath);
        if (existingDbInfo.exists) {
            console.warn('Using existing database despite update failure');
            return SQLite.openDatabaseAsync(HYMNS_DB_NAME);
        }

        // Try using the asset directly as last resort
        const asset = Asset.fromModule(HYMNS_ASSET);
        if (asset.localUri) {
            console.warn('Using asset database directly');
            return SQLite.openDatabaseAsync(asset.localUri);
        }

        throw new Error('No usable database available');
    } catch (fallbackError) {
        console.error('Fallback failed:', fallbackError);
        throw new Error('Could not initialize database');
    }
}