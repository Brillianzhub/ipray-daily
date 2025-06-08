import { Tabs } from 'expo-router/tabs';
import { Book, Home, Music, HandHelping as PrayingHands } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#1E3A8A',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom,
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
          marginBottom: 4,
        },
        headerTitleStyle: {
          fontFamily: 'Cormorant-Bold',
          fontSize: 22,
          color: '#1E3A8A',
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#F1F5F9',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerTitle: 'IPray Daily',
        }}
      />
      <Tabs.Screen
        name="prayer"
        options={{
          title: 'Prayer',
          tabBarIcon: ({ color, size }) => <PrayingHands size={size} color={color} />,
          headerTitle: 'Prayer Journal',
        }}
      />
      <Tabs.Screen
        name="hymns"
        options={{
          title: 'Hymns',
          tabBarIcon: ({ color, size }) => <Music size={size} color={color} />,
          headerTitle: 'Hymn Collection',
        }}
      />
      <Tabs.Screen
        name="bible"
        options={{
          title: 'Bible',
          tabBarIcon: ({ color, size }) => <Book size={size} color={color} />,
          headerTitle: 'Scripture',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E2E8F0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});