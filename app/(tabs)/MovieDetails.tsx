import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Animated,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import MovieCard from "@/components/MovieCard";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList, Movie } from "@/constants/Movie";
import { LinearGradient } from "expo-linear-gradient";
import ProfilePic from "@/components/ProfilePic";
import { StackNavigationProp } from "@react-navigation/stack";
import MovieActionModal from "@/components/MovieActionModal";
import MovieTimeCounter from "@/components/MovieTimeCounter";

type MovieDetailsRouteProp = RouteProp<RootStackParamList, "MovieDetails">;
type NavigationProp = StackNavigationProp<RootStackParamList, "Popular">;
type MovieDetailsProps = {
    route: MovieDetailsRouteProp;
};

export default function MovieDetails({ route }: any) {
    const router = useRouter();
    const { movie, seats, projection_id } = route.params;
    const navigation = useNavigation<NavigationProp>();
    const [userRating, setUserRating] = useState(0);
    const [isModalVisible, setModalVisible] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const { projection_date, start_time, end_time } = route.params;
    const [canReserve, setCanReserve] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState('');
    const [showFullDescription, setShowFullDescription] = useState(false);
    const DESCRIPTION_LIMIT = 120;
    const showReserveButton = route.params?.fromProgram || false;

    // Fade-in animation
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    // Toggle modal function
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    // Handle time updates from MovieTimeCounter
    const handleTimeUpdate = (canReserve: boolean, timeRemaining: string) => {
        setCanReserve(canReserve);
        setTimeRemaining(timeRemaining);
    };

    // Truncate description with "Read more" option
    const renderDescription = () => {
        if (!movie.description) return null;
        
        const shouldTruncate = movie.description.length > DESCRIPTION_LIMIT && !showFullDescription;
        const displayText = shouldTruncate 
            ? `${movie.description.substring(0, DESCRIPTION_LIMIT)}...` 
            : movie.description;
        
        return (
            <>
                <Text style={styles.description}>{displayText}</Text>
                {movie.description.length > DESCRIPTION_LIMIT && (
                    <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
                        <Text style={styles.readMoreText}>
                            {showFullDescription ? "Show less" : "Read more"}
                        </Text>
                    </TouchableOpacity>
                )}
            </>
        );
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Back Button */}
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}>
                <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Cover with Gradient */}
            <View style={styles.coverContainer}>
                <Image source={{ uri: movie.cover_url }} style={styles.cover} />
                <LinearGradient
                    colors={["transparent", "#030314"]}
                    style={styles.lineargrad}
                />
            </View>

            {/* Movie Information */}
            <Animated.View style={[styles.detailsContainer, { opacity: fadeAnim }]}>
                <View style={styles.movieInfos}>
                    <Text style={styles.title}>
                        {movie.title}
                    </Text>
                    <View style={styles.directorContainer}>
                        <Text style={styles.directedBy}>DIRECTED BY</Text>
                        <Text style={styles.directedByperson}>
                            {movie.directedBy}
                        </Text>
                    </View>
                    <Text style={styles.metaInfo}>
                        {movie.dateReleased} • {movie.projectionTime}
                    </Text>
                </View>
                <View style={styles.cardContainer}>
                    <MovieCard movie={movie} />
                </View>
            </Animated.View>

            {/* Time Counter (only shown if from program view) */}
            {showReserveButton && (
                <View style={styles.timeCounterContainer}>
                    <MovieTimeCounter 
                        projection_date={projection_date}
                        start_time={start_time}
                        projection_id={projection_id}
                        onTimeUpdate={handleTimeUpdate}
                    />
                </View>
            )}

            {/* Description */}
            <Animated.View style={[styles.descriptionContainer, { opacity: fadeAnim }]}>
                <Text style={styles.sectionTitle}>DESCRIPTION</Text>
                {renderDescription()}
            </Animated.View>

            <View style={styles.separator} />

            {/* Rate, log, and review action */}
            <TouchableOpacity onPress={toggleModal} style={styles.actionButtonContainer}>
                <View style={styles.actionButton}>
                    <ProfilePic />
                    <Text style={styles.actionButtonText}>
                        Rate, reserve, add to list + more
                    </Text>
                    <Ionicons name="ellipsis-horizontal" color="#919cd7" size={17} />
                </View>
            </TouchableOpacity>

            <View style={styles.separator} />

            {/* AD Section */}
            <Animated.View style={[styles.adSection, { opacity: fadeAnim }]}>
                <Image
                    source={{
                        uri: "https://pubandbar.com/perch/resources/header-image-1-w1200h600.png",
                    }}
                    style={styles.adBanner}
                    resizeMode="cover"
                />
                <TouchableOpacity style={styles.removeAdButton}>
                    <Text style={styles.removeAdText}>REMOVE ADS</Text>
                </TouchableOpacity>
            </Animated.View>

            <View style={styles.separator} />

            {/* Go Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackContainer}>
                <View style={styles.goBackButton}>
                    <Text style={styles.goBackText}>Return to Popular</Text>
                </View>
            </TouchableOpacity>

            {/* Movie Action Modal Component */}
            <MovieActionModal
                isVisible={isModalVisible}
                toggleModal={toggleModal}
                userRating={userRating}
                setUserRating={setUserRating}
                movie={movie}
                seats={seats}
                projection_id={projection_id}
                projection_date={projection_date}
                start_time={start_time}
                canReserve={canReserve}
                timeRemaining={timeRemaining}
                showReserveButton={showReserveButton}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#030314",
    },
    backButton: {
        position: "absolute",
        top: 20,
        left: 20,
        zIndex: 10,
        backgroundColor: "rgba(3, 3, 20, 0.5)",
        borderRadius: 20,
        padding: 8,
    },
    coverContainer: {
        width: '100%',
        height: 220,
        position: 'relative',
        marginBottom: 10,
    },
    cover: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    lineargrad: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    detailsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: "#030314",
    },
    movieInfos: {
        flex: 1,
        justifyContent: 'center',
        paddingRight: 10,
    },
    cardContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        color: "#9290C3",
        fontFamily: "Satoshi",
        fontWeight: 'bold',
        marginBottom: 8,
    },
    directorContainer: {
        marginVertical: 4,
    },
    directedBy: {
        fontSize: 12,
        color: "#6B668F",
        fontFamily: "Satoshi",
        letterSpacing: 0.5,
    },
    directedByperson: {
        color: "#FFFFFF",
        fontFamily: "Satoshi",
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 2,
    },
    metaInfo: {
        marginTop: 8,
        fontSize: 14,
        color: "#6B668F",
        fontFamily: "Satoshi",
    },
    timeCounterContainer: {
        paddingHorizontal: 20,
        marginVertical: 10,
    },
    descriptionContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    sectionTitle: {
        fontFamily: "Satoshi",
        fontSize: 14,
        letterSpacing: 1,
        color: "#6B668F",
        marginBottom: 10,
    },
    description: {
        fontFamily: "Satoshi",
        fontSize: 15,
        lineHeight: 22,
        color: "#9290C3",
    },
    readMoreText: {
        fontFamily: "Satoshi",
        fontSize: 14,
        color: "#919cd7",
        fontWeight: 'bold',
        marginTop: 8,
    },
    actionButtonContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    actionButton: {
        backgroundColor: '#13123b',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#535C91',
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    actionButtonText: {
        color: "#919cd7",
        fontFamily: "Satoshi",
        fontSize: 15,
    },
    separator: {
        height: 1,
        backgroundColor: "#2E2A4A",
        marginVertical: 15,
    },
    adSection: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
    },
    adBanner: {
        width: '100%',
        height: 100,
        borderRadius: 8,
        backgroundColor: '#0A0821',
    },
    removeAdButton: {
        marginTop: 10,
        padding: 8,
    },
    removeAdText: {
        fontFamily: "Satoshi",
        fontSize: 12,
        color: "#6B668F",
        letterSpacing: 1,
    },
    goBackContainer: {
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    goBackButton: {
        backgroundColor: '#13123b',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#535C91',
        paddingVertical: 12,
        width: '100%',
        alignItems: 'center',
    },
    goBackText: {
        color: "white",
        fontFamily: "Satoshi",
        fontSize: 15,
    },
});