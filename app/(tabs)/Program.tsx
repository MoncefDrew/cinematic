import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useFonts } from 'expo-font';
import { useNavigation } from "@react-navigation/native";
import { useMovieStore } from "@/api/store/moviesStore";
import { useProjectionStore } from "@/api/store/ProjectionStore";
import {Movie} from "@/constants/Movie";

const WeeklyMovieSchedule = () => {
    const [loaded] = useFonts({
        Satoshi: require('../../assets/fonts/Satoshi-Variable.ttf'),
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState(null);
    const { movies } = useMovieStore();
    const { projections, fetchProjections } = useProjectionStore();
    const navigation = useNavigation();

    useEffect(() => {
        fetchProjections();
    }, [fetchProjections]);

    if (!loaded) return null;

    //checking the streaming state
    const isMovieStreaming = (projectionTime:any) => {
        const now = new Date();
        const [hours, minutes] = projectionTime.split(':');
        const projectionDate = new Date();
        projectionDate.setHours(parseInt(hours), parseInt(minutes));
        // @ts-ignore
        return now - projectionDate >= 0 && now - projectionDate <= 2 * 60 * 60 * 1000;
    };

    const getNextWeekDates = () => {
        const today = new Date();
        return Array.from({ length: 7 }).map((_, index) => {
            const date = new Date(today);
            date.setDate(today.getDate() + index);
            return {
                dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
                fullDate: date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                }),
                date: date.toISOString().split('T')[0],
                dayNumber: date.getDate(),
            };
        });
    };

    const getProjectionsWithMovies = () => projections
        .map(projection => ({
            ...projection,
            movie: movies.find(movie => movie.film_id === projection.film_id),
        }))
        .filter(projection => projection.movie);

    const filteredMovies = getProjectionsWithMovies().filter(projection => {
        const matchesSearch = projection.movie.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGenre = !selectedGenre || projection.movie.genre.includes(selectedGenre);
        return matchesSearch && matchesGenre;
    });

    const getMoviesForDay = (day) => filteredMovies.filter(projection => projection.projection_date === day);


    const travelToMovie = (item) => {
        const { movie } = item;
        const {projection_id,start_time,projection_date,end_time,duration} = item;
        navigation.navigate('MovieDetails', {fromProgram: true,movie,projection_id,projection_date,start_time,end_time,duration });
    };


    const renderMovieItem = ({ item, fullDate }) => {
        const truncatedDescription = item.movie.description.length > 70
            ? `${item.movie.description.substring(0, 70)}...`
            : item.movie.description;
        const isStreaming = isMovieStreaming(item.start_time);

        const formatTime = (timeString) => {
            const [hours, minutes] = timeString.split(':');
            const hour = parseInt(hours, 10);
            const period = hour >= 12 ? 'PM' : 'AM';
            const formattedHour = hour % 12 || 12;
            return `${formattedHour}:${minutes} ${period}`;
        };

        return (
            <TouchableOpacity onPress={() => travelToMovie(item)} style={styles.movieContainer}>
                <View style={styles.movieCard}>
                    <View style={styles.headerContainer}>
                        <View style={styles.timeContainer}>
                            {isStreaming ? (
                                <View style={styles.streamingContainer}>
                                    <View style={styles.streamingDot} />
                                    <Text style={styles.streamingText}>Streaming</Text>
                                </View>
                            ) : (
                                <Text style={styles.movieTime}>{formatTime(item.start_time)}</Text>
                            )}
                        </View>
                        <Text style={styles.fullDateText}>{fullDate}</Text>
                    </View>
                    <View style={styles.movieContent}>
                        <Image source={{ uri: item.movie.poster_url }} style={styles.poster} />
                        <View style={styles.movieInfo}>
                            <Text style={styles.movieTitle} numberOfLines={1}>{item.movie.title}</Text>
                            <Text style={styles.movieDescription}>{truncatedDescription}</Text>
                            <View style={styles.movieDetails}>
                                <View style={styles.movieMetadata}>
                                    <Text style={styles.metadataText}>{item.movie.duration}</Text>
                                    <Text style={styles.metadataDot}>•</Text>
                                    <Text style={styles.metadataText}>{item.movie.rating}</Text>
                                </View>
                                <View style={styles.timePrice}>
                                    <Text style={styles.moviePrice}>100.00 DA</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Weekly Schedule</Text>
                <Text style={styles.subtitle}>Discover upcoming movies and showtimes for the week ahead</Text>
            </View>

            <TextInput
                style={styles.searchInput}
                placeholder="Search movies..."
                placeholderTextColor="#8899AA"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            <FlatList
                data={getNextWeekDates()}
                keyExtractor={(item) => item.date}
                renderItem={({ item: date }) => {
                    const dayMovies = getMoviesForDay(date.date);
                    return dayMovies.length > 0 ? (
                        <FlatList
                            data={dayMovies}
                            keyExtractor={(item) => item.projection_id}
                            renderItem={({ item }) => renderMovieItem({ item, fullDate: date.fullDate })}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />
                    ) : (
                        <Text style={styles.noMovies}>No movies scheduled for {date.fullDate}</Text>
                    );
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111827',
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        color: '#fff',
        fontSize: 32,
        fontFamily: 'Satoshi',
        fontWeight: '700',
        marginBottom: 8,
    },
    subtitle: {
        color: '#94A3B8',
        fontSize: 16,
        fontFamily: 'Satoshi',
        lineHeight: 24,
    },
    searchInput: {
        backgroundColor: '#1F2937',
        borderRadius: 12,
        padding: 16,
        color: '#fff',
        marginBottom: 24,
        fontFamily: 'Satoshi',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#374151',
    },
    movieContainer: {
        marginRight: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    movieCard: {
        backgroundColor: '#1F2937',
        width: 340,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#374151',
        overflow: 'hidden',
    },
    dateMarker: {
        backgroundColor: '#374151',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
    },
    fullDateText: {
        color: '#fff',
        fontFamily: 'Satoshi',
        fontSize: 14,
        fontWeight: '600',
    },
    movieContent: {
        flexDirection: 'row',
        padding: 16,
    },
    poster: {
        width: 90,
        height: 140,
        borderRadius: 8,
        marginRight: 16,
    },
    movieInfo: {
        flex: 1,
        justifyContent: 'space-between',
    },
    movieTitle: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Satoshi',
        fontWeight: '700',
        marginBottom: 8,
    },
    movieDescription: {
        color: '#94A3B8',
        fontSize: 14,
        fontFamily: 'Satoshi',
        lineHeight: 20,
        marginBottom: 12,
    },
    movieDetails: {
        flexDirection: 'column',
    },
    movieMetadata: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    metadataText: {
        color: '#94A3B8',
        fontSize: 13,
        fontFamily: 'Satoshi',
    },
    metadataDot: {
        color: '#94A3B8',
        marginHorizontal: 8,
    },
    timePrice: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#2D3748',
        padding: 8,
        borderRadius: 8,
    },
    movieTime: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Satoshi',
        fontWeight: '500',
    },
    moviePrice: {
        color: '#10B981',
        fontSize: 16,
        fontFamily: 'Satoshi',
        fontWeight: '700',
    },
    noMovies: {
        color: '#94A3B8',
        fontSize: 14,
        fontFamily: 'Satoshi',
        fontStyle: 'italic',
        textAlign: 'center',
        marginVertical: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    streamingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    streamingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10B981',
        marginRight: 5,
    },
    streamingText: {
        color: '#10B981',
        fontWeight: 'bold',
    },
});

export default WeeklyMovieSchedule;