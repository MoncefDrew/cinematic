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
    const {movie} = route.params;
    const navigation = useNavigation<NavigationProp>();
    const [userRating, setUserRating] = useState(0);
    const [isModalVisible, setModalVisible] = useState(false);
    const modalY = useRef(new Animated.Value(300)).current;
    const {duration, projection_date, start_time, end_time} = route.params;
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
                style={{marginHorizontal: 5}}
            >
                <Ionicons
                    name={index < rating ? "star" : "star-outline"}
                    size={30}
                    color="#FFD700"
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
                    colors={["transparent", "#0A0A0A"]} // Dark gradient
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
                        <Text style={{color: "white", paddingHorizontal: 20}}>
                            Rate, reserve, add to list + more
                        </Text>
                        <Ionicons name="ellipsis-horizontal" color="white" size={17}/>
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
                                                navigation.navigate("ReserveTicket", {movie});
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
        backgroundColor: "#0A0A0A",
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: "center",
    },
    background: {flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'},
    separator: {height: 0.25, backgroundColor: "#333333", marginVertical: 10}, // Darker separator
    container: {flex: 1, backgroundColor: "#0A0A0A"}, // Dark background
    coverContainer: {width: '100%', height: 200, position: 'relative'},
    cover: {width: '100%', height: '100%', resizeMode: 'cover'},
    lineargrad: {position: 'absolute', left: 0, right: 0, top: 0, bottom: 0},
    detailsContainer: {flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 5, backgroundColor: "#0A0A0A"}, // Dark background
    movieInfos: {justifyContent: 'center'},
    cardContainer: {justifyContent: 'center', alignItems: 'center'},
    title: {fontSize: 25, color: "#FFFFFF", fontWeight: 'bold', marginBottom: 10}, // White text
    subtitle: {marginTop: 13, fontSize: 14, color: "#8899AA", marginBottom: 10}, // Lighter text
    titleDescription: {fontWeight: 400, color: "#8899AA", marginBottom: 10}, // Lighter text
    description: {fontWeight: 300, fontSize: 14, color: "#8899AA"}, // Lighter text
    disContainer: {paddingVertical: 10, paddingHorizontal: 20},
    directedBy: {marginTop: 12, fontWeight: 300, color: "#8899AA"}, // Lighter text
    directedByperson: {color: "#FFFFFF", fontWeight: 'bold', fontSize: 14}, // White text
    adSection: {alignItems: 'center', justifyContent: 'center', padding: 10},
    adBanner: {width: '100%', height: 90, borderRadius: 3, backgroundColor: '#333333', padding: 20}, // Darker ad banner
    removeAdButton: {borderRadius: 5, alignItems: 'center'},
    ratingSection: {alignItems: 'center', flexDirection: 'row', justifyContent: 'center'},
    ratingTitle: {fontSize: 15, fontWeight: 200, color: '#FFFFFF'}, // White text
    starsContainer: {marginHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between'},
    rate: {alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, margin: 10},
    containerRate: {
        alignItems: 'center',
        padding: 4,
        backgroundColor: "#333333",
        borderColor: '#fff',
        justifyContent: 'center',
        borderRadius: 10,
        flexDirection: 'row',
        height: 40,
        paddingHorizontal: 20
    }, // Darker button
    modalOverlay: {flex: 1, backgroundColor: "rgba(0, 0, 0, 0.7)", justifyContent: "flex-end"}, // Darker overlay
    bottomModal: {
        width: "100%",
        backgroundColor: "#0A0A0A",
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: "center"
    }, // Dark background
    reserveTicket: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: "100%",
        backgroundColor: "#118B50",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
        marginVertical: 5
    },
    modalTitle: {fontSize: 18, fontWeight: "bold", marginBottom: 20, color: "#FFFFFF", marginHorizontal: 20}, // White text
    modalButton: {
        width: "100%",
        padding: 15,
        backgroundColor: "#333333",
        borderRadius: 5,
        alignItems: "center",
        marginVertical: 5
    }, // Darker button
    modalButtonText: {color: "white", fontSize: 16, paddingHorizontal: 20},
    closeButton: {backgroundColor: "#333333"}, // Darker button
    modalRatingSection: {alignItems: "center", marginVertical: 10},
    starRatingContainer: {flexDirection: "row", justifyContent: "center", marginVertical: 10},
    disabledButton: {
        backgroundColor: '#374151',
        opacity: 0.7
    }
});