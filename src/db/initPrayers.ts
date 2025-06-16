// import * as SQLite from 'expo-sqlite';
// import * as FileSystem from 'expo-file-system';
// import { Asset } from 'expo-asset';

// const Prayers = 'prayers.db';

// export async function openPrayerDatabase(): Promise<SQLite.SQLiteDatabase> {
//   const dbPath = `${FileSystem.documentDirectory}${Prayers}`;

//   const fileInfo = await FileSystem.getInfoAsync(dbPath);
//   if (!fileInfo.exists) {
//     const asset = Asset.fromModule(require('../../assets/databases/prayers.db'));
//     await asset.downloadAsync();

//     if (!asset.localUri) {
//       throw new Error('Database asset could not be resolved.');
//     }

//     await FileSystem.copyAsync({
//       from: asset.localUri,
//       to: dbPath,
//     });

//     console.log('✅ DB copied to:', dbPath);
//   } else {
//     console.log('✅ DB already exists at:', dbPath);
//   }

//   // ✅ Important fix: open using the actual path
//   return SQLite.openDatabaseSync(dbPath);
// }




import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { Platform } from 'react-native';

const PRAYERS_DB_NAME = 'prayers.db';
const PRAYERS_ASSET = require('../../assets/databases/prayers.db');

export async function openPrayerDatabase(): Promise<SQLite.SQLiteDatabase> {
  const sqliteDir = `${FileSystem.documentDirectory}SQLite`;
  const dbPath = `${sqliteDir}/${PRAYERS_DB_NAME}`;

  try {
    // Ensure directory exists
    const dirInfo = await FileSystem.getInfoAsync(sqliteDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(sqliteDir, { intermediates: true });
    }

    // Helper to validate database
    const isDbValid = async (path: string) => {
      const info = await FileSystem.getInfoAsync(path);
      return info.exists && info.size > 1024; // 1KB threshold
    };

    // Copy database if needed
    if (!(await isDbValid(dbPath))) {
      const asset = Asset.fromModule(PRAYERS_ASSET);
      await asset.downloadAsync();

      if (!asset.localUri) {
        throw new Error('Failed to download database asset');
      }

      await FileSystem.copyAsync({
        from: asset.localUri,
        to: dbPath,
      });

      if (!(await isDbValid(dbPath))) {
        await FileSystem.deleteAsync(dbPath); 
        throw new Error('Database verification failed after copy');
      }

      if (__DEV__) {
        console.log('Successfully copied prayers database');
      }
    } else if (__DEV__) {
      console.log('Prayers DB already exists at:', dbPath);
    }

    return SQLite.openDatabaseSync(PRAYERS_DB_NAME);

  } catch (error) {
    console.error('Failed to initialize prayer database:', error);
    throw error; 
  }
}

