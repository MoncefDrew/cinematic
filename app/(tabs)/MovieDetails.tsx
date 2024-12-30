import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
} from "react-native";
import { Colors } from "@/constants/Colors";
import {useNavigation, useRouter} from "expo-router";
import MovieCard from "@/components/MovieCard";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp} from "@react-navigation/native";
import { RootStackParamList, Movie } from "@/constants/Movie";
import { LinearGradient } from "expo-linear-gradient";
import ProfilePic from "@/components/ProfilePic";
import {StackNavigationProp} from "@react-navigation/stack";

type MovieDetailsRouteProp = RouteProp<RootStackParamList, "MovieDetails">;
type NavigationProp = StackNavigationProp<RootStackParamList, 'Popular'>;

type MovieDetailsProps = {
    route: MovieDetailsRouteProp;
};

const MovieDetails: React.FC<MovieDetailsProps> = ({ route }) => {
    const router = useRouter();
    const { movie } = route.params;
    const navigation = useNavigation<NavigationProp>();

    const [isModalVisible, setModalVisible] = useState(false);
    const [userRating, setUserRating] = useState(0);

    const toggleModal = () => setModalVisible(!isModalVisible);

    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, index) => (
            <TouchableOpacity
                key={index}
                onPress={() => setUserRating(index + 1)}
                style={{ marginHorizontal: 5 }}
            >
                <Ionicons
                    name={index < rating ? "star" : "star-outline"}
                    size={30}
                    color={Colors.theme.starColor}
                />
            </TouchableOpacity>
        ));
    };

    return (
        <ScrollView style={styles.container}>
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

            {/* Cover with Gradient */}
            <View style={styles.coverContainer}>
                <Image source={{ uri: movie.cover }} style={styles.cover} />
                <LinearGradient
                    colors={["transparent", Colors.theme.background]}
                    style={styles.lineargrad}
                />
            </View>

            {/* Movie Information */}
            <View style={styles.detailsContainer}>
                <View style={[styles.movieInfos, { flex: 1 }]}>
                    <Text style={[styles.title, { fontFamily: "Satoshi" }]}>
                        {movie.title}
                    </Text>
                    <Text style={styles.directedBy}>DIRECTED BY</Text>
                    <Text
                        style={[styles.directedByperson, { fontFamily: "Satoshi" }]}
                    >
                        {movie.directedBy}
                    </Text>
                    <Text style={[styles.directedBy, { fontFamily: "Satoshi" }]}>
                        {movie.dateReleased} • {movie.projectionTime}{" "}
                        <Text style={{ fontFamily: "Satoshi" }}>TRAILER</Text>
                    </Text>
                </View>
                <View style={styles.cardContainer}>
                    <MovieCard movie={movie} />
                </View>
            </View>

            {/* Description */}
            <View style={styles.disContainer}>
                <Text style={styles.titleDescription}>DESCRIPTION</Text>
                <Text style={styles.description}>{movie.Description}</Text>
            </View>

            <View style={styles.separator} />

            {/* AD Section */}
            <View style={styles.adSection}>
                <Image
                    source={{
                        uri: "https://pubandbar.com/perch/resources/header-image-1-w1200h600.png",
                    }}
                    style={styles.adBanner}
                    resizeMode="cover"
                />
                <TouchableOpacity style={styles.removeAdButton}>
                    <Text style={styles.directedBy}>REMOVE ADS</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.separator} />

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



            {/* Rate, log, and review action */}
            <TouchableOpacity onPress={toggleModal}>
                <View style={styles.rate}>
                    <View style={styles.containerRate}>
                        <ProfilePic />
                        <Text style={{ color: "white", paddingHorizontal: 20 }}>
                            Rate, reserve, add to list + more
                        </Text>
                        <Ionicons name="ellipsis-horizontal" color="white" size={17} />
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




            {/* Modal */}
            <Modal
                visible={isModalVisible}
                transparent
                animationType="slide"
                onRequestClose={toggleModal}
            >
                <TouchableWithoutFeedback onPress={toggleModal}>
                    <View style={styles.modalOverlay}>
                        <KeyboardAvoidingView
                            style={styles.bottomModal}
                            behavior="padding" // Optional, for better keyboard handling on iOS
                        >
                            <Text style={styles.modalTitle}>What would you like to do?</Text>

                            {/* Rating Section */}
                            <View style={styles.modalRatingSection}>
                                <Text style={styles.modalButtonText}>Rate the Movie:</Text>
                                <View style={styles.starsContainer}>{renderStars(userRating)}</View>
                            </View>

                            {/* Options List */}
                            <TouchableOpacity onPress={() => {
                                toggleModal(); // Close the modal
                                //@ts-ignore
                                navigation.navigate("ReserveTicket", {movie})}}
                                style={styles.reserveTicket}>
                                <Ionicons name='ticket' size={25} color='white'/>
                                <Text style={styles.modalButtonText}>Reserve Ticket</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton}>
                                <Text style={styles.modalButtonText}>Mark as Watched</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.closeButton]}
                                onPress={toggleModal}
                            >
                                <Text style={styles.modalButtonText}>Confirm</Text>
                            </TouchableOpacity>
                        </KeyboardAvoidingView>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
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
    detailsContainer: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 5, backgroundColor: Colors.theme.background },
    movieInfos: { justifyContent: 'center' },
    cardContainer: { justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 25, color: Colors.theme.BigTitle, fontWeight: 'bold', marginBottom: 10 },
    subtitle: { marginTop: 13, fontSize: 14, color: Colors.theme.InactiveTint, marginBottom: 10 },
    titleDescription: { fontWeight: 400, color: Colors.theme.tabIconDefault, marginBottom: 10 },
    description: { fontWeight: 300, fontSize: 14, color: Colors.theme.textColorSmall },
    disContainer: { paddingVertical: 10, paddingHorizontal: 20 },
    directedBy: { marginTop: 12, fontWeight: 300, color: Colors.theme.tabIconDefault },
    directedByperson: { color: Colors.theme.tabIconDefault, fontWeight: 'bold', fontSize: 14 },
    adSection: { alignItems: 'center', justifyContent: 'center', padding: 10 },
    adBanner: { width: '100%', height: 90, borderRadius: 3, backgroundColor: '#ccc', padding: 20 },
    removeAdButton: { borderRadius: 5, alignItems: 'center' },
    ratingSection: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
    ratingTitle: { fontSize: 15, fontWeight: 200, color: '#ffffff' },
    starsContainer: { marginHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between' },
    rate: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, margin: 10 },
    containerRate: { alignItems: 'center', padding: 4, backgroundColor: Colors.theme.button, borderColor: '#fff', justifyContent: 'center', borderRadius: 10, flexDirection: 'row', height: 40, paddingHorizontal: 20 },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: "flex-end" },
    modalContainer: { width: "100%", backgroundColor: Colors.theme.background, padding: 20, borderRadius: 10, alignItems: "center" },
    bottomModal: { width: "100%", backgroundColor: Colors.theme.background, padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, alignItems: "center" },
    reserveTicket: { flexDirection: 'row', justifyContent: 'center', width: "100%", backgroundColor: "#118B50", padding: 15, borderRadius: 5, alignItems: "center", marginVertical: 5 },
    modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 20, color: Colors.theme.textColorSmall, marginHorizontal: 20 },
    modalButton: { width: "100%", padding: 15, backgroundColor: Colors.theme.button, borderRadius: 5, alignItems: "center", marginVertical: 5 },
    modalButtonText: { color: "white", fontSize: 16, paddingHorizontal: 20 },
    closeButton: { backgroundColor: Colors.theme.cardBorder },
    modalRatingSection: { alignItems: "center", marginVertical: 10 },
    starRatingContainer: { flexDirection: "row", justifyContent: "center", marginVertical: 10 }
});



export default MovieDetails;
