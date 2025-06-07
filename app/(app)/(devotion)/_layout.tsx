import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";

const DevotionLayout = () => {


    const handleBackPress = () => {
        router.replace('/home');
    };

    return (
        <>
            <Stack>
                <Stack.Screen
                    name="Devotion"
                    options={{
                        headerShown: true,
                        title: "Daily Devotion",
                        headerTitleAlign: 'center',
                        headerLeft: () => (
                            <TouchableOpacity onPress={handleBackPress}>
                                <Ionicons name="arrow-back" size={24} color="#000" />
                            </TouchableOpacity>
                        ),
                    }}
                />

                <Stack.Screen
                    name="TimeTable"
                    options={{
                        headerShown: true,
                        title: "Contents",
                        headerTitleAlign: 'center',
                        headerLeft: () => (
                            <TouchableOpacity onPress={handleBackPress}>
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

export default DevotionLayout;
