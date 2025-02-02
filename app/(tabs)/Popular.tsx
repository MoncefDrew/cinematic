import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, View, StyleSheet } from "react-native";
import MovieCard from "@/components/MovieCard";
import { Colors } from "@/constants/Colors";
import { useFonts } from "expo-font";
import { fetchFilms, MostRatedFilms } from "@/api/MoviesApi"; // Ensure the correct path
import { Movie } from "@/constants/Movie";

export default function Popular() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loaded] = useFonts({
        Satoshi: require("../../assets/fonts/Satoshi-Variable.ttf"),
    });

    // Fetch movies on component mount
    useEffect(() => {
        const getMovies = async () => {
            const fetchedMovies = await MostRatedFilms();
            setMovies(fetchedMovies);
        };
        getMovies().then(r =>console.log(r) );
    }, []);

    const handleMoviePress = (id: number) => {
        console.log(`Movie ${id} pressed!`);
    };

    // @ts-ignore
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
            <FlatList
                data={movies}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <MovieCard movie={item} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        height: "100%",
        flex: 1,
        backgroundColor: "#0A0A0A", // Dark background for cinematic feel
        padding: 20,
    },
    heading: {
        marginTop: 10,
        color: "#FFFFFF", // White color for text
        fontSize: 24, // Larger font size for headings
        marginBottom: 20,
        fontFamily: "Satoshi",
        fontWeight: "bold", // Bold font for headings
    },
    text: {
        textAlign: "center",
        color: "#8899AA", // Lighter color for secondary text
        fontWeight: "400",
        fontSize: 16, // Slightly larger font size for readability
    },
    welcome: {
        padding: 20,
        backgroundColor: "#1A1A1A", // Darker background for the welcome section
        borderColor: "#333333", // Subtle border color
        borderRadius: 8, // Rounded corners
        alignItems: "center",
        borderWidth: 1,
        marginTop: 10,
        shadowColor: "#000", // Adding shadow for depth
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5, // Elevation for Android
    },
});