import React, { useEffect, useCallback, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    StatusBar,
    ImageBackground,
    TouchableOpacity,
    Dimensions,
    Alert,
} from 'react-native';
import {
    BORDERRADIUS,
    COLORS,
    FONTSIZE,
    SPACING,
} from '@/theme/theme';
import { LinearGradient } from "expo-linear-gradient";
import AppHeader from '@/components/AppHeader';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFonts } from "expo-font";
import {useSeatStore} from '@/api/store/seatsStore';

export default function ReserveTicket({ navigation, route }:any) {
    const {
        seats,
        loading,
        error,
        selectedSeat,
        fetchSeats,
        selectSeat,
    } = useSeatStore();

    const [price] = useState(100); // Fixed price state

    const handleBack = useCallback(() => {
        try {
            navigation.navigate('MovieDetails', route.params);
        } catch (error) {
            console.error("Navigation error:", error);
            navigation.goBack();
        }
    }, [navigation, route.params]);

    useEffect(() => {
        const loadSeats = async () => {
            if (route.params?.projection_id) {
                console.log('Fetching seats for projection:', route.params.projection_id); // Debug log
                await fetchSeats(route.params.projection_id);
            } else {
                console.log('No projection ID available'); // Debug log
            }
        };

        loadSeats();
    }, [route.params?.projection_id]);

    // Add debug logging for seats state
    useEffect(() => {
        console.log('Current seats state:', seats); // Debug log
    }, [seats]);

    const [fontsLoaded] = useFonts({
        "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-Medium": require("../../assets/fonts/Poppins-Medium.ttf"),
        "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
    });
    if (!fontsLoaded) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: COLORS.White }}>Loading fonts...</Text>
            </View>
        );
    }
    if (!route.params?.movie) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: COLORS.White }}>No movie data available</Text>
            </View>
        );
    }

    // Helper function to chunk array into rows
    const chunks = (array: any[], size: number) => {
        if (!array) return [];
        const chunked = [];
        for (let i = 0; i < array.length; i += size) {
            chunked.push(array.slice(i, i + size));
        }
        return chunked;
    };

    // ReserveTicket.tsx - Updated renderSeats function
    const renderSeats = () => {
        if (!seats || seats.length === 0) {
            console.log('No seats available to render'); // Debug log
            return (
                <View style={[styles.seatMap, { alignItems: 'center', justifyContent: 'center' }]}>
                    <Text style={{ color: COLORS.White }}>No seats available</Text>
                </View>
            );
        }

        const seatRows = chunks(seats, 8);
        console.log('Rendered seat rows:', seatRows); // Debug log

        return (
            <View style={styles.seatMap}>
                {seatRows.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.seatRow}>
                        <Text style={styles.rowLabel}>{String.fromCharCode(65 + rowIndex)}</Text>
                        {row.map((seat) => {
                            const seatIndex = seat.number - 1;
                            return (
                                <TouchableOpacity
                                    key={seat.number}
                                    onPress={() => selectSeat(seatIndex)}
                                    disabled={seat.reserved}>

                                    <MaterialIcons
                                        name="event-seat"
                                        style={[
                                            styles.seatIcon,
                                            seat.reserved ? styles.takenSeat : {},
                                            seat.selected ? styles.selectedSeat : {},
                                        ]}
                                    />
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ))}
            </View>
        );
    };

    // seat choosing
    const handleBookSeats = async () => {
        if (selectedSeat === null) {
            Alert.alert('Selection Required', 'Please select a seat before proceeding.');
            return;
        }

        try {
            const seatNumber = selectedSeat + 1; // Convert from index to seat number

            const rowIndex = Math.floor(selectedSeat / 8);
            const rowLetter = String.fromCharCode(65 + rowIndex);
            const seatInRow = (selectedSeat % 8) + 1;

            navigation.navigate('TicketPage', {
                projection_id:route?.params.projection_id,
                seatArray: [seatNumber],
                ticketImage: route.params.movie.poster_url,
                movieData: route.params.movie,
                seatDetails: {
                    hall: "02",
                    row: rowLetter,
                    seatNumber: selectedSeat,
                    rawSeatNumber: seatNumber
                },
                price: price,
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to reserve seat. Please try again.');
        }
    };

    return (
        <ScrollView
            style={styles.container}
            bounces={false}
            showsVerticalScrollIndicator={false}>
            <StatusBar hidden />
            <View>
                <ImageBackground
                    source={{ uri: route.params?.movie.cover_url }}
                    style={styles.ImageBG}>
                    <LinearGradient
                        colors={[COLORS.BlackRGB10, COLORS.Black]}
                        style={styles.linearGradient}>
                        <View style={styles.appHeaderContainer}>
                            <AppHeader
                                name="close"
                                action={handleBack}
                            />
                        </View>
                    </LinearGradient>
                </ImageBackground>
            </View>

            <View style={styles.mainContainer}>
                <View style={styles.movieInfoContainer}>
                    <Text style={styles.movieTitle}>{route.params?.movie.title || "Movie Title"}</Text>
                    <View style={styles.movieMetaContainer}>
                        <Text style={styles.movieMeta}>Today, 7:00 PM</Text>
                        <Text style={styles.movieMeta}>•</Text>
                        <Text style={styles.movieMeta}>Hall 1</Text>
                    </View>
                </View>

                <View style={styles.seatContainer}>
                    <View style={styles.screenContainer}>
                        <View style={styles.screenLine} />
                        <Text style={styles.screenText}>SCREEN</Text>
                    </View>

                    {loading ? (
                        <View style={[styles.seatMap, { alignItems: 'center', justifyContent: 'center' }]}>
                            <Text style={{ color: COLORS.White }}>Loading seats...</Text>
                        </View>
                    ) : error ? (
                        <View style={[styles.seatMap, { alignItems: 'center', justifyContent: 'center' }]}>
                            <Text style={{ color: COLORS.White }}>{error}</Text>
                        </View>
                    ) : (
                        renderSeats()
                    )}

                    <View style={styles.legendContainer}>
                        <View style={styles.legendItem}>
                            <MaterialIcons name="event-seat" style={styles.legendIcon} />
                            <Text style={styles.legendText}>Available</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <MaterialIcons name="event-seat" style={[styles.legendIcon, styles.takenSeat]} />
                            <Text style={styles.legendText}>Taken</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <MaterialIcons name="event-seat" style={[styles.legendIcon, styles.selectedSeat]} />
                            <Text style={styles.legendText}>Selected</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.bottomContainer}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.priceLabel}>Total Price</Text>
                        <Text style={styles.priceAmount}>{price.toFixed(2)} DA</Text>
                        {selectedSeat !== null && (
                            <Text style={styles.seatInfo}>
                                Seat: {String.fromCharCode(65 + Math.floor(selectedSeat/8))}{(selectedSeat % 8) + 1}
                            </Text>
                        )}
                    </View>
                    <TouchableOpacity
                        style={[
                            styles.bookButton,
                            !selectedSeat && styles.disabledButton
                        ]}
                        onPress={handleBookSeats}
                        disabled={!selectedSeat}>
                        <Text style={styles.bookButtonText}>Book Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    seatRow: {
        flexDirection: "row",
        gap: SPACING.space_8,
        alignItems: 'center',
        justifyContent: "center",
    },
    legendContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        padding: SPACING.space_12,
        borderTopWidth: 1,
        borderColor: COLORS.WhiteRGBA15,
        backgroundColor: COLORS.BlackRGB10,
    },
    mainContainer: {
        padding: SPACING.space_16,
    },
    movieInfoContainer: {
        marginBottom: SPACING.space_24,
    },
    movieTitle: {
        fontFamily: "Poppins-Bold",
        fontSize: FONTSIZE.size_24,
        color: COLORS.White,
        marginBottom: SPACING.space_8,
    },
    movieMetaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.space_10,
        marginBottom: SPACING.space_8,
    },
    movieMeta: {
        fontFamily: "Poppins-Regular",
        fontSize: FONTSIZE.size_14,
        color: COLORS.WhiteRGBA50,
    },
    movieDescription: {
        fontFamily: "Poppins-Regular",
        fontSize: FONTSIZE.size_14,
        color: COLORS.WhiteRGBA75,
    },
    seatContainer: {
        backgroundColor: COLORS.BlackRGB10,
        borderRadius: BORDERRADIUS.radius_25,
        borderWidth: 1,
        borderColor: COLORS.WhiteRGBA15,
        overflow: 'hidden',
    },
    screenContainer: {
        alignItems: 'center',
        paddingVertical: SPACING.space_20,
        backgroundColor: COLORS.BlackRGB10,
        borderBottomWidth: 1,
        borderColor: COLORS.WhiteRGBA15,
    },
    screenLine: {
        width: '70%',
        height: 4,
        backgroundColor: COLORS.WhiteRGBA50,
        borderRadius: 2,
    },
    screenText: {
        fontFamily: "Poppins-Regular",
        fontSize: FONTSIZE.size_12,
        color: COLORS.WhiteRGBA50,
        marginTop: SPACING.space_10,
    },
    seatMap: {
        gap: SPACING.space_8,
        padding: SPACING.space_20,

    },

    rowLabel: {
        fontFamily: "Poppins-Medium",
        fontSize: FONTSIZE.size_12,
        color: COLORS.White,
        width: 16,
        marginRight: SPACING.space_8,
    },
    seatIcon: {
        fontSize: FONTSIZE.size_20,  // Reduced size
        color: COLORS.White,
    },
    takenSeat: {
        color: COLORS.Grey,
        opacity: 0.5,
    },
    selectedSeat: {
        color: COLORS.Orange,
    },

    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING.space_8,
    },
    legendIcon: {
        fontSize: FONTSIZE.size_20,
        color: COLORS.White,
    },
    disabledButton: {
        backgroundColor: COLORS.Grey,
        opacity: 0.5,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.Black,
    },
    ImageBG: {
        width: "100%",
        aspectRatio: 16/9,
    },
    linearGradient: {
        height: "100%",
    },
    appHeaderContainer: {
        marginHorizontal: SPACING.space_36,
        marginTop: SPACING.space_20 * 2,
    },

    screenIndicator: {
        alignItems: 'center',
        marginBottom: SPACING.space_36,
    },

    sectionTitle: {
        fontFamily: "Poppins-SemiBold",
        fontSize: FONTSIZE.size_18,
        color: COLORS.White,
        marginBottom: SPACING.space_15,
    },

    legendText: {
        fontFamily: "Poppins-Regular",
        fontSize: FONTSIZE.size_12,
        color: COLORS.White,
    },
    bottomContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: SPACING.space_24,
        backgroundColor: COLORS.DarkGrey,
        padding: SPACING.space_20,
        borderRadius: BORDERRADIUS.radius_25,
    },
    priceContainer: {
        alignItems: "flex-start",
    },
    priceLabel: {
        fontFamily: "Poppins-Regular",
        fontSize: FONTSIZE.size_14,
        color: COLORS.WhiteRGBA50,
    },
    priceAmount: {
        fontFamily: "Poppins-Bold",
        fontSize: FONTSIZE.size_24,
        color: COLORS.White,
    },
    seatInfo: {
        fontFamily: "Poppins-Regular",
        fontSize: FONTSIZE.size_12,
        color: COLORS.Orange,
        marginTop: 4,
    },
    bookButton: {
        backgroundColor: COLORS.Orange,
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 8,
    },
    bookButtonText: {
        fontFamily: "Poppins-SemiBold",
        fontSize: FONTSIZE.size_16,
        color: COLORS.White,
    },
});