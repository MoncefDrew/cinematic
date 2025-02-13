import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // For icons

const BaridiMobilePayment = ({navigation, route}: any) => {
    // Example ticket details passed via navigation

    const movieName = "inter"
    const showTime = "9:30"
    const ticketPrice = 100
    // State for Baridi Mobile phone number
    const [phoneNumber, setPhoneNumber] = useState('');

    // Validate phone number
    const validatePhoneNumber = (number: string) => {
        const regex = /^\+?\d{10,12}$/; // Basic validation for phone numbers
        return regex.test(number);
    };

    // Handle payment confirmation
    const handlePayment = () => {
        if (!validatePhoneNumber(phoneNumber)) {
            Alert.alert('Invalid Phone Number', 'Please enter a valid Baridi Mobile phone number.');
            return;
        }

        // Simulate payment processing
        Alert.alert(
            'Payment Successful',
            `Your ticket for ${movieName} at ${showTime} has been booked!`,
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
        );
    };

    return (
        <ScrollView style={styles.container}>
            {/* Ticket Details */}
            <View style={styles.ticketDetails}>
                <Text style={styles.movieTitle}>{movieName}</Text>
                <Text style={styles.showTime}>Show Time: {showTime}</Text>
                <Text style={styles.ticketPrice}>Price: KES {ticketPrice}</Text>
            </View>

            {/* Baridi Mobile Payment Form */}
            <View style={styles.paymentForm}>
                <Text style={styles.sectionTitle}>Baridi Mobile Payment</Text>
                <View style={styles.inputContainer}>
                    <Icon name="phone" size={20} color="#94A3B8" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Baridi Mobile Number"
                        placeholderTextColor="#94A3B8"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                    />
                </View>
            </View>

            {/* Pay Button */}
            <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
                <Text style={styles.payButtonText}>Confirm Payment</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111827',
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    ticketDetails: {
        marginBottom: 24,
    },
    movieTitle: {
        color: '#fff',
        fontSize: 24,
        fontFamily: 'Satoshi',
        fontWeight: '700',
        marginBottom: 8,
    },
    showTime: {
        color: '#94A3B8',
        fontSize: 16,
        fontFamily: 'Satoshi',
        marginBottom: 4,
    },
    ticketPrice: {
        color: '#10B981',
        fontSize: 18,
        fontFamily: 'Satoshi',
        fontWeight: '700',
    },
    paymentForm: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Satoshi',
        fontWeight: '700',
        marginBottom: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1F2937',
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#374151',
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: '#fff',
        fontFamily: 'Satoshi',
        fontSize: 16,
        paddingVertical: 16,
    },
    payButton: {
        backgroundColor: '#10B981',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 24,
    },
    payButtonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Satoshi',
        fontWeight: '700',
    },
});

export default BaridiMobilePayment;