import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import { Platform } from 'react-native';

const FavoritesLayout = () => {

    const handleBackPress = () => {
        router.replace('/home');
    };

    return (
        <>
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{
                        headerShown: true,
                        title: "Favorites",
                        headerTitleAlign: 'center',
                        headerLeft: () => (
                            <TouchableOpacity
                                onPress={handleBackPress}
                                style={{
                                    paddingHorizontal: 0,
                                    marginLeft: Platform.OS === 'android' ? 0 : 8,
                                }}
                            >
                                <Ionicons name="arrow-back" size={24} color="#000" />
                            </TouchableOpacity>
                        ),
                    }}
                />
            </Stack>

            <StatusBar style="dark" backgroundColor="#FFF" />
        </>
    );
};

export default FavoritesLayout;
