import { Slot } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { CormorantGaramond_400Regular, CormorantGaramond_700Bold } from '@expo-google-fonts/cormorant-garamond';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider } from '@/context/ThemeContext';
import { SQLiteProvider } from 'expo-sqlite';
import { initializeDatabases } from '@/src/db/initialize';
import { deleteBibleDatabases } from '@/hooks/useDeleteOldBibleFiles';

const PRAYERS_DB_ASSET = require('@/assets/databases/prayers.db');

SplashScreen.preventAutoHideAsync().catch(() => { });

export default function RootLayout() {
    useFrameworkReady();

    const [isReady, setIsReady] = useState(false);

    const [fontsLoaded, fontError] = useFonts({
        'Inter-Regular': Inter_400Regular,
        'Inter-Medium': Inter_500Medium,
        'Inter-Bold': Inter_700Bold,
        'Cormorant-Regular': CormorantGaramond_400Regular,
        'Cormorant-Bold': CormorantGaramond_700Bold,
    });

    const onLayoutRootView = useCallback(async () => {
        if ((fontsLoaded || fontError) && isReady) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError, isReady]);

    useEffect(() => {
        onLayoutRootView();
    }, [onLayoutRootView]);

    // 🟡 Initialize DBs when fonts are ready
    useEffect(() => {
        async function setup() {
            // await deleteBibleDatabases(); // 🔥 remove old
            await initializeDatabases();  // 🧱 re-init
            setIsReady(true);
        }

        if (fontsLoaded) {
            setup().catch(console.error);
        }
    }, [fontsLoaded]);

    if (!fontsLoaded || !isReady) return null;

    return (
        <ThemeProvider>
            <SQLiteProvider
                databaseName="prayers.db"
                assetSource={{ assetId: PRAYERS_DB_ASSET }}
            >
                <Slot />
            </SQLiteProvider>
        </ThemeProvider>
    );
}
