import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';

const HYMNS_DB_ASSET = require('@/assets/databases/hymns.db');

export default function HymnsLayout() {
    return (
        <SQLiteProvider
            databaseName="hymns.db"
            assetSource={{ assetId: HYMNS_DB_ASSET }}
        >
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen
                    name="[id]"
                    options={{
                        presentation: 'card',
                        animation: 'slide_from_right',
                        title: 'Hymn',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => router.back()}>
                                <Ionicons name="arrow-back" size={24} color="#000" />
                            </TouchableOpacity>
                        )
                    }}
                />
            </Stack>
        </SQLiteProvider>
    );
}
