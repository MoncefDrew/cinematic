import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, View, StyleSheet } from "react-native";
import MovieCard from "@/components/MovieCard";
import { Colors } from "@/constants/Colors";
import { useFonts } from "expo-font";
import {fetchFilms, MostRatedFilms} from "@/api/MoviesApi"; // Ensure the correct path
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
        getMovies();
    }, []);

    const handleMoviePress = (id: number) => {
        console.log(`Movie ${id} pressed!`);
    };

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
        backgroundColor: Colors.theme.background,
        padding: 20,
    },
    heading: {
        marginTop: 10,
        color: Colors.theme.BigTitle,
        fontSize: 17,
        marginBottom: 15,
        fontFamily: "Satoshi",
    },
    text: {
        textAlign: "center",
        color: "#8899AA",
        fontWeight: "400",
    },
    welcome: {
        padding: 15,
        backgroundColor: Colors.theme.backgroundCard,
        borderColor: Colors.theme.tabIconDefault,
        borderRadius: 4,
        alignItems: "center",
        borderWidth: 1,
        marginTop: 10,
    },
});
