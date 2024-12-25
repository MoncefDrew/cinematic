import React from "react";
import {View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Button} from "react-native";
import {Colors} from "@/constants/Colors";
import {useFonts} from "expo-font";
import {MovieCard} from "@/components/MovieCard";
import {Ionicons} from "@expo/vector-icons";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {DrawerScreenProps} from "@react-navigation/drawer";
type Props = DrawerScreenProps<any, "MovieDetails">; // Adjust "MovieDetails" to your route name



const MovieDetails: React.FC<Props> = ({navigation}) => {
    const [loaded] = useFonts({
        Satoshi: require("../../assets/fonts/Satoshi-Variable.ttf"),
        SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
    });




    const Stack = createNativeStackNavigator();


    const movie = {
        id: "4",
        title: "The Matrix",
        cover:
            "https://film-grab.com/wp-content/uploads/2017/02/thematrixreloaded044.jpg",
        date: "18/6/2025",
        poster: "https://www.coverwhiz.com/uploads/movies/the-matrix.jpg",
        time: "119 mins",
        year: 2012,
        evaluation: 3,
        description:
            "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
        directedBy: "Jaume Collet-Serra",
        trailer: ''
    };

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity
                style={{padding:20,margin:30,position:'absolute'}}
                onPress={() => navigation.goBack()}>
                <Ionicons name='arrow-back-outline' color='white' size={24}/>
            </TouchableOpacity>

            {/* Cover with Gradient */}
            <View style={styles.cover}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text>Profile Screen</Text>
                </View>
                <Image source={{uri: movie.cover}} style={styles.cover}/>
            </View>


            {/* Movie Information and Card */}
            <View style={styles.detailsContainer}>
                {/* Left: Movie Information */}
                <View style={[styles.movieInfos, {flex: 1}]}>
                    <Text style={[styles.title, {fontFamily: "Satoshi"}]}>
                        {movie.title}
                    </Text>

                    <Text style={styles.directedBy}>
                        DIRECTED BY
                    </Text>
                    <Text style={[styles.directedByperson, {fontFamily: 'Satoshi'}]}>{movie.directedBy}</Text>

                    <Text style={[styles.directedBy, {fontFamily: "Satoshi"}]}>
                        {movie.year} • {movie.time} <Text style={{fontFamily: 'Satoshi',}}>TRAILER</Text>
                    </Text>

                </View>

                {/* Right: Movie Card */}
                <View style={styles.cardContainer}>
                    <MovieCard
                        poster={movie.poster}
                        id={movie.id}
                        title={movie.title}
                        Evaluaton={movie.evaluation}
                        projectionTime={movie.time}
                        projectionDate={movie.date}
                    />
                </View>
            </View>


            <View style={styles.disContainer}>
                <Text style={styles.titleDescription}>DESCRIPTION</Text>
                <Text style={styles.description}>{movie.description}</Text>
            </View>

            <View style={styles.separator}/>

            <View style={styles.adSection}>
                <Image
                    source={{uri: "https://pubandbar.com/perch/resources/header-image-1-w1200h600.png"}}
                    style={styles.adBanner}
                    resizeMode="cover"
                />
                <TouchableOpacity style={styles.removeAdButton}>
                    <Text style={styles.directedBy}>REMOVE ADS</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.separator}/>

            {/* Rating Section */}
            <View style={styles.ratingSection}>
                <Text style={styles.ratingTitle}>RATINGS</Text>
                <View style={styles.starsContainer}>
                    {/* API CALL FOR RATINGS
                      - getting the evaluation to separate it into the stars to get stars number
                      - need to make a stars generator and the input stars number
                    */}
                    <Ionicons name="star" size={15} color={Colors.theme.starColor}/>
                    <Ionicons name="star" size={15} color={Colors.theme.starColor}/>
                    <Ionicons name="star" size={15} color={Colors.theme.starColor}/>
                </View>
                <Text style={styles.ratingTitle}>{movie.evaluation}</Text>
            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    separator: {
        height: 0.25, // Height of the line
        backgroundColor: Colors.theme.cardBorder, // Color of the separator
        marginVertical: 10, // Space above and below the separator
    },

    container: {
        flex: 1,
        backgroundColor: Colors.theme.background,
    },
    cover: {
        width: "100%",
        height: 250,
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        bottom: 0,
    },
    detailsContainer: {
        flexDirection: "row", // Horizontal layout
        padding: 20,
        backgroundColor: Colors.theme.background,
    },
    movieInfos: {
        justifyContent: "center", // Align vertically within the space

    },
    cardContainer: {
        justifyContent: "center", // Align vertically within the space
        alignItems: "center", // Center card horizontally

    },
    title: {
        fontSize: 25,
        color: Colors.theme.BigTitle,
        fontWeight: "bold",
        marginBottom: 10,
    },
    subtitle: {
        marginTop: 13,
        fontSize: 14,
        color: Colors.theme.InactiveTint,
        marginBottom: 10,
    },
    titleDescription: {
        fontWeight: 200,
        color: Colors.theme.tabIconDefault,
        marginBottom: 10,
    },
    description: {
        fontWeight: 300,
        fontSize: 13,
        fontFamily: 'Satoshi',
        color: Colors.theme.BigTitle,
    },
    disContainer: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },

    directedBy: {
        marginTop: 12,
        fontWeight: 300,
        color: Colors.theme.tabIconDefault,
    },
    directedByperson: {
        color: Colors.theme.tabIconDefault,
        fontWeight: "bold",
        fontSize: 14
    },


    //AD section
    adSection: {
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
    },
    adBanner: {
        width: "100%",
        height: 100,
        borderRadius: 3,
        backgroundColor: "#ccc",
        padding: 20,
    },
    removeAdButton: {
        padding: 5,
        borderRadius: 5,
        alignItems: "center",
    },


    //rating section
    ratingSection: {
        alignItems: 'center',
        marginVertical: 20,
        padding: 5,
        flexDirection: "row",
        justifyContent: 'center'

    },
    ratingTitle: {
        fontSize: 15,
        fontWeight: 200,
        color: "#ffffff",
    },
    starsContainer: {
        marginLeft: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
});

export default MovieDetails;
