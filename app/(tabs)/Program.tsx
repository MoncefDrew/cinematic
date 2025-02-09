import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useFonts } from 'expo-font';
import { useNavigation } from "@react-navigation/native";
import { useMovieStore } from "@/api/store/moviesStore";
import { useProjectionStore } from "@/api/store/ProjectionStore";
import {Movie} from "@/constants/Movie";
import {LinearGradient} from "expo-linear-gradient";

const WeeklyMovieSchedule = () => {
    const [loaded] = useFonts({Satoshi: require('../../assets/fonts/Satoshi-Variable.ttf'),});
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
        const {projection_id,start_time,projection_date,duration,seats} = item;
        // @ts-ignore
        navigation.navigate('MovieDetails', {fromProgram: true,movie,projection_id,projection_date,start_time,seats,duration });
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
            <TouchableOpacity
                onPress={() => travelToMovie(item)}
                style={styles.movieContainer}
            >
                <LinearGradient
                    colors={[ '#13122a','#13122a',]}
                    style={styles.movieCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
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
                        <Image
                            source={{ uri: item.movie.poster_url }}
                            style={styles.poster}
                        />
                        <View style={styles.movieInfo}>
                            <Text style={styles.movieTitle} numberOfLines={1}>
                                {item.movie.title}
                            </Text>
                            <Text style={styles.movieDescription}>
                                {truncatedDescription}
                            </Text>
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
                </LinearGradient>
            </TouchableOpacity>
        );
    };

    return (
        <LinearGradient
            colors={['#030314','#030314'  ]}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
        >
            <View style={styles.header}>
                <Text style={styles.title}>Weekly Schedule</Text>
                <Text style={styles.subtitle}>
                    Discover upcoming movies and showtimes for the week ahead
                </Text>
            </View>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search movies..."
                    placeholderTextColor="#9290C3"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <FlatList
                data={getNextWeekDates()}
                keyExtractor={(item) => item.date}
                renderItem={({ item: date }) => {
                    const dayMovies = getMoviesForDay(date.date);
                    return dayMovies.length > 0 ? (
                        <View style={styles.dayContainer}>
                            <Text style={styles.dayText}>{date.fullDate}</Text>
                            <FlatList
                                data={dayMovies}
                                keyExtractor={(item) => item.projection_id}
                                renderItem={({ item }) => renderMovieItem({ item, fullDate: date.fullDate })}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.moviesList}
                            />
                        </View>
                    ) : (
                        <Text style={styles.noMovies}>
                            No movies scheduled for {date.fullDate}
                        </Text>
                    );
                }}
            />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 24,
        padding:6
    },
    header: {
        marginHorizontal: 20,
        marginBottom: 24,
    },
    title: {
        color: '#9290C3',
        fontSize: 32,
        fontFamily: 'Satoshi',
        fontWeight: '700',
        marginBottom: 8,
    },
    subtitle: {
        color: '#535C91',
        fontSize: 16,
        fontFamily: 'Satoshi',
        lineHeight: 24,
    },
    searchContainer: {
        marginHorizontal: 20,
        marginBottom: 24,
    },
    searchInput: {
        backgroundColor: 'rgba(27, 26, 85, 0.7)',
        borderRadius: 12,
        padding: 16,
        color: '#9290C3',
        fontFamily: 'Satoshi',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#535C91',
    },
    dayContainer: {
        marginBottom: 24,
    },
    dayText: {
        color: '#9290C3',
        fontSize: 18,
        fontFamily: 'Satoshi',
        fontWeight: '600',
        marginHorizontal: 20,
        marginBottom: 12,
    },
    moviesList: {
        paddingHorizontal: 20,
    },
    movieContainer: {
        marginRight: 16,
        marginBottom: 8,
        borderRadius: 16,
        overflow: 'hidden',
    },
    movieCard: {
        width: 340,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#535C91',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(83, 92, 145, 0.3)',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    streamingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(146, 144, 195, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    streamingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#9290C3',
        marginRight: 6,
    },
    streamingText: {
        color: '#9290C3',
        fontFamily: 'Satoshi',
        fontSize: 14,
        fontWeight: '600',
    },
    movieTime: {
        color: '#9290C3',
        fontSize: 14,
        fontFamily: 'Satoshi',
        fontWeight: '600',
    },
    fullDateText: {
        color: '#9290C3',
        fontFamily: 'Satoshi',
        fontSize: 14,
        fontWeight: '500',
    },
    movieContent: {
        flexDirection: 'row',
        padding: 16,
    },
    poster: {
        width: 100,
        height: 150,
        borderRadius: 12,
        marginRight: 16,
    },
    movieInfo: {
        flex: 1,
        justifyContent: 'space-between',
    },
    movieTitle: {
        color: '#9290C3',
        fontSize: 20,
        fontFamily: 'Satoshi',
        fontWeight: '700',
        marginBottom: 8,
    },
    movieDescription: {
        color: '#535C91',
        fontSize: 14,
        fontFamily: 'Satoshi',
        lineHeight: 20,
        marginBottom: 12,
    },
    movieDetails: {
        flexDirection: 'column',
        gap: 8,
    },
    movieMetadata: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metadataText: {
        color: '#535C91',
        fontSize: 13,
        fontFamily: 'Satoshi',
    },
    metadataDot: {
        color: '#535C91',
        marginHorizontal: 8,
    },
    timePrice: {
        backgroundColor: 'rgba(27, 26, 85, 0.7)',
        padding: 10,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    moviePrice: {
        color: '#9290C3',
        fontSize: 16,
        fontFamily: 'Satoshi',
        fontWeight: '700',
    },
    noMovies: {
        color: '#535C91',
        fontSize: 14,
        fontFamily: 'Satoshi',
        fontStyle: 'italic',
        textAlign: 'center',
        marginVertical: 16,
        marginHorizontal: 20,
    },
});

export default WeeklyMovieSchedule;