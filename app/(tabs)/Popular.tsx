import {FlatList, Image, Text, View} from "react-native";
import {StyleSheet} from 'react-native';
import {MovieCard} from "@/components/MovieCard";
import {Colors} from "@/constants/Colors";
import {useFonts} from "expo-font";
import React from "react";

export default function Popular() {

    const [loaded] = useFonts({
        Satoshi: require('../../assets/fonts/Satoshi-Variable.ttf')
    });


    //api call for movies list for most watched movies
    const movies = [
        {
            id: "1",
            title: "Inception",
            poster: "https://a.ltrbxd.com/resized/sm/upload/sv/95/s9/4j/inception-0-1000-0-1500-crop.jpg?v=30d7224316",
            date:18/6/2025,
            time:'18:00:00',
            Evaluation : 4,
        },
        {
            id: "2",
            title: "Avatar",
            poster: "https://a.ltrbxd.com/resized/sm/upload/1p/mh/li/l2/b7nR3eKeTOwHPKmDLUWunIGasKo-0-1000-0-1500-crop.jpg?v=0bb5ec98ec",
            date:18/6/2025,
            time:'18:00:00',
            Evaluation : 4,

        },
        {
            id: "3",
            title: "Interstellar",
            poster: "https://a.ltrbxd.com/resized/film-poster/1/1/7/6/2/1/117621-interstellar-0-1000-0-1500-crop.jpg?v=7ad89e6666",
            date:18/6/2025,
            time:'18:00:00',
            Evaluation : 4,

        },
        {
            id: "4",
            title: "The Matrix",
            poster: "https://a.ltrbxd.com/resized/film-poster/5/1/5/1/8/51518-the-matrix-0-1000-0-1500-crop.jpg?v=fc7c366afe",
            date:18/6/2025,
            time:'18:00:00',
            Evaluation : 4,

        },
    ];


    //movie pressing button handler --> goes to the film page
    const handleMoviePress = (id: string) => {
        console.log(`Movie ${id} pressed!`);
    };

    return (
        <>
        {/*<View style={styles.pro}>
              //  <Image/>
            //</View>
        */}
            <View style={styles.main}>

                <Text style={styles.heading}>Popular Movies</Text>
                <FlatList
                    data={movies}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                        <MovieCard
                            id={item.id}
                            title={item.title}
                            poster={item.poster}
                            onMovieClick={handleMoviePress}
                            projectionDate={item.date.toLocaleString()}
                            projectionTime={item.time}
                            Evaluaton={item.Evaluation}
                        />
                    )}
                />
            </View>
        </>

    );
};

const styles = StyleSheet.create({
    pro: {
        paddingVertical:20,
        alignItems:"center",
        backgroundColor:'#223344',

    },
    main: {
        paddingLeft: 25,
        flex: 1,
        justifyContent: "center",
        backgroundColor: Colors.theme.background,
        paddingVertical: 20,
    },
    heading: {
        color: Colors.theme.BigTitle,
        fontSize: 17,
        marginBottom: 15,
        fontFamily: "Satoshi",
        //

    },
});

