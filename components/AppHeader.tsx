import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { FONTSIZE, SPACING } from '@/theme/theme';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, withTiming, Easing } from 'react-native-reanimated';

const CinematicColors = {
    background: '#0A0B1E',
    surface: '#12132D',
    primary: '#6366F1',
    primaryLight: '#818CF8',
    accent: '#4F46E5',
    accentSoft: 'rgba(99, 102, 241, 0.15)',
    text: '#9B9BC0',
    textSecondary: '#9B9BC0',
    border: '#1E2048',
    cardBackground: '#181935',
};

const GradientColors = {
    start: '#0A0B1E',
    middle: '#12132D',
    end: '#181935',
};

interface AppHeaderProps {
    name: string;
    header: string;
    action?: () => void;
    transparent: boolean;
}

export default function AppHeader({ name, header, action }: AppHeaderProps) {
    const router = useRouter();
    const opacity = useSharedValue(1); // Shared value for opacity animation

    const navigateWithAnimation = (route: string) => {
        // Fade out animation
        opacity.value = withTiming(0, {
            duration: 300,
            easing: Easing.ease,
        });

        // Navigate after the animation completes
        setTimeout(() => {
            if (route === 'back') {
                router.back();
            } else {
                router.push(route);
            }
            // Reset opacity after navigation
            opacity.value = withTiming(1, {
                duration: 300,
                easing: Easing.ease,
            });
        }, 300);
    };

    return (
        <LinearGradient
            colors={["transparent", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0 }}
            style={styles.gradientContainer}
        >
            <Animated.View style={[styles.headerContainer, { opacity }]}>
                <TouchableOpacity
                    onPress={() => navigateWithAnimation('back')}
                    style={styles.iconButton}
                >
                    <Ionicons
                        name={name}
                        size={24}
                        color={CinematicColors.text}
                    />
                </TouchableOpacity>

                <View style={styles.titleContainer}>
                    <Text style={styles.headerTitle}>{header}</Text>
                </View>

                <TouchableOpacity
                    onPress={action || (() => navigateWithAnimation("/(tabs)/Profile"))}
                    style={styles.iconButton}
                >
                    <Ionicons
                        name="settings-outline"
                        size={24}
                        color={CinematicColors.primary}
                    />
                </TouchableOpacity>
            </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradientContainer: {
        paddingTop: 2,
        backgroundColor: 'transparent',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.space_20,
        paddingVertical: SPACING.space_15,
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: FONTSIZE.size_20,
        fontWeight: 'bold',
        color: CinematicColors.text,
        fontFamily: 'Satoshi',
    },
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
});