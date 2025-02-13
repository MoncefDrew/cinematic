import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const CinematicColors = {
  background: '#0A0B1E',
  surface: '#12132D',
  primary: '#6366F1',
  primaryLight: '#818CF8',
  accent: '#4F46E5',
  accentSoft: 'rgba(99, 102, 241, 0.15)',
  text: '#FFFFFF',
  textSecondary: '#9B9BC0',
  border: '#1E2048',
  gradientStart: 'rgba(18, 19, 45, 0.95)',
  gradientEnd: 'rgba(10, 11, 30, 0.98)',
  cardBackground: '#181935',
};

export default function SplashScreen() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    // Simple fade in and scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();

    // Navigate after 2.5 seconds
    const timer = setTimeout(() => {
      // @ts-ignore
      navigation.navigate('aboutApp');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
      <View style={styles.container}>
        <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
        >
          <View style={styles.logoContainer}>
            <Ionicons
                name="film-outline"
                size={64}
                color={CinematicColors.primary}
            />
          </View>
          <Text style={styles.title}>Cinematic</Text>
        </Animated.View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CinematicColors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: CinematicColors.text,
    fontFamily: 'Satoshi',
    letterSpacing: 0.5,
  },
});