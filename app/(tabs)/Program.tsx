import React, { useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, FlatList, TouchableOpacity, TextInput, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import {RouteProp, useNavigation} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import {Movie, RootStackParamList} from "@/constants/Movie";


type MovieDetailsRouteProp = RouteProp<RootStackParamList, "MovieDetails">;
type NavigationProp = StackNavigationProp<RootStackParamList, 'Program'>;

type MovieDetailsProps = {
    route: MovieDetailsRouteProp;
};

const WeeklyMovieSchedule = () => {
    const [loaded] = useFonts({
        Satoshi: require('../../assets/fonts/Satoshi-Variable.ttf'),
    });
    const navigation = useNavigation<NavigationProp>();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

    if (!loaded) return null;

    const movies = [
        {
            id: 1,
            title: 'Inception',
            description: 'Dream state secrets extraction thriller.',
            poster_url: 'https://a.ltrbxd.com/resized/sm/upload/sv/95/s9/4j/inception-0-2000-0-3000-crop.jpg?v=30d7224316',
            projectionDate: '2025-02-02',
            projectionTime: '20:00',
            genre: ['Sci-Fi', 'Action'],
            duration: '2h 28min',
            rating: 'PG-13',
            price: 12.99,
        },
        {
            id: 2,
            title: 'The Dark Knight',
            description: 'Batman faces chaos unleashed by the Joker.',
            poster_url: 'https://a.ltrbxd.com/resized/sm/upload/78/y5/zg/ej/oefdD26aey8GPdx7Rm45PNncJdU-0-2000-0-3000-crop.jpg?v=2d0ce4be25',
            projectionDate: '2025-02-03',
            cover_url:'https://image.tmdb.org/t/p/w500/1gKDAWgzHTbBM5OcWzhVBw4H3wt.jpg',
            projectionTime: '19:30',
            genre: ['Action', 'Drama'],
            duration: '2h 32min',
            rating: 'PG-13',
            price: 12.99,
        },
        {
            id: 3,
            title: 'Interstellar',
            description: 'Explorers travel through a wormhole for humanity.',
            poster_url: 'https://a.ltrbxd.com/resized/film-poster/1/1/7/6/2/1/117621-interstellar-0-2000-0-3000-crop.jpg?v=7ad89e6666',
            projectionDate: '2025-02-03',
            cover_url:'https://image.tmdb.org/t/p/w500/1gKDAWgzHTbBM5OcWzhVBw4H3wt.jpg',
            projectionTime: '21:00',
            genre: ['Sci-Fi', 'Drama'],
            duration: '2h 49min',
            rating: 'PG-13',
            price: 12.99,
        },
    ];

    const genres = Array.from(new Set(movies.flatMap(movie => movie.genre)));
    const getNextWeekDates = () => {
        const today = new Date();
        return Array.from({ length: 7 }).map((_, index) => {
            const date = new Date();
            date.setDate(today.getDate() + index);
            const formattedDate = date.toISOString().split('T')[0];
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            return { dayName, date: formattedDate };
        });
    };

    const filteredMovies = movies.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGenre = !selectedGenre || movie.genre.includes(selectedGenre);
        return matchesSearch && matchesGenre;
    });

    const getMoviesForDay = (day: string) =>
        filteredMovies.filter((movie) => movie.projectionDate === day);


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Weekly Movie Schedule</Text>

            <View style={styles.filterContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search movies..."
                    placeholderTextColor="#8899AA"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.genreScroll}
                >
                    <TouchableOpacity
                        style={[
                            styles.genreChip,
                            !selectedGenre && styles.selectedGenreChip
                        ]}
                        onPress={() => setSelectedGenre(null)}
                    >
                        <Text style={styles.genreText}>All</Text>
                    </TouchableOpacity>
                    {genres.map(genre => (
                        <TouchableOpacity
                            key={genre}
                            style={[
                                styles.genreChip,
                                selectedGenre === genre && styles.selectedGenreChip
                            ]}
                            onPress={() => setSelectedGenre(genre)}
                        >
                            <Text style={styles.genreText}>{genre}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {getNextWeekDates().map(({ dayName, date }) => {
                    const dayMovies = getMoviesForDay(date);

                    return (
                        <View key={date} style={styles.dayContainer}>
                            <Text style={styles.dayHeader}>{`${dayName}, ${date}`}</Text>
                            {dayMovies.length > 0 ? (
                                <FlatList
                                    data={dayMovies}
                                    keyExtractor={(item) => item.id.toString()}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity >
                                            <LinearGradient
                                                colors={["#1C1C1C", "#121212"]}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 1 }}
                                                style={styles.movieBox}
                                            >
                                                <Image source={{ uri: item.poster_url }} style={styles.poster} />
                                                <View style={styles.movieInfo}>
                                                    <Text style={styles.movieTitle}>{item.title}</Text>
                                                    <Text style={styles.movieDescription}>{item.description}</Text>
                                                    <View style={styles.movieMetadata}>
                                                        <Text style={styles.metadataText}>{item.duration}</Text>
                                                        <Text style={styles.metadataDot}>•</Text>
                                                        <Text style={styles.metadataText}>{item.rating}</Text>
                                                    </View>
                                                    <View style={styles.genreContainer}>
                                                        {item.genre.map(g => (
                                                            <View key={g} style={styles.genreTag}>
                                                                <Text style={styles.genreTagText}>{g}</Text>
                                                            </View>
                                                        ))}
                                                    </View>
                                                    <View style={styles.timePrice}>
                                                        <Text style={styles.movieTime}>{item.projectionTime}</Text>
                                                        <Text style={styles.moviePrice}>${item.price}</Text>
                                                    </View>
                                                </View>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    )}
                                />
                            ) : (
                                <Text style={styles.noMovies}>No movies scheduled</Text>
                            )}
                        </View>
                    );
                })}
            </ScrollView>

        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0A', // Darker background
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    title: {
        color: '#fff',
        fontSize: 26,
        fontFamily: 'Satoshi',
        fontWeight: '700',
        marginBottom: 16,
    },
    filterContainer: {
        marginBottom: 20,
    },
    searchInput: {
        backgroundColor: '#1A1A1A',
        borderRadius: 8,
        padding: 12,
        color: '#fff',
        marginBottom: 12,
        fontFamily: 'Satoshi',
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    genreScroll: {
        flexGrow: 0,
    },
    genreChip: {
        backgroundColor: '#1A1A1A',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    selectedGenreChip: {
        backgroundColor: '#E31837', // Cinema red
    },
    genreText: {
        color: '#fff',
        fontFamily: 'Satoshi',
    },
    dayContainer: {
        marginBottom: 24,
    },
    dayHeader: {
        color: '#ffff', // Metallic gold
        fontSize: 18,
        fontFamily: 'Satoshi',
        marginBottom: 8,
    },
    movieBox: {
        flexDirection: 'row',
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    poster: {
        width: 100,
        height: 150,
        borderRadius: 8,
        marginRight: 16,
    },
    movieInfo: {
        flex: 1,
    },
    movieTitle: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Satoshi',
        fontWeight: '700',
        marginBottom: 4,
    },
    movieDescription: {
        color: '#B8B8B8',
        fontSize: 14,
        fontFamily: 'Satoshi',
        marginBottom: 6,
    },
    movieMetadata: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    metadataText: {
        color: '#B8B8B8',
        fontSize: 12,
        fontFamily: 'Satoshi',
    },
    metadataDot: {
        color: '#B8B8B8',
        marginHorizontal: 6,
    },
    genreContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 6,
    },
    genreTag: {
        backgroundColor: '#2A2A2A',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginRight: 6,
        marginBottom: 4,
    },
    genreTagText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'Satoshi',
    },
    timePrice: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    movieTime: {
        color: '#B8B8B8',
        fontSize: 14,
        fontFamily: 'Satoshi',
    },
    moviePrice: {
        color: '#D4AF37', // Metallic gold
        fontSize: 16,
        fontFamily: 'Satoshi',
        fontWeight: '700',
    },
    noMovies: {
        color: '#B8B8B8',
        fontSize: 14,
        fontFamily: 'Satoshi',
        fontStyle: 'italic',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#0A0A0A',
        borderRadius: 16,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    closeButton: {
        position: 'absolute',
        right: 16,
        top: 16,
        zIndex: 1,
    },
    modalTitle: {
        color: '#fff',
        fontSize: 24,
        fontFamily: 'Satoshi',
        fontWeight: '700',
        marginBottom: 8,
        marginTop: 8,
    },
    modalInfo: {
        color: '#B8B8B8',
        fontSize: 16,
        fontFamily: 'Satoshi',
        marginBottom: 20,
    },
    seatsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderColor: '#2A2A2A',
    },
    seat: {
        width: 40,
        height: 40,
        backgroundColor: '#1A1A1A',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 4,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    selectedSeat: {
        backgroundColor: '#E31837', // Cinema red
        borderColor: '#E31837',
    },
    seatText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Satoshi',
    },
    bookingSummary: {
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    summaryText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Satoshi',
        marginBottom: 8,
    },
    bookButton: {
        backgroundColor: '#E31837', // Cinema red
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Satoshi',
        fontWeight: '700',
    },
});

export default WeeklyMovieSchedule;