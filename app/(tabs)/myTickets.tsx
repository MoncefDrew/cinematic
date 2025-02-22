// pages/MyTickets.js
import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StatusBar,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    useWindowDimensions,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppHeader from '@/components/AppHeader';
import { BORDERRADIUS, FONTSIZE } from "@/theme/theme";
import { useTicketStore } from "@/api/store/TicketStore";
import Ticket from '@/components/Ticket';
import QrModal from '@/components/QrModal';

export default function MyTickets({ navigation }:any) {
    const { tickets, fetchTickets } = useTicketStore();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const scrollViewRef = useRef(null);
    const { width } = useWindowDimensions();

    const TICKET_WIDTH = width < 768 ? width * 0.75 : width * 0.5;

    useEffect(() => {
        const loadTickets = async () => {
            try {
                await fetchTickets();
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadTickets();
    }, [fetchTickets]);

    const handleScroll = (event) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffset / (TICKET_WIDTH + 40));
        setCurrentIndex(index);
    };

    const scrollToTicket = (index) => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToOffset({
                offset: index * (TICKET_WIDTH + 40) + 20,
                animated: true
            });
        }
    };

    const handleTicketPress = (ticket) => {
        setSelectedTicket(ticket);
        setModalVisible(true);
    };

    const getFormattedDate = (dateString) => {
        try {
            const rawDate = dateString;
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

    const getFormattedTime = (ticket) => {
        try {
            const timeStr = ticket?.projection?.start_time;
            if (!timeStr) return 'N/A';

            const [hoursStr, minutesStr] = timeStr.split(':');
            if (!hoursStr || !minutesStr) return timeStr;

            const hours = parseInt(hoursStr, 10);
            const minutes = parseInt(minutesStr, 10);

            if (isNaN(hours) || isNaN(minutes)) return timeStr;

            const period = hours >= 12 ? 'PM' : 'AM';
            const hours12 = hours % 12 || 12;

            return `${hours12}:${minutesStr.padStart(2, '0')} ${period}`;
        } catch (error) {
            console.error('Time formatting error:', error);
            return ticket?.projection?.start_time || 'N/A';
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <LinearGradient
                    colors={['#02040a', '#030314']}
                    style={styles.container}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                >
                    <AppHeader header={'My tickets'} name="Home" transparent={true}/>
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
                    <AppHeader header={'My tickets'} name="Home" transparent={true}/>
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
                <AppHeader header={'My tickets'} name="close" transparent={true}/>

                <QrModal
                    visible={modalVisible}
                    ticket={selectedTicket}
                    onClose={() => setModalVisible(false)}
                />

                <View style={styles.pagination}>
                    {tickets?.map((_, index) => (
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
                        {tickets.map((ticket, index) => (
                            <Ticket
                                key={ticket?.ticket_id || index}
                                ticket={ticket}
                                width={TICKET_WIDTH}
                                onPress={handleTicketPress}
                                getFormattedDate={getFormattedDate}
                                getFormattedTime={getFormattedTime}
                            />
                        ))}
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
    container: {
        flex: 1,
        backgroundColor: '#030314',
    },
    scrollContainer: {
        alignItems: 'center',
        paddingBottom: 20,
        paddingHorizontal: 20,
        alignSelf: 'flex-start',
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