import React, {useEffect, useState} from "react";
import {StyleSheet,Text, View} from "react-native";

const UpcomingMovieCountdown = () => {

    const targetDate = new Date('2023-12-25T00:00:00'); // Replace with your movie release date
    const calculateTimeLeft = (target: Date) => {
        const now = new Date();
        const difference = target.getTime() - now.getTime();
        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    };
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(targetDate));
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);



    return (
        <View style={styles.countdownContainer}>
            <Text style={styles.countdownTitle}>Coming Soon: Movie Title</Text>
            <View style={styles.countdownTimer}>
                <Text style={styles.countdownText}>{timeLeft.days}d</Text>
                <Text style={styles.countdownText}>{timeLeft.hours}h</Text>
                <Text style={styles.countdownText}>{timeLeft.minutes}m</Text>
                <Text style={styles.countdownText}>{timeLeft.seconds}s</Text>
            </View>
        </View>
    );
};

// Add this to your styles
const styles = StyleSheet.create({
    countdownContainer: {
        backgroundColor: 'rgba(27, 26, 85, 0.7)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        alignItems: 'center',
    },
    countdownTitle: {
        color: "#9290C3",
        fontSize: 18,
        fontFamily: "Satoshi",
        fontWeight: "700",
        marginBottom: 12,
    },
    countdownTimer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    countdownText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontFamily: "Satoshi",
    },
});