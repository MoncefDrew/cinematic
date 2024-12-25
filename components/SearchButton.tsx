import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchButton() {

    const inputRef = useRef<TextInput>(null);

    const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
        //backend shit


    return (
        <View style={styles.container}>
            <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder="Search..."
                placeholderTextColor="white"
            />
            <TouchableOpacity onPress={handleFocus} style={styles.iconContainer}>
                <Ionicons name="search" size={24} color="white" />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#14171C',
        borderRadius: 8,
        paddingHorizontal: 10,
        width: '100%', // Full width of the container
        marginRight: 8,
    },
    input: {
        flex: 1,
        color: 'white',
        fontSize: 16,
        paddingVertical: 5,
    },
    iconContainer: {
        padding: 10,
    },
});