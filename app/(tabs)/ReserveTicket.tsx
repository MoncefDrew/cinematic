import React, {useState} from 'react';
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    StatusBar,
    ImageBackground,
    TouchableOpacity,
    FlatList,
    ToastAndroid,
} from 'react-native';
import {
    BORDERRADIUS,
    COLORS,
    FONTFAMILY,
    FONTSIZE,
    SPACING,
} from '@/theme/theme';
import {LinearGradient} from "expo-linear-gradient";
import AppHeader from '@/components/AppHeader';
import CustomIcon from '@/components/CustomIcon';
import {Ionicons} from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {useFonts} from "expo-font";

const time ='19:00' ;

const generateDate = () => {
    const date = new Date();
    let weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let weekdays = [];
    for (let i = 0; i < 7; i++) {
        let tempDate = {
            date: new Date(date.getTime() + i * 24 * 60 * 60 * 1000).getDate(),
            day: weekday[new Date(date.getTime() + i * 24 * 60 * 60 * 1000).getDay()],
        };
        weekdays.push(tempDate);
    }
    return weekdays;
};

const generateSeats = () => {
    let numRow = 8;
    let numColumn = 3;
    let rowArray = [];
    let start = 1;
    let reachnine = false;

    for (let i = 0; i < numRow; i++) {
        let columnArray = [];
        for (let j = 0; j < numColumn; j++) {
            let seatObject = {
                number: start,
                taken: Boolean(Math.round(Math.random())),
                selected: false,
            };
            columnArray.push(seatObject);
            start++;
        }
        if (i == 3) {
            numColumn += 2;
        }
        if (numColumn < 9 && !reachnine) {
            numColumn += 2;
        } else {
            reachnine = true;
            numColumn -= 2;
        }
        rowArray.push(columnArray);
    }
    return rowArray;
};

