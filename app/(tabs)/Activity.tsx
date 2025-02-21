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
import {useAuthStore} from "@/api/store/AuthStore";

export default function Activity({ navigation }) {
    const [selectedPollIndex, setSelectedPollIndex] = useState(0);
    const { polls, fetchPolls, submitVote, loading, error } = useMoviePollStore();
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        fetchPolls(user); // Pass `user` to fetchPolls
    }, [fetchPolls, user]);

    const handleVote = async (pollId, filmId) => {
        await submitVote(pollId, filmId, user); // Pass `user` to submitVote
    };

    const renderPollItem = (poll) => {
        const totalVotes = poll.movies.reduce((sum, movie) => sum + (movie.votes || 0), 0);
    console.log(poll)
        return (
            <View key={poll.id} style={styles.pollCard}>
                <Text style={styles.pollTitle}>{poll.title || 'Untitled Poll'}</Text>
                <Text style={styles.pollSubtitle}>
                    Ends on {new Date(poll.ProjectionDate).toLocaleDateString()} at {poll.ProjectionTime}
                </Text>

                {poll.movies.map((movie) => (
                    <TouchableOpacity
                        key={movie.film_id}
                        style={styles.movieOption}
                        onPress={() => handleVote(poll.id, movie.film_id)}
                        disabled={poll.userVoted}
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
                    colors={['#0A0B1E', '#12132D']}
                    style={styles.container}
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
                    colors={['#0A0B1E', '#12132D']}
                    style={styles.container}
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
                colors={['#0A0B1E', '#12132D']}
                style={styles.container}
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
        width: Dimensions.get('window').width - 40,
        marginHorizontal: 20,
        backgroundColor: '#181935',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#1E2048',
    },
    pollTitle: {
        fontFamily: 'Poppins',
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    pollSubtitle: {
        fontFamily: 'Poppins',
        fontSize: 14,
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
});