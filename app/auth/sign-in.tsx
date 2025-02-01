import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    Text,
    Platform,
    Animated,
} from "react-native";

// Letterboxd-inspired color scheme
const Colors = {
    background: "#121212", // Dark background
    cardBackground: "#1E1E1E", // Slightly lighter card background
    textPrimary: "#FFFFFF", // White text
    textSecondary: "#B0B0B0", // Light gray text
    buttonPrimary: "#2ECC71", // Letterboxd green
    border: "#333333", // Dark border
    link: "#2ECC71", // Green for links
    inputPlaceholder: "#666666", // Gray placeholder text
};

export default function SignInPage() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const buttonScale = new Animated.Value(1); // For button animation

    async function signInWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        if (error) Alert.alert(error.message);
        setLoading(false);
    }

    // Button press animation
    const animateButton = () => {
        Animated.sequence([
            Animated.timing(buttonScale, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(buttonScale, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            {/* Title */}
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your Letterboxd account</Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
                <Ionicons
                    name="mail-outline"
                    size={20}
                    color={Colors.textSecondary}
                    style={styles.inputIcon}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={Colors.inputPlaceholder}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
                <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={Colors.textSecondary}
                    style={styles.inputIcon}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={Colors.inputPlaceholder}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
                style={styles.signInButton}
                onPress={() => {
                    animateButton();
                    signInWithEmail();
                }}
                disabled={loading}
            >
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                    <Text style={styles.signInButtonText}>
                        {loading ? "Signing In..." : "Sign In"}
                    </Text>
                </Animated.View>
            </TouchableOpacity>

            {/* Forgot Password Link */}
            <TouchableOpacity
                style={styles.forgotPasswordContainer}
                onPress={() => console.log("Forgot password pressed")}
            >
                <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
            </TouchableOpacity>

            {/* Go Back Button */}
            <TouchableOpacity
                style={styles.goBackButton}
                onPress={() => router.back()}
            >
                <Ionicons
                    name="arrow-back-outline"
                    size={20}
                    color={Colors.textPrimary}
                />
                <Text style={styles.goBackButtonText}>Go Back</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.background,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: Colors.textPrimary,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginBottom: 30,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        marginBottom: 15,
        backgroundColor: Colors.cardBackground,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: Colors.textPrimary,
        fontSize: 16,
    },
    signInButton: {
        backgroundColor: Colors.buttonPrimary,
        padding: 15,
        borderRadius: 10,
        width: "100%",
        alignItems: "center",
        marginTop: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    signInButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    forgotPasswordContainer: {
        marginTop: 15,
    },
    forgotPasswordText: {
        color: Colors.link,
        fontSize: 14,
        textDecorationLine: "underline",
    },
    goBackButton: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
    },
    goBackButtonText: {
        color: Colors.textPrimary,
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 5,
    },
});