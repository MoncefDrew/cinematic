import {Text, TouchableOpacity, View} from "react-native";
import { StyleSheet } from 'react-native';
import { Image } from 'react-native';
import {Colors} from "@/constants/Colors";
import {Movie, RootStackParamList} from "@/constants/Movie";
import React from "react";
import {useNavigation} from "expo-router";
import {StackNavigationProp} from "@react-navigation/stack";


type NavigationProp = StackNavigationProp<RootStackParamList, 'Popular'>;

type MovieCardProps = {
    movie: Movie;
};

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {


    const navigation = useNavigation<NavigationProp>();

    const handlePress = () => {
        navigation.navigate('MovieDetails', { movie });
    };

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress}>
            <Image source={{ uri: movie.poster }} style={styles.image} />
        </TouchableOpacity>
    );
};





// styles for movie card
const styles = StyleSheet.create({
    card: {
        width: 100, // Width of each movie card
        marginRight: 5,
        alignItems: "center",

    },

    image: {
        width: 100,
        height: 150, // Poster size
        borderRadius: 2,
        borderWidth : 0.5,
        borderColor : Colors.theme.cardBorder,
    },



});

export default MovieCard;
