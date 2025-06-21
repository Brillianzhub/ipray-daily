import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeDatabases } from '@/src/db/initialize'; // adjust path as needed
import type { SQLiteDatabase } from 'expo-sqlite';
import type { BibleVersion } from '@/lib/database';

interface DatabaseContextValue {
    bibleDbs: Record<BibleVersion, SQLiteDatabase> | null;
    isReady: boolean;
}

const DatabaseContext = createContext<DatabaseContextValue>({
    bibleDbs: null,
    isReady: false,
});

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [bibleDbs, setBibleDbs] = useState<null | Record<BibleVersion, SQLiteDatabase>>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        initializeDatabases()
            .then(({ bibleDbs }) => {
                setBibleDbs(bibleDbs);
                setIsReady(true);
            })
            .catch((err) => {
                console.error('DB init failed', err);
            });
    }, []);

    return (
        <DatabaseContext.Provider value={{ bibleDbs, isReady }}>
            {children}
        </DatabaseContext.Provider>
    );
};

export const useDatabase = () => useContext(DatabaseContext);
