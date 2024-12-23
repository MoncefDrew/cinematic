import {Text, TouchableOpacity, View} from "react-native";
import { StyleSheet } from 'react-native';
import { Image } from 'react-native';
import {Colors} from "@/constants/Colors";

//movie props for type safety
type MovieCardProps = {
    id: string;
    title: string;
    poster: string;
    projectionDate :string,
    projectionTime : string,
    Evaluaton : number,
    onMovieClick?: (id: string) => void; // Optional callback for handling presses
};



export const MovieCard: React.FC<MovieCardProps> = ({ id, title, poster, onMovieClick }) => {
    return (
        <TouchableOpacity onPress={() => onMovieClick?.(id)} style={styles.container}>
            <Image source={{ uri: poster }} style={styles.poster} />
        </TouchableOpacity>
    );
};




// styles for movie card
const styles = StyleSheet.create({
    container: {
        width: 100, // Width of each movie card
        marginRight: 5,
        alignItems: "center",

    },

    poster: {
        width: 100,
        height: 150, // Poster size
        borderRadius: 2,
        borderWidth : 0.5,
        borderColor : Colors.theme.cardBorder,
    },



});