export default function ReserveTicket ({navigation, route}: any){
    const [price, setPrice] = useState<number>(0);
    const [twoDSeatArray, setTwoDSeatArray] = useState<any[][]>(generateSeats());
    const [selectedSeatArray, setSelectedSeatArray] = useState([]);
    const [fontsLoaded] = useFonts({
        "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-Medium": require("../../assets/fonts/Poppins-Medium.ttf"),
        "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
    });

    if (!fontsLoaded) {
        return null; // or return a loading indicator
    }
    console.log(route);

    const selectSeat = (index: number, subindex: number, num: number) => {
        if (!twoDSeatArray[index][subindex].taken) {
            let array: any = [...selectedSeatArray];
            let temp = [...twoDSeatArray];
            temp[index][subindex].selected = !temp[index][subindex].selected;
            if (!array.includes(num)) {
                array.push(num);
                setSelectedSeatArray(array);
            } else {
                const tempindex = array.indexOf(num);
                if (tempindex > -1) {
                    array.splice(tempindex, 1);
                    setSelectedSeatArray(array);
                }
            }
            setPrice(array.length * 5.0);
            setTwoDSeatArray(temp);
        }
    };

    const BookSeats = async () => {

            navigation.navigate('TicketPage', {
                seatArray: selectedSeatArray,
                ticketImage: route.params.movie.poster_url,
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
                                header={''}
                                action={() => navigation.goBack()}
                            />
                        </View>
                    </LinearGradient>
                </ImageBackground>
                <Text style={styles.screenText}>Screen this side</Text>
            </View>

            <View style={styles.seatContainer}>
                <View style={styles.containerGap20}>
                    {twoDSeatArray?.map((item, index) => {
                        return (
                            <View key={index} style={styles.seatRow}>
                                {item?.map((subitem, subindex) => {
                                    return (
                                        <TouchableOpacity
                                            key={subitem.number}
                                            onPress={() => {
                                                selectSeat(index, subindex, subitem.number);
                                            }}>
                                            <MaterialIcons
                                                name="chair"
                                                style={[
                                                    styles.seatIcon,
                                                    subitem.taken ? {color: COLORS.Grey} : {},
                                                    subitem.selected ? {color: COLORS.Orange} : {},
                                                ]}
                                            />
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        );
                    })}
                </View>
                <View style={styles.seatRadioContainer}>
                    <View style={styles.radioContainer}>
                        <MaterialIcons name="chair" style={styles.radioIcon} />
                        <Text style={styles.radioText}>Available</Text>
                    </View>
                    <View style={styles.radioContainer}>
                        <MaterialIcons
                            name="chair"
                            style={[styles.radioIcon, {color: COLORS.Grey}]}
                        />
                        <Text style={styles.radioText}>Taken</Text>
                    </View>
                    <View style={styles.radioContainer}>
                        <MaterialIcons
                            name="chair"
                            style={[styles.radioIcon, {color: COLORS.Orange}]}
                        />
                        <Text style={styles.radioText}>Selected</Text>
                    </View>
                </View>
            </View>

            <View>

            </View>



            <View style={styles.buttonPriceContainer}>
                <View style={styles.priceContainer}>
                    <Text style={styles.totalPriceText}>Total Price</Text>
                    <Text style={styles.price}>$ {price}.00</Text>
                </View>
                <TouchableOpacity onPress={BookSeats}>
                    <Text style={styles.buttonText}>Buy Tickets</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        display: "flex",
        flex: 1,
        backgroundColor: COLORS.Black,
    },
    ImageBG: {
        width: "100%",
        aspectRatio: 3072 / 1727,
    },
    linearGradient: {
        height: "100%",
    },
    appHeaderContainer: {
        marginHorizontal: SPACING.space_36,
        marginTop: SPACING.space_20 * 2,
    },
    screenText: {
        textAlign: "center",
        fontFamily: "Poppins-Regular", // Updated to Poppins-Regular
        fontSize: FONTSIZE.size_10,
        color: COLORS.WhiteRGBA15,
    },
    seatContainer: {
        marginVertical: SPACING.space_20,
    },
    containerGap20: {
        gap: SPACING.space_20,
    },
    seatRow: {
        flexDirection: "row",
        gap: SPACING.space_20,
        justifyContent: "center",
    },
    seatIcon: {
        fontSize: FONTSIZE.size_24,
        color: COLORS.White,
    },
    seatRadioContainer: {
        flexDirection: "row",
        marginTop: SPACING.space_36,
        marginBottom: SPACING.space_10,
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    radioContainer: {
        flexDirection: "row",
        gap: SPACING.space_10,
        alignItems: "center",
    },
    radioIcon: {
        fontSize: FONTSIZE.size_20,
        color: COLORS.White,
    },
    radioText: {
        fontFamily: "Poppins-Medium", // Updated to Poppins-Medium
        fontSize: FONTSIZE.size_12,
        color: COLORS.White,
    },
    containerGap24: {
        gap: SPACING.space_24,
    },
    dateContainer: {
        width: SPACING.space_10 * 7,
        height: SPACING.space_10 * 10,
        borderRadius: SPACING.space_10 * 10,
        backgroundColor: COLORS.DarkGrey,
        alignItems: "center",
        justifyContent: "center",
    },
    dateText: {
        fontFamily: "Poppins-Medium", // Updated to Poppins-Medium
        fontSize: FONTSIZE.size_24,
        color: COLORS.White,
    },
    dayText: {
        fontFamily: "Poppins-Regular", // Updated to Poppins-Regular
        fontSize: FONTSIZE.size_12,
        color: COLORS.White,
    },
    OutterContainer: {
        marginVertical: SPACING.space_24,
    },
    timeContainer: {
        paddingVertical: SPACING.space_10,
        borderWidth: 1,
        borderColor: COLORS.WhiteRGBA50,
        paddingHorizontal: SPACING.space_20,
        borderRadius: BORDERRADIUS.radius_25,
        backgroundColor: COLORS.DarkGrey,
        alignItems: "center",
        justifyContent: "center",
    },
    timeText: {
        fontFamily: "Poppins-Regular", // Updated to Poppins-Regular
        fontSize: FONTSIZE.size_14,
        color: COLORS.White,
    },
    buttonPriceContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 60,
        paddingBottom: SPACING.space_24,
    },
    priceContainer: {
        alignItems: "center",
    },
    totalPriceText: {
        fontFamily: "Poppins-Regular", // Updated to Poppins-Regular
        fontSize: FONTSIZE.size_14,
        color: COLORS.Grey,
    },
    price: {
        fontFamily: "Poppins-Medium", // Updated to Poppins-Medium
        fontSize: FONTSIZE.size_24,
        color: COLORS.White,
    },
    buttonText: {
        borderRadius: BORDERRADIUS.radius_25,
        paddingHorizontal: SPACING.space_24,
        paddingVertical: SPACING.space_10,
        fontFamily: "Poppins-SemiBold", // Updated to Poppins-SemiBold
        fontSize: FONTSIZE.size_16,
        color: COLORS.White,
        backgroundColor: COLORS.Orange,
    },
});

