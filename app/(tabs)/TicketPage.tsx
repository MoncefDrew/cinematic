import React, { useCallback, useEffect, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    StatusBar,
    ImageBackground,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import AppHeader from '@/components/AppHeader';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useSeatStore } from '@/api/store/seatsStore';
import { useTicketStore } from '@/api/store/TicketStore';
import {BORDERRADIUS, FONTSIZE, SPACING} from "@/theme/theme";

export default function TicketPage({ navigation, route }: any) {
    const [fontsLoaded] = useFonts({
        'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
    });
    const [ticketData, setTicketData] = useState<any>(route.params);
    const { createTicket } = useTicketStore();
    const { reserveSeat } = useSeatStore();
    const { seatNumber } = route.params.seatDetails;

    const [isLoading, setIsLoading] = useState(false); // State to manage loading

    useEffect(() => {
        if (route.params) {
            setTicketData(route.params);
        }
    }, [route.params]);

    const handleGoBack = useCallback(() => {
        try {
            navigation.navigate('ReserveTicket', {
                projection_id: route?.params.projection_id,
                movieData: route.params.movie,
                movie: ticketData?.movieData,
            });
        } catch (error) {
            console.error('Navigation error:', error);
            navigation.goBack();
        }
    }, [navigation, ticketData]);

    const handleSubmit = async () => {
        if (isLoading) return; // Prevent multiple clicks while loading

        setIsLoading(true); // Start loading
        try {
            await submitTicket(); // Call the submit function
        } catch (error) {
            console.error('Error submitting ticket:', error);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    const submitTicket = async () => {
        await createTicket(route.params.projection_id, seatNumber);
        await reserveSeat(route.params.projection_id, seatNumber);
        console.log('Ticket created successfully');
        navigation.navigate('MyTickets'); // Navigate to myTickets after successful submission
    };

    if (!fontsLoaded || !ticketData) {
        return (
            <View style={styles.container}>
                <StatusBar hidden />
                <View style={styles.appHeaderContainer}>
                    <AppHeader name="back" header={'My Ticket'} action={handleGoBack} />
                </View>
            </View>
        );
    }

    return (
        <LinearGradient colors={['#030314', '#030314']} style={styles.container} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
            <StatusBar hidden />
            <View style={styles.appHeaderContainer}>
                <AppHeader name="close" header={'Tickets'} action={handleGoBack} />
            </View>

            <View style={styles.ticketContainer}>
                <ImageBackground source={{ uri: ticketData?.ticketImage }} style={styles.ticketBGImage}>
                    <LinearGradient colors={['rgba(27, 26, 85, 0)', '#1B1A55']} style={styles.linearGradient}>
                        <View style={[styles.blackCircle, { position: 'absolute', bottom: -40, left: -40 }]} />
                        <View style={[styles.blackCircle, { position: 'absolute', bottom: -40, right: -40 }]} />
                    </LinearGradient>
                </ImageBackground>
                <View style={styles.linear} />

                <View style={styles.ticketFooter}>
                    <View style={[styles.blackCircle, { position: 'absolute', top: -40, left: -40 }]} />
                    <View style={[styles.blackCircle, { position: 'absolute', top: -40, right: -40 }]} />
                    <View style={styles.ticketDateContainer}>
                        <View style={styles.subtitleContainer}>
                            <Text style={styles.dateTitle}>11 Feb</Text>
                            <Text style={styles.subtitle}>Saturday</Text>
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
                style={[styles.button, isLoading && styles.buttonDisabled]} // Disable button style when loading
                onPress={handleSubmit}
                disabled={isLoading} // Disable button while loading
            >
                {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" /> // Show loading spinner
                ) : (
                    <Text style={styles.buttonText}>Buy the Ticket</Text> // Show button text
                )}
            </TouchableOpacity>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
    },
    button: {
        backgroundColor: '#13123b',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#535C91',
        marginHorizontal: 80,
        marginBottom: 40,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50, // Fixed height for consistency
    },
    buttonDisabled: {
        opacity: 0.7, // Reduce opacity when disabled
    },
    buttonText: {
        borderRadius: BORDERRADIUS.radius_25,
        paddingVertical: 10,
        fontFamily: 'Poppins-Regular',
        fontSize: FONTSIZE.size_16,
        color: '#FFFFFF',
    },
    appHeaderContainer: {
        marginHorizontal: SPACING.space_36,
        marginTop: SPACING.space_20 * 2,
    },
    ticketContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    ticketBGImage: {
        alignSelf: 'center',
        width: 310,
        aspectRatio: 200 / 300,
        borderTopLeftRadius: BORDERRADIUS.radius_25,
        borderTopRightRadius: BORDERRADIUS.radius_25,
        overflow: 'hidden',
        justifyContent: 'flex-end',
    },
    linearGradient: {
        height: '50%',
    },
    linear: {
        borderTopColor: '#070F2B',
        borderTopWidth: 3,
        width: 310,
        alignSelf: 'center',
        backgroundColor: '#1B1A55',
        borderStyle: 'dashed',
    },
    ticketFooter: {
        backgroundColor: '#1B1A55',
        width: 310,
        alignItems: 'center',
        paddingBottom: SPACING.space_36,
        alignSelf: 'center',
        borderBottomLeftRadius: BORDERRADIUS.radius_25,
        borderBottomRightRadius: BORDERRADIUS.radius_25,
    },
    ticketDateContainer: {
        flexDirection: 'row',
        gap: SPACING.space_36,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: SPACING.space_10,
    },
    ticketSeatContainer: {
        flexDirection: 'row',
        gap: SPACING.space_36,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: SPACING.space_10,
    },
    dateTitle: {
        fontFamily: 'Poppins-Medium',
        fontSize: FONTSIZE.size_24,
        color: '#9290C3',
    },
    subtitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: FONTSIZE.size_14,
        color: '#9290C3',
    },
    subheading: {
        fontFamily: 'Poppins-Medium',
        fontSize: FONTSIZE.size_18,
        color: '#535C91',
    },
    subtitleContainer: {
        alignItems: 'center',
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
});