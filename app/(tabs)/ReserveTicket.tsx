import React, {useState} from 'react';
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
import {useRouter} from "expo-router";

const {width} = Dimensions.get('window');
const SEAT_SIZE = width * 0.06;

const generateSeats = () => {
    // Create a more rectangular layout
    const rows = 6;  // Number of rows (A-F)
    const seatsPerRow = 8;  // 8 seats per row
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
export default function ReserveTicket ({navigation, route}: any){
    const [price, setPrice] = useState<number>(0);
    const [twoDSeatArray, setTwoDSeatArray] = useState<any[][]>(generateSeats());
    const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
    const [fontsLoaded] = useFonts({
        "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-Medium": require("../../assets/fonts/Poppins-Medium.ttf"),
        "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
    });

    const router = useRouter();

    if (!fontsLoaded) {
        return null;
    }

    const selectSeat = (index: number, subindex: number, num: number) => {
        if (!twoDSeatArray[index][subindex].taken) {
            let temp = [...twoDSeatArray];

            // Deselect previously selected seat
            if (selectedSeat !== null) {
                temp = temp.map(row =>
                    row.map(seat => ({...seat, selected: false}))
                );
            }

            // Select new seat
            temp[index][subindex].selected = !temp[index][subindex].selected;
            setSelectedSeat(temp[index][subindex].selected ? num : null);
            setPrice(temp[index][subindex].selected ? 5.0 : 0);
            setTwoDSeatArray(temp);
        }
    };

    const BookSeats = async () => {
        if (selectedSeat === null) {
            Alert.alert('Selection Required', 'Please select a seat before proceeding.');
            return;
        }

        navigation.navigate('TicketPage', {
            seatArray: [selectedSeat],
            ticketImage: route.params.movie.poster_url,
        });
    };

    return (
        <ScrollView
            style={styles.container}
            bounces={false}
            showsVerticalScrollIndicator={false}>
            <StatusBar hidden />

            {/* Movie Banner */}
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
                                action={() => router.back()}
                            />
                        </View>
                    </LinearGradient>
                </ImageBackground>
            </View>

            {/* Main Content */}
            <View style={styles.mainContainer}>
                {/* Screen Indicator */}
                <View style={styles.screenIndicator}>
                    <View style={styles.screenLine} />
                    <Text style={styles.screenText}>SCREEN</Text>
                </View>

                {/* Seating Area */}
                <View style={styles.seatContainer}>
                    <Text style={styles.sectionTitle}>Choose Your Seat</Text>
                    <View style={styles.seatMap}>
                        {twoDSeatArray?.map((item, index) => (
                            <View key={index} style={styles.seatRow}>
                                <Text style={styles.rowLabel}>{String.fromCharCode(65 + index)}</Text>
                                {item?.map((subitem, subindex) => (
                                    <TouchableOpacity
                                        key={subitem.number}
                                        onPress={() => selectSeat(index, subindex, subitem.number)}>
                                        <MaterialIcons
                                            name="event-seat"  // Changed icon to event-seat
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

                    {/* Seat Legend */}
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

                {/* Price and Booking Section */}
                <View style={styles.bottomContainer}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.priceLabel}>Total Price</Text>
                        <Text style={styles.priceAmount}>$ {price.toFixed(2)}</Text>
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
    seatContainer: {
        backgroundColor: COLORS.BlackRGB10,
        borderRadius: BORDERRADIUS.radius_25,
        padding: SPACING.space_15,
        borderWidth: 1,
        borderColor: COLORS.WhiteRGBA15,
    },
    seatMap: {
        gap: SPACING.space_8,
        paddingHorizontal: SPACING.space_24,
        paddingVertical: SPACING.space_20,
    },
    seatRow: {
        flexDirection: "row",
        gap: SPACING.space_8,
        alignItems: 'center',
        justifyContent: "center",
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
    legendContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginTop: SPACING.space_20,
        backgroundColor: COLORS.DarkGrey,
        padding: SPACING.space_12,
        borderRadius: BORDERRADIUS.radius_25,
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
    mainContainer: {
        padding: SPACING.space_16,
    },
    screenIndicator: {
        alignItems: 'center',
        marginBottom: SPACING.space_36,
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
        paddingHorizontal: SPACING.space_24,
        paddingVertical: SPACING.space_12,
        borderRadius: BORDERRADIUS.radius_25,
    },
    bookButtonText: {
        fontFamily: "Poppins-SemiBold",
        fontSize: FONTSIZE.size_16,
        color: COLORS.White,
    },
});