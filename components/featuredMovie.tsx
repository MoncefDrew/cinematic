import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from "expo-font";
import {BORDERRADIUS, FONTSIZE} from "@/theme/theme";

// @ts-ignore
export default function FeaturedMovie({ movie }) {
    const [loaded] = useFonts({
        Satoshi: require("@/assets/fonts/Satoshi-Variable.ttf"),
    });

    if (!loaded) {
        return null; // Return null or a loading indicator if fonts are not loaded
    }

    return (
        <View style={styles.featuredMovieContainer}>
            <Image
                source={{ uri: movie.cover_url }} // Movie cover image
                style={styles.backgroundImage}
                resizeMode="cover"
            />
            <LinearGradient
                colors={['rgba(0,0,0,0.36)', 'rgba(0,0,0,0.94)']} // Gradient from transparent to dark
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradientOverlay}
            />
            <View style={styles.featuredMovieDetails}>
                <Text style={styles.featuredMovieTitle}>{movie.title}</Text>
                <Text style={styles.featuredMovieDescription}>
                    {movie.description.substring(0, 100)}...
                </Text>
                <TouchableOpacity style={styles.featuredMovieButton}>
                    <Text style={styles.featuredMovieButtonText}>Book Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    featuredMovieContainer: {
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 24,
        elevation: 5, // Add shadow for Android
        shadowColor: '#000', // Add shadow for iOS
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        borderWidth: 2, // Add border
        borderColor: '#535C91', // Use theme color for border
        width: width * 0.9, // Responsive width (90% of screen width)
        height: 250, // Fixed height for consistency
        position: 'relative',
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    gradientOverlay: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    featuredMovieDetails: {
        padding: 20,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    featuredMovieTitle: {
        color: '#FFFFFF',
        fontSize: 24,
        fontFamily: 'Satoshi', // Use a bold variant of the font
        fontWeight: '700',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.5)', // Add text shadow for better readability
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    featuredMovieDescription: {
        color: '#E0E0E0',
        fontSize: 15,
        fontFamily: 'Satoshi', // Use a medium variant of the font
        marginBottom: 16,
        textShadowColor: 'rgba(0, 0, 0, 0.5)', // Add text shadow for better readability
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    featuredMovieButton: {
        backgroundColor: '#13123b',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#535C91',
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: 'center',
        alignSelf: 'flex-start', // Align button to the left
        elevation: 3, // Add shadow for Android
        shadowColor: '#000', // Add shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    featuredMovieButtonText: {
        borderRadius: BORDERRADIUS.radius_25,
        fontSize: FONTSIZE.size_16,
        color: '#a2acdc',
        fontFamily: 'Satoshi',
        fontWeight: '700',
    },
});