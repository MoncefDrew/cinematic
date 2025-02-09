import React, { useEffect } from "react";
import { FlatList, Text, View, StyleSheet } from "react-native";
import MovieCard from "@/components/MovieCard";
import { useFonts } from "expo-font";
import { useMovieStore } from '@/api/store/moviesStore';
import { LinearGradient } from 'expo-linear-gradient';

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
        <LinearGradient
            colors={['#02040a', '#030314']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
        >
            <View style={styles.content}>
                <View style={styles.welcome}>
                    <Text style={styles.title}>Welcome to Cinematic</Text>
                    <Text style={styles.subtitle}>
                        You can navigate popular movies and book a ticket for your favorite
                        movie if you have a chance to. Hurry up now!
                    </Text>
                </View>

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
                        keyExtractor={(item) => item.film_id}
                        renderItem={({ item }) => <MovieCard movie={item}/>}
                    />
                )}
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    welcome: {
        backgroundColor: 'rgba(27, 26, 85, 0.7)', // Semi-transparent dark blue
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#535C91",
        padding: 16,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backdropFilter: 'blur(10px)', // Note: This only works on iOS
    },
    title: {
        color: "#9290C3",
        fontSize: 24,
        fontFamily: "Satoshi",
        fontWeight: "700",
        marginBottom: 8,
    },
    subtitle: {
        color: "#535C91",
        fontSize: 16,
        fontFamily: "Satoshi",
        lineHeight: 24,
    },
    sectionTitle: {
        color: "#9290C3",
        fontSize: 20,
        fontFamily: "Satoshi",
        fontWeight: "700",
        marginBottom: 16,
    },
    loadingText: {
        color: "#535C91",
        fontSize: 16,
        fontFamily: "Satoshi",
        textAlign: "center",
    },
    errorText: {
        color: "#FF6B6B",
        fontSize: 16,
        fontFamily: "Satoshi",
        textAlign: "center",
    },
});