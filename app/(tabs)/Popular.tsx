import React, { useEffect } from "react";
import { FlatList, Text, View, StyleSheet } from "react-native";
import MovieCard from "@/components/MovieCard";
import { useFonts } from "expo-font";
import { useMovieStore } from '@/api/store/moviesStore'; // Adjust path as needed

export default function Popular() {
    const {
        movies,
        loading,
        error,
        fetchPopular
    } = useMovieStore();

    const [loaded] = useFonts({
        Satoshi: require("../../assets/fonts/Satoshi-Variable.ttf"),
    });

    // Fetch popular movies on component mount
    useEffect(() => {
        fetchPopular();
    }, []);

    const handleMoviePress = (id: string) => {
        console.log(`Movie ${id} pressed!`);
    };

    if (!loaded) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.welcome}>
                <Text style={styles.title}>Welcome to Cinematic</Text>
                <Text style={styles.subtitle}>
                    You can navigate popular movies and book a ticket for your favorite
                    movie if you have a chance to. Hurry up now!
                </Text>
            </View>

            {/* Popular Movies */}
            <Text style={styles.sectionTitle}>Popular Movies</Text>
            {loading ? (
                <Text style={styles.loadingText}>Loading...</Text>
            ) : error ? (
                <Text style={[styles.errorText]}>{error}</Text>
            ) : (
                <FlatList
                    data={movies}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <MovieCard movie={item} />}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#111827", // Dark background to match the design
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    welcome: {
        backgroundColor: "#1F2937", // Dark card background
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#374151", // Matching border color
        padding: 16,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        color: "#FFFFFF", // White text for the title
        fontSize: 24,
        fontFamily: "Satoshi",
        fontWeight: "700",
        marginBottom: 8,
    },
    subtitle: {
        color: "#94A3B8", // Subdued text color
        fontSize: 16,
        fontFamily: "Satoshi",
        lineHeight: 24,
    },
    sectionTitle: {
        color: "#FFFFFF", // White text for section title
        fontSize: 20,
        fontFamily: "Satoshi",
        fontWeight: "700",
        marginBottom: 16,
    },
    loadingText: {
        color: "#94A3B8", // Subdued text color for loading state
        fontSize: 16,
        fontFamily: "Satoshi",
        textAlign: "center",
    },
    errorText: {
        color: "#EF4444", // Red color for error messages
        fontSize: 16,
        fontFamily: "Satoshi",
        textAlign: "center",
    },
});