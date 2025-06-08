import { Slot } from 'expo-router';
import { useCallback, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { CormorantGaramond_400Regular, CormorantGaramond_700Bold } from '@expo-google-fonts/cormorant-garamond';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider } from '@/context/ThemeContext';

// Prevent the splash screen from auto-hiding on first load
SplashScreen.preventAutoHideAsync().catch(() => { });

export default function RootLayout() {
    useFrameworkReady();

    const [fontsLoaded, fontError] = useFonts({
        'Inter-Regular': Inter_400Regular,
        'Inter-Medium': Inter_500Medium,
        'Inter-Bold': Inter_700Bold,
        'Cormorant-Regular': CormorantGaramond_400Regular,
        'Cormorant-Bold': CormorantGaramond_700Bold,
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    useEffect(() => {
        onLayoutRootView();
    }, [onLayoutRootView]);

    // Don't render anything until fonts are loaded
    if (!fontsLoaded && !fontError) return null;

    return (
        <ThemeProvider>
            <Slot />
        </ThemeProvider>
    );
}
