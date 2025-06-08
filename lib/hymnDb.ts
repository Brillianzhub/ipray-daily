// import * as SQLite from 'expo-sqlite';
// import * as FileSystem from 'expo-file-system';

// const sqliteDir = `${FileSystem.documentDirectory}SQLite`;

// FileSystem.makeDirectoryAsync(sqliteDir, { intermediates: true }).catch(() => {});
// export const hymnsDb = SQLite.openDatabaseSync('hymns.db');


// export async function ensureHymnsDbDir() {
//   const dirInfo = await FileSystem.getInfoAsync(sqliteDir);
//   if (!dirInfo.exists) {
//     await FileSystem.makeDirectoryAsync(sqliteDir, { intermediates: true });
//   }
// }


import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

const sqliteDir = `${FileSystem.documentDirectory}SQLite`;

// ✅ Initialize with proper typing
export const hymnsDb: SQLite.SQLiteDatabase = SQLite.openDatabaseSync('hymns.db');

export async function ensureHymnsDbDir() {
  const dirInfo = await FileSystem.getInfoAsync(sqliteDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(sqliteDir, { intermediates: true });
  }
}