import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Button } from "react-native";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router"; // Import useRouter hook
import MovieCard from "@/components/MovieCard";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList, Movie } from "@/constants/Movie";
import { LinearGradient } from "expo-linear-gradient";
import ProfilePic from "@/components/ProfilePic";

type MovieDetailsRouteProp = RouteProp<RootStackParamList, "MovieDetails">;

type MovieDetailsProps = {
    route: MovieDetailsRouteProp;
};

const MovieDetails: React.FC<MovieDetailsProps> = ({ route }) => {
    const router = useRouter(); // Access router object
    const { movie } = route.params;

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={{position: "absolute",
                top: 40, // Adjust top position to place it near the header
                left: 20, // Adjust left position for the back button
                zIndex: 1, }}>
                <Ionicons name="arrow-back" size={30} color={Colors.theme.textColorSmall} />
            </TouchableOpacity>
            {/* Cover with Gradient */}
            <View style={styles.coverContainer}>
                <Image source={{ uri: movie.cover }} style={styles.cover} />
                <LinearGradient
                    colors={["transparent", Colors.theme.background]}
                    style={styles.lineargrad}
                />
            </View>

            {/* Movie Information and Card */}
            <View style={styles.detailsContainer}>
                {/* Left: Movie Information */}
                <View style={[styles.movieInfos, { flex: 1 }]}>
                    <Text style={[styles.title, { fontFamily: "Satoshi" }]}>{movie.title}</Text>
                    <Text style={styles.directedBy}>DIRECTED BY</Text>
                    <Text style={[styles.directedByperson, { fontFamily: "Satoshi" }]}>{movie.directedBy}</Text>
                    <Text style={[styles.directedBy, { fontFamily: "Satoshi" }]}>
                        {movie.dateReleased} • {movie.projectionTime} <Text style={{ fontFamily: "Satoshi" }}>TRAILER</Text>
                    </Text>
                </View>

                {/* Right: Movie Card */}
                <View style={styles.cardContainer}>
                    <MovieCard movie={movie} />
                </View>
            </View>

            <View style={styles.disContainer}>
                <Text style={styles.titleDescription}>DESCRIPTION</Text>
                <Text style={styles.description}>{movie.Description}</Text>
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
                <Text style={styles.ratingTitle}>Ratings</Text>
                <View style={styles.starsContainer}>
                    <Ionicons name="star" size={15} color={Colors.theme.starColor} />
                    <Ionicons name="star" size={15} color={Colors.theme.starColor} />
                    <Ionicons name="star" size={15} color={Colors.theme.starColor} />
                </View>
                <Text style={styles.ratingTitle}>{movie.Evaluation}</Text>
            </View>

            <View style={styles.separator} />

            {/*Rate,log and review action section*/}
            <TouchableOpacity>
                <View style={styles.rate}>
                    <View style={styles.containerRate}>
                        <ProfilePic/>
                        <Text style={{color:'white',paddingHorizontal:20}}>Rate, log, review, add to list + more</Text>
                    </View>
                </View>
            </TouchableOpacity>


            <View style={styles.separator} />

            {/* Go Back Button */}
            <TouchableOpacity onPress={() => router.back()}>
                <View style={styles.rate}>
                    <Text style={{ color: "white" }}>Go Back to Popular</Text>
                </View>
            </TouchableOpacity>

            <View style={styles.separator} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    background: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' },
    separator: { height: 0.25, backgroundColor: Colors.theme.cardBorder, marginVertical: 10 },

    container: { flex: 1, backgroundColor: Colors.theme.background },
    coverContainer: { width: '100%', height: 200, position: 'relative' },
    cover: { width: '100%', height: '100%', resizeMode: 'cover' },
    lineargrad: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },

    detailsContainer: { flexDirection: 'row', paddingHorizontal:20, paddingVertical:5, backgroundColor: Colors.theme.background },
    movieInfos: { justifyContent: 'center' },
    cardContainer: { justifyContent: 'center', alignItems: 'center' },

    title: { fontSize: 25, color: Colors.theme.BigTitle, fontWeight: 'bold', marginBottom: 10 },
    subtitle: { marginTop: 13, fontSize: 14, color: Colors.theme.InactiveTint, marginBottom: 10 },
    titleDescription: { fontWeight: 400, color: Colors.theme.tabIconDefault, marginBottom: 10 },
    description: { fontWeight: 300, fontSize: 14,  color: Colors.theme.textColorSmall },
    disContainer: { paddingVertical: 10, paddingHorizontal: 20 },

    directedBy: { marginTop: 12, fontWeight: 300, color: Colors.theme.tabIconDefault },
    directedByperson: { color: Colors.theme.tabIconDefault, fontWeight: 'bold', fontSize: 14 },

    // AD Section
    adSection: { alignItems: 'center', justifyContent: 'center', padding: 15 },
    adBanner: { width: '100%', height: 100, borderRadius: 3, backgroundColor: '#ccc', padding: 20 },
    removeAdButton: { padding: 5, borderRadius: 5, alignItems: 'center' },

    // Rating Section
    ratingSection: { alignItems: 'center',  flexDirection: 'row', justifyContent: 'center' },
    ratingTitle: { fontSize: 15, fontWeight: 200, color: '#ffffff' },
    starsContainer: { marginHorizontal:20, flexDirection: 'row', justifyContent: 'space-between' },

    //rate section
    rate:{
        alignItems: 'center', justifyContent: 'center',
        paddingHorizontal:20,
        margin:10

    },

    containerRate:{
        alignItems: 'center',
        padding:4,
        backgroundColor:Colors.theme.button,
        borderColor:'#fff',
        justifyContent:'center',
        borderRadius: 10,
        flexDirection:'row',
        height:40,
        paddingHorizontal:20,
    }
});


export default MovieDetails;
