import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type MovieOption = {
  id: number;
  text: string;
  votes: number;
  director: string;
  rating: number;
  genres: string[];
  description: string;
};

const PollComponent = () => {
  const [poll, setPoll] = useState<MovieOption[]>([
    {
      id: 1,
      text: 'Oppenheimer',
      votes: 142,
      director: 'Christopher Nolan',
      rating: 8.9,
      genres: ['Biography', 'Drama', 'History'],
      description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.'
    },
    {
      id: 2,
      text: 'Barbie',
      votes: 156,
      director: 'Greta Gerwig',
      rating: 7.5,
      genres: ['Adventure', 'Comedy', 'Fantasy'],
      description: 'Barbie suffers a crisis that leads her to question her world and her existence.'
    },
    {
      id: 3,
      text: 'Mission Impossible',
      votes: 98,
      director: 'Christopher McQuarrie',
      rating: 8.2,
      genres: ['Action', 'Adventure', 'Thriller'],
      description: 'Ethan Hunt and his IMF team must track down a terrifying new weapon before it falls into the wrong hands.'
    },
  ]);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isVoted, setIsVoted] = useState(false);
  const [expandedMovie, setExpandedMovie] = useState<number | null>(null);

  const totalVotes = poll.reduce((sum, option) => sum + option.votes, 0);

  const handleVote = () => {
    if (selectedOption === null) return;

    setPoll(current =>
      current.map(option =>
        option.id === selectedOption
          ? { ...option, votes: option.votes + 1 }
          : option
      )
    );
    setIsVoted(true);
    Alert.alert('Success', 'Thanks for voting! Your opinion has been recorded.');
  };

  const getVotePercentage = (votes: number) => {
    return totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);
  };

  const MovieCard = ({ movie }: { movie: MovieOption }) => {
    const isExpanded = expandedMovie === movie.id;

    return (
      <View style={styles.movieCard}>
        <TouchableOpacity
          style={[
            styles.optionContainer,
            selectedOption === movie.id && !isVoted && styles.selectedOption,
          ]}
          onPress={() => {
            if (!isVoted) {
              setSelectedOption(movie.id);
            } else {
              setExpandedMovie(isExpanded ? null : movie.id);
            }
          }}
        >
          <View style={styles.optionContent}>
            <Text style={styles.movieTitle}>{movie.text}</Text>
            {isVoted && (
              <Text style={styles.percentageText}>
                {getVotePercentage(movie.votes)}%
              </Text>
            )}
          </View>

          {isVoted && (
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${getVotePercentage(movie.votes)}%` },
                ]}
              />
            </View>
          )}
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <Text style={styles.description}>{movie.description}</Text>
            <View style={styles.genreContainer}>
              {movie.genres.map(genre => (
                <View key={genre} style={styles.genreTag}>
                  <Text style={styles.genreText}>{genre}</Text>
                </View>
              ))}
            </View>
            <View style={styles.movieInfo}>
              <Text style={styles.infoText}>Director: {movie.director}</Text>
              <Text style={styles.infoText}>Rating: ⭐️ {movie.rating}/10</Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerIcon}>
          <Ionicons name="person-circle" size={48} color="#60A5FA" />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.question}>Best Movie of 2023?</Text>
          <Text style={styles.subtitle}>Cast your vote and join the discussion!</Text>
        </View>
      </View>

      <View style={styles.pollContainer}>
        {poll.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </View>

      {!isVoted ? (
        <TouchableOpacity
          style={[
            styles.voteButton,
            selectedOption === null && styles.disabledButton,
          ]}
          onPress={handleVote}
          disabled={selectedOption === null}
        >
          <Text style={styles.voteButtonText}>Cast Your Vote</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.footer}>
          <Text style={styles.totalVotesText}>{totalVotes} total votes</Text>
          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="thumbs-up" size={20} color="#9CA3AF" />
              <Text style={styles.socialButtonText}>Like</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="chatbubble" size={20} color="#9CA3AF" />
              <Text style={styles.socialButtonText}>Comment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="share-social" size={20} color="#9CA3AF" />
              <Text style={styles.socialButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  headerIcon: {
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  pollContainer: {
    padding: 16,
  },
  movieCard: {
    marginBottom: 16,
  },
  optionContainer: {
    backgroundColor: 'rgba(55, 65, 81, 0.5)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: '#60A5FA',
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  percentageText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#60A5FA',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#60A5FA',
  },
  expandedContent: {
    padding: 16,
    backgroundColor: '#1F2937',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  description: {
    color: '#D1D5DB',
    fontSize: 14,
    lineHeight: 20,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  genreTag: {
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  genreText: {
    color: '#D1D5DB',
    fontSize: 12,
  },
  movieInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  infoText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  voteButton: {
    backgroundColor: '#60A5FA',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#374151',
    opacity: 0.5,
  },
  voteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
  },
  totalVotesText: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  socialButtonText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
});

export default PollComponent;