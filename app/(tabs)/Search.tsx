import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function Search() {
  const [showGenreButtons, setShowGenreButtons] = useState(false);
  const [showLanguageButtons, setShowLanguageButtons] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Thriller', 'Romance', 'Science Fiction', 'Fantasy', 'Adventure', 'Mystery'];
  const languages = ['English', 'French', 'Arabic', 'Japanese', 'Korean'];

  const toggleButtons = (type: 'genre' | 'language') => {
    if (type === 'genre') setShowGenreButtons(!showGenreButtons);
    else setShowLanguageButtons(!showLanguageButtons);
  };

  const handleSelect = (type: 'genre' | 'language', value: string) => {
    const setter = type === 'genre' ? setSelectedGenres : setSelectedLanguages;
    setter(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
  };

  const renderButton = (type: 'genre' | 'language', items: string[], selectedItems: string[], toggle: boolean) => (
    toggle && (
      <View style={styles.optionsContainer}>
        {items.map(item => (
          <TouchableOpacity key={item} style={styles.singleButtonContainer} onPress={() => handleSelect(type, item)}>
            <View style={[styles.checkbox, selectedItems.includes(item) && styles.selectedCheckbox]} />
            <Text style={styles.buttonText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  );

  return (
    <View style={styles.container}>
      {/* Genre Container */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => toggleButtons('genre')}>
          <Text style={styles.buttonText}>Genre</Text>
        </TouchableOpacity>
        {renderButton('genre', genres, selectedGenres, showGenreButtons)}
      </View>

      {/* Language Container */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => toggleButtons('language')}>
          <Text style={styles.buttonText}>Language</Text>
        </TouchableOpacity>
        {renderButton('language', languages, selectedLanguages, showLanguageButtons)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#14171C',  // Keeps the background color the same
    flexDirection: 'row',
    paddingTop: 20,
    paddingLeft: 16,
    flex: 1,  // Makes sure the container takes the full screen height
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'flex-start',
    marginRight: 10,
  },
  optionsContainer: {
    marginTop: 20,
  },
  singleButtonContainer: {
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: 'white',
    marginRight: 10,
    borderRadius: 5,
  },
  selectedCheckbox: {
    backgroundColor: 'gray',  // The selected checkbox color
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textTransform: 'capitalize',
  },
});



