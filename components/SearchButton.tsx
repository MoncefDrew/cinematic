import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchButton() {
    const handleSearch = () => {
        alert("Search icon pressed!");
    };


    return (
        <TouchableOpacity  onPress={handleSearch} style={styles.searchButton}>
            <Ionicons name="search" size={20} color="white" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    searchButton: {
        padding: 20,

    },
});
