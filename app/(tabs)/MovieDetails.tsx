import React, {useEffect, useRef, useState} from "react";
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
    Animated, // Import Animated

} from "react-native";
import {useNavigation, useRouter} from "expo-router";
import MovieCard from "@/components/MovieCard";
import {Ionicons} from "@expo/vector-icons";
import {RouteProp} from "@react-navigation/native";
import {RootStackParamList, Movie} from "@/constants/Movie";
import {LinearGradient} from "expo-linear-gradient";
import ProfilePic from "@/components/ProfilePic";
import {StackNavigationProp} from "@react-navigation/stack";


type MovieDetailsRouteProp = RouteProp<RootStackParamList, "MovieDetails">;
type NavigationProp = StackNavigationProp<RootStackParamList, 'Popular'>;
type MovieDetailsProps = {
    route: MovieDetailsRouteProp;
};


export default function MovieDetails({route}: any) {
    const router = useRouter();
    const {movie,seats,projection_id} = route.params;
    const navigation = useNavigation<NavigationProp>();
    const [userRating, setUserRating] = useState(0);
    const [isModalVisible, setModalVisible] = useState(false);
    const modalY = useRef(new Animated.Value(300)).current;
    const { projection_date, start_time, end_time} = route.params;
    const [canReserve, setCanReserve] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState('');


    //refreshes the start time and projection
    useEffect(() => {
        if (showReserveButton){

            checkReservationAvailability();
            const timer = setInterval(checkReservationAvailability, 60000);
            return () => clearInterval(timer);
        }
    }, [projection_date, start_time]);


    const showReserveButton = route.params?.fromProgram || false;


    //check Reservation Availability
    const checkReservationAvailability = () => {
        const [hours, minutes, seconds] = start_time.split(':');
        const projectionDate = new Date(projection_date);
        projectionDate.setHours(Number(hours), Number(minutes), 0);
        const now = new Date();
        const diffHours = (projectionDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        setCanReserve(diffHours <= 24 && diffHours > 0);
        if (diffHours > 24) {
            const days = Math.floor(diffHours / 24);
            setTimeRemaining(`Opens in ${days} days`);
        } else if (diffHours > 0) {
            const hours = Math.floor(diffHours);
            const minutes = Math.floor((diffHours - hours) * 60);
            setTimeRemaining(`${hours}h ${minutes}m remaining`);
        } else {
            setTimeRemaining('Projection ended');
        }
    };



    //options modal
    const toggleModal = () => {
        if (isModalVisible) {
            // Slide down
            Animated.timing(modalY, {
                toValue: 300,
                duration: 300,
                useNativeDriver: true,
            }).start(() => setModalVisible(false)); // Hide modal after animation
        } else {
            setModalVisible(true); // Show modal first
            // Slide up
            Animated.timing(modalY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };


    // Render stars function (unchanged)
    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, index) => (
            <TouchableOpacity
                key={index}
                onPress={() => setUserRating(index + 1)}
                style={{margin:10}}
            >
                <Ionicons
                    name={index < rating ? "star" : "star-outline"}
                    size={30}
                    color="#4A3F8C"
                />
            </TouchableOpacity>
        ));
    };


    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                    position: "absolute",
                    top: 40,
                    left: 20,
                    zIndex: 1,
                }}>
                <Ionicons
                    name="arrow-back"
                    size={30}
                    color="#FFFFFF" // White color for back button
                />
            </TouchableOpacity>

            {/* Cover with Gradient */}
            <View style={styles.coverContainer}>
                <Image source={{uri: movie.cover_url}} style={styles.cover}/>
                <LinearGradient
                    colors={["transparent", "#030314"]} // Dark gradient
                    style={styles.lineargrad}
                />
            </View>

            {/* Movie Information */}
            <View style={styles.detailsContainer}>
                <View style={[styles.movieInfos, {flex: 1}]}>
                    <Text style={[styles.title, {fontFamily: "Satoshi"}]}>
                        {movie.title}
                    </Text>
                    <Text style={styles.directedBy}>DIRECTED BY</Text>
                    <Text
                        style={[styles.directedByperson, {fontFamily: "Satoshi"}]}
                    >
                        {movie.directedBy}
                    </Text>
                    <Text style={[styles.directedBy, {fontFamily: "Satoshi"}]}>
                        {movie.dateReleased} • {movie.projectionTime}{" "}
                        <Text style={{fontFamily: "Satoshi"}}>TRAILER</Text>
                    </Text>
                </View>
                <View style={styles.cardContainer}>
                    <MovieCard movie={movie}/>
                </View>
            </View>

            {/* Description */}
            <View style={styles.disContainer}>
                <Text style={styles.titleDescription}>DESCRIPTION</Text>
                <Text style={styles.description}>{movie.description}</Text>
            </View>

            <View style={styles.separator}/>

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

            <View style={styles.separator}/>

            {/* Rating Section */}
            <View style={styles.ratingSection}>
                <Text style={styles.ratingTitle}>Ratings</Text>
                <View style={styles.starsContainer}>
                    <Ionicons name="star" size={15} color="#FFD700"/>
                    <Ionicons name="star" size={15} color="#FFD700"/>
                    <Ionicons name="star" size={15} color="#FFD700"/>
                </View>
                <Text style={styles.ratingTitle}>{movie.Evaluation}</Text>
            </View>

            <View style={styles.separator}/>

            {/* Rate, log, and review action */}
            <TouchableOpacity onPress={toggleModal}>
                <View style={styles.rate}>
                    <View style={styles.containerRate}>
                        <ProfilePic/>
                        <Text style={{color: "#919cd7", paddingHorizontal: 18,paddingVertical:2}}>
                            Rate, reserve, add to list + more
                        </Text>
                        <Ionicons name="ellipsis-horizontal" color="#919cd7" size={17}/>
                    </View>
                </View>
            </TouchableOpacity>
            <View style={styles.separator}/>

            {/* Go Back Button */}
            <TouchableOpacity onPress={() => router.back()}>
                <View style={styles.rate}>
                    <Text style={{color: "white"}}>Go Back to Popular</Text>
                </View>
            </TouchableOpacity>

            {/* Modal */}
            <Modal visible={isModalVisible} transparent animationType="none" onRequestClose={toggleModal}>
                <TouchableWithoutFeedback onPress={toggleModal}>
                    <View style={styles.modalOverlay}>
                        <KeyboardAvoidingView style={styles.bottomModal} behavior="padding">
                            <Animated.View style={[styles.modalContainer, {transform: [{translateY: modalY}]}]}>
                                <Text style={styles.modalTitle}>What would you like to do?</Text>

                                <View style={styles.modalRatingSection}>
                                    <Text style={styles.modalButtonText}>Rate the Movie:</Text>
                                    <View style={styles.starsContainer}>{renderStars(userRating)}</View>
                                </View>

                                {showReserveButton && (
                                    <TouchableOpacity
                                        onPress={() => {
                                            if (canReserve) {
                                                toggleModal();
                                                navigation.navigate("ReserveTicket", {movie,seats,projection_id});
                                            }
                                        }}
                                        style={[styles.reserveTicket, !canReserve && styles.disabledButton]}
                                        disabled={!canReserve}
                                    >
                                        <Ionicons name='ticket' size={25} color='white'/>
                                        <Text style={styles.modalButtonText}>
                                            {canReserve ? 'Reserve Ticket' : timeRemaining}
                                        </Text>
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity style={styles.modalButton}>
                                    <Text style={styles.modalButtonText}>Mark as Watched</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.modalButton, styles.closeButton]}
                                                  onPress={toggleModal}>
                                    <Text style={styles.modalButtonText}>Confirm</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </KeyboardAvoidingView>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        width: "100%",
        backgroundColor: "#030314", // Even darker blue-purple
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: "center",
    },
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },
    separator: {
        height: 0.25,
        backgroundColor: "#2E2A4A", // Deep purple for separators
        marginVertical: 10
    },
    container: {

        flex: 1,
        backgroundColor: "#030314" // Darkest blue-purple background
    },
    coverContainer: {
        width: '100%',
        height: 200,
        position: 'relative'
    },
    cover: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    lineargrad: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },
    detailsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 5,
        backgroundColor: "#030314", // Darkest blue-purple

    },
    movieInfos: {
        justifyContent: 'center'
    },
    cardContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 25,
        color: "#9290C3",
        fontWeight: 'bold',
        marginBottom: 10
    },
    subtitle: {
        marginTop: 13,
        fontSize: 14,
        color: "#6B668F", // Muted purple for secondary text
        marginBottom: 10
    },
    titleDescription: {
        fontWeight: 400,
        color: "#6B668F", // Muted purple
        marginBottom: 10
    },
    description: {
        fontWeight: 300,
        fontSize: 14,
        color: "#6B668F" // Muted purple
    },
    disContainer: {
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    directedBy: {
        marginTop: 12,
        fontWeight: 300,
        color: "#6B668F" // Muted purple
    },
    directedByperson: {
        color: "#FFFFFF",
        fontWeight: 'bold',
        fontSize: 14
    },
    adSection: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    adBanner: {
        width: '100%',
        height: 90,
        borderRadius: 3,
        backgroundColor: '#0A0821', // Very dark purple
        padding: 20
    },
    removeAdButton: {
        borderRadius: 5,
        alignItems: 'center'
    },
    ratingSection: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    ratingTitle: {
        fontSize: 15,
        fontWeight: 200,
        color: '#FFFFFF'
    },
    starsContainer: {
        marginHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    rate: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        margin: 10,

    },
    containerRate: {
            backgroundColor: '#13123b',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#535C91',
            paddingVertical: 22,
            paddingHorizontal: 20,
            alignItems: 'center',
            alignSelf: 'flex-start', // Align button to the left
            elevation: 3, // Add shadow for Android
            shadowColor: '#000', // Add shadow for iOS
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,


        justifyContent: 'center',
        flexDirection: 'row',
        height: 40,

    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(3, 3, 20, 0.95)", // Almost black with slight purple tint
        justifyContent: "flex-end"
    },
    bottomModal: {

        width: "100%",
        backgroundColor: "#030314", // Darkest blue-purple
        padding: 20,
        borderColor: '#2E2A4A', // Deep purple for borders
        borderTopWidth:1,
        alignItems: "center"
    },
    reserveTicket: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: "100%",
        backgroundColor: "#121023", // Rich purple for primary action
        padding: 15,
        borderRadius: 5,
        borderColor:'#2E2A4A',
        alignItems: "center",
        marginVertical: 5
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#FFFFFF",
        marginHorizontal: 20
    },
    modalButton: {
        borderWidth:1,
        borderColor: '#2E2A4A', // Deep purple for borders
        width: "100%",
        padding: 15,
        backgroundColor: "#0A0821", // Very dark purple for secondary buttons
        borderRadius: 5,
        alignItems: "center",
        marginVertical: 5
    },
    modalButtonText: {
        fontFamily:'Satoshi',
        fontWeight:600,
        color: "#897cdc",
        fontSize: 16,
        paddingHorizontal: 15
    },
    closeButton: {
        backgroundColor: "#0A0821" // Very dark purple
    },
    modalRatingSection: {
        alignItems: "center",
        marginVertical: 10
    },
    starRatingContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 10
    },
    disabledButton: {
        backgroundColor: '#0A0821', // Very dark purple
        opacity: 0.7
    }
});