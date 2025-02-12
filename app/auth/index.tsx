import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

export default function LandingPage() {
  const navigation = useNavigation();

  return (
    <LinearGradient 
      colors={['#111827', '#223344']} 
      style={styles.container}
    >
      <Text style={styles.title}>Welcome to Cinematic</Text>
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
        <Ionicons name="log-in" size={20} color="white" style={styles.icon} />
      </TouchableOpacity>

      {/* Sign Up Button */}
      <TouchableOpacity
        style={styles.signUpButton}
        onPress={() => navigation.navigate("SignUp")}
        activeOpacity={0.8} // Button feedback
      >
        <Text style={styles.signUpText}>Sign Up</Text>
        <Ionicons name="person-add" size={20} color="#00F0FF" style={styles.icon} />
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 18,
    color: "#B8B8B8",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 26,
  },
  signInButton: {
    backgroundColor: "#324b63",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '90%',
    maxWidth: 350,
    marginBottom: 20,
  },
  signInText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 10,
  },
  signUpButton: {
    backgroundColor: "transparent",
    borderColor: "#00F0FF",
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '90%',
    maxWidth: 350,
  },
  signUpText: {
    color: "#00F0FF",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 10,
  },
  icon: {
    marginLeft: 5,
  },
});