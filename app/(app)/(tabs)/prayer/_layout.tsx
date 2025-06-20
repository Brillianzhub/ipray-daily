import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function PrayerLayout() {

    return (
        <Stack
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen
                name="prayers"
                options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                    title: 'Prayer',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color="#000" />
                        </TouchableOpacity>
                    )
                }}
            />
        </Stack>
    );
}