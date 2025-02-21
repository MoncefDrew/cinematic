import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StatusBar,
    StyleSheet,
    ImageBackground,
    ScrollView,
    Dimensions,
    SafeAreaView,
    useWindowDimensions,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '@/components/AppHeader';
import { BORDERRADIUS, FONTSIZE, SPACING } from "@/theme/theme";
import { useTicketStore } from "@/api/store/TicketStore";

const TICKET_WIDTH =  250 ;

// @ts-ignore
export default function MyTickets({ navigation }) {
    const { tickets, fetchTickets } = useTicketStore();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const scrollViewRef = useRef(null);
    const { width } = useWindowDimensions();


    const TICKET_WIDTH = width < 768 ? width * 0.75 : width * 0.5;

    useEffect(() => {
        const loadTickets = async () => {
            try {
                await fetchTickets();
            } catch (err) {
                // @ts-ignore
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadTickets();
    }, [fetchTickets]);

    const handleScroll = (event: { nativeEvent: { contentOffset: { x: any; }; }; }) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffset / (TICKET_WIDTH + 40));
        setCurrentIndex(index);
    };

    const scrollToTicket = (index: React.Key | null | undefined) => {
        if (scrollViewRef.current) {
            // @ts-ignore
            scrollViewRef.current.scrollToOffset({
            // @ts-ignore
                offset: index * (TICKET_WIDTH + 40) + 20,
                animated: true
            });
        }
    };

    // Format date to show day and date
    const getFormattedDate = (dateString: any) => {
        try {
            const rawDate =dateString ;
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
    const getFormattedTime = (ticket: { ticket_id?: any; projection: any; seat?: { rowNumber: any; seatNumber: any; }; }) => {
        try {
            const timeStr = ticket?.projection?.start_time;
            if (!timeStr) return 'N/A';

            const [hoursStr, minutesStr] = timeStr.split(':');
            if (!hoursStr || !minutesStr) return timeStr;

            const hours = parseInt(hoursStr, 10);
            const minutes = parseInt(minutesStr, 10);

            if (isNaN(hours) || isNaN(minutes)) return timeStr;

            // Convert to 12-hour format with AM/PM
            const period = hours >= 12 ? 'PM' : 'AM';
            const hours12 = hours % 12 || 12;

            return `${hours12}:${minutesStr.padStart(2, '0')} ${period}`;
        } catch (error) {
            console.error('Time formatting error:', error);
            return ticket?.projection?.start_time || 'N/A';
        }
    };




    const renderTicket = (ticket: { ticket_id: any; projection: { poster_url: any; movie: { title: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }; projection_date: any; hall_number: any; }; seat: { rowNumber: any; seatNumber: any; }; }, index: any) => (
        <TouchableOpacity
            key={ticket?.ticket_id || index}
            style={styles.ticketWrapper}
        >
            <View style={[styles.ticketContainer, { width: TICKET_WIDTH }]}>
                <ImageBackground
                    source={{ uri: ticket?.projection?.poster_url  }}
                    style={[styles.ticketBGImage, { width: TICKET_WIDTH }]}
                >
                    <LinearGradient
                        colors={['rgba(27, 26, 85, 0)', '#16143d']}
                        style={styles.linearGradient}
                    >

                        <View style={[styles.blackCircle, styles.bottomLeftCircle]} />
                        <View style={[styles.blackCircle, styles.bottomRightCircle]} />
                        <View style={{
                            position: 'absolute', // Position the container absolutely
                            bottom: 0, // Align to the bottom
                            left: 0, // Stretch across the screen
                            right: 0,
                            alignItems: 'center', // Center the content horizontally
                            padding: 20,
                        }}>
                            <Text style={{fontFamily: 'Poppins',
                                fontSize: 24,
                                textAlign:'center',
                                color: '#b0aed2',}}>{ticket?.projection?.movie?.title}</Text>
                        </View>
                    </LinearGradient>
                </ImageBackground>

                <View style={[styles.linear, { width: TICKET_WIDTH }]} />

                <View style={[styles.ticketFooter, { width: TICKET_WIDTH }]}>
                    <View style={[styles.blackCircle, styles.topLeftCircle]} />
                    <View style={[styles.blackCircle, styles.topRightCircle]} />

                    <View style={styles.ticketDateContainer}>
                        {/* Updated date display structure */}
                        <View style={styles.subtitleContainer}>
                            <Text style={styles.dateTitle}>{getFormattedDate(ticket?.projection?.projection_date).day}</Text>
                            <Text style={styles.subtitle}>{getFormattedDate(ticket?.projection?.projection_date).date}</Text>
                        </View>
                        <View style={styles.subtitleContainer}>
                            <Ionicons name="time-outline" style={styles.clockIcon} />
                            <Text style={styles.subtitle}>
                                {getFormattedTime(ticket)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.ticketSeatContainer}>
                        <View style={styles.subtitleContainer}>
                            <Text style={styles.subheading}>Row</Text>
                            <Text style={styles.subtitle}>{ticket?.seat?.rowNumber || '02'}</Text>
                        </View>
                        <View style={styles.subtitleContainer}>
                            <Text style={styles.subheading}>Seat</Text>
                            <Text style={styles.subtitle}>{ticket?.seat?.seatNumber || 'N/A'}</Text>
                        </View>
                        <View style={styles.subtitleContainer}>
                            <Text style={styles.subheading}>Hall</Text>
                            <Text style={styles.subtitle}>{ticket?.projection?.hall_number || 'N/A'}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <LinearGradient
                    colors={['#02040a', '#030314']}
                    style={styles.container}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                >
                    <AppHeader header={'My tickets'} name="Home"  transparent={true}/>
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#9290C3" />
                    </View>
                </LinearGradient>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <LinearGradient
                    colors={['#02040a', '#030314']}
                    style={styles.container}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                >
                    <StatusBar hidden />
                    <AppHeader header={'My tickets'} name="Home"  transparent={true}/>
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>Error: {error}</Text>
                    </View>
                </LinearGradient>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient
                colors={['#02040a', '#030314']}
                style={styles.container}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            >
                <StatusBar hidden />
                <AppHeader header={'My tickets'} name="close"  transparent={true}/>

                <View style={styles.pagination}>
                    {tickets?.map((_: any, index: React.Key | null | undefined) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => scrollToTicket(index)}
                        >
                            <View
                                style={[
                                    styles.paginationDot,
                                    index === currentIndex && styles.paginationDotActive
                                ]}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                {tickets && tickets.length > 0 ? (
                    <ScrollView
                        ref={scrollViewRef}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContainer}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        decelerationRate="fast"
                        snapToInterval={TICKET_WIDTH + 40}
                        snapToAlignment="center"
                        disableIntervalMomentum={true}
                    >
                        {tickets.map((ticket: any, index: any) => renderTicket(ticket, index))}
                    </ScrollView>
                ) : (
                    <View style={styles.noTicketsContainer}>
                        <Text style={styles.noTicketsText}>No tickets found</Text>
                        <TouchableOpacity
                            style={styles.browseButton}
                            onPress={() => navigation.navigate('Popular')}
                        >
                            <Text style={styles.browseButtonText}>Browse Movies</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#030314',
    },
    scrollContainer: {
        alignItems: 'center',
        paddingBottom: 20,
        paddingHorizontal: 20,
        alignSelf:'flex-start',
    },
    ticketWrapper: {
        width: TICKET_WIDTH,
        marginHorizontal: 50,
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#030314',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontFamily: 'Poppins',
        fontSize: FONTSIZE.size_18,
        color: '#9290C3',
    },

    ticketContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal:20
    },
    ticketBGImage: {
        aspectRatio: 200 / 300,
        borderTopLeftRadius: BORDERRADIUS.radius_25,
        borderTopRightRadius: BORDERRADIUS.radius_25,
        overflow: 'hidden',
        justifyContent: 'flex-end',
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderColor: '#4b45b0',
    },
    linearGradient: {
        height: '50%',
        justifyContent: 'flex-end',
        paddingBottom: 20,
    },
    linear: {
        borderTopColor: '#070F2B',
        borderTopWidth: 3,
        backgroundColor: '#1B1A55',
        borderStyle: 'dashed',
    },
    ticketFooter: {
        backgroundColor: '#16143d',
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#4b45b0',
        alignItems: 'center',
        paddingBottom: 20,
        borderBottomLeftRadius: BORDERRADIUS.radius_25,
        borderBottomRightRadius: BORDERRADIUS.radius_25,
    },
    ticketDateContainer: {
        flexDirection: 'row',
        gap: SPACING.space_36,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: SPACING.space_10,
        flexWrap: 'wrap',
    },
    ticketSeatContainer: {
        flexDirection: 'row',
        gap: SPACING.space_36,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: SPACING.space_10,
        flexWrap: 'wrap',
    },
    dateTitle: {
        fontFamily: 'Poppins',
        fontSize: 18,
        color: '#9290C3',
        fontWeight: '700',
    },
    subtitle: {
        fontFamily: 'Poppins',
        fontSize: 18,
        color: '#9290C3',
    },
    subheading: {
        fontFamily: 'Poppins',
        fontSize: FONTSIZE.size_18,
        color: '#535C91',
        fontWeight: '600',
    },
    subtitleContainer: {
        alignItems: 'center',
        padding: 5,
    },
    clockIcon: {
        fontSize: FONTSIZE.size_24,
        color: '#535C91',
        paddingBottom: SPACING.space_10,
    },
    blackCircle: {
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: '#030314',
        position: 'absolute',
    },
    bottomLeftCircle: {
        bottom: -25,
        left: -25,
    },
    bottomRightCircle: {
        bottom: -25,
        right: -25,
    },
    topLeftCircle: {
        top: -25,
        left: -25,
    },
    topRightCircle: {
        top: -25,
        right: -25,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

        marginBottom: 10,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#535C91',
        marginHorizontal: 4,
    },
    paginationDotActive: {
        backgroundColor: '#9290C3',
        width: 20,
    },
    noTicketsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noTicketsText: {
        fontFamily: 'Poppins',
        fontSize: FONTSIZE.size_18,
        color: '#9290C3',
    },
    browseButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#535C91',
        borderRadius: BORDERRADIUS.radius_10,
    },
    browseButtonText: {
        fontFamily: 'Poppins',
        fontSize: FONTSIZE.size_16,
        color: '#FFFFFF',
    },
});