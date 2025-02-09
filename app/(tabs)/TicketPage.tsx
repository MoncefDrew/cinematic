import React, {useCallback, useEffect, useState} from 'react';
import {
    Text,
    View,
    StyleSheet,
    StatusBar,
    ImageBackground,
    Image, TouchableOpacity, Alert,
} from 'react-native';
import AppHeader from '@/components/AppHeader';
import {
    BORDERRADIUS,
    COLORS,
    FONTSIZE,
    SPACING,
} from '@/theme/theme';
import {LinearGradient} from "expo-linear-gradient";
import {Ionicons} from "@expo/vector-icons";
import {useFonts} from "expo-font";
import {useSeatStore} from '@/api/store/seatsStore';
import {useTicketStore} from '@/api/store/TicketStore'

export default function TicketPage({navigation, route}: any) {
    const [fontsLoaded] = useFonts({
        "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-Medium": require("../../assets/fonts/Poppins-Medium.ttf"),
        "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
    });
    const [ticketData, setTicketData] = useState<any>(route.params);
    if (ticketData !== route.params && route.params != undefined) {
        setTicketData(route.params);
    }
    const {createTicket} = useTicketStore()
    const {reserveSeat} = useSeatStore();    // Update ticketData when route.params changes
    const {seatNumber} = route.params.seatDetails
    console.log(seatNumber)

    useEffect(() => {
        if (route.params) {
            setTicketData(route.params);
        }
    }, [route.params]);

    const handleGoBack = useCallback(() => {
        try {
            navigation.navigate('ReserveTicket', {
                projection_id:route?.params.projection_id,
                movieData: route.params.movie,
                movie: ticketData?.movieData

            });
        } catch (error) {
            console.error("Navigation error:", error);
            navigation.goBack();
        }
    }, [navigation, ticketData]);
    if (!fontsLoaded) {
        return null;
    }

    const submitTicket = async() =>{
        await createTicket(route.params.projection_id);
        console.log("created ticket successfully")
        await reserveSeat(route.params.projection_id, seatNumber);
        console.log("finished")

    }
    if (!ticketData) {
        return (
            <View style={styles.container}>
                <StatusBar hidden/>
                <View style={styles.appHeaderContainer}>
                    <AppHeader
                        name="back"
                        header={'My Ticket'}
                        action={handleGoBack}
                    />
                </View>
            </View>
        );
    }

    return (
        <LinearGradient
            colors={[ '#030314','#030314',]}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
        >
            <StatusBar hidden />
            <View style={styles.appHeaderContainer}>
                <AppHeader
                    name="close"
                    header={'Tickets'}
                    action={handleGoBack}
                />
            </View>


            <View style={styles.ticketContainer}>
                <ImageBackground
                    source={{uri: ticketData?.ticketImage}}
                    style={styles.ticketBGImage}>
                    <LinearGradient
                        colors={['rgba(27, 26, 85, 0)', '#1B1A55']}
                        style={styles.linearGradient}>
                        <View
                            style={[
                                styles.blackCircle,
                                {position: 'absolute', bottom: -40, left: -40},
                            ]}></View>
                        <View
                            style={[
                                styles.blackCircle,
                                {position: 'absolute', bottom: -40, right: -40},
                            ]}></View>
                    </LinearGradient>
                </ImageBackground>
                <View style={styles.linear}></View>

                <View style={styles.ticketFooter}>
                    <View
                        style={[
                            styles.blackCircle,
                            {position: 'absolute', top: -40, left: -40},
                        ]}></View>
                    <View
                        style={[
                            styles.blackCircle,
                            {position: 'absolute', top: -40, right: -40},
                        ]}></View>
                    <View style={styles.ticketDateContainer}>
                        <View style={styles.subtitleContainer}>
                            <Text style={styles.dateTitle}>11 feb</Text>
                            <Text style={styles.subtitle}>saturday</Text>
                        </View>
                        <View style={styles.subtitleContainer}>
                            <Ionicons name="time-outline" style={styles.clockIcon} />
                            <Text style={styles.subtitle}>9:00 PM</Text>
                        </View>
                    </View>
                    <View style={styles.ticketSeatContainer}>
                        <View style={styles.subtitleContainer}>
                            <Text style={styles.subheading}>Hall</Text>
                            <Text style={styles.subtitle}>{ticketData?.seatDetails?.hall || '02'}</Text>
                        </View>
                        <View style={styles.subtitleContainer}>
                            <Text style={styles.subheading}>Row</Text>
                            <Text style={styles.subtitle}>{ticketData?.seatDetails?.row || 'A'}</Text>
                        </View>
                        <View style={styles.subtitleContainer}>
                            <Text style={styles.subheading}>Seat</Text>
                            <Text style={styles.subtitle}>{ticketData?.seatDetails?.seatNumber || '1'}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={() => submitTicket()}
            >
                <Text style={styles.buttonText}>Buy the Ticket</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#13123b',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#535C91',
        marginHorizontal: 80,
        marginBottom: 40,

        alignItems: 'center',
    },

    buttonText: {
        borderRadius: BORDERRADIUS.radius_25,
        paddingVertical: 10,
        fontFamily: "Poppins-regular",
        fontSize: FONTSIZE.size_16,
        color: '#FFFFFF',
    },

    // Updated styles with new color palette
    container: {
        display: "flex",
        flex: 1,
    },
    appHeaderContainer: {
        marginHorizontal: SPACING.space_36,
        marginTop: SPACING.space_20 * 2,
    },
    ticketContainer: {
        flex: 1,
        justifyContent: "center",
    },
    ticketBGImage: {
        alignSelf: "center",
        width: 310,
        aspectRatio: 200 / 300,
        borderTopLeftRadius: BORDERRADIUS.radius_25,
        borderTopRightRadius: BORDERRADIUS.radius_25,
        overflow: "hidden",
        justifyContent: "flex-end",
    },
    linearGradient: {
        height: "50%",
    },
    linear: {
        borderTopColor: '#070F2B',
        borderTopWidth: 3,
        width: 310,
        alignSelf: "center",
        backgroundColor: '#1B1A55',
        borderStyle: "dashed",
    },
    ticketFooter: {
        backgroundColor: '#1B1A55',
        width: 310,
        alignItems: "center",
        paddingBottom: SPACING.space_36,
        alignSelf: "center",
        borderBottomLeftRadius: BORDERRADIUS.radius_25,
        borderBottomRightRadius: BORDERRADIUS.radius_25,
    },
    ticketDateContainer: {
        flexDirection: "row",
        gap: SPACING.space_36,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: SPACING.space_10,
    },
    ticketSeatContainer: {
        flexDirection: "row",
        gap: SPACING.space_36,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: SPACING.space_10,
    },
    dateTitle: {
        fontFamily: "Poppins-Medium",
        fontSize: FONTSIZE.size_24,
        color: '#9290C3',
    },
    subtitle: {
        fontFamily: "Poppins-Regular",
        fontSize: FONTSIZE.size_14,
        color: '#9290C3',
    },
    subheading: {
        fontFamily: "Poppins-Medium",
        fontSize: FONTSIZE.size_18,
        color: '#535C91',
    },
    subtitleContainer: {
        alignItems: "center",
    },
    clockIcon: {
        fontSize: FONTSIZE.size_24,
        color: '#535C91',
        paddingBottom: SPACING.space_10,
    },
    blackCircle: {
        height: 70,
        width: 70,
        borderRadius: 80,
        backgroundColor: '#030314',
    },

    barcodeImage: {
        height: 50,
        aspectRatio: 158 / 52,
    },

});

