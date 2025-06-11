import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function PrayerLayout() {

    const handleBackPress = () => {
        router.back();
    };

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="prayers"
                options={{
                    headerShown: true,
                    title: "Prayer Category",
                    headerTitleAlign: 'center',
                    headerLeft: () => (
                        <TouchableOpacity onPress={handleBackPress}>
                            <Ionicons name="arrow-back" size={24} color="#000" />
                        </TouchableOpacity>
                    ),
                }}
            />
        </Stack>
    );
}