import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Modal ,
    Animated,
    ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";
import { RootStackParamList } from "@/constants/Movie";
import { RouteProp} from "@react-navigation/native";
import {router, useNavigation, useRouter} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {StackNavigationProp} from "@react-navigation/stack";
import {COLORS} from "@/theme/theme";
import AppHeader from "@/components/AppHeader";
// Type definition for the route parameters expected by the MovieDetails screen
type MovieDetailsRouteProp = RouteProp<RootStackParamList, "MovieDetails">;
// Props interface for the ReserveTicket component
type MovieDetailsProps = {
    route: MovieDetailsRouteProp;
};

/**
 * ReserveTicket Component
 *
 * A comprehensive movie ticket reservation system that allows users to:
 * - View movie details
 * - Select a single seat from an interactive seating chart
 * - View pricing information
 * - Complete the reservation process
 *
 * @param {MovieDetailsProps} movie - Contains route parameters with movie details
 * @returns {JSX.Element} The rendered ReserveTicket component
 */


// Constants
const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const SEATS_PER_ROW = 8;
const TICKET_PRICE = 12.99;

type NavigationProp = StackNavigationProp<RootStackParamList, 'MovieDetails'>;


const ReserveTicket: React.FC<MovieDetailsProps> = (movie) => {
    const navigation = useNavigation<NavigationProp>();

    const Movie  = movie.route.params;
    const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
    const [takenSeats] = useState<string[]>(['A3', 'B5', 'C7', 'D4', 'E2', 'F6']);
    const [showTicket, setShowTicket] = useState(false);
    const fadeAnim = useState(new Animated.Value(0))[0];

    const handleSeatSelection = (seatId: string) => {
        if (takenSeats.includes(seatId)) return;
        setSelectedSeat((prev) => (prev === seatId ? null : seatId));
    };



    const router = useRouter();
    const handleReservation = () => {
        if (!selectedSeat) {
            Alert.alert("Select a Seat", "Please select a seat to continue.");

        }

    };

    const renderSeat = (row: string, seatNumber: number) => {
        const seatId = `${row}${seatNumber}`;
        const isSelected = selectedSeat === seatId;
        const isTaken = takenSeats.includes(seatId);

        return (
            <TouchableOpacity
                key={seatId}
                onPress={() => handleSeatSelection(seatId)}
                disabled={isTaken}
                style={[
                    styles.seat,
                    isSelected && styles.selectedSeat,
                    isTaken && styles.takenSeat,
                ]}
            >
                <Text style={[
                    styles.seatText,
                    isSelected && styles.selectedSeatText,
                    isTaken && styles.takenSeatText,
                ]}>
                    {seatNumber}
                </Text>
            </TouchableOpacity>
        );
    };

    const TicketInfos = {

    }

    // @ts-ignore
    return (
        <View style={styles.container}>
            <StatusBar style="light" />
                <View style={styles.header}>
                    <ImageBackground
                        style={styles.coverImage}
                        source={{ uri: Movie.movie.cover_url }}
                    >
                        <LinearGradient
                            colors={['transparent', '#121212']}
                            style={styles.linearGradient}
                        >
                            <View style={styles.infoContainer}>
                                <Text style={styles.title}>{Movie.movie.title}</Text>
                                <Text style={styles.subtitle}>
                                    {Movie.movie.duration} • {Movie.movie.dateReleased}
                                </Text>
                            </View>
                        </LinearGradient>
                    </ImageBackground>
                </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>


                <View style={styles.screenContainer}>
                    <View style={styles.screen} />
                </View>

                <View style={styles.seatsContainer}>
                    {ROWS.map((row) => (
                        <View key={row} style={styles.row}>
                            {Array.from({ length: SEATS_PER_ROW }, (_, i) => renderSeat(row, i + 1))}
                        </View>
                    ))}
                </View>

                <View style={styles.legend}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendSeat]} />
                        <Text style={styles.legendText}>Available</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendSeat, styles.selectedSeat]} />
                        <Text style={styles.legendText}>Selected</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendSeat, styles.takenSeat]} />
                        <Text style={styles.legendText}>Taken</Text>
                    </View>
                </View>

                {selectedSeat && (
                    <View style={styles.summary}>
                        <Text style={styles.summaryText}>
                            Selected Seat: {selectedSeat}
                        </Text>
                        <Text style={styles.summaryText}>
                            Price: ${TICKET_PRICE.toFixed(2)}
                        </Text>
                    </View>
                )}

                <TouchableOpacity
                    style={[styles.reserveButton, !selectedSeat && styles.disabledButton]}
                    onPress={()=>{navigation.navigate("TicketPage",Movie)}}
                    disabled={!selectedSeat}
                >
                    <Text style={styles.reserveButtonText}>
                        Reserve Ticket
                    </Text>
                </TouchableOpacity>


            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        width: '100%',
    },
    coverImage: {
        width: '100%',
        height: 200,
        borderRadius:12,
    },
    linearGradient: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    infoContainer: {
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    subtitle: {
        fontSize: 14,
        color: 'lightgrey',
        marginTop: 4,
    },
    screenContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    screen: {
        width: '90%',
        height: 10,
        backgroundColor: '#444444',
        borderRadius: 5,
        transform: [{ perspective: 100 }, { rotateX: '-10deg' }],
    },
    screenText: {
        color: '#888888',
        marginTop: 10,
        fontSize: 12,
    },
    seatsContainer: {
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    rowLabel: {
        color: '#888888',
        width: 30,
        textAlign: 'center',},
    seat: {
        width: 35,
        height: 35,
        margin: 3,
        borderRadius: 8,
        backgroundColor: '#2d2d2d',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#3d3d3d',
    },
    selectedSeat: {
        backgroundColor: '#0066cc',
        borderColor: '#0077ee',
    },
    takenSeat: {
        backgroundColor: '#444444',
        borderColor: '#555555',
    },
    seatText: {
        color: '#ffffff',
        fontSize: 12,
    },
    selectedSeatText: {
        color: '#ffffff',
    },
    takenSeatText: {
        color: '#666666',
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    legendSeat: {
        width: 20,
        height: 20,
        borderRadius: 4,
        backgroundColor: '#2d2d2d',
        marginRight: 5,
        borderWidth: 1,
        borderColor: '#3d3d3d',
    },
    legendText: {
        color: '#888888',
        fontSize: 12,
    },
    summary: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#1d1d1d',
        borderRadius: 10,
        alignItems: 'center',
    },
    summaryText: {
        color: '#ffffff',
        fontSize: 16,
        marginBottom: 5,
    },
    reserveButton: {
        backgroundColor: '#0066cc',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    disabledButton: {
        backgroundColor: '#333333',
    },
    reserveButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    ticket: {
        marginTop: 20,
        padding: 20,
        backgroundColor: '#1d1d1d',
        borderRadius: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#0066cc',
    },
    ticketTitle: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    ticketText: {
        color: '#ffffff',
        fontSize: 16,
        marginBottom: 5,
    },
});

export default ReserveTicket;