import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import DrawerContent from '@/components/navigation/DrawerContent';
import { Book, Home, Music, HandHelping as PrayingHands } from 'lucide-react-native';
import { ThemeProvider } from '@/context/ThemeContext';
import { BibleVersionProvider } from '@/context/BibleVersionContext';

export default function AppLayout() {

  return (
    <ThemeProvider>
      <BibleVersionProvider>
        <Drawer
          screenOptions={{
            headerShown: false,
            drawerType: Platform.select({
              ios: 'front',
              android: 'front',
              default: 'permanent'
            }),
            drawerStyle: {
              width: 280,
            },
            headerTitleStyle: {
              fontFamily: 'Inter-Medium',
            },
            overlayColor: 'rgba(0,0,0,0.5)',
          }}
          drawerContent={(props) => <DrawerContent {...props} />}
        >
          <Drawer.Screen
            name="(tabs)"
            options={{
              drawerLabel: 'Home',
              title: 'Home',
              drawerIcon: ({ color, size }) => <Home color={color} size={size} />,
            }}
          />
          <Drawer.Screen
            name="(devotion)"
            options={{
              drawerLabel: 'Devotion',
              title: 'Devotion',
              drawerIcon: ({ color, size }) => <Book color={color} size={size} />,
            }}
          />

        </Drawer>
        <StatusBar style="auto" />
      </BibleVersionProvider>
    </ThemeProvider>
  );
}