import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert, Animated } from "react-native";
import ProfileHeader from "@/components/ProfileHeader";
import { MoviePoll } from "@/constants/MoviePoll";
import { moviesVotes } from "../constants/Movie";
import { Colors } from "@/constants/Colors";

export default function Poll() {
    const [poll, setPoll] = useState<MoviePoll>({
        id: 1,
        title: "Favorite Movie of All Time",
        dateCreated: new Date(),
        isActive: true,
        movies: moviesVotes,
    });

    const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
    const [hasVoted, setHasVoted] = useState(false);
    const [barWidth] = useState(new Animated.Value(0));

    const getTotalVotes = () => poll.movies.reduce((sum, movie) => sum + movie.votes, 0);

    const getVotePercentage = (votes: number) => {
        const total = getTotalVotes();
        return total === 0 ? 0 : Math.round((votes / total) * 100);
    };

    const handleVote = () => {
        if (!selectedMovie) return Alert.alert("Please select a movie!");
        if (hasVoted) return Alert.alert("You can only vote once!");

        setPoll(prevPoll => ({
            ...prevPoll,
            movies: prevPoll.movies.map(movie =>
                movie.id === selectedMovie ? { ...movie, votes: movie.votes + 1 } : movie
            ),
        }));
        setHasVoted(true);

        Animated.timing(barWidth, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    return (
        <View style={styles.container}>
            <View style={styles.pollCard}>
                <ProfileHeader />
                <Text style={styles.title}>{poll.title}</Text>

                <View style={styles.optionsContainer}>
                    {poll.movies.map((movie) => {
                        const percentage = getVotePercentage(movie.votes);
                        const width = barWidth.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', `${percentage}%`],
                        });

                        return (
                            <TouchableOpacity
                                key={movie.id}
                                style={[
                                    styles.optionButton,
                                    selectedMovie === movie.id && !hasVoted && styles.selectedOption,
                                ]}
                                onPress={() => !hasVoted && setSelectedMovie(movie.id)}
                                disabled={hasVoted}
                            >
                                <View style={styles.optionContent}>
                                    {hasVoted && (
                                        <Animated.View
                                            style={[
                                                styles.progressBar,
                                                { width },
                                            ]}
                                        />
                                    )}
                                    <View style={styles.labelContainer}>
                                        <Text style={styles.optionText}>{movie.title}</Text>
                                        {hasVoted && (
                                            <Text style={styles.percentageText}>{percentage}%</Text>
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {!hasVoted && (
                    <TouchableOpacity
                        style={[styles.voteButton, !selectedMovie && styles.disabledButton]}
                        onPress={handleVote}
                        disabled={!selectedMovie}
                    >
                        <Text style={styles.voteButtonText}>Vote</Text>
                    </TouchableOpacity>
                )}

                {hasVoted && (
                    <Text style={styles.totalVotes}>
                        {getTotalVotes()} votes
                    </Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    pollCard: {
        backgroundColor: "#1c1c1e",
        borderRadius: 12,
        padding: 16,
        borderWidth: 0.1,
        borderColor: "#373738",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#ffffff",
        marginBottom: 16,
        marginTop: 16,
    },
    optionsContainer: {
        gap: 8,
        marginBottom: 16,
    },
    optionButton: {
        borderWidth: 1,
        borderColor: "#333333",
        borderRadius: 4,
        overflow: 'hidden',
    },
    selectedOption: {
        backgroundColor: "rgba(128, 128, 128, 0.2)",
        borderColor: "#666666",
    },
    optionContent: {
        position: 'relative',
        minHeight: 44,
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        zIndex: 1,
    },
    optionText: {
        color: "#ffffff",
        fontSize: 16,
    },
    progressBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        backgroundColor: "rgba(128, 128, 128, 0.3)",
    },
    percentageText: {
        color: "#ffffff",
        fontSize: 16,
        marginLeft: 8,
    },
    voteButton: {
        backgroundColor: "#666666",
        borderRadius: 4,
        padding: 12,
        alignItems: "center",
    },
    disabledButton: {
        backgroundColor: "#333333",
    },
    voteButtonText: {
        fontSize: 16,
        color: "#ffffff",
        fontWeight: "bold",
    },
    totalVotes: {
        color: "#8e8e93",
        fontSize: 14,
        textAlign: "center",
        marginTop: 8,
    },
});