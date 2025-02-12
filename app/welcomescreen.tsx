import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const Colors = {
  background: '#0A0B1E',
  surface: '#12132D',
  primary: '#6366F1',
  primaryLight: '#818CF8',
  accent: '#4F46E5',
  accentSoft: 'rgba(99, 102, 241, 0.15)',
  text: '#FFFFFF',
  textSecondary: '#9B9BC0',
  border: '#1E2048',
  cardBackground: '#181935',
};

export default function WelcomeScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('aboutApp');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/images/cinema-logo.jpg')} 
          style={styles.logo} 
        />
        <Text style={styles.title}>Cinematic</Text>
      </View>

      <Text style={styles.description}>
        Your ultimate movie companion
      </Text>

      <View style={styles.featuresContainer}>
        {[
          { icon: "ticket", text: "Book Tickets" },
          { icon: "film", text: "Discover Movies" },
          { icon: "star", text: "Rate & Review" }
        ].map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Ionicons name={feature.icon} size={24} color={Colors.primary} />
            <Text style={styles.featureText}>{feature.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    overflow: 'hidden',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.text,
    fontFamily: 'Satoshi',
  },
  description: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 32,
    fontFamily: 'Satoshi',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    paddingHorizontal: 10,
  },
  featureItem: {
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: 5,
  },
  featureText: {
    color: Colors.primary,
    marginTop: 5,
    fontSize: 12,
    fontFamily: 'Satoshi',
  },
});