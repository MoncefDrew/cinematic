// components/Ticket/Ticket.js
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BORDERRADIUS, FONTSIZE, SPACING } from "@/theme/theme";

const Ticket = ({ ticket, width, onPress, getFormattedDate, getFormattedTime }:any) => {
    return (
        <TouchableOpacity
            style={styles.ticketWrapper}
            onPress={() => onPress(ticket)}
        >
            <View style={[styles.ticketContainer, { width }]}>
                <ImageBackground
                    source={{ uri: ticket?.projection?.poster_url }}
                    style={[styles.ticketBGImage, { width }]}
                >
                    <LinearGradient
                        colors={['rgba(27, 26, 85, 0)', '#16143d']}
                        style={styles.linearGradient}
                    >
                        <View style={[styles.blackCircle, styles.bottomLeftCircle]} />
                        <View style={[styles.blackCircle, styles.bottomRightCircle]} />
                        <View style={styles.titleContainer}>
                            <Text style={styles.movieTitleText}>{ticket?.projection?.movie?.title}</Text>
                        </View>
                    </LinearGradient>
                </ImageBackground>

                <View style={[styles.linear, { width }]} />

                <View style={[styles.ticketFooter, { width }]}>
                    <View style={[styles.blackCircle, styles.topLeftCircle]} />
                    <View style={[styles.blackCircle, styles.topRightCircle]} />

                    <View style={styles.ticketDateContainer}>
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
};

const styles = StyleSheet.create({
    ticketWrapper: {
        marginHorizontal: 15,
        alignItems: 'center',
    },
    ticketContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20
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
    titleContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        padding: 20,
    },
    movieTitleText: {
        fontFamily: 'Poppins',
        fontSize: 24,
        textAlign: 'center',
        color: '#b0aed2',
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
});

export default Ticket;