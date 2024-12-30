import React from "react";
import {View, Text, Image, StyleSheet, TouchableOpacity, ScrollView} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {Colors} from "@/constants/Colors";
import { RootStackParamList} from "@/constants/Movie";
import {RouteProp} from "@react-navigation/native";
import {Ionicons} from "@expo/vector-icons";
import {router} from "expo-router";
import MovieDetails from "@/app/(tabs)/MovieDetails";

type MovieDetailsRouteProp = RouteProp<RootStackParamList, "MovieDetails">;

type MovieDetailsProps = {
    route: MovieDetailsRouteProp;
};


const ReserveTicket: React.FC<MovieDetailsProps> = (movie) => {

    const Movie= movie.route.params
    return (

        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity
                onPress={() => router.back()}
                style={{
                    position: "absolute",
                    top: 40,
                    left: 20,
                    zIndex: 1,
                }}
            >
                <Ionicons
                    name="arrow-back"
                    size={30}
                    color={Colors.theme.textColorSmall}
                />
            </TouchableOpacity>
            {/* Movie Cover with Gradient */}
            <View style={styles.coverContainer}>
                <Image source={{ uri: Movie.movie.poster }} style={styles.coverImage} />
                <LinearGradient
                    colors={["transparent", Colors.theme.background]}
                    style={styles.lineargrad}
                />
            </View>

            {/* Movie Details */}
            <View style={styles.detailsContainer}>
                <Text style={styles.movieTitle}>{Movie.movie.title}</Text>
                <Text style={styles.movieDate}>{Movie.movie.projectionDate}</Text>
            </View>

            {/* Ticket Reservation Section */}
            <View style={styles.ticketSection}>
                <Text style={styles.reserveTitle}>Reserve Your Ticket</Text>
                <TouchableOpacity style={styles.reserveButton}>
                    <Text style={styles.reserveButtonText}>book your seat</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.theme.background,
    },
    coverContainer: {
        height: 500,
    },
    coverImage: {
        width: '100%',
        height: '100%',
    },

    detailsContainer: {
        alignItems:'center',
        padding: 20,
        backgroundColor: Colors.theme.background,
    },
    movieTitle: {
        fontSize: 28,
        fontWeight: 'thin',
        color: Colors.theme.icontTitle,
    },
    movieDate: {
        fontSize: 12,
        color: Colors.theme.tabIconDefault,
        marginTop: 5,
    },
    ticketSection: {
        padding: 20,
        backgroundColor: Colors.theme.background,
        alignItems: 'center',
    },
    reserveTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.theme.textColorSmall,
        marginBottom: 20,
    },
    reserveButton: {
        backgroundColor: Colors.theme.button,
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        alignItems: 'center',
    },
    reserveButtonText: {
        color: 'white',
        fontSize: 18,
    },
    lineargrad: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },

});

export default ReserveTicket;
