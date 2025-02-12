import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import {
    KeyboardAvoidingView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    Text,
    Platform,
    Animated,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';

const Colors = {
    background: "#111827",
    cardBackground: "#1E293B",
    textPrimary: "#FFFFFF",
    textSecondary: "#B8B8B8",
    buttonPrimary: "#324b63",
    border: "#334155",
    link: "#00F0FF",
    inputPlaceholder: "#6B7280",
    error: "#ef4444",
    success: "#22c55e",
};

const toastConfig = {
    error: (props) => (
        <View style={[{
            minHeight: 60,
            width: '90%',
            backgroundColor: Colors.cardBackground,
            borderRadius: 8,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            borderLeftWidth: 4,
            borderLeftColor: '#ff0000',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        }]}>
            <Ionicons name="alert-circle" size={24} color="#ff0000" />
            <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ color: Colors.textPrimary, fontSize: 16, fontWeight: 'bold' }}>
                    {props.text1}
                </Text>
                {props.text2 && (
                    <Text style={{ color: '#ff0000', fontSize: 14, marginTop: 4 }}>
                        {props.text2}
                    </Text>
                )}
            </View>
        </View>
    ),
    success: (props) => (
        <View style={[{
            minHeight: 60,
            width: '90%',
            backgroundColor: Colors.cardBackground,
            borderRadius: 8,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            borderLeftWidth: 4,
            borderLeftColor: Colors.success,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        }]}>
            <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
            <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ color: Colors.textPrimary, fontSize: 16, fontWeight: 'bold' }}>
                    {props.text1}
                </Text>
                {props.text2 && (
                    <Text style={{ color: Colors.success, fontSize: 14, marginTop: 4 }}>
                        {props.text2}
                    </Text>
                )}
            </View>
        </View>
    ),
};

export default function SignInPage() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const buttonScale = new Animated.Value(1);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError("Email is required");
            showToast("error", "Email is required");
            return false;
        }
        if (!emailRegex.test(email)) {
            setEmailError("Please enter a valid email address");
            showToast("error", "Please enter a valid email address");
            return false;
        }
        setEmailError("");
        return true;
    };

    const validatePassword = (password: string | any[]) => {
        if (!password) {
            setPasswordError("Password is required");
            showToast("error", "Password is required");
            return false;
        }
        if (password.length < 8) {
            setPasswordError("Password must be at least 8 characters");
            showToast("error", "Password must be at least 8 characters");
            return false;
        }
        setPasswordError("");
        return true;
    };

    const showToast = (type: string, message: string) => {
        Toast.show({
            type: type,
            text1: type === 'error' ? 'Error' : 'Success',
            text2: message,
            position: 'top',
            visibilityTime: 3000,
            autoHide: true,
            topOffset: 50,
        });
    };

    async function signInWithEmail() {
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);

        if (!isEmailValid || !isPasswordValid) {
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });
            
            if (error) {
                showToast("error", error.message);
            }
        } catch (error) {
            showToast("error", "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }

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
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoid}
        >
            <LinearGradient 
                colors={['#111827', '#223344']} 
                style={styles.container}
            >
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to your Cinematic account</Text>

                <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        style={[styles.input, emailError && styles.inputError]}
                        placeholder="Email"
                        placeholderTextColor={Colors.inputPlaceholder}
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            setEmailError("");
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        style={[styles.input, passwordError && styles.inputError]}
                        placeholder="Password"
                        placeholderTextColor={Colors.inputPlaceholder}
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            setPasswordError("");
                        }}
                        secureTextEntry
                    />
                </View>
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                <TouchableOpacity
                    style={[styles.signInButton, loading && styles.signInButtonDisabled]}
                    onPress={() => {
                        animateButton();
                        signInWithEmail();
                    }}
                    disabled={loading}
                >
                    <Animated.View style={{ transform: [{ scale: buttonScale }], flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                        <Text style={styles.signInButtonText}>{loading ? "Signing In..." : "Sign In"}</Text>
                        <Ionicons name="log-in" size={20} color="white" style={styles.icon} />
                    </Animated.View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.forgotPasswordContainer}>
                    <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.goBackButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back-outline" size={20} color={Colors.textPrimary} />
                    <Text style={styles.goBackButtonText}>Go Back</Text>
                </TouchableOpacity>

                <Toast config={toastConfig} />
            </LinearGradient>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboardAvoid: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
        marginBottom: 5,
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
    inputError: {
        borderColor: Colors.error,
    },
    errorText: {
        color: Colors.error,
        fontSize: 12,
        marginBottom: 10,
        alignSelf: 'flex-start',
        marginLeft: 15,
    },
    signInButton: {
        backgroundColor: Colors.buttonPrimary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        width: "90%",
        maxWidth: 350,
        marginTop: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    signInButtonDisabled: {
        opacity: 0.7,
    },
    signInButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
        marginRight: 10,
    },
    icon: {
        marginLeft: 5,
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