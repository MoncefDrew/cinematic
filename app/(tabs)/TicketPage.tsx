import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    StatusBar,
    ImageBackground,
    Image,
} from 'react-native';
import AppHeader from '@/components/AppHeader';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '@/theme/theme';
import CustomIcon from '@/components/CustomIcon';
import {useNavigation, useRouter} from "expo-router";
import {LinearGradient} from "expo-linear-gradient";
import {Ionicons} from "@expo/vector-icons";
import {StackNavigationProp} from "@react-navigation/stack";
import {Movie, RootStackParamList} from "@/constants/Movie";
import MovieDetails from "@/app/(tabs)/MovieDetails";
import {RouteProp} from "@react-navigation/native";

type NavigationProp = StackNavigationProp<RootStackParamList, 'ReserveTicket'>;
type MovieDetailsRouteProp = RouteProp<RootStackParamList, "MovieDetails">;
// Props interface for the ReserveTicket component
type MovieDetailsProps = {
    route: MovieDetailsRouteProp;
};

export default function TicketPage(Movie:MovieDetailsProps) {

    const navigation = useNavigation<NavigationProp>();
    const movieDetails = Movie.route.params;

    // Dynamic ticket data
    const ticketData = {
        ticketImage: movieDetails.movie.poster_url,
        //Projection date
        date: { date: '22 Jan 2025', day: 'Wednesday' },
        time: '7:30 PM',
        //seat number
        seat: 'A1',
    };
    const router = useRouter()
    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <View style={styles.appHeaderContainer}>
                <AppHeader name="arrow-back-outline" header={'Ticket'} action={() => navigation.navigate("ReserveTicket",Movie)} />
            </View>

            <View style={styles.ticketContainer}>
                <ImageBackground source={{ uri: ticketData.ticketImage }} style={styles.ticketBGImage}>
                    <LinearGradient colors={[COLORS.OrangeRGBA0, '#181b20']} style={styles.linearGradient}>
                        <View style={[styles.blackCircle, { position: 'absolute', bottom: -40, left: -40 }]} />
                        <View style={[styles.blackCircle, { position: 'absolute', bottom: -40, right: -40 }]} />
                    </LinearGradient>
                </ImageBackground>
                <View style={styles.linear}></View>

                <View style={styles.ticketFooter}>
                    <View style={[styles.blackCircle, { position: 'absolute', top: -40, left: -40 }]} />
                    <View style={[styles.blackCircle, { position: 'absolute', top: -40, right: -40 }]} />
                    <View style={styles.ticketDateContainer}>
                        <View style={styles.subtitleContainer}>
                            <Text style={styles.dateTitle}>{ticketData.date.date}</Text>
                            <Text style={styles.subtitle}>{ticketData.date.day}</Text>
                        </View>
                        <View style={styles.subtitleContainer}>
                            <Ionicons name="time-outline" size={20} color="white" style={styles.clockIcon} />
                            <Text style={styles.subtitle}>{ticketData.time}</Text>
                        </View>
                    </View>
                    <View style={styles.ticketSeatContainer}>
                        <View style={styles.subtitleContainer}>
                            <Text style={styles.subheading}>Hall</Text>
                            <Text style={styles.subtitle}>02</Text>
                        </View>
                        <View style={styles.subtitleContainer}>
                            <Text style={styles.subheading}>Row</Text>
                            <Text style={styles.subtitle}>04</Text>
                        </View>
                        <View style={styles.subtitleContainer}>
                            <Text style={styles.subheading}>Seats</Text>
                            <Text style={styles.subtitle}>
                                {ticketData.seat}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        backgroundColor: COLORS.Black,
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
        width: 300,
        aspectRatio: 200 / 300,
        borderTopLeftRadius: BORDERRADIUS.radius_25,
        borderTopRightRadius: BORDERRADIUS.radius_25,
        overflow: 'hidden',
        justifyContent: 'flex-end',
    },
    linearGradient: {
        height: '70%',
    },
    linear: {
        borderTopColor: COLORS.Black,
        borderTopWidth: 3,
        width: 300,
        alignSelf: 'center',
        backgroundColor: '#181b20',
        borderStyle: 'dashed',
    },
    ticketFooter: {
        backgroundColor: '#181b20',
        width: 300,
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
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_24,
        color: COLORS.White,
    },
    subtitle: {
        fontFamily: FONTFAMILY.poppins_regular,
        fontSize: FONTSIZE.size_14,
        color: COLORS.White,
    },
    subheading: {
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_18,
        color: COLORS.White,
    },
    subtitleContainer: {
        alignItems: 'center',
    },
    clockIcon: {
        fontSize: FONTSIZE.size_24,
        color: COLORS.White,
        paddingBottom: SPACING.space_10,
    },
    barcodeImage: {
        height: 50,
        aspectRatio: 158 / 52,
    },
    blackCircle: {
        height: 80,
        width: 80,
        borderRadius: 80,
        backgroundColor: COLORS.Black,
    },
});

