import React, {useCallback, useEffect, useState} from 'react';
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
import {LinearGradient} from "expo-linear-gradient";
import AppHeader from '@/components/AppHeader';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {useFonts} from "expo-font";

const {width} = Dimensions.get('window');
const SEAT_SIZE = width * 0.06;

const generateSeats = () => {
    const rows = 6;
    const seatsPerRow = 8;
    let rowArray = [];
    let seatNumber = 1;

    for (let i = 0; i < rows; i++) {
        let columnArray = [];
        for (let j = 0; j < seatsPerRow; j++) {
            let seatObject = {
                number: seatNumber,
                taken: Boolean(Math.round(Math.random())),
                selected: false,
            };
            columnArray.push(seatObject);
            seatNumber++;
        }
        rowArray.push(columnArray);
    }
    return rowArray;
};

// @ts-ignore
export default function ReserveTicket ({navigation, route}){

    const [price, setPrice] = useState<number>(100);
    const [twoDSeatArray, setTwoDSeatArray] = useState(generateSeats());
    const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
    const [movieDetails, setMovieDetails] = useState<any>(route.params);
    useEffect(() => {
        if (route.params) {
            setMovieDetails(route.params);
        }
    }, [route.params]);
    const handleBack = useCallback(() => {
        try {
            navigation.navigate('MovieDetails',route.params);
        } catch (error) {
            console.error("Navigation error:", error);
            navigation.goBack();
        }
    }, [navigation, movieDetails]);
    const [fontsLoaded] = useFonts({
        "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-Medium": require("../../assets/fonts/Poppins-Medium.ttf"),
        "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
    });

    if (movieDetails !== route.params && route.params != undefined) {
        setMovieDetails(route.params);
    }
    if (!fontsLoaded) {
        console.log('Fonts not loaded'); // Debug log
        return (
            <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
                <Text style={{color: COLORS.White}}>Loading fonts...</Text>
            </View>
        );
    }

    if (!route.params?.movie) {
        console.log('No movie data'); // Debug log
        return (
            <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
                <Text style={{color: COLORS.White}}>No movie data available</Text>
            </View>
        );
    }

    const selectSeat = (index: number, subindex: number, num: number) => {
        if (!twoDSeatArray[index][subindex].taken) {
            let temp = [...twoDSeatArray];

            if (selectedSeat !== null) {
                temp = temp.map(row =>
                    row.map(seat => ({...seat, selected: false}))
                );
            }

            temp[index][subindex].selected = !temp[index][subindex].selected;
            setSelectedSeat(temp[index][subindex].selected ? num : null);
            setPrice(100);
            setTwoDSeatArray(temp);
        }
    };

    const BookSeats = () => {
        if (selectedSeat === null) {
            Alert.alert('Selection Required', 'Please select a seat before proceeding.');
            return;
        }

        const rowIndex = Math.floor((selectedSeat - 1) / 8);
        const rowLetter = String.fromCharCode(65 + rowIndex);
        const seatInRow = selectedSeat % 8 || 8;

        navigation.navigate('TicketPage', {
            seatArray: [selectedSeat],
            ticketImage: route.params.movie.poster_url,
            movieData: route.params.movie,
            seatDetails: {
                hall: "02",
                row: rowLetter,
                seatNumber: seatInRow,
                rawSeatNumber: selectedSeat
            },
            price:price,
        });
    };



    return (
        <ScrollView
            style={styles.container}
            bounces={false}
            showsVerticalScrollIndicator={false}>
            <StatusBar hidden />
            <View>
                <ImageBackground
                    source={{uri: route.params?.movie.cover_url}}
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

                    <View style={styles.seatMap}>
                        {twoDSeatArray?.map((item, index) => (
                            <View key={index} style={styles.seatRow}>
                                <Text style={styles.rowLabel}>{String.fromCharCode(65 + index)}</Text>
                                {item?.map((subitem, subindex) => (
                                    <TouchableOpacity
                                        key={subitem.number}
                                        onPress={() => selectSeat(index, subindex, subitem.number)}>
                                        <MaterialIcons
                                            name="event-seat"
                                            style={[
                                                styles.seatIcon,
                                                subitem.taken ? styles.takenSeat : {},
                                                subitem.selected ? styles.selectedSeat : {},
                                            ]}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}
                    </View>

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
                        {selectedSeat && (
                            <Text style={styles.seatInfo}>
                                Seat: {String.fromCharCode(65 + Math.floor((selectedSeat-1)/8))}{selectedSeat % 8 || 8}
                            </Text>
                        )}
                    </View>
                    <TouchableOpacity
                        style={[
                            styles.bookButton,
                            !selectedSeat && styles.disabledButton
                        ]}
                        onPress={BookSeats}
                        disabled={!selectedSeat}>
                        <Text style={styles.bookButtonText}>Book Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};
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