import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, StatusBar, ActivityIndicator} from 'react-native';
import {useFonts} from 'expo-font';
import {useNavigation} from "@react-navigation/native";
import {useMovieStore} from "@/api/store/moviesStore";
import {useProjectionStore} from "@/api/store/ProjectionStore";
import {LinearGradient} from "expo-linear-gradient";
import AppHeader from "@/components/AppHeader";
import {SPACING} from "@/theme/theme";
import MovieProjectionItem from "@/components/MovieProjectionItem";

const WeeklyMovieSchedule = () => {
    const [loaded] = useFonts({Satoshi: require('../../assets/fonts/Satoshi-Variable.ttf'),});
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const {movies} = useMovieStore();
    const {projections, fetchProjections} = useProjectionStore();
    const navigation = useNavigation();
    
    useEffect(() => {
        setIsLoading(true);
        fetchProjections()
            .then(() => {
                console.log("Projections fetched:", projections.length);
                console.log("First few projections:", projections.slice(0, 3));
                console.log("Available movies:", movies.length);
            })
            .catch(error => console.error("Error fetching projections:", error))
            .finally(() => setIsLoading(false));
    }, [fetchProjections]);
    
    if (!loaded) return null;

    if (isLoading) {
        return (
            <LinearGradient
                colors={['#02040a', '#030314']}
                style={styles.container}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
            >
                <AppHeader
                    header={'Movie Calendar'}
                    name='home' 
                    transparent={false}
                />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#9290C3" />
                    <Text style={styles.loadingText}>Loading projections...</Text>
                </View>
            </LinearGradient>
        );
    }

    // Updated to ensure date format matches database format (YYYY-MM-DD)
    const getNextWeekDates = () => {
        const today = new Date();
        const dates = Array.from({length: 7}).map((_, index) => {
            const date = new Date(today);
            date.setDate(today.getDate() + index);
            
            // Format date as YYYY-MM-DD to match database format
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            
            return {
                dayName: date.toLocaleDateString('en-US', {weekday: 'long'}),
                fullDate: date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                }),
                date: formattedDate,
                dayNumber: date.getDate(),
            };
        });
        console.log("Generated dates:", dates.map(d => d.date));
        return dates;
    };

    const getProjectionsWithMovies = () => {
        const result = projections.map(projection => {
            // Make sure projection_date is properly formatted and trimmed
            if (projection.projection_date) {
                projection.projection_date = projection.projection_date.trim();
            }
            
            const movie = movies.find(movie => movie.film_id === projection.film_id);
            if (!movie) {
                console.log(`Projection ${projection.projection_id} has film_id ${projection.film_id}, but no matching movie found`);
            }
            return {
                ...projection,
                movie,
            };
        }).filter(projection => projection.movie);
        
        console.log("Projections with movies:", result.length);
        if (result.length > 0) {
            console.log("Sample projection with movie:", {
                projection_id: result[0].projection_id,
                projection_date: result[0].projection_date,
                movie_title: result[0].movie?.title
            });
        }
        return result;
    };

    const projectionMappings = getProjectionsWithMovies();
    if (projectionMappings.length === 0) {
        return (
            <LinearGradient
                colors={['#02040a', '#030314']}
                style={styles.container}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
            >
                <AppHeader
                    header={'Movie Calendar'}
                    name='home' 
                    transparent={false}
                />
                <View style={styles.emptyContainer}>
                    <Text style={styles.noMovies}>No movie projections available.</Text>
                    <Text style={styles.debugText}>
                        Movies: {movies.length}, Projections: {projections.length}
                    </Text>
                </View>
            </LinearGradient>
        );
    }

    const filteredMovies = projectionMappings.filter(projection => {
        const matchesSearch = searchQuery === '' || 
            projection.movie.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGenre = !selectedGenre || 
            (projection.movie.genre && projection.movie.genre.includes(selectedGenre));
        return matchesSearch && matchesGenre;
    });

    // Improved date comparison function with more detailed logging
    const normalizeDate = (dateStr) => {
        if (!dateStr) return '';
        return dateStr.toString().trim().split('T')[0];
    };

    const getMoviesForDay = (day) => {
        console.log(`Looking for movies on ${day}`);
        const dayMovies = filteredMovies.filter(projection => {
            const projDate = normalizeDate(projection.projection_date);
            const searchDate = normalizeDate(day);
            
            console.log(`Comparing "${projDate}" with "${searchDate}"`);
            console.log(`Types: ${typeof projDate} vs ${typeof searchDate}`);
            
            const isMatch = projDate === searchDate;
            if (isMatch) {
                console.log(`MATCH FOUND!`);
            }
            
            return isMatch;
        });
        console.log(`Found ${dayMovies.length} movies for ${day}`);
        return dayMovies;
    };

    const travelToMovie = (item) => {
        const {movie} = item;
        const {projection_id, start_time, projection_date, duration, seats} = item;
        // @ts-ignore
        navigation.navigate('MovieDetails', {
            fromProgram: true,
            movie,
            projection_id,
            projection_date,
            start_time,
            seats,
            duration
        });
    };

    return (
        <LinearGradient
            colors={['#02040a', '#030314']}
            style={styles.container}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
        >
            <AppHeader
                header={'Movie Calendar'}
                name='home' 
                transparent={false}
            />
            <StatusBar hidden/>

            <View style={styles.header}>
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
                renderItem={({item: date}) => {
                    const dayMovies = getMoviesForDay(date.date);
                    return dayMovies.length > 0 ? (
                        <View style={styles.dayContainer}>
                            <Text style={styles.dayText}>{date.fullDate}</Text>
                            <FlatList
                                data={dayMovies}
                                keyExtractor={(item) => item.projection_id.toString()}
                                renderItem={({item}) => (
                                    <MovieProjectionItem 
                                        item={item} 
                                        fullDate={date.fullDate} 
                                        onPress={() => travelToMovie(item)}
                                    />
                                )}
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
    appHeaderContainer: {
        marginHorizontal: SPACING.space_36,
        marginBottom: SPACING.space_10 * 2,
    },
    container: {
        flex: 1,
        paddingHorizontal: 6
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
    noMovies: {
        color: '#535C91',
        fontSize: 14,
        fontFamily: 'Satoshi',
        fontStyle: 'italic',
        textAlign: 'center',
        marginVertical: 16,
        marginHorizontal: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#9290C3',
        fontSize: 16,
        fontFamily: 'Satoshi',
        marginTop: 12,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    debugText: {
        color: '#535C91',
        fontSize: 12,
        fontFamily: 'Satoshi',
        marginTop: 8,
    }
});

export default WeeklyMovieSchedule;