import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";

const SermonsLayout = () => {

    const handleBackPress = () => {
        router.replace('/home');
    };

    return (
        <>
            <Stack>
                <Stack.Screen
                    name="SermonCollections"
                    options={{
                        headerShown: true,
                        title: "Sermon Collections",
                        headerTitleAlign: 'center',
                        headerLeft: () => (
                            <TouchableOpacity onPress={handleBackPress}>
                                <Ionicons name="arrow-back" size={24} color="#000" />
                            </TouchableOpacity>
                        ),
                    }}
                />

                <Stack.Screen
                    name="SermonsPage"
                    options={{
                        headerShown: true,
                        title: "Sermon Details",
                        headerTitleAlign: 'center',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => router.back()}>
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

export default SermonsLayout;
