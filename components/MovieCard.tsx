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
        // @ts-ignore
        navigation.navigate('MovieDetails', { movie });
    };

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress}>
            <Image source={{ uri: movie.poster_url }} style={styles.image} />
        </TouchableOpacity>
    );
};





// styles for movie card
const styles = StyleSheet.create({
    card: {
        marginRight: 5,
        alignItems: "center",

        maxHeight:150,
        maxWidth:100,
    },

    image: {
        minWidth: 100,
        minHeight: 150, // Poster size
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: '#535C91',
    },



});

export default MovieCard;