import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";

export default function LandingPage() {
    const router = useRouter();

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Welcome to Letterboxd</Text>
      <Text style={styles.description}>
        Track the films you’ve watched, discover new favorites, and interact
        with other movie enthusiasts.
      </Text>
      <TouchableOpacity
        style={styles.signInButton}
        onPress={()=> router.push("/auth/sign-in")}
      >
        <Text style={styles.signInText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.signUpButton}
        onPress={()=> router.push("/auth/sign-up")}

      >
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#E5E5E5", // Light gray
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#A9A9A9", // Medium gray
    textAlign: "center",
    marginBottom: 32,
  },
  signInButton: {
    backgroundColor: "#2ECC71", // Letterboxd green
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    marginBottom: 12,
  },
  signInText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  signUpButton: {
    borderColor: "#555", // Border gray
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  signUpText: {
    color: "#E5E5E5", // Light gray
    fontSize: 16,
    fontWeight: "600",
  },
});

