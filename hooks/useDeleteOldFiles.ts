import { useEffect } from 'react';
import * as FileSystem from 'expo-file-system';

export function useClearOldHymnsDbOnce() {
    useEffect(() => {
        const clear = async () => {
            const dbPath = `${FileSystem.documentDirectory}SQLite/hymns.db`;
            const fileInfo = await FileSystem.getInfoAsync(dbPath);
            if (fileInfo.exists) {
                console.log('Old hymns.db found, deleting...');
                await FileSystem.deleteAsync(dbPath, { idempotent: true });
            } else {
                console.log('No old hymns.db found.');
            }
        };

        clear();
    }, []);
}
