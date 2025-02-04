import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import MovieCard from "@/components/MovieCard";
import { useMovieStore } from '@/api/store/moviesStore';

export default function Browse() {
  const { movies, loading, error, fetchMovies, filteredMovies } = useMovieStore();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'evaluation' | 'date'>('evaluation');

  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Thriller', 'Romance'];
  const languages = ['English', 'French', 'Arabic', 'Japanese', 'Korean'];

  useEffect(() => {
    fetchMovies();
  }, []);

  const displayMovies = filteredMovies.length > 0 ? filteredMovies : movies;

  if (loading) {
    return (
        <View style={styles.container}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
    );
  }

  if (error) {
    return (
        <View style={styles.container}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
    );
  }

  return (
      <View style={styles.container}>
        {/* Welcome Section */}
        <View style={styles.welcome}>
          <Text style={styles.title}>Browse Movies</Text>
          <Text style={styles.subtitle}>Discover your next favorite film from our curated collection</Text>
        </View>

        <View style={styles.header}>
          <View style={styles.headerActions}>
            <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setShowFilters(!showFilters)}
            >
              <Ionicons
                  name={showFilters ? "close" : "options"}
                  size={20}
                  color="#94A3B8"
              />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.sortButton}
                onPress={() => setSortBy(prev => prev === 'evaluation' ? 'date' : 'evaluation')}
            >
              <Ionicons name="swap-vertical" size={20} color="#94A3B8" />
              <Text style={styles.sortButtonText}>
                Sort by {sortBy === 'evaluation' ? 'Rating' : 'Release Date'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {showFilters && (
            <View style={styles.filtersSection}>
              <Text style={styles.sectionTitle}>Genres</Text>
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

              <Text style={[styles.sectionTitle, styles.marginTop]}>Languages</Text>
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
            numColumns={4}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  welcome: {
    backgroundColor: "#1F2937",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#374151",
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontFamily: "Satoshi",
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    color: "#94A3B8",
    fontSize: 16,
    fontFamily: "Satoshi",
    lineHeight: 24,
  },
  loadingText: {
    color: "#94A3B8",
    fontSize: 16,
    fontFamily: "Satoshi",
    textAlign: "center",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 16,
    fontFamily: "Satoshi",
    textAlign: "center",
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortButtonText: {
    color: "#94A3B8",
    marginLeft: 4,
    fontFamily: "Satoshi",
  },
  filterButton: {
    padding: 4,
  },
  filtersSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: "Satoshi",
    fontWeight: "700",
    marginBottom: 16,
  },
  marginTop: {
    marginTop: 24,
  },
  filterChip: {
    backgroundColor: "#1F2937",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#374151",
  },
  selectedChip: {
    backgroundColor: "#374151",
    borderColor: "#94A3B8",
  },
  filterChipText: {
    color: "#94A3B8",
    fontSize: 14,
    fontFamily: "Satoshi",
  },
  selectedChipText: {
    color: "#FFFFFF",
  },
  movieGrid: {
    padding: 8,
    gap: 8,
  }
});