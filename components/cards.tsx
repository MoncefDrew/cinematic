import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

// Types for movie data
type Movie = { id: number; title: string; poster: any };

// Props for the Cards component
interface CardsProps {
  postId: number;
  votes: { [key: number]: number | null };
  handleVote: (postId: number, movieId: number) => void;
}

// Cards component
const Cards: React.FC<CardsProps> = ({ postId, votes, handleVote }) => {
  // Movie data moved inside the Cards component
  const postMovies: { [key: number]: Movie[] } = {
    1: [
      { id: 1, title: "Inception", poster: require("../assets/images/inception.jpg") },
      { id: 2, title: "Interstellar", poster: require("../assets/images/interstellar.jpg") },
      { id: 3, title: "The Dark Knight", poster: require("../assets/images/dark_knight.jpg") },
    ],
    2: [
      { id: 1, title: "Iron Man", poster: require("../assets/images/iron man.jpg") },
      { id: 2, title: "Fury", poster: require("../assets/images/fury.jpg") },
      { id: 3, title: "Silent Hill", poster: require("../assets/images/silent hill.jpg") },
    ],
    3: [
      { id: 1, title: "Friday the 13th", poster: require("../assets/images/friday the 13th.jpg") },
      { id: 2, title: "The Day After Tomorrow", poster: require("../assets/images/the day after tomorrow.jpg") },
      { id: 3, title: "The Revenant", poster: require("../assets/images/the revenant.jpg") },
    ],
  };

  const movies = postMovies[postId] || [];

  return (
    <View style={styles.movieListContainer}>
      {movies.map(({ id, title, poster }) => (
        <View key={id} style={styles.movieContainer}>
          <Image source={poster} style={styles.poster} resizeMode="contain" />
          <Text style={styles.movieTitle}>{title}</Text>
          <TouchableOpacity
            style={[styles.voteButton, votes[postId] === id && styles.votedButton]}
            onPress={() => handleVote(postId, id)}
            disabled={votes[postId] !== null}
          >
            <Text style={styles.buttonText}>{votes[postId] === id ? "Voted" : "Vote"}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

// Styles for the Cards component
const styles = StyleSheet.create({
  movieListContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // Allow wrapping of movies to the next line
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  movieContainer: {
    alignItems: "center",
    width: "30%", // Adjust width to allow multiple movies per row
    marginRight: 10, // Space between movies
    marginBottom: 15, // Space between rows
  },
  poster: { width: "100%", height: 180, borderRadius: 10, marginBottom: 5 },
  movieTitle: { color: "#fff", fontSize: 12, marginBottom: 5 },
  voteButton: { backgroundColor: "#007BFF", padding: 5, borderRadius: 5 },
  votedButton: { backgroundColor: "#28A745" },
  buttonText: { color: "#fff", fontSize: 12 },
});

export default Cards;
