import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
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
import { router } from "expo-router";
import { useAuthStore } from "@/api/store/AuthStore";
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

// Custom Toast Configuration
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
                    <Text style={{ color: Colors.textSecondary, fontSize: 14, marginTop: 4 }}>
                        {props.text2}
                    </Text>
                )}
            </View>
        </View>
    ),
};

interface ValidationErrors {
    username?: string;
    email?: string;
    password?: string;
}

export default function SignUpPage() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState({ username: false, email: false, password: false });
    const buttonScale = new Animated.Value(1);
    const setUser = useAuthStore((state) => state.setUser);

    // Validation functions
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string) => {
        return password.length >= 8;
    };

    const validateUsername = (username: string) => {
        return username.length >= 3 && username.length <= 20;
    };

    const validateForm = () => {
        const newErrors: ValidationErrors = {};

        if (!validateUsername(username)) {
            newErrors.username = "Username must be between 3 and 20 characters";
        }

        if (!validateEmail(email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!validatePassword(password)) {
            newErrors.password = "Password must be at least 8 characters long";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle field blur
    const handleBlur = (field: keyof typeof touched) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    // Effect to validate on change
    useEffect(() => {
        if (touched.email) validateForm();
    }, [email]);

    useEffect(() => {
        if (touched.password) validateForm();
    }, [password]);

    useEffect(() => {
        if (touched.username) validateForm();
    }, [username]);

    async function signUpWithEmail() {
        if (!validateForm()) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Please fix the errors before submitting',
                position: 'bottom'
            });
            return;
        }

        setLoading(true);
        try {
            const { data: { user }, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;

            await addClient({ username, email, password });
            setUser({ username, email, profilePic: null });
            
            Toast.show({
                type: 'success',
                text1: 'Success!',
                text2: 'Account created! Please verify your email.',
                position: 'bottom'
            });
            
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message,
                position: 'bottom'
            });
        } finally {
            setLoading(false);
        }
    }

    const generateSimpleId = () => `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const addClient = async (clientData: { username: string; email: string; password: string; }) => {
        const { error } = await supabase.from("client").insert([
            {
                username: clientData.username,
                email: clientData.email,
                password: clientData.password,
            },
        ]);

        if (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Error adding client to database',
                position: 'bottom'
            });
        }
    };

    const animateButton = () => {
        Animated.sequence([
            Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
            Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start();
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <Text style={styles.title}>Join Letterboxd</Text>
            <Text style={styles.subtitle}>Create your account to get started</Text>

            <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                    style={[styles.input, errors.username && touched.username && styles.inputError]}
                    placeholder="Username"
                    placeholderTextColor={Colors.inputPlaceholder}
                    value={username}
                    onChangeText={setUsername}
                    onBlur={() => handleBlur('username')}
                />
            </View>
            {errors.username && touched.username && (
                <Text style={styles.errorText}>{errors.username}</Text>
            )}

            <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                    style={[styles.input, errors.email && touched.email && styles.inputError]}
                    placeholder="Email"
                    placeholderTextColor={Colors.inputPlaceholder}
                    value={email}
                    onChangeText={setEmail}
                    onBlur={() => handleBlur('email')}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>
            {errors.email && touched.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                    style={[styles.input, errors.password && touched.password && styles.inputError]}
                    placeholder="Password"
                    placeholderTextColor={Colors.inputPlaceholder}
                    value={password}
                    onChangeText={setPassword}
                    onBlur={() => handleBlur('password')}
                    secureTextEntry
                />
            </View>
            {errors.password && touched.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <TouchableOpacity
                style={[styles.joinButton, loading && styles.joinButtonDisabled]}
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

            <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.goBackButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back-outline" size={20} color={Colors.textPrimary} />
                <Text style={styles.goBackButtonText}>Go Back</Text>
            </TouchableOpacity>

            <Toast config={toastConfig} />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center", 
        backgroundColor: Colors.background, 
        paddingHorizontal: 20 
    },
    title: { 
        fontSize: 32, 
        fontWeight: "bold", 
        color: Colors.textPrimary, 
        marginBottom: 10 
    },
    subtitle: { 
        fontSize: 16, 
        color: Colors.textSecondary, 
        marginBottom: 30 
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
        paddingVertical: 10 
    },
    inputIcon: { 
        marginRight: 10 
    },
    input: { 
        flex: 1, 
        color: Colors.textPrimary, 
        fontSize: 16 
    },
    inputError: {
        borderColor: Colors.error,
    },
    errorText: {
        color: Colors.error,
        fontSize: 12,
        marginBottom: 10,
        alignSelf: 'flex-start',
        marginLeft: 15
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
        elevation: 5 
    },
    joinButtonDisabled: {
        opacity: 0.7
    },
    joinButtonText: { 
        color: "white", 
        fontSize: 16, 
        fontWeight: "bold" 
    },
    dividerContainer: { 
        flexDirection: "row", 
        alignItems: "center", 
        marginVertical: 20, 
        width: "100%" 
    },
    dividerLine: { 
        flex: 1, 
        height: 1, 
        backgroundColor: Colors.border 
    },
    dividerText: { 
        marginHorizontal: 10, 
        color: Colors.textSecondary, 
        fontSize: 14 
    },
    goBackButton: { 
        flexDirection: "row", 
        alignItems: "center", 
        marginTop: 20 
    },
    goBackButtonText: { 
        color: Colors.textPrimary, 
        fontSize: 16, 
        fontWeight: "bold", 
        marginLeft: 5 
    },
});