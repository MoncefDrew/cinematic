import React, { useState } from "react";
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from "react-native";
import Cards from "../../components/cards"; // Import the Cards component

// Types for movie data
type Movie = { id: number; title: string; poster: any };

// Updated Activity Component
export default function Activity() {
  const [votes, setVotes] = useState<{ [key: number]: number | null }>({ 1: null, 2: null, 3: null });

  // Get formatted date for each post
  const getDate = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  };

  // Handle movie voting
  const handleVote = (postId: number, movieId: number) => {
    setVotes((prevVotes) => ({ ...prevVotes, [postId]: movieId }));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {[1, 2, 3].map((postId) => (
          <View key={postId} style={styles.postContainer}>
            <View style={styles.adminContainer}>
              <Image source={require("../../assets/images/alucard.jpg")} style={styles.adminImage} />
              <View style={styles.adminNameAndDate}>
                <Text style={styles.adminName}>Admin</Text>
                <Text style={styles.postDate}>{getDate(postId === 1 ? 0 : postId === 2 ? 1 : 2)}</Text>
              </View>
            </View>
            <Text style={styles.postText}>Vote for the movie you wanna watch next week</Text>

            {/* Use Cards component */}
            <Cards postId={postId} votes={votes} handleVote={handleVote} />

            {postId !== 3 && <View style={styles.separator} />}
          </View>
        ))}
      </ScrollView>

      {/* Floating action button */}
      <TouchableOpacity style={styles.postButton}>
        <Text style={styles.postButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles (unchanged)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#14171C" },
  scrollContainer: { padding: 10, paddingBottom: 100 },
  postContainer: { padding: 10, marginBottom: 20 },
  adminContainer: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  adminImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  adminNameAndDate: { flexDirection: "column" },
  adminName: { color: "#fff", fontSize: 16 },
  postDate: { color: "#bbb", fontSize: 12, marginTop: 3 },
  postText: { color: "#bbb", fontSize: 14, marginBottom: 10 },
  postButton: { position: "absolute", bottom: 20, right: 20, backgroundColor: "#007BFF", width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center" },
  postButtonText: { color: "#fff", fontSize: 80, fontWeight: "100", marginBottom: 20 },
  separator: { height: 1, backgroundColor: "#fff", marginVertical: 10 },
});
