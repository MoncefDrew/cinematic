import {FlatList, Image, Text, View} from "react-native";
import {StyleSheet} from 'react-native';
import  MovieCard from "@/components/MovieCard";
import {Colors} from "@/constants/Colors";
import {useFonts} from "expo-font";
import React from "react";
import {Movie} from "@/constants/Movie";
import moviesList from '../../constants/Movie'
export default function Popular() {

    const [loaded] = useFonts({
        Satoshi: require('../../assets/fonts/Satoshi-Variable.ttf')
    });


    //api call for movies list for most watched movies
    const movies= moviesList;


    //movie pressing button handler --> goes to the film page
    const handleMoviePress = (id: number) => {
        console.log(`Movie ${id} pressed!`);

    };

    return (
        <>
        {/*<View style={styles.pro}>
              //  <Image/>
            //</View>
        */}
            <View style={styles.main} >
                <View style={styles.welcome}>
                    <Text style={styles.heading}>Welcome to cinematic</Text>
                    <Text style={styles.text}>you can navigate popular movies and book a ticket for your favorite movie
                        if you had a chance to, hurry up now ! </Text>
                </View>
                <Text style={styles.heading}>Popular Movies</Text>
                <View style={{}}>
                    <FlatList
                        data={moviesList}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({item}) => (
                            <MovieCard
                                movie={item}
                            />
                        )}
                    />
                </View>
                {/*Streaming this week*/}
                <Text style={styles.heading}>Popular Movies</Text>

                <View>
                    <FlatList
                        data={moviesList}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({item}) => (
                            <MovieCard
                                movie={item}
                            />
                        )}
                    />
                </View>



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
        height:'100%',
        flex:1,
        backgroundColor: Colors.theme.background,
        padding: 20,
    },
    heading: {

        marginTop:10,
        color: Colors.theme.BigTitle,
        fontSize: 17,
        marginBottom: 15,
        fontFamily: "Satoshi",
        //

    },

    text : {
        textAlign: 'center',
        color: "#8899AA",
        fontWeight : "400",
    },
    welcome : {
        padding:15,
        backgroundColor: Colors.theme.backgroundCard,
        borderColor: Colors.theme.tabIconDefault,
        borderRadius:4,
        alignItems:'center',
        borderWidth:1,
        marginTop:10,

    }
});

