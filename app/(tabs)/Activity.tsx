

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    ScrollView,
    Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '@/components/AppHeader';
import { useMoviePollStore } from '@/api/store/MoviePollStore';
import { useAuthStore } from "@/api/store/AuthStore";

export default function Activity({ navigation }) {
    const [selectedPollIndex, setSelectedPollIndex] = useState(0);
    const { polls, fetchPolls, submitVote, loading, error } = useMoviePollStore();
    const user = useAuthStore((state) => state.user);

    // Fetch polls only once when the component mounts
    useEffect(() => {
        fetchPolls(user);
    }, [fetchPolls, user]);


    // Component to display the countdown timer
    const CountdownTimer = ({ poll }) => {
        const [remainingTime, setRemainingTime] = useState(getRemainingTime(poll));

        useEffect(() => {
            const interval = setInterval(() => {
                const newRemainingTime = getRemainingTime(poll);
                setRemainingTime(newRemainingTime);

                if (!newRemainingTime.isActive) {
                    clearInterval(interval); // Stop the timer when the poll ends
                }
            }, 1000);

            return () => clearInterval(interval); // Cleanup interval on unmount
        }, [poll]);

        return (
            <Text style={styles.countdownText}>
                {remainingTime.isActive
                    ? `${remainingTime.hours}h ${remainingTime.minutes}m ${remainingTime.seconds}s remaining`
                    : "Poll ended"}
            </Text>
        );
    };

    // Function to calculate the remaining time for the poll
    const getRemainingTime = (poll) => {
        const now = new Date();
        const pollCreationTime = new Date(poll.date_created); // Ensure `date_created` is a valid date string
        const pollEndTime = new Date(pollCreationTime.getTime() + poll.timelapse * 60 * 60 * 1000);
        const remainingTime = pollEndTime - now;

        if (remainingTime <= 0) return { hours: 0, minutes: 0, seconds: 0, isActive: false };

        const hours = Math.floor(remainingTime / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
        return { hours, minutes, seconds, isActive: true };
    };
    const handleVote = async (pollId, filmId) => {
        await submitVote(pollId, filmId, user); // Pass `user` to submitVote
    };

    const renderPollItem = (poll) => {
        const totalVotes = poll.movies.reduce((sum, movie) => sum + (movie.votes || 0), 0);
        const isActive = getRemainingTime(poll).isActive; // Check if the poll is still active

        return (
            <View key={poll.id} style={styles.pollCard}>
                <Text style={styles.pollTitle}>{poll.title || 'Untitled Poll'}</Text>
                <Text style={styles.pollSubtitle}>
                    TO BE PROJECTED IN
                    <Text style={{color : '#c6c4f3' ,fontFamily: 'Poppins',
                        fontSize: 14,}}>  {new Date(poll.ProjectionDate).toLocaleDateString()}</Text>
                    <Text>   AT</Text>
                    <Text style={{color:'#c6c4f3',fontFamily: 'Poppins',
                        fontSize: 14}}>   {poll.ProjectionTime} .</Text>
                </Text>

                {poll.movies.map((movie) => (
                    <TouchableOpacity
                        key={movie.film_id}
                        style={[
                            styles.movieOption,
                            (!isActive || poll.userVoted) && styles.disabledOption, // Disable style if poll is inactive or user has voted
                        ]}
                        onPress={() => handleVote(poll.id, movie.film_id)}
                        disabled={!isActive || poll.userVoted} // Disable if poll is inactive or user has voted
                    >
                        <Image
                            source={{ uri: movie.poster_url || 'https://via.placeholder.com/150' }}
                            style={styles.movieImage}
                            resizeMode="cover"
                        />
                        <View style={styles.movieDetails}>
                            <Text style={styles.movieTitle}>{movie.title}</Text>
                            <Text style={styles.movieVotes}>
                                {movie.votes || 0} votes ({totalVotes > 0 ? ((movie.votes / totalVotes) * 100).toFixed(1) : 0}%)
                            </Text>
                        </View>
                        {poll.userVoted === movie.film_id && (
                            <Ionicons name="checkmark-circle" size={24} color="#6366F1" style={styles.votedIcon} />
                        )}
                    </TouchableOpacity>
                ))}

                {/* Countdown Timer */}
                <CountdownTimer poll={poll} />

                <View style={styles.pollFooter}>
                    <Text style={styles.pollVotesText}>
                        {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
                    </Text>
                </View>
            </View>
        );
    };

    const renderPaginationDots = () => {
        if (polls.length === 0) return null;

        return (
            <View style={styles.paginationContainer}>
                {polls.map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => setSelectedPollIndex(index)}
                        style={styles.paginationTouchable}
                    >
                        <View
                            style={[
                                styles.paginationDot,
                                index === selectedPollIndex && styles.paginationDotActive
                            ]}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <LinearGradient
                    colors={['#02040a', '#030314']}
                    style={styles.container}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                >
                    <AppHeader header={'Movie Polls'} name="Home" transparent={true} />
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#6366F1" />
                    </View>
                </LinearGradient>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <LinearGradient
                    colors={['#02040a', '#030314']}
                    style={styles.container}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                >
                    <AppHeader header={'Movie Polls'} name="Home" transparent={true} />
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>Error: {error}</Text>
                    </View>
                </LinearGradient>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient
                colors={['#02040a', '#030314']}
                style={styles.container}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
            >
                <AppHeader header={'Movie Polls'} name="close" transparent={true} />

                {polls.length > 0 ? (
                    <>
                        {renderPaginationDots()}
                        <ScrollView
                            pagingEnabled
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            onMomentumScrollEnd={(e) => {
                                const contentOffset = e.nativeEvent.contentOffset.x;
                                const index = Math.round(contentOffset / (Dimensions.get('window').width - 40));
                                setSelectedPollIndex(index);
                            }}
                        >
                            {polls.map(renderPollItem)}
                        </ScrollView>
                    </>
                ) : (
                    <View style={styles.noPollsContainer}>
                        <Ionicons name="film-outline" size={60} color="#6366F1" />
                        <Text style={styles.noPollsText}>No active polls found</Text>
                        <TouchableOpacity
                            style={styles.browseButton}
                            onPress={() => navigation.navigate('Popular')}
                        >
                            <Text style={styles.browseButtonText}>Browse Movies</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0A0B1E',
    },
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontFamily: 'Poppins',
        fontSize: 18,
        color: '#9B9BC0',
    },
    noPollsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    noPollsText: {
        fontFamily: 'Poppins',
        fontSize: 18,
        color: '#9B9BC0',
        marginTop: 20,
    },
    browseButton: {
        marginTop: 30,
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#6366F1',
        borderRadius: 10,
    },
    browseButtonText: {
        fontFamily: 'Poppins',
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    pollCard: {
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#535C91',
        width: Dimensions.get('window').width - 40,
        marginHorizontal: 20,
        backgroundColor: '#181935',
        padding: 20,
        marginBottom: 20,
    },
    pollTitle: {
        fontFamily: 'Poppins',
        fontSize: 22,
        fontWeight: '700',
        color: '#c6c4f3',
        marginBottom: 8,
    },
    pollSubtitle: {
        fontFamily: 'Poppins',
        fontSize: 15,
        color: '#9B9BC0',
        marginBottom: 24,
    },
    movieOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#12132D',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#1E2048',
    },
    disabledOption: {
        opacity: 0.5, // Dim the option if the poll is inactive or user has voted
    },
    movieImage: {
        width: 60,
        height: 80,
        borderRadius: 6,
        marginRight: 12,
    },
    movieDetails: {
        flex: 1,
    },
    movieTitle: {
        fontFamily: 'Poppins',
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    movieVotes: {
        fontFamily: 'Poppins',
        fontSize: 14,
        color: '#9B9BC0',
    },
    votedIcon: {
        marginLeft: 12,
    },
    pollFooter: {
        marginTop: 16,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    pollVotesText: {
        fontFamily: 'Poppins',
        fontSize: 14,
        color: '#9B9BC0',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 16,
    },
    paginationTouchable: {
        padding: 8,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#1E2048',
        marginHorizontal: 4,
    },
    paginationDotActive: {
        backgroundColor: '#6366F1',
        width: 24,
    },
    countdownText: {
        fontFamily: 'Poppins',
        fontSize: 14,
        color: '#9B9BC0',
        textAlign: 'center',
        marginTop: 16,
    },
});