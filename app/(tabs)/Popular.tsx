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
        <View style={styles.main}>
            <View style={styles.welcome}>
                <Text style={styles.heading}>Welcome to Cinematic</Text>
                <Text style={styles.text}>
                    You can navigate popular movies and book a ticket for your favorite
                    movie if you have a chance to. Hurry up now!
                </Text>
            </View>

            {/* Popular Movies */}
            <Text style={styles.heading}>Popular Movies</Text>
            {loading ? (
                <Text style={styles.text}>Loading...</Text>
            ) : error ? (
                <Text style={[styles.text, styles.error]}>{error}</Text>
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
    main: {
        height: "100%",
        flex: 1,
        backgroundColor: "#0A0A0A",
        padding: 20,
    },
    heading: {
        marginTop: 10,
        color: "#FFFFFF",
        fontSize: 24,
        marginBottom: 20,
        fontFamily: "Satoshi",
        fontWeight: "bold",
    },
    text: {
        textAlign: "center",
        color: "#8899AA",
        fontWeight: "400",
        fontSize: 16,
    },
    error: {
        color: "#FF4444",
    },
    welcome: {
        padding: 20,
        backgroundColor: "#1A1A1A",
        borderColor: "#333333",
        borderRadius: 8,
        alignItems: "center",
        borderWidth: 1,
        marginTop: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
});