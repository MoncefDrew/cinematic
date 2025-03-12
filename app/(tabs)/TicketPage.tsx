import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import AppHeader from '@/components/AppHeader';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import {useFonts} from 'expo-font';
import {useSeatStore} from '@/api/store/seatsStore';
import {useTicketStore} from '@/api/store/TicketStore';
import {BORDERRADIUS, FONTSIZE, SPACING} from "@/theme/theme";
import {useRouter} from "expo-router";
import Toast from 'react-native-toast-message';

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
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Format date to show day and date
    const getFormattedDate = () => {
        try {
            const rawDate = route.params.projection_date;
            if (!rawDate) return { day: 'N/A', date: '' };

            const dateObj = new Date(rawDate);
            if (isNaN(dateObj.getTime())) return { day: rawDate, date: '' };

            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            const dayName = days[dateObj.getDay()];
            const monthName = months[dateObj.getMonth()];
            const dayNum = dateObj.getDate();

            return {
                day: dayName,
                date: `${monthName} ${dayNum}`
            };
        } catch (error) {
            console.error('Date formatting error:', error);
            return { day: 'N/A', date: '' };
        }
    };

    // Format time to include AM/PM
    const getFormattedTime = () => {
        try {
            const timeStr = route.params.projection_time;
            if (!timeStr) return 'N/A';

            // Handle HH:MM format
            const [hoursStr, minutesStr] = timeStr.split(':');
            if (!hoursStr || !minutesStr) return timeStr;

            const hours = parseInt(hoursStr, 10);
            const minutes = parseInt(minutesStr, 10);

            if (isNaN(hours) || isNaN(minutes)) return timeStr;

            // Convert to 12-hour format with AM/PM
            const period = hours >= 12 ? 'PM' : 'AM';
            const hours12 = hours % 12 || 12; // Convert 0 to 12

            return `${hours12}:${minutesStr.padStart(2, '0')} ${period}`;
        } catch (error) {
            console.error('Time formatting error:', error);
            return route.params.projection_time || 'N/A';
        }
    };

    useEffect(() => {
        if (route.params) {
            setTicketData(route.params);
        }
    }, [route.params]);

    const handleGoBack = useCallback(() => {
        try {
            navigation.goBack()
        } catch (error) {
            console.error('Navigation error:', error);
            navigation.goBack();
        }
    }, [navigation, ticketData]);

    const handleSubmit = async () => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            // Run operations concurrently
            await Promise.all([
                createTicket(route.params.projection_id, seatNumber,route.params.movieData.title),
                reserveSeat(route.params.projection_id, seatNumber)
            ]);

            console.log('Ticket created successfully');
            navigation.navigate('MainTabs');
        } catch (error) {
            console.error('Error submitting ticket:', error);
        } finally {
            setIsLoading(false);
            Toast.show({
                      type: "success",
                      text1: `Ticket Reserved Successfully`, 
                      visibilityTime: 3000,
                      position: "top",
                      topOffset: 50,
                    })
        }
    };

    if (!fontsLoaded || !ticketData) {
        return (
            <View style={styles.container}>
                <StatusBar hidden />
                <AppHeader name="back" header={'My Ticket'} action={handleGoBack} transparent={true} />
            </View>
        );
    }

    // Get formatted date parts
    const { day, date } = getFormattedDate();
    const formattedTime = getFormattedTime();

    // Get movie title
    const movieTitle = ticketData?.movie?.title || ticketData?.movieData?.title || "hello";




    return (
        <LinearGradient colors={['#02040a', '#030314']} style={styles.container} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
            <StatusBar hidden />
            <AppHeader name="close" header={'Tickets'} action={handleGoBack} transparent={true}/>

            <View style={styles.ticketContainer}>
                <ImageBackground source={{ uri: ticketData?.ticketImage }} style={styles.ticketBGImage}>
                    <LinearGradient colors={['rgba(27, 26, 85, 0)', '#1B1A55']} style={styles.linearGradient}>
                        <View style={[styles.blackCircle, { position: 'absolute', bottom: -40, left: -40 }]} />
                        <View style={[styles.blackCircle, { position: 'absolute', bottom: -40, right: -40 }]} />
                        <View style={{
                            position: 'absolute', // Position the container absolutely
                            bottom: 0, // Align to the bottom
                            left: 0, // Stretch across the screen
                            right: 0,
                            alignItems: 'center', // Center the content horizontally
                            padding: 20,
                        }}>
                            <Text style={{fontFamily: 'Poppins-Medium',
                                fontSize: 24,
                                textAlign:'center',
                                color: '#b0aed2',}}>{movieTitle}</Text>
                        </View>
                    </LinearGradient>
                </ImageBackground>
                <View style={styles.linear} />

                <View style={styles.ticketFooter}>
                    <View style={[styles.blackCircle, { position: 'absolute', top: -40, left: -40 }]} />
                    <View style={[styles.blackCircle, { position: 'absolute', top: -40, right: -40 }]} />

                    <View style={styles.ticketDateContainer}>
                        {/* Updated date display structure */}
                        <View style={styles.subtitleContainer}>
                            <Text style={styles.dateTitle}>{day}</Text>
                            <Text style={styles.subtitle}>{date}</Text>
                        </View>

                        {/* Updated time display */}
                        <View style={styles.subtitleContainer}>
                            <Ionicons name="time-outline" style={styles.clockIcon} />
                            <Text style={styles.subtitle}>{formattedTime}</Text>
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
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text style={styles.buttonText}>Buy the Ticket</Text>
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
        height: '60%',
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


