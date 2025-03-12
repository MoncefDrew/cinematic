import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    ScrollView,
    Dimensions,
    Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '@/components/AppHeader';
import { useMoviePollStore } from '@/api/store/MoviePollStore';
import { useAuthStore } from "@/api/store/AuthStore";

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

export default function Activity({ navigation }) {
    const scrollViewRef = useRef(null);
    const [selectedPollIndex, setSelectedPollIndex] = useState(0);
    const { polls, fetchPolls, submitVote, loading, error } = useMoviePollStore();
    const user = useAuthStore((state) => state.user);
    const scrollX = useRef(new Animated.Value(0)).current;

    // Fetch polls only once when the component mounts
    useEffect(() => {
        fetchPolls(user);
    }, [fetchPolls, user]);
    
    // Component to display the countdown timer
    const CountdownTimer = ({ poll }) => {
        const [remainingTime, setRemainingTime] = useState(getRemainingTime(poll));
        const isExpiring = remainingTime.hours < 2 && remainingTime.isActive;

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

        if (!remainingTime.isActive) {
            return (
                <View style={styles.timerContainer}>
                    <Ionicons name="time" size={18} color="#9B9BC0" style={styles.timerIcon} />
                    <Text style={styles.pollEndedText}>Poll ended</Text>
                </View>
            );
        }

        return (
            <View style={[styles.timerContainer, isExpiring && styles.expiringTimer]}>
                <Ionicons name="time" size={18} color={isExpiring ? "#FF6B6B" : "#9B9BC0"} style={styles.timerIcon} />
                <Text style={[styles.countdownText, isExpiring && styles.expiringText]}>
                    {`${remainingTime.hours}h ${remainingTime.minutes}m ${remainingTime.seconds}s remaining`}
                </Text>
            </View>
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
    
    const scrollToIndex = (index) => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ x: index * CARD_WIDTH, animated: true });
        }
        setSelectedPollIndex(index);
    };

    const renderPollItem = (poll, index) => {
        const totalVotes = poll.movies.reduce((sum, movie) => sum + (movie.votes || 0), 0);
        const isActive = getRemainingTime(poll).isActive; // Check if the poll is still active

        return (
            <View key={poll.id} style={styles.pollCard}>
                <LinearGradient
                    colors={['rgba(99, 102, 241, 0.15)', 'rgba(99, 102, 241, 0.05)']}
                    style={styles.cardGradient}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                />
                
                <View style={styles.pollHeader}>
                    <Text style={styles.pollTitle}>{poll.title || 'Untitled Poll'}</Text>
                    <CountdownTimer poll={poll} />
                </View>
                
                <View style={styles.projectionInfo}>
                    <Ionicons name="calendar-outline" size={18} color="#c6c4f3" style={styles.projectionIcon} />
                    <Text style={styles.projectionText}>
                        {new Date(poll.ProjectionDate).toLocaleDateString()}
                    </Text>
                    <Ionicons name="time-outline" size={18} color="#c6c4f3" style={styles.projectionIcon} />
                    <Text style={styles.projectionText}>
                        {poll.ProjectionTime}
                    </Text>
                </View>

                {poll.movies.map((movie, movieIndex) => {
                    const votePercentage = totalVotes > 0 ? (movie.votes / totalVotes) * 100 : 0;
                    const isUserVoted = poll.userVoted === movie.film_id;
                    
                    return (
                        <TouchableOpacity
                            key={movie.film_id}
                            style={[
                                styles.movieOption,
                                (!isActive || poll.userVoted) && styles.disabledOption,
                                isUserVoted && styles.votedOption
                            ]}
                            onPress={() => handleVote(poll.id, movie.film_id)}
                            disabled={!isActive || poll.userVoted}
                        >
                            <Image
                                source={{ uri: movie.poster_url || 'https://via.placeholder.com/150' }}
                                style={styles.movieImage}
                                resizeMode="cover"
                            />
                            <View style={styles.movieDetails}>
                                <Text style={styles.movieTitle} numberOfLines={2}>{movie.title}</Text>
                                <View style={styles.progressBarContainer}>
                                    <View 
                                        style={[
                                            styles.progressBar, 
                                            { width: `${votePercentage}%` },
                                            isUserVoted && styles.votedProgressBar
                                        ]} 
                                    />
                                </View>
                                <View style={styles.voteInfoContainer}>
                                    <Text style={[styles.movieVotes, isUserVoted && styles.votedText]}>
                                        {movie.votes || 0} votes
                                    </Text>
                                    <Text style={[styles.votePercentage, isUserVoted && styles.votedText]}>
                                        {votePercentage.toFixed(1)}%
                                    </Text>
                                </View>
                            </View>
                            {isUserVoted && (
                                <View style={styles.votedBadge}>
                                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}

                <View style={styles.pollFooter}>
                    <View style={styles.totalVotesContainer}>
                        <Ionicons name="people-outline" size={18} color="#9B9BC0" />
                        <Text style={styles.pollVotesText}>
                            {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
                        </Text>
                    </View>
                    
                    {!isActive ? (
                        <View style={styles.pollStatusBadge}>
                            <Text style={styles.pollStatusText}>Closed</Text>
                        </View>
                    ) : poll.userVoted ? (
                        <View style={[styles.pollStatusBadge, styles.votedStatusBadge]}>
                            <Text style={styles.pollStatusText}>Voted</Text>
                        </View>
                    ) : (
                        <View style={[styles.pollStatusBadge, styles.activeStatusBadge]}>
                            <Text style={styles.pollStatusText}>Active</Text>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    const renderPaginationDots = () => {
        if (!polls || polls.length <= 1) return null;

        return (
            <View style={styles.paginationContainer}>
                {polls.map((_, index) => {
                    // Calculate the input range for interpolation
                    const inputRange = [
                        (index - 1) * CARD_WIDTH,
                        index * CARD_WIDTH,
                        (index + 1) * CARD_WIDTH
                    ];
                    
                    // Interpolate the width and opacity based on scroll position
                    const dotWidth = scrollX.interpolate({
                        inputRange,
                        outputRange: [8, 24, 8],
                        extrapolate: 'clamp'
                    });
                    
                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp'
                    });

                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => scrollToIndex(index)}
                            style={styles.paginationTouchable}
                        >
                            <Animated.View
                                style={[
                                    styles.paginationDot,
                                    { width: dotWidth, opacity }
                                ]}
                            />
                        </TouchableOpacity>
                    );
                })}
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
                        <Text style={styles.loadingText}>Loading polls...</Text>
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
                        <Ionicons name="alert-circle-outline" size={60} color="#FF6B6B" />
                        <Text style={styles.errorText}>Error: {error}</Text>
                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={() => fetchPolls(user)}
                        >
                            <Text style={styles.retryButtonText}>Try Again</Text>
                        </TouchableOpacity>
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

                {polls && polls.length > 0 ? (
                    <View style={styles.content}>
                        {renderPaginationDots()}
                        
                        <Animated.ScrollView
                            ref={scrollViewRef}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            snapToInterval={CARD_WIDTH}
                            decelerationRate="fast"
                            contentContainerStyle={styles.scrollViewContent}
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                                { useNativeDriver: false }
                            )}
                            scrollEventThrottle={16}
                            onMomentumScrollEnd={(e) => {
                                const index = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
                                setSelectedPollIndex(index);
                            }}
                        >
                            {polls.map((poll, index) => renderPollItem(poll, index))}
                        </Animated.ScrollView>
                    </View>
                ) : (
                    <View style={styles.noPollsContainer}>
                        <Ionicons name="film-outline" size={70} color="#6366F1" />
                        <Text style={styles.noPollsTitle}>No active polls</Text>
                        <Text style={styles.noPollsText}>There are no movie polls available right now.</Text>
                        <TouchableOpacity
                            style={styles.browseButton}
                            onPress={() => navigation.navigate('Popular')}
                        >
                            <LinearGradient
                                colors={['#6366F1', '#5457E0']}
                                style={styles.buttonGradient}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 0}}
                            >
                                <Ionicons name="film-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                                <Text style={styles.browseButtonText}>Browse Movies</Text>
                            </LinearGradient>
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
    content: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontFamily: 'Poppins',
        fontSize: 16,
        color: '#9B9BC0',
        marginTop: 12,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontFamily: 'Poppins',
        fontSize: 16,
        color: '#9B9BC0',
        marginTop: 16,
        marginBottom: 24,
        textAlign: 'center',
    },
    retryButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#6366F1',
        borderRadius: 10,
    },
    retryButtonText: {
        fontFamily: 'Poppins',
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    noPollsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    noPollsTitle: {
        fontFamily: 'Poppins',
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
        marginTop: 20,
    },
    noPollsText: {
        fontFamily: 'Poppins',
        fontSize: 16,
        color: '#9B9BC0',
        marginTop: 8,
        marginBottom: 32,
        textAlign: 'center',
    },
    browseButton: {
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    buttonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 28,
    },
    buttonIcon: {
        marginRight: 8,
    },
    browseButtonText: {
        fontFamily: 'Poppins',
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    scrollViewContent: {
        paddingBottom: 20,
    },
    pollCard: {
        borderRadius: 20,
        overflow: 'hidden',
        width: CARD_WIDTH,
        marginHorizontal: 20,
        backgroundColor: '#141530',
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#1E2048',
        position: 'relative',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    cardGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    pollHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    pollTitle: {
        fontFamily: 'Poppins',
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        flex: 1,
        marginRight: 12,
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(18, 19, 45, 0.6)',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 12,
    },
    expiringTimer: {
        backgroundColor: 'rgba(255, 107, 107, 0.2)',
    },
    timerIcon: {
        marginRight: 6,
    },
    countdownText: {
        fontFamily: 'Poppins',
        fontSize: 12,
        color: '#9B9BC0',
    },
    expiringText: {
        color: '#FF6B6B',
        fontWeight: '500',
    },
    pollEndedText: {
        fontFamily: 'Poppins',
        fontSize: 12,
        color: '#9B9BC0',
    },
    projectionInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        flexWrap: 'wrap',
    },
    projectionIcon: {
        marginRight: 4,
    },
    projectionText: {
        fontFamily: 'Poppins',
        fontSize: 14,
        color: '#c6c4f3',
        marginRight: 12,
    },
    movieOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(18, 19, 45, 0.8)',
        borderRadius: 14,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#1E2048',
    },
    disabledOption: {
        opacity: 0.7,
    },
    votedOption: {
        borderColor: '#6366F1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
    },
    movieImage: {
        width: 60,
        height: 85,
        borderRadius: 8,
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
        marginBottom: 8,
    },
    progressBarContainer: {
        height: 6,
        backgroundColor: 'rgba(155, 155, 192, 0.2)',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#6366F1',
        borderRadius: 3,
    },
    votedProgressBar: {
        backgroundColor: '#8D90FF',
    },
    voteInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    movieVotes: {
        fontFamily: 'Poppins',
        fontSize: 12,
        color: '#9B9BC0',
    },
    votePercentage: {
        fontFamily: 'Poppins',
        fontSize: 12,
        fontWeight: '600',
        color: '#6366F1',
    },
    votedText: {
        color: '#8D90FF',
    },
    votedBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#6366F1',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pollFooter: {
        marginTop: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalVotesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pollVotesText: {
        fontFamily: 'Poppins',
        fontSize: 14,
        color: '#9B9BC0',
        marginLeft: 6,
    },
    pollStatusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        backgroundColor: '#3A3A5A',
        borderRadius: 8,
    },
    activeStatusBadge: {
        backgroundColor: '#22c55e',
    },
    votedStatusBadge: {
        backgroundColor: '#6366F1',
    },
    pollStatusText: {
        fontFamily: 'Poppins',
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 6,
    },
    paginationTouchable: {
        padding: 8,
    },
    paginationDot: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#6366F1',
        marginHorizontal: 4,
    },
});