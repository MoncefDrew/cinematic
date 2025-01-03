import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

interface Movie {
  id: number;
  title: string;
  genre: string[];
  language: string;
  rating: number;
  imageUrl: string;
  year: number;
  duration: string;
}

export default function Browse() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'rating' | 'year'>('rating');

  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Thriller', 'Romance', 'Documentary'];
  const languages = ['English', 'French', 'Arabic', 'Japanese', 'Korean', 'Spanish'];

  const sampleMovies: Movie[] = [
    {
      id: 1,
      title: "Inception",
      genre: ["Science Fiction", "Action"],
      language: "English",
      rating: 4.8,
      imageUrl: "https://placeholder.com/movie1.jpg",
      year: 2010,
      duration: "2h 28m"
    },
    // Add more sample movies
  ];

  const filteredMovies = sampleMovies
    .filter(movie => {
      const matchesGenres = selectedGenres.length === 0 || 
        movie.genre.some(g => selectedGenres.includes(g));
      const matchesLanguages = selectedLanguages.length === 0 || 
        selectedLanguages.includes(movie.language);
      return matchesGenres && matchesLanguages;
    })
    .sort((a, b) => sortBy === 'rating' ? 
      b.rating - a.rating : 
      b.year - a.year
    );

  const renderMovieCard = ({ item: movie }: { item: Movie }) => (
    <TouchableOpacity style={styles.movieCard}>
      <Image
        source={{ uri: 'https://via.placeholder.com/150' }}
        style={styles.movieImage}
      />
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle}>{movie.title}</Text>
        <Text style={styles.movieYear}>{movie.year} • {movie.duration}</Text>
        <View style={styles.genreContainer}>
          {movie.genre.slice(0, 2).map(genre => (
            <Text key={genre} style={styles.genreTag}>{genre}</Text>
          ))}
        </View>
        <View style={styles.movieMeta}>
          <Text style={styles.movieLanguage}>{movie.language}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.movieRating}>{movie.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

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
            onPress={() => setSortBy(prev => prev === 'rating' ? 'year' : 'rating')}
          >
            <Ionicons name="swap-vertical" size={20} color="#007BFF" />
            <Text style={styles.sortButtonText}>
              Sort by {sortBy === 'rating' ? 'Rating' : 'Year'}
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
        renderItem={renderMovieCard}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.movieGrid}
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
    paddingBottom: 16,
  },
  movieCard: {
    backgroundColor: '#1A1D24',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  movieImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#2A2D34',
  },
  movieInfo: {
    padding: 12,
  },
  movieTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  movieYear: {
    color: '#888',
    fontSize: 14,
    marginBottom: 8,
  },
  genreContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  genreTag: {
    color: '#FFF',
    fontSize: 12,
    backgroundColor: '#2A2D34',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  movieMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  movieLanguage: {
    color: '#888',
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  movieRating: {
    color: '#FFD700',
    marginLeft: 4,
    fontSize: 14,
  },
});