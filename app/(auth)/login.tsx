import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function Login() {
    const router = useRouter();

    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Text>Login Screen</Text>
            <Button title="Login" onPress={() => router.replace('/(app)/(tabs)/home')} />
        </View>
    );
}
