import React, { useState } from 'react';
import { StyleSheet, View, Button, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you are using Expo

const genres = [
  'Action',
  'Comedy',
  'Drama',
  'Horror',
  'Romance',
  'Science Fiction',
  'Documentary',
  'Thriller',
  'Adventure',
  'Animation',
];

const GenreButtons = (onGenrePress: (arg0: string) => void) => {
  return (
    <ScrollView horizontal contentContainerStyle={styles.container}>
      {genres.map((genre, index) => (
        <View key={index} style={styles.buttonContainer}>
          <Button title={genre} onPress={() => onGenrePress(genre)} />
        </View>
      ))}
    </ScrollView>
  );
};

const SearchInput = (placeholder: string | undefined, onChangeText: ((text: string) => void) | undefined ) => {
  return (
    <View style={styles.inputContainer}>
      <Ionicons name="search" size={20} color="gray" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const ExpandableButtons = () => {
  const [showButtons, setShowButtons] = useState(false);

  const handleMainButtonPress = () => {
    setShowButtons((prev) => !prev);
  };

  const handleSubButtonPress = (buttonLabel: string) => {
    console.log(`Pressed: ${buttonLabel}`);
  };

  return (
    <View style={styles.expandableContainer}>
      <Button title="Toggle Buttons" onPress={handleMainButtonPress} />
      {showButtons && (
        <View style={styles.subButtonsContainer}>
          {['Button 1', 'Button 2', 'Button 3'].map((label, index) => (
            <View key={index} style={styles.buttonContainer}>
              <Button title={label} onPress={() => handleSubButtonPress(label)} />
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  buttonContainer: {
    marginHorizontal: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
  expandableContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  subButtonsContainer: {
    marginTop: 10,
  },
});

export { GenreButtons, SearchInput, ExpandableButtons };
