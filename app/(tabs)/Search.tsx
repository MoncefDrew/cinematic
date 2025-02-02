import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import MovieCard from "@/components/MovieCard";
import { useMovieStore } from '@/api/store/moviesStore'; // Adjust path as needed

export default function Browse() {
  const { movies, loading, error, fetchMovies } = useMovieStore();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'evaluation' | 'date'>('evaluation');

  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Thriller', 'Romance'];
  const languages = ['English', 'French', 'Arabic', 'Japanese', 'Korean'];

  useEffect(() => {
    fetchMovies();
  }, []);

  // Filter and sort movies
  const filteredMovies = Array.isArray(movies) ? [...movies]
      .filter(movie =>
          (selectedGenres.length === 0 || selectedGenres.some(genre => movie.genres?.includes(genre))) &&
          (selectedLanguages.length === 0 || selectedLanguages.includes(movie.language))
      )
      .sort((a, b) => {
        if (sortBy === 'evaluation') {
          return (b.Evaluation || 0) - (a.Evaluation || 0);
        }
        return (b.dateReleased || 0) - (a.dateReleased || 0);
      }) : [];

  if (loading) {
    return (
        <View style={styles.container}>
          <Text style={styles.text}>Loading...</Text>
        </View>
    );
  }

  if (error) {
    return (
        <View style={styles.container}>
          <Text style={[styles.text, styles.error]}>{error}</Text>
        </View>
    );
  }

  return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Movies</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setShowFilters(!showFilters)}
            >
              <Ionicons
                  name={showFilters ? "close" : "options"}
                  size={20}
                  color="#007BFF"
              />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.sortButton}
                onPress={() => setSortBy(prev => prev === 'evaluation' ? 'date' : 'evaluation')}
            >
              <Ionicons name="swap-vertical" size={20} color="#007BFF" />
              <Text style={styles.sortButtonText}>
                Sort by {sortBy === 'evaluation' ? 'Rating' : 'Release Date'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {showFilters && (
            <View style={styles.filtersSection}>
              <Text style={styles.filterTitle}>Genres</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {genres.map(genre => (
                    <TouchableOpacity
                        key={genre}
                        style={[
                          styles.filterChip,
                          selectedGenres.includes(genre) && styles.selectedChip
                        ]}
                        onPress={() => setSelectedGenres(prev =>
                            prev.includes(genre) ?
                                prev.filter(item => item !== genre) :
                                [...prev, genre]
                        )}
                    >
                      <Text style={[
                        styles.filterChipText,
                        selectedGenres.includes(genre) && styles.selectedChipText
                      ]}>{genre}</Text>
                    </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={[styles.filterTitle, styles.marginTop]}>Languages</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {languages.map(language => (
                    <TouchableOpacity
                        key={language}
                        style={[
                          styles.filterChip,
                          selectedLanguages.includes(language) && styles.selectedChip
                        ]}
                        onPress={() => setSelectedLanguages(prev =>
                            prev.includes(language) ?
                                prev.filter(item => item !== language) :
                                [...prev, language]
                        )}
                    >
                      <Text style={[
                        styles.filterChipText,
                        selectedLanguages.includes(language) && styles.selectedChipText
                      ]}>{language}</Text>
                    </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
        )}

        <FlatList
            data={filteredMovies}
            renderItem={({item}) => (
                <MovieCard movie={item} />
            )}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.movieGrid}
            numColumns={3}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14171C',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  text: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
  },
  error: {
    color: '#FF4444',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortButtonText: {
    color: '#007BFF',
    marginLeft: 4,
  },
  filterButton: {
    padding: 4,
  },
  filtersSection: {
    marginBottom: 16,
  },
  filterTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  marginTop: {
    marginTop: 16,
  },
  filterChip: {
    backgroundColor: '#1A1D24',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#2A2D34',
  },
  selectedChip: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  filterChipText: {
    color: '#FFF',
    fontSize: 14,
  },
  selectedChipText: {
    color: '#FFF',
  },
  movieGrid: {
    padding: 8,
    gap: 8,
  }
});