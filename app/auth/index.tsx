import React, { useRef, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, SafeAreaView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

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
};

const { width } = Dimensions.get('window');

const slides = [
    {
        title: "Welcome to Cinematic",
        description: "Your ultimate destination for discovering and booking movie experiences. Browse the latest releases, reserve seats, and join a community of film enthusiasts.",
        icon: "film-outline"
    },
    {
        title: "Terms of Service",
        description: "By using Cinematic, you agree to our terms of service. We prioritize user privacy and secure transactions. All bookings are subject to theater availability and policies.",
        icon: "document-text-outline"
    },
    {
        title: "Get Started",
        description: "Ready to begin your cinematic journey? Swipe to complete the introduction and start exploring movies, showtimes, and exclusive offers.",
        icon: "rocket-outline"
    }
];

export default function LandingPage() {
    const navigation = useNavigation();
    const scrollRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);


    const handleScroll = useCallback((event) => {
        const contentOffset = event.nativeEvent.contentOffset;
        const index = Math.round(contentOffset.x / width);
        setCurrentIndex(index);
    }, []);

    const goToNextSlide = useCallback(() => {
        if (currentIndex < slides.length - 1) {
            scrollRef.current?.scrollTo({
                x: width * (currentIndex + 1),
                animated: true,
            });
        } else {
            navigation.navigate("SignIn");
        }
    }, [currentIndex, navigation]);

    const renderSlide = useCallback(({ item, index }) => (
        <View key={index} style={styles.slide}>
            <View style={styles.card}>
                <Ionicons name={item.icon} size={60} color={CinematicColors.primary} />
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        </View>
    ), []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient
                colors={[CinematicColors.gradientStart, CinematicColors.gradientEnd]}
                style={styles.container}
            >
                <ScrollView
                    ref={scrollRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    decelerationRate="fast"
                    snapToInterval={width}
                    snapToAlignment="center"
                >
                    {slides.map((slide, index) => renderSlide({ item: slide, index }))}
                </ScrollView>

                <View style={styles.footer}>
                    <View style={styles.pagination}>
                        {slides.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.paginationDot,
                                    index === currentIndex && styles.paginationDotActive,
                                ]}
                            />
                        ))}
                    </View>

                    <TouchableOpacity
                        style={styles.signInButton}
                        onPress={goToNextSlide}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={[CinematicColors.primary, CinematicColors.accent]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.buttonGradient}
                        >
                            <Text style={styles.signInText}>
                                {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
                            </Text>
                            <Ionicons
                                name="arrow-forward"
                                size={20}
                                color={CinematicColors.text}
                            />
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.signUpButton}
                        onPress={() => navigation.navigate("SignUp")}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.signUpText}>
                            Already have an account? Sign In
                        </Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: CinematicColors.background,
    },
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 40 : 20,
    },
    slide: {
        width,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    card: {
        backgroundColor: CinematicColors.cardBackground,
        borderRadius: 20,
        padding: 30,
        width: '100%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: CinematicColors.border,
        shadowColor: CinematicColors.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
    },
    cardTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: CinematicColors.text,
        marginTop: 24,
        marginBottom: 12,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: CinematicColors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 20 : 32,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 24,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: CinematicColors.border,
        marginHorizontal: 4,
        transition: 'all 0.3s ease',
    },
    paginationDotActive: {
        backgroundColor: CinematicColors.primary,
        width: 24,
    },
    signInButton: {
        width: '100%',
        height: 56,
        borderRadius: 28,
        overflow: 'hidden',
        marginBottom: 16,
    },
    buttonGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    signInText: {
        color: CinematicColors.text,
        fontSize: 18,
        fontWeight: "600",
    },
    signUpButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
    },
    signUpText: {
        color: CinematicColors.textSecondary,
        fontSize: 16,
    },
});