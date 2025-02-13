import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StatusBar,
    StyleSheet,
    ImageBackground,
    ScrollView,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '@/components/AppHeader';
import { BORDERRADIUS, FONTSIZE, SPACING } from "@/theme/theme";
import { useTicketStore } from "@/api/store/TicketStore";

const { width } = Dimensions.get('window');
const TICKET_WIDTH = width * 0.8;

// @ts-ignore
export default function MyTickets  ({ navigation,route }){
    const { tickets, fetchTickets } = useTicketStore();
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        fetchTickets().then(r => console.log(r));
    }, [fetchTickets]);

    const handleScroll = (event) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffset / (TICKET_WIDTH + 60)); // 60 is total horizontal margin
        setCurrentIndex(index);
    };

    const handleGoBack = () => navigation.goBack();

    // Function to format the date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    // Function to format the duration from "00:02:00" to "2h 0m"
    const formatDuration = (durationString) => {
        const [hours, minutes] = durationString.split(':').map(Number);
        return `${hours}h ${minutes}m`; // Display as "2h 0m"
    };

    const renderTicket = (ticket, index) => (
        <View key={ticket?.ticket_id || index} style={styles.ticketWrapper}>
            <View style={styles.ticketContainer}>
                <ImageBackground
                    source={{ uri: ticket?.projection?.poster_url }}
                    style={styles.ticketBGImage}
                >
                    <LinearGradient
                        colors={['rgba(27, 26, 85, 0)', '#1B1A55']}
                        style={styles.linearGradient}
                    >
                        <View style={[styles.blackCircle, styles.bottomLeftCircle]} />
                        <View style={[styles.blackCircle, styles.bottomRightCircle]} />
                    </LinearGradient>
                </ImageBackground>
                <View style={styles.linear} />

                <View style={styles.ticketFooter}>
                    <View style={[styles.blackCircle, styles.topLeftCircle]} />
                    <View style={[styles.blackCircle, styles.topRightCircle]} />

                    <View style={styles.ticketDateContainer}>
                        <View style={styles.subtitleContainer}>
                            <Text style={styles.dateTitle}>
                                {formatDate(ticket?.projection?.projection_date)}
                            </Text>
                        </View>
                        <View style={styles.subtitleContainer}>
                            <Ionicons name="time-outline" style={styles.clockIcon} />
                            <Text style={styles.subtitle}>
                                {formatDuration(ticket?.projection?.duration)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.ticketSeatContainer}>
                        <View style={styles.subtitleContainer}>
                            <Text style={styles.subheading}>Row</Text>
                            <Text style={styles.subtitle}>02</Text>
                        </View>
                        <View style={styles.subtitleContainer}>
                            <Text style={styles.subheading}>Seat</Text>
                            <Text style={styles.subtitle}>{ticket?.seat?.seatNumber}</Text>
                        </View>

                        <View style={styles.subtitleContainer}>
                            <Text style={styles.subheading}>Time</Text>
                            <Text style={styles.subtitle}>{ticket?.projection.start_time}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <LinearGradient
            colors={['#030314', '#030314']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
        >
            <StatusBar hidden />
            <View style={styles.appHeaderContainer}>
                <AppHeader
                    name="close"
                    header={'My Tickets'}
                    action={handleGoBack}
                />
            </View>

            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {tickets?.map((ticket, index) => renderTicket(ticket, index)) || []}
            </ScrollView>

            <View style={styles.pagination}>
                {tickets?.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.paginationDot,
                            index === currentIndex && styles.paginationDotActive
                        ]}
                    />
                )) || []}
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    appHeaderContainer: {
        marginHorizontal: SPACING.space_36,
        marginTop: SPACING.space_20 * 2,
    },
    scrollContainer: {
        alignItems: 'center',
        paddingHorizontal: width * 0.1, // 10% padding on sides
    },
    ticketWrapper: {
        width: TICKET_WIDTH,
        marginHorizontal: 30,
    },
    ticketContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ticketBGImage: {
        width: TICKET_WIDTH,
        aspectRatio: 200 / 300,
        borderTopLeftRadius: BORDERRADIUS.radius_25,
        borderTopRightRadius: BORDERRADIUS.radius_25,
        overflow: 'hidden',
        justifyContent: 'flex-end',
    },
    linearGradient: {
        height: '50%',
        justifyContent: 'flex-end',
        paddingBottom: 20,
    },
    linear: {
        borderTopColor: '#070F2B',
        borderTopWidth: 3,
        width: TICKET_WIDTH,
        backgroundColor: '#1B1A55',
        borderStyle: 'dashed',
    },
    ticketFooter: {
        backgroundColor: '#1B1A55',
        width: TICKET_WIDTH,
        alignItems: 'center',
        paddingBottom: SPACING.space_36,
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
        fontFamily: 'Poppins',
        fontSize: 20, // Increased font size
        color: '#9290C3',
        fontWeight: '700',
    },
    subtitle: {
        fontFamily: 'Poppins',
        fontSize: FONTSIZE.size_18, // Increased font size
        color: '#9290C3',
    },
    subheading: {
        fontFamily: 'Poppins',
        fontSize: FONTSIZE.size_20, // Increased font size
        color: '#535C91',
        fontWeight: '600',
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
        position: 'absolute',
    },
    bottomLeftCircle: {
        bottom: -40,
        left: -40,
    },
    bottomRightCircle: {
        bottom: -40,
        right: -40,
    },
    topLeftCircle: {
        top: -40,
        left: -40,
    },
    topRightCircle: {
        top: -40,
        right: -40,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
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
});

