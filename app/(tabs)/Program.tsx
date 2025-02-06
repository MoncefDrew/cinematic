import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useFonts } from 'expo-font';
import { useNavigation } from "@react-navigation/native";
import { useMovieStore } from "@/api/store/moviesStore";
import { useProjectionStore } from "@/api/store/ProjectionStore";
import MovieCard from "@/components/MovieCard";

const WeeklyMovieSchedule = () => {
    const [loaded] = useFonts({
        Satoshi: require('../../assets/fonts/Satoshi-Variable.ttf'),
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState(null);
    const { movies } = useMovieStore();
    const { projections, fetchProjections } = useProjectionStore();

    useEffect(() => {
        fetchProjections();
    }, [fetchProjections]);

    if (!loaded) return null;

    const isMovieStreaming = (projectionTime) => {
        const now = new Date();
        const [hours, minutes] = projectionTime.split(':');
        const projectionDate = new Date();
        projectionDate.setHours(parseInt(hours), parseInt(minutes));

        // Movie is considered streaming if it started within the last 2 hours
        const timeDiff = now.getTime() - projectionDate.getTime();
        return timeDiff >= 0 && timeDiff <= 2 * 60 * 60 * 1000;
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
                    year: 'numeric'
                }),
                date: date.toISOString().split('T')[0],
                dayNumber: date.getDate()
            };
        });
    };

    const getProjectionsWithMovies = () => {
        return projections
            .map(projection => {
                const matchedMovie = movies.find(movie => movie.film_id === projection.film_id);
                return matchedMovie ? { ...projection, movie: matchedMovie } : null;
            })
            .filter(Boolean);
    };

    const filteredMovies = getProjectionsWithMovies().filter(projection => {
        const matchesSearch = projection.movie.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGenre = !selectedGenre || projection.movie.genre.includes(selectedGenre);
        return matchesSearch && matchesGenre;
    });

    const getMoviesForDay = (day) =>
        filteredMovies.filter((projection) => projection.projection_date === day);

    const renderMovieItem = ({ item, dayName, dayNumber, fullDate }) => {
        const truncatedDescription = item.movie.description.length > 50
            ? item.movie.description.substring(0, 70) + '...'
            : item.movie.description;
        const isStreaming = isMovieStreaming(item.start_time);


        return (
            <TouchableOpacity style={styles.movieContainer}>
                <View style={styles.movieCard}>
                    <View style={styles.dateMarker}>
                        <View style={styles.dateInfo}>
                            <Text style={styles.fullDateText}>{fullDate}</Text>
                        </View>
                        {isStreaming && <View style={styles.streamingDot} />}
                    </View>
                    <View style={styles.movieContent}>
                        <View  style={styles.poster}>
                            <MovieCard movie={item}  />
                        </View>
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
                                    <Text style={styles.movieTime}>{item.projectionTime}</Text>
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
                            keyExtractor={(item) => item.id}
                            renderItem={({item}) => renderMovieItem({
                                item,
                                dayName: date.dayName,
                                dayNumber: date.dayNumber,
                                fullDate: date.fullDate
                            })}
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
        backgroundColor: '#111827', // Darker, more sophisticated background
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
    dateInfo: {
        flex: 1,
    },
    fullDateText: {
        color: '#fff',
        fontFamily: 'Satoshi',
        fontSize: 14,
        fontWeight: '600',
    },
    streamingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10B981', // Green color for streaming indicator
        marginLeft: 8,
    },
    movieContent: {
        flexDirection: 'row',
        padding: 16,
    },
    poster: {

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
        color: '#10B981', // Changed to match streaming dot color
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
});

export default WeeklyMovieSchedule;