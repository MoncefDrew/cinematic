import React, { useRef, useState } from 'react';
import { TouchableOpacity, StyleSheet, TextInput, View, Animated, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMovieStore } from '@/api/store/moviesStore'; // Adjust path as needed

export default function SearchBar() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { movies, setFilteredMovies } = useMovieStore();

    // Animation value
    const animatedWidth = useRef(new Animated.Value(50)).current;
    const inputRef = useRef<TextInput>(null);
    const opacityAnimation = useRef(new Animated.Value(0)).current;

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        if (text.trim() === '') {
            setFilteredMovies(movies);
            return;
        }

        const filtered = movies.filter((movie: { title: string; genres: any[]; }) =>
            movie.title.toLowerCase().includes(text.toLowerCase()) ||
            movie.genres?.some(genre =>
                genre.toLowerCase().includes(text.toLowerCase())
            )
        );
        setFilteredMovies(filtered);
    };

    const expandSearch = () => {
        setIsExpanded(true);
        Animated.parallel([
            Animated.timing(animatedWidth, {
                toValue: 300,
                duration: 300,
                useNativeDriver: false
            }),
            Animated.timing(opacityAnimation, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false
            })
        ]).start(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        });
    };

    const collapseSearch = () => {
        Keyboard.dismiss();
        setSearchQuery('');
        setFilteredMovies(movies);
        Animated.parallel([
            Animated.timing(animatedWidth, {
                toValue: 50,
                duration: 300,
                useNativeDriver: false
            }),
            Animated.timing(opacityAnimation, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false
            })
        ]).start(() => {
            setIsExpanded(false);
        });
    };

    return (
        <Animated.View style={[styles.container, { width: animatedWidth }]}>
            {isExpanded && (
                <Animated.View style={[styles.inputContainer, { opacity: opacityAnimation }]}>
                    <TextInput
                        ref={inputRef}
                        style={styles.input}
                        placeholder="Search movies..."
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        value={searchQuery}
                        onChangeText={handleSearch}
                        onBlur={collapseSearch}
                    />
                </Animated.View>
            )}
            <TouchableOpacity
                onPress={isExpanded ? collapseSearch : expandSearch}
                style={styles.iconContainer}
            >
                <Ionicons
                    name={isExpanded ? "close" : "search"}
                    size={24}
                    color="white"
                />
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1D24',
        borderRadius: 25,
        height: 40,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#2A2D34',
        margin:20,
    },
    inputContainer: {
        flex: 1,
        paddingLeft: 20,
    },
    input: {
        flex: 1,
        color: 'white',
        fontSize: 16,
        paddingVertical: 8,
    },
    iconContainer: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
});