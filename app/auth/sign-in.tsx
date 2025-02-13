
    import React, {useEffect, useState} from "react";
    import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Image, Alert,
    Animated,
} from "react-native";
    import { useNavigation } from "@react-navigation/native";
    import { Ionicons } from "@expo/vector-icons";
    import {LinearGradient} from "expo-linear-gradient";
    import {useMovieStore} from "@/api/store/moviesStore";
    import {supabase} from "@/lib/supabase";

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
        const buttonScale = new Animated.Value(1); // For button animation
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [loading, setLoading] = useState(false);
        const featuredMovie =   {
            film_id: '11ed03be-ecfb-4219-9b7c-a8f9a71511cf',
            title: 'American Psycho',
            rating: 7.4,
            release_date: '2000-04-13',
            description: 'A wealthy New York investment banking executive hides his alternate psychopathic ego from his co-workers and friends as he escalates deeper into his illogical, gratuitous fantasies.',
            poster_url: 'https://image.tmdb.org/t/p/w500/9uGHEgsiUXjCNq8wdq4r49YL8A1.jpg',
            cover_url: 'https://image.tmdb.org/t/p/w500/rRwD4MoBlkBXWQ6PDnbKRSU5dDu.jpg',
            genre: 'Thriller, Drama, Crime',
            duration: 'N/A',
            directedBy: 'Mary Harron',
            created_at: '2025-02-09T21:39:15.364512+00:00'
        }

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
            <View style={styles.container}>
                <View style={styles.poster_}>
                    <Image source={{uri: featuredMovie.cover_url}} style={styles.poster}/>
                    <LinearGradient
                        colors={["transparent", "#0a0b1e"]} // Dark gradient
                        style={styles.lineargrad}
                    />
                </View>

                <View style={styles.overlay}>
                    <View style={styles.content}>
                        <Text style={styles.title}>Sign in to Cinematic</Text>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor={CinematicColors.textSecondary}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor={CinematicColors.textSecondary}
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

                        <View style={styles.footer}>
                            <TouchableOpacity
                                style={styles.footerButton}
                                onPress={() => navigation.navigate('SignUp')} // Replace 'SignUp' with your sign-up route
                            >
                                <Text style={styles.footerButtonText}>JOIN</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.footerButton}
                                onPress={() => navigation.navigate('ResetPassword')} // Replace 'ResetPassword' with your reset password route
                            >
                                <Text style={styles.footerButtonText}>RESET PASSWORD</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    const styles = StyleSheet.create({

        lineargrad: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        },
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        poster_:{
            width:'100%',
            height:'60%'
        },
        poster:{
            width:'100%',
            height:'100%'
        },
        overlay: {
            flex: 1,
            width: '100%',
            backgroundColor: 'rgba(10, 11, 30, 0.7)', // Semi-transparent overlay
            justifyContent: "center",
            alignItems: "center",


        },
        content: {
            width: '90%',
            maxWidth: 400,
        },
        title: {
            fontSize: 24,
            fontWeight: '200',
            color: CinematicColors.text,
            marginBottom: 10,
        },
        inputContainer: {
            width: '100%',
            marginBottom: 16,
        },
        input: {
            width: '100%',
            paddingVertical: 12,
            paddingHorizontal: 16,
            backgroundColor: CinematicColors.cardBackground,
            color: CinematicColors.text,
            fontSize: 16,
        },
        signInButton: {
            width: '100%',
            paddingVertical: 14,
            backgroundColor: CinematicColors.primary,
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 16,
        },
        signInButtonText: {
            color: CinematicColors.text,
            fontSize: 16,
            fontWeight: "bold",
        },
        footer: {
            flexDirection: "row",
            justifyContent: "space-between",
            width: '100%',
            marginTop: 24,
        },
        footerButton: {
            paddingVertical: 12,
            paddingHorizontal: 16,
        },
        footerButtonText: {
            color: CinematicColors.primaryLight,
            fontSize: 14,
            fontWeight: "600",
            textDecorationLine: "underline",
        },
    });