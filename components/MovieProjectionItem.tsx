import { LinearGradient } from 'expo-linear-gradient';
import React, { RefAttributes } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';


interface MovieProjectionItemProps {
    item:any,
    fullDate:string,
    onPress:any,
}
const MovieProjectionItem = ({ item, fullDate, onPress }:MovieProjectionItemProps) => {
    // Handle cases where movie might be null or undefined
    if (!item || !item.movie) {
        console.log("Invalid item passed to MovieProjectionItem:", item);
        return null;
    }

    const truncatedDescription = item.movie.description 
        ? (item.movie.description.length > 70
            ? `${item.movie.description.substring(0, 70)}...`
            : item.movie.description)
        : "No description available";

    // Check if movie is currently streaming
    const isMovieStreaming = () => {
        try {
            const now = new Date();

            const [hours, minutes] = item.start_time.split(':');
            const showtime = new Date(item.projection_date);
            showtime.setHours(parseInt(hours), parseInt(minutes));

            const timeDifference = now.getTime() - showtime.getTime();

            return timeDifference >= 0 && timeDifference <= 2 * 60 * 60 * 1000;
        } catch (error) {
            console.error("Error calculating streaming status:", error);
            return false;
        }
    };

    const formatTime = (timeString:string) => {
        try {
            const [hours, minutes] = timeString.split(':');
            const hour = parseInt(hours, 10);
            const period = hour >= 12 ? 'PM' : 'AM';
            const formattedHour = hour % 12 || 12;
            return `${formattedHour}:${minutes} ${period}`;
        } catch (error) {
            console.error("Error formatting time:", error);
            return timeString || "Unknown time";
        }
    };

    const isStreaming = isMovieStreaming();

    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.movieContainer}
        >
            <LinearGradient
                                colors={['rgba(99, 102, 241, 0.15)', 'rgba(99, 102, 241, 0.05)']}
                                style={styles.cardGradient}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 1}}
                            />
            <View style={styles.movieCard}>
                <View style={styles.headerContainer}>
                    <View style={styles.timeContainer}>
                        {isStreaming ? (
                            <View style={styles.streamingContainer}>
                                <View style={styles.streamingDot}/>
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
                        source={{uri: item.movie.poster_url}}
                        style={styles.poster}
                    />
                    <View style={styles.movieInfo}>
                        <Text style={styles.movieTitle} numberOfLines={1}>
                            {item.movie.title || "Untitled"}
                        </Text>
                        <Text style={styles.movieDescription}>
                            {truncatedDescription}
                        </Text>
                        <View style={styles.movieDetails}>
                            <View style={styles.movieMetadata}>
                                <Text style={styles.metadataText}>{item.movie.duration || "Unknown"}</Text>
                                <Text style={styles.metadataDot}>•</Text>
                                <Text style={styles.metadataText}>{item.movie.rating || "Not rated"}</Text>
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

const styles = StyleSheet.create({
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
        backgroundColor: 'rgba(34, 197, 94, 0.1)', // Light green background with opacity
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    streamingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#22C55E', // Solid light green
        marginRight: 6,
    },
    streamingText: {
        color: '#22C55E', // Light green text
        fontFamily: 'Satoshi',
        fontSize: 14,
        fontWeight: '500',
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
    cardGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});

export default MovieProjectionItem;