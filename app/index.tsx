import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle, TouchableOpacity, Animated, Easing } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useRouter } from 'expo-router';
// import { initializeDatabases } from '@/src/db/initialize';


interface AppThemeColors {
  accent: string;
  background: string;
  border: string;
  primary: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
  };
}

const Index: React.FC = () => {
  const colors = useAppTheme() as AppThemeColors;
  const [fadeAnim] = useState(new Animated.Value(0));
  const [buttonScale] = useState(new Animated.Value(0.8));

  const router = useRouter();

  // useEffect(() => {
  //   async function init() {
  //     await initializeDatabases();
  //   }
  //   init();
  // }, []);


  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(buttonScale, {
          toValue: 0.95,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleContinue = () => {
    router.replace({
      pathname: "/(app)/(tabs)/home"
    });
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor: colors.background, opacity: fadeAnim }]}>
      <Animated.Text style={[styles.title, { color: colors.text.primary }]}>
        IPray Daily
      </Animated.Text>
      <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
        ...Men ought always to pray and not to faint.
      </Text>
      <Text style={[styles.verse, { color: colors.text.secondary }]}>
        Luke 18:1 (KJV)
      </Text>

      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleContinue}
        >
          <Text style={[styles.buttonText, { color: colors.surface }]}>
            Continue
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

export default Index;

interface Styles {
  container: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  verse: TextStyle;
  button: ViewStyle;
  buttonText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  verse: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 32,
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});