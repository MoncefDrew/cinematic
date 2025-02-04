import { supabase } from "@/lib/supabase";
import {Modal, StyleSheet, TouchableOpacity, View, TouchableWithoutFeedback, Alert} from "react-native";
import React, { useState } from "react";
import { Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function LogOut(props: any) {
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            Alert.alert("Error", error.message);
        } else {
            setShowConfirmation(false);
            props.navigation.navigate("Landing");
        }
    };

    return (
        <>
            <TouchableOpacity
                onPress={() => setShowConfirmation(true)}
                style={styles.buttonContainer}
            >
                <View style={styles.buttonContent}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="exit" color="#EF4444" size={26} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.buttonText}>Log Out</Text>
                    </View>
                </View>
            </TouchableOpacity>

            <Modal
                visible={showConfirmation}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowConfirmation(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowConfirmation(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContainer}>
                                <View style={styles.modalHeader}>
                                    <Ionicons name="warning" size={28} color="#EF4444" />
                                    <Text style={styles.modalTitle}>Confirm Logout</Text>
                                </View>
                                <Text style={styles.modalText}>
                                    Are you sure you want to log out? You'll need to sign in again to access your account.
                                </Text>
                                <View style={styles.modalButtons}>
                                    <TouchableOpacity
                                        style={styles.cancelButton}
                                        onPress={() => setShowConfirmation(false)}
                                    >
                                        <Text style={styles.cancelButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.logoutButton}
                                        onPress={handleLogout}
                                    >
                                        <Text style={styles.logoutButtonText}>Log Out</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: "#1F2937",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#374151",
        justifyContent: "flex-start",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconContainer: {
        justifyContent: "flex-start",
        marginRight: 32,
    },
    textContainer: {
        justifyContent: "flex-start",
    },
    buttonText: {
        color: "#EF4444",
        fontSize: 16,
        fontWeight: "500",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: "#1F2937",
        borderRadius: 12,
        padding: 24,
        width: '80%',
        maxWidth: 400,
        borderWidth: 1,
        borderColor: "#374151",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
        elevation: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    modalTitle: {
        color: "#FFFFFF",
        fontSize: 20,
        fontFamily: "Satoshi",
        fontWeight: "700",
    },
    modalText: {
        color: "#94A3B8",
        fontSize: 16,
        fontFamily: "Satoshi",
        lineHeight: 24,
        marginBottom: 24,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    cancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 6,
        backgroundColor: "#374151",
        borderWidth: 1,
        borderColor: "#4B5563",
    },
    cancelButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontFamily: "Satoshi",
        fontWeight: "600",
    },
    logoutButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 6,
        backgroundColor: "#EF4444",
    },
    logoutButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontFamily: "Satoshi",
        fontWeight: "600",
    },
});