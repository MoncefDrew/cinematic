import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
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
import { router } from "expo-router";

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

export default function SignUpPage() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const buttonScale = new Animated.Value(1); // For button animation

    async function signUpWithEmail() {
        setLoading(true);
        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email: email,
            password: password,
        });
        if (error) Alert.alert(error.message);
        await addClient({ username, email, password });

        if (!session) Alert.alert("Please check your inbox for email verification!");
        setLoading(false);
    }

    const generateSimpleId = (): string => {
        return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    };

    const addClient = async (clientData: { username: any; email: any; password: any; }) => {
        const customId = generateSimpleId();

        const { data, error } = await supabase.from("client").insert([
            {
                username: clientData.username,
                email: clientData.email,
                password: clientData.password,
            },
        ]);

        if (error) {
            console.error("Error adding client:", error);
        } else {
            console.log("Client added:", data);
        }
    };

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
            <Text style={styles.title}>Join Letterboxd</Text>
            <Text style={styles.subtitle}>Create your account to get started</Text>

            {/* Username Input */}
            <View style={styles.inputContainer}>
                <Ionicons
                    name="person-outline"
                    size={20}
                    color={Colors.textSecondary}
                    style={styles.inputIcon}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor={Colors.inputPlaceholder}
                    value={username}
                    onChangeText={setUsername}
                />
            </View>

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

            {/* Join Button */}
            <TouchableOpacity
                style={styles.joinButton}
                onPress={() => {
                    animateButton();
                    signUpWithEmail();
                }}
                disabled={loading}
            >
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                    <Text style={styles.joinButtonText}>
                        {loading ? "Creating Account..." : "Join Letterboxd"}
                    </Text>
                </Animated.View>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
            </View>

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
    joinButton: {
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
    joinButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 20,
        width: "100%",
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.border,
    },
    dividerText: {
        marginHorizontal: 10,
        color: Colors.textSecondary,
        fontSize: 14,
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