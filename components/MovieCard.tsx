import {Text, TouchableOpacity, View} from "react-native";
import {StyleSheet} from 'react-native';
import {Image} from 'react-native';
import {Colors} from "@/constants/Colors";
import {Movie, RootStackParamList} from "@/constants/Movie";
import React from "react";
import {useNavigation} from "expo-router";
import {StackNavigationProp} from "@react-navigation/stack";


type NavigationProp = StackNavigationProp<RootStackParamList, 'Popular'>;

type MovieCardProps = {
    movie: Movie,
    route?: unknown
};

const MovieCard: React.FC<MovieCardProps> = ({movie, route}:any) => {

    const navigation = useNavigation<NavigationProp>();

    const handlePress = () => {
        // @ts-ignore
        navigation.navigate('MovieDetails', {movie});
    };

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress}>
            <Image source={{uri: movie.poster_url}} style={styles.image}/>
        </TouchableOpacity>
    );
};


// styles for movie card
const styles = StyleSheet.create({
    card: {
        margin: 2,
        alignItems: "center",
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: '#94A3B8',
        overflow: 'hidden',
        maxHeight: 150
    },

    image: {
        minWidth: 100,
        minHeight: 150, // Poster size
    },


});

export default MovieCard;