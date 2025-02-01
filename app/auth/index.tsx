import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function LandingPage() {
  const navigation = useNavigation();

  // @ts-ignore
  return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Letterboxd</Text>
        <Text style={styles.description}>
          Track the films you’ve watched, discover new favorites, and interact
          with other movie enthusiasts.
        </Text>

        {/* Sign In Button */}
        <TouchableOpacity
            style={styles.signInButton}
            onPress={() => navigation.navigate("SignIn")}
            activeOpacity={0.8} // Button feedback
        >
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>

        {/* Sign Up Button */}
        <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => navigation.navigate("SignUp")}
            activeOpacity={0.8} // Button feedback
        >
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // White background
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000000", // Black
    marginBottom: 16,
    textAlign: "center",
    fontFamily: "sans-serif", // Use sans-serif font
  },
  description: {
    fontSize: 16,
    color: "#666666", // Gray
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
    fontFamily: "sans-serif", // Use sans-serif font
  },
  signInButton: {
    backgroundColor: "#2ECC71", // Letterboxd green
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "100%",
    maxWidth: 300,
    alignItems: "center",
    marginBottom: 16,
  },
  signInText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "sans-serif", // Use sans-serif font
  },
  signUpButton: {
    backgroundColor: "transparent",
    borderColor: "#2ECC71", // Letterboxd green
    borderWidth: 2,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "100%",
    maxWidth: 300,
    alignItems: "center",
  },
  signUpText: {
    color: "#2ECC71", // Letterboxd green
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "sans-serif", // Use sans-serif font
  },
});