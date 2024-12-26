import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import {Colors} from "@/constants/Colors";
import {moviesVotes} from '../constants/Movie'
import ProfileHeader from "@/components/ProfileHeader";
import {MoviePoll} from "@/constants/MoviePoll";



export default function Poll() {
    const [poll, setPoll] = useState<MoviePoll>({
        id: 1,
        title: "Favorite Movie of All Time",
        description: "Vote for your favorite movie from the list below!",
        dateCreated: new Date(),
        isActive: true,
        movies:moviesVotes,
    });

    const [hasVoted, setHasVoted] = useState(false);

    const handleVote = (movieId: number) => {
        if (hasVoted) return alert("You can only vote once!");
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
            <View style={styles.postContainer}>
                {/* Admin Information */}
                <View style={styles.adminContainer}>
                    <ProfileHeader  />
                </View>
                <Text style={styles.title}>{poll.title}</Text>
                <Text style={styles.description}>{poll.description}</Text>
                <Text style={styles.date}>Date Created: {poll.dateCreated.toDateString()}</Text>

                {/* Movies List */}
                <View style={styles.moviesWrapper}>
                    <FlatList
                        data={poll.movies}
                        keyExtractor={(item) => item.id.toString()}
                        horizontal
                        renderItem={({ item }) => (
                            <View style={styles.movieContainer}>
                                <Image source={{ uri: item.poster }} style={styles.moviePoster} />
                                <Text style={styles.movieVotes}>Votes: {item.votes}</Text>
                                <TouchableOpacity
                                    style={styles.voteButton}
                                    onPress={() => handleVote(item.id)}
                                >
                                    <Text style={styles.voteButtonText}>Vote</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#14171C", padding: 16 },
    adminContainer: { flexDirection: "row", alignItems: "center" },
    adminPhoto: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
    adminName: { color: "#ffffff", fontSize: 18 },
    postContainer: {borderWidth: 1, borderColor: Colors.theme.tabIconDefault, borderRadius: 10, padding: 16, marginTop: 16,},
    title: { color: "#ffffff", fontSize: 24, fontWeight: "bold", marginBottom: 8 },
    description: { color: "#aaaaaa", fontSize: 16, marginBottom: 8 },
    date: { color: "#aaaaaa", fontSize: 14, marginBottom: 16 },
    label: { color: "#ffffff", fontSize: 18, marginBottom: 8 },
    moviesWrapper: { height: 300 },
    movieContainer: {backgroundColor: "#1f1f1f", marginRight: 12, borderRadius: 8, alignItems: "center", flex: 1},
    moviePoster: { width: 120, height: 180, borderRadius: 8, marginBottom: 8 },
    movieTitle: { color: "#ffffff", fontSize: 18, marginBottom: 8, textAlign: "center" },
    movieVotes: { color: "#aaaaaa", fontSize: 14, marginBottom: 8, textAlign: "center" },
    voteButton: {backgroundColor: "#4caf50", padding: 10, borderRadius: 8,width:'90%', marginTop: 8, alignItems: "center", justifyContent: "center",},
    voteButtonText: { color: "#ffffff", fontSize: 16 },
});
