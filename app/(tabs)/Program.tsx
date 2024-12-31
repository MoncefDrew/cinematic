import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { Colors } from '@/constants/Colors';  // Adjust this import based on your actual project structure

const StreamingSchedule = () => {
    const [loaded] = useFonts({
        Satoshi: require('../../assets/fonts/Satoshi-Variable.ttf'),
    });

    if (!loaded) {
        return null; // Or you can return a loading spinner here
    }


    // Sample data for movies with duration in minutes
    const movies = [
        {
            id: 1,
            title: 'Inception',
            description: 'A skilled thief, the absolute best in the dangerous art of extraction, steals secrets from deep within the subconscious during the dream state.',
            poster: 'https://a.ltrbxd.com/resized/sm/upload/sv/95/s9/4j/inception-0-2000-0-3000-crop.jpg?v=30d7224316',
            projectionDate: '2024-12-31',
            projectionTime: '20:00',
            duration: 148, // In minutes
        },
        {
            id: 2,
            title: 'The Dark Knight',
            description: 'When the menace known as The Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham.',
            poster: 'https://a.ltrbxd.com/resized/sm/upload/78/y5/zg/ej/oefdD26aey8GPdx7Rm45PNncJdU-0-2000-0-3000-crop.jpg?v=2d0ce4be25',
            projectionDate: '2025-01-10',
            projectionTime: '19:30',
            duration: 152,
        },
        {
            id: 3,
            title: 'Interstellar',
            description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
            poster: 'https://a.ltrbxd.com/resized/film-poster/1/1/7/6/2/1/117621-interstellar-0-2000-0-3000-crop.jpg?v=7ad89e6666',
            projectionDate: '2024-02-05',
            projectionTime: '21:00',
            duration: 169,
        },
    ];

    // Function to get movie state based on projection date, time, and duration
    const getMovieState = (projectionDate: string, projectionTime: string, duration: number): string => {
        const now = new Date();
        const projectionDateTime = new Date(`${projectionDate}T${projectionTime}`);
        const endDateTime = new Date(projectionDateTime.getTime() + duration * 60000); // Add duration in milliseconds

        if (now > endDateTime) {
            return 'Streamed';
        } else if (now >= projectionDateTime && now <= endDateTime) {
            return 'Streaming Now';
        } else {
            return 'Not Streamed Yet';
        }
    };



    // Function to get the text color for the stream state
    const getStateTextColor = (state: string): string => {
        switch (state) {
            case 'Streaming Now':
                return '#00E054'; // Light color for "Streaming Now"
            case 'Streamed':
                return '#A66C6C'; // Muted red for "Streamed"
            case 'Not Streamed Yet':
                return '#C2A400'; // Muted yellow for "Not Streamed Yet"
            default:
                return '#ccc'; // Default to gray if no state matches
        }
    };

    // Function to format the date and add the day of the week
    const formatDate = (projectionDate: string): string => {
        const date = new Date(projectionDate);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return `${days[date.getDay()]}, ${projectionDate}`;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Streaming Schedule</Text>
            <Text style={styles.subtitle}>
                Reach your favorite movie by navigating our special program for clients
            </Text>

            <FlatList
                data={movies}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    const state = getMovieState(item.projectionDate, item.projectionTime, item.duration);
                    return (
                        <View style={styles.scheduleBox}>
                            <Text style={styles.movieDate}>{formatDate(item.projectionDate)} at {item.projectionTime}</Text>

                            <View style={styles.movieDetails}>
                                    <Image source={{ uri: item.poster }} style={styles.poster} />
                                <View style={styles.movieInfo}>
                                    <Text style={styles.movieTitle}>{item.title}</Text>
                                    <Text style={styles.movieDescription}>{item.description}</Text>
                                    <Text style={styles.movieDuration}>Duration: {item.duration} mins</Text>
                                </View>
                            </View>

                            {/* Stream status at bottom-right corner */}
                            <Text style={[styles.movieState, { color: getStateTextColor(state) }]}>{state}</Text>
                        </View>
                    );
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.theme.background,
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontFamily: 'Satoshi',
        fontWeight: '100',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 18,
        fontFamily: 'Satoshi',
        color: '#8899AA',
        marginBottom: 15,
    },
    scheduleBox: {
        backgroundColor: '#0d1117',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        position: 'relative',
    },
    movieDate: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 8,
        fontFamily: 'Satoshi',
    },
    movieDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    poster: {
        width: 80,
        height: 120,
        borderRadius: 8,
        marginRight: 16,
    },
    movieInfo: {
        flex: 1,
    },
    movieTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'Satoshi',
        marginBottom: 6,
    },
    movieDescription: {
        color: '#8899AA',
        fontSize: 14,
        fontFamily: 'Satoshi',
    },
    movieDuration: {
        color: Colors.theme.icontTitle,
        fontSize: 14,
        fontFamily: 'Satoshi',
        marginTop: 10,
    },
    movieState: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        fontSize: 14,
        fontFamily: 'Satoshi',
        fontWeight: '500',
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 4,
    },
});

export default StreamingSchedule;
