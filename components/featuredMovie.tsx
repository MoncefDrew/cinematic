import {ImageBackground, TouchableOpacity, Text, View, StyleSheet} from "react-native";
import React from "react";

// @ts-ignore
export default function FeaturedMovie ({ movie }) {
    return (
        <View style={styles.featuredMovieContainer}>
            <ImageBackground
                source={{ uri: movie.poster_url }} // Replace with your movie poster URL
                style={styles.featuredMovieImage}
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
};

// Add this to your styles
const styles = StyleSheet.create({
    featuredMovieContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(27, 26, 85, 0.7)',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 24,
    },
    featuredMovieImage: {
        width: 120,
        height: 180,
    },
    featuredMovieDetails: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    featuredMovieTitle: {
        color: "#9290C3",
        fontSize: 18,
        fontFamily: "Satoshi",
        fontWeight: "700",
        marginBottom: 8,
    },
    featuredMovieDescription: {
        color: "#535C91",
        fontSize: 14,
        fontFamily: "Satoshi",
        marginBottom: 12,
    },
    featuredMovieButton: {
        backgroundColor: "#9290C3",
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    featuredMovieButtonText: {
        color: "#070F2B",
        fontSize: 14,
        fontFamily: "Satoshi",
        fontWeight: "700",
    },
});