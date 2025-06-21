import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { Book, Calendar, Heart, Home, Info, Mail, Moon, Music, HandHelping as PrayingHands, Settings, Sun } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAppTheme } from '@/hooks/useAppTheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const menuItems = [
  {
    label: 'Daily Devotionals',
    icon: Calendar,
    path: '/(devotion)/Devotion'
  },
  {
    label: 'Favorites',
    icon: Heart,
    path: '/(favorites)'
  },
  {
    label: 'About',
    icon: Info,
    path: '/(about)'
  },
  {
    label: 'Contact Us',
    icon: Mail,
    path: '/contact'
  },
  {
    label: 'Settings',
    icon: Settings,
    path: '/(settings)'
  }
];

export default function DrawerContent(props: any) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const colors = useAppTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      borderRadius: 12,
      backgroundColor: colors.background,

    },
    header: {
      padding: 16,
      alignItems: 'center',
      marginTop: 8,
    },
    logo: {
      width: 60,
      height: 60,
      borderRadius: 40,
      marginBottom: 16,
    },
    appName: {
      fontFamily: 'Cormorant-Bold',
      fontSize: 24,
      color: colors.primary,
      marginBottom: 4,
    },
    appVersion: {
      fontFamily: 'Inter-Regular',
      fontSize: 12,
      color: colors.text.secondary,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 16,
      width: '90%',
      alignSelf: 'center',
    },
    mainTabsContainer: {
      padding: 16,
    },
    sectionTitle: {
      fontFamily: 'Inter-Medium',
      fontSize: 14,
      color: colors.text.secondary,
      marginBottom: 16,
      paddingHorizontal: 8,
    },
    mainTabs: {
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    tabItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    activeTab: {
      backgroundColor: theme === 'light' ? '#EFF6FF' : '#0284c7',
    },
    tabLabel: {
      fontFamily: 'Inter-Medium',
      fontSize: 16,
      color: colors.text.secondary,
      marginLeft: 16,
    },
    activeTabLabel: {
      color: colors.primary,
    },
    menuItems: {
      paddingHorizontal: 16,
      flex: 1,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    menuItemLabel: {
      fontFamily: 'Inter-Medium',
      fontSize: 15,
      color: colors.text.primary,
      marginLeft: 16,
    },
    footer: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      alignItems: 'center',
    },
    footerText: {
      fontFamily: 'Inter-Regular',
      fontSize: 12,
      color: colors.text.secondary,
    },
    themeToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginTop: 8,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.appName}>IPray Daily</Text>
        <Text style={styles.appVersion}>Version 1.0.0</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.mainTabsContainer}>
        <Text style={styles.sectionTitle}>Main Sections</Text>

        <View style={styles.mainTabs}>
          <TouchableOpacity
            style={[styles.tabItem, pathname.includes('/home') && styles.activeTab]}
            onPress={() => router.push({
              pathname: '/home'
            })}
          >
            <Home size={24} color={pathname.includes('/home') ? colors.primary : colors.text.secondary} />
            <Text style={[styles.tabLabel, pathname.includes('/home') && styles.activeTabLabel]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, pathname.includes('/prayer') && styles.activeTab]}
            onPress={() => router.push('/prayer')}
          >
            <MaterialCommunityIcons
              name="hands-pray"
              size={24}
              color={pathname.includes('/prayer') ? colors.primary : colors.text.secondary}
            />
            <Text style={[styles.tabLabel, pathname.includes('/prayer') && styles.activeTabLabel]}>
              Prayer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, pathname.includes('/hymns') && styles.activeTab]}
            onPress={() => router.push('/hymns')}
          >
            <Music size={24} color={pathname.includes('/hymns') ? colors.primary : colors.text.secondary} />
            <Text style={[styles.tabLabel, pathname.includes('/hymns') && styles.activeTabLabel]}>Hymns</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, pathname.includes('/bible') && styles.activeTab]}
            onPress={() => router.push('/bible')}
          >
            <Book size={24} color={pathname.includes('/bible') ? colors.primary : colors.text.secondary} />
            <Text style={[styles.tabLabel, pathname.includes('/bible') && styles.activeTabLabel]}>Bible</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.divider} />

      <ScrollView style={styles.menuItems}>
        <Text style={styles.sectionTitle}>More</Text>

        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => router.push(item.path as never)}
          >
            <item.icon size={22} color={colors.text.secondary} />
            <Text style={styles.menuItemLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.themeToggle}
          onPress={toggleTheme}
        >
          {theme === 'light' ? (
            <Moon size={22} color={colors.text.secondary} />
          ) : (
            <Sun size={22} color={colors.text.secondary} />
          )}
          <Text style={styles.menuItemLabel}>
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 IPray Daily</Text>
      </View>
    </SafeAreaView>
  );
}