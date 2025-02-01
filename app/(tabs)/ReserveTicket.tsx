import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Modal 
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";
import { RootStackParamList } from "@/constants/Movie";
import { RouteProp } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
// Type definition for the route parameters expected by the MovieDetails screen
type MovieDetailsRouteProp = RouteProp<RootStackParamList, "MovieDetails">;
// Props interface for the ReserveTicket component
type MovieDetailsProps = {
    route: MovieDetailsRouteProp;
};
// Constants for the seating configuration
const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const SEATS_PER_ROW = 8; // Optimized for mobile screens
const TICKET_PRICE = 12.99;
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
const ReserveTicket: React.FC<MovieDetailsProps> = (movie) => {
    const Movie = movie.route.params;
    const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
    const [takenSeats] = useState<string[]>(['A3', 'B5', 'C7', 'D4', 'E2', 'F6']);
    const [showTicket, setShowTicket] = useState(false);
    /**
     * Handles the selection and deselection of a seat
     *
     * @param {string} seatId - The identifier of the selected seat (e.g., 'A1')
     */
    const handleSeatSelection = (seatId: string) => {
        if (takenSeats.includes(seatId)) return;
        setSelectedSeat((prev) => (prev === seatId ? null : seatId));
    };
    /**
     * Processes the reservation request
     * Includes validation and confirmation dialog
     */
    const handleReservation = () => {
        if (!selectedSeat) {
            Alert.alert("Select a Seat", "Please select a seat to continue.");
            return;
        }
        
        // Directly show the ticket modal without Alert
        setShowTicket(true);
    };

    // Add Ticket Modal Component inline
    const TicketModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showTicket}
            onRequestClose={() => setShowTicket(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.ticketContainer}>
                    {/* Close Button */}
                    <TouchableOpacity 
                        style={styles.closeButton}
                        onPress={() => setShowTicket(false)}
                    >
                        <Ionicons name="close" size={24} color={Colors.theme.textColorSmall} />
                    </TouchableOpacity>
    
                    {/* Ticket Content */}
                    <LinearGradient
                        colors={['#6a11cb', '#2575fc']}
                        style={styles.ticketContent}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        {/* Movie Poster */}
                        <Image 
                            source={{ uri: Movie.movie.poster }} 
                            style={styles.ticketPoster}
                        />
    
                        {/* Movie Title and Date */}
                        <Text style={styles.ticketTitle}>{Movie.movie.title}</Text>
                        <Text style={styles.ticketDate}>{Movie.movie.projectionDate}</Text>
    
                        {/* Seat and Price Details */}
                        <View style={styles.ticketDetails}>
                            <View style={styles.detailItem}>
                                <Text style={styles.ticketLabel}>Seat</Text>
                                <Text style={styles.ticketValue}>{selectedSeat}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.ticketLabel}>Price</Text>
                                <Text style={styles.ticketValue}>${TICKET_PRICE}</Text>
                            </View>
                        </View>
    
                        {/* QR Code Placeholder */}
                        <View style={styles.qrCodePlaceholder}>
                            <Text style={styles.qrCodeText}>QR Code Placeholder</Text>
                        </View>
    
                        {/* Ticket ID */}
                        <Text style={styles.ticketId}>
                            ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
                        </Text>
                    </LinearGradient>
                </View>
            </View>
        </Modal>
    );
    /**
     * Renders an individual seat component
     *
     * @param {string} row - The row identifier (A-H)
     * @param {number} seatNumber - The seat number within the row
     * @returns {JSX.Element} A seat button component
     */
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
                <MaterialCommunityIcons
                    name="seat"
                    size={24}
                    color={
                        isTaken
                            ? Colors.theme.error
                            : isSelected
                                ? Colors.theme.accent
                                : Colors.theme.InactiveTint
                    }
                />
                <Text style={styles.seatNumber}>{seatNumber}</Text>
            </TouchableOpacity>
        );
    };
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Back Navigation Button */}
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons
                    name="arrow-back"
                    size={30}
                    color={Colors.theme.textColorSmall}
                />
            </TouchableOpacity>
            {/* Movie Cover Image */}
            <View style={styles.coverContainer}>
                <Image source={{ uri: Movie.movie.poster }} style={styles.coverImage} />
            </View>
            {/* Movie Information */}
            <View style={styles.detailsContainer}>
                <Text style={styles.movieTitle}>{Movie.movie.title}</Text>
                <Text style={styles.movieDate}>{Movie.movie.projectionDate}</Text>
            </View>
            {/* Screen Indicator */}
            <View style={styles.screenIndicator}>
                <LinearGradient
                    colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                    style={styles.screenLine}
                />
                <Text style={styles.screenText}>SCREEN</Text>
            </View>
            {/* Seating Legend */}
            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <MaterialCommunityIcons
                        name="seat"
                        size={24}
                        color={Colors.theme.InactiveTint}
                    />
                    <Text style={styles.legendText}>Available</Text>
                </View>
                <View style={styles.legendItem}>
                    <MaterialCommunityIcons
                        name="seat"
                        size={24}
                        color={Colors.theme.accent}
                    />
                    <Text style={styles.legendText}>Selected</Text>
                </View>
                <View style={styles.legendItem}>
                    <MaterialCommunityIcons
                        name="seat"
                        size={24}
                        color={Colors.theme.error}
                    />
                    <Text style={styles.legendText}>Taken</Text>
                </View>
            </View>
            {/* Seating Grid */}
            <View style={styles.seatingGrid}>
                {ROWS.map((row) => (
                    <View key={row} style={styles.row}>
                        <Text style={styles.rowLabel}>{row}</Text>
                        <View style={styles.seats}>
                            {Array.from({ length: SEATS_PER_ROW }, (_, i) =>
                                renderSeat(row, i + 1)
                            )}
                        </View>
                    </View>
                ))}
            </View>
            {/* Reservation Summary */}
            <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Selected Seat:</Text>
                    <Text style={styles.summaryValue}>{selectedSeat || "None"}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total:</Text>
                    <Text style={styles.summaryValue}>
                        {selectedSeat ? `$${TICKET_PRICE.toFixed(2)}` : "$0.00"}
                    </Text>
                </View>
            </View>
            {/* Reserve Button */}
            <TouchableOpacity
                style={[
                    styles.reserveButton,
                    !selectedSeat && styles.disabledButton,
                ]}
                onPress={handleReservation}
                disabled={!selectedSeat}
            >
                <Text style={styles.reserveButtonText}>Reserve</Text>
            </TouchableOpacity>

            <TicketModal />
        </ScrollView>
    );
};
//Styles
const styles = StyleSheet.create({
    container: {flexGrow: 1,backgroundColor: Colors.theme.background,},
    backButton: {position: "absolute",top: 40,left: 20,zIndex: 1,},
    coverContainer: {width: '100%',height: 200,position: 'relative',},
    coverImage: {width: '100%',height: '100%',resizeMode: 'cover',borderBottomLeftRadius: 15,borderBottomRightRadius: 15,},
    detailsContainer: {padding: 20,backgroundColor: Colors.theme.background,},
    movieTitle: {fontSize: 28,fontWeight: 'bold',color: Colors.theme.textColorSmall,},
    movieDate: {fontSize: 18,color: Colors.theme.InactiveTint,marginTop: 5,},
    screenIndicator: {alignItems: 'center',marginVertical: 20,},
    screenLine: {height: 4,width: '80%',borderRadius: 2,},
    screenText: {color: Colors.theme.InactiveTint,fontSize: 12,marginTop: 5,},
    legend: {flexDirection: 'row',justifyContent: 'space-around',paddingHorizontal: 20,marginBottom: 20,},
    legendItem: {flexDirection: 'row',alignItems: 'center',},
    legendText: {color: Colors.theme.InactiveTint,marginLeft: 5,fontSize: 12,},
    seatingGrid: {alignItems: 'center',paddingBottom: 20,},
    row: {flexDirection: 'row',alignItems: 'center',marginBottom: 10,},
    rowLabel: {color: Colors.theme.InactiveTint,width: 20,textAlign: 'center',},
    seats: {flexDirection: 'row',justifyContent: 'center',gap: 8,paddingHorizontal: 10,},
    seat: {alignItems: 'center',justifyContent: 'center',width: 32,height: 32,},
    selectedSeat: {opacity: 1, color: '#4caf50',},
    takenSeat: {opacity: 1, color: '#FF3B30',},
    seatNumber: {color: Colors.theme.InactiveTint,fontSize: 10,marginTop: -4,},
    summaryContainer: {backgroundColor: Colors.theme.cardBackground,margin: 20,padding: 15,borderRadius: 10,},
    summaryRow: {flexDirection: 'row',justifyContent: 'space-between',marginBottom: 10,},
    summaryLabel: {color: Colors.theme.InactiveTint,},
    summaryValue: {color: '#4caf50',fontWeight: '500',},
    reserveButton: {backgroundColor: Colors.theme.button,margin: 20,padding: 15,borderRadius: 10,alignItems: 'center',},
    disabledButton: {backgroundColor: Colors.theme.button,opacity: 0.6,},
    reserveButtonText: {color:'#FFFFFF', fontSize: 18, fontWeight:'500',},
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    ticketContainer: {
        width: '90%',
        backgroundColor: Colors.theme.cardBackground,
        borderRadius: 15,
        overflow: 'hidden',
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 10,
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    ticketContent: {
        alignItems: 'center',
        padding: 20,
    },
    ticketPoster: {
        width: 150,
        height: 225,
        borderRadius: 10,
        marginBottom: 15,
    },
    ticketTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 5,
    },
    ticketDate: {
        fontSize: 16,
        color: '#FFFFFF',
        opacity: 0.8,
        marginBottom: 15,
    },
    ticketDetails: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingVertical: 15,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderStyle: 'dashed',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        marginBottom: 15,
    },
    detailItem: {
        alignItems: 'center',
    },
    ticketLabel: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.8,
        marginBottom: 5,
    },
    ticketValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    qrCodePlaceholder: {
        width: 150,
        height: 150,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 15,
    },
    qrCodeText: {
        fontSize: 14,
        color: '#6a11cb',
        fontWeight: 'bold',
    },
    ticketId: {
        fontSize: 12,
        color: '#FFFFFF',
        opacity: 0.8,
        fontFamily: 'SpaceMono',
    },
});
export default ReserveTicket;