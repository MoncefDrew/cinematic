import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    Animated,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import {useMovieStore} from "@/api/store/moviesStore";

const { width, height } = Dimensions.get('window');

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
    error: '#EF4444',
    success: '#10B981',
};

export default function SignInPage() {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const featuredMovie = {
        cover_url: 'https://image.tmdb.org/t/p/original/9PqD3wSIjntyJDBzMNuxuKHwpUD.jpg'
    };

    async function signInWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) Alert.alert(error.message);
        setLoading(false);
    }

    return (
        <View style={styles.container}>
            {/* Background Image Container */}
            <View style={styles.backgroundContainer}>
                <Image
                    source={{ uri: featuredMovie.cover_url }}
                    style={styles.backgroundImage}
                />
                <LinearGradient
                    colors={[
                        'transparent',
                        CinematicColors.background,
                        CinematicColors.background
                    ]}
                    style={styles.gradient}
                />
            </View>

            {/* Content Container */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.contentContainer}
            >
                <View style={styles.content}>
                    <Text style={styles.title}>Welcome to Cinematic</Text>
                    <Text style={styles.subtitle}>Your gateway to endless entertainment</Text>

                    <View style={styles.inputContainer}>
                        <View style={styles.inputWrapper}>
                            <Ionicons
                                name="mail-outline"
                                size={20}
                                color={CinematicColors.primaryLight}
                                style={styles.icon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor={CinematicColors.textSecondary}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputWrapper}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={20}
                                color={CinematicColors.primaryLight}
                                style={styles.icon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor={CinematicColors.textSecondary}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.signInButton}
                        onPress={signInWithEmail}
                        disabled={loading}
                    >
                        <LinearGradient
                            colors={[CinematicColors.primary, CinematicColors.accent]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.buttonGradient}
                        >
                            <Text style={styles.signInButtonText}>
                                {loading ? "Signing In..." : "Sign In"}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('SignUp')}
                        >
                            <Text style={styles.footerText}>Create Account</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('ResetPassword')}
                        >
                            <Text style={styles.footerText}>Reset Password</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CinematicColors.background,
    },
    backgroundContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        zIndex: 1,
    },
    content: {
        padding: 24,
        paddingBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#776ea1',
        marginBottom: 8,
        fontFamily: 'Satoshi',
    },
    subtitle: {
        fontSize: 16,
        color: CinematicColors.textSecondary,
        marginBottom: 32,
        fontFamily: 'Satoshi',
    },
    inputContainer: {
        gap: 16,
        marginBottom: 24,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(24, 25, 53, 0.8)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: CinematicColors.border,
        height: 56,
        paddingHorizontal: 16,
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: CinematicColors.text,
        fontSize: 16,
        fontFamily: 'Satoshi',
    },
    signInButton: {
        height: 56,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 24,
    },
    buttonGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    signInButtonText: {
        color: CinematicColors.text,
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Satoshi',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 8,

    },
    footerText: {
        color: CinematicColors.primaryLight,
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Satoshi',
    },
});