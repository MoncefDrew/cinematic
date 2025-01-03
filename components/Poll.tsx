import React, { useState } from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, Alert } from "react-native";
import { Colors } from "@/constants/Colors";
import { moviesVotes } from "../constants/Movie";
import ProfileHeader from "@/components/ProfileHeader";
import { MoviePoll } from "@/constants/MoviePoll";

export default function Poll() {
    const [poll, setPoll] = useState<MoviePoll>({
        id: 1,
        title: "Favorite Movie of All Time",
        description: "Vote for your favorite movie from the list below!",
        dateCreated: new Date(),
        isActive: true,
        movies: moviesVotes,
    });

    const [hasVoted, setHasVoted] = useState(false);

    const handleVote = (movieId: number) => {
        if (hasVoted) return Alert.alert("You can only vote once!");
        setPoll((prevPoll) => ({
            ...prevPoll,
            movies: prevPoll.movies.map((movie) =>
                movie.id === movieId ? { ...movie, votes: movie.votes + 1 } : movie
            ),
        }));
        setHasVoted(true);
    };

    return (
        <View style={styles.container}>
            {/* Poll Details */}
            <View style={styles.pollCard}>
                {/* Admin Information */}
                <View style={styles.adminContainer}>
                    <ProfileHeader />
                </View>
                <Text style={styles.title}>{poll.title}</Text>
                <Text style={styles.description}>{poll.description}</Text>
                <Text style={styles.date}>Created: {poll.dateCreated.toDateString()}</Text>

                {/* Movies List */}
                <FlatList
                    data={poll.movies}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    contentContainerStyle={styles.moviesWrapper}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View style={styles.movieCard}>
                            <Image source={{ uri: item.poster }} style={styles.moviePoster} />
                            <Text style={styles.movieVotes}>Votes: {item.votes}</Text>
                            <TouchableOpacity
                                style={[
                                    styles.voteButton,
                                    hasVoted && styles.disabledButton,
                                ]}
                                disabled={hasVoted}
                                onPress={() => handleVote(item.id)}
                            >
                                <Text style={styles.voteButtonText}>
                                    {hasVoted ? "Voted" : "Vote"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        padding: 16,
    },
    pollCard: {
        backgroundColor: "#1c1c1e",
        borderRadius: 12,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    adminContainer: {
        marginBottom: 10,

    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#ffffff",
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: "#d1d1d1",
        marginBottom: 16,
    },
    date: {
        fontSize: 14,
        color: "#8e8e93",
        marginBottom: 16,
    },
    moviesWrapper: {
        paddingVertical: 16,
        flexDirection: "row",
    },
    movieCard: {
        width: 150,
        backgroundColor: "#2c2c2e",
        borderRadius: 12,
        padding: 8,
        marginRight: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    moviePoster: {
        width: "100%",
        height: 200,
        borderRadius: 8,
        marginBottom: 8,
    },
    movieVotes: {
        fontSize: 14,
        color: "#d1d1d1",
        marginBottom: 8,
        textAlign: "center",
    },
    voteButton: {
        backgroundColor: "#4caf50",
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
    disabledButton: {
        backgroundColor: "#555555",
    },
    voteButtonText: {
        fontSize: 16,
        color: "#ffffff",
        fontWeight: "bold",
    },
});
