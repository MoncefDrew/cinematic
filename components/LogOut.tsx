import { supabase } from "@/lib/supabase";
import { Modal, StyleSheet, TouchableOpacity, View, TouchableWithoutFeedback, Alert } from "react-native";
import React, { useState } from "react";
import { Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Matching the cinematic theme colors
const CinematicColors = {
    background: '#0A0B1E',
    surface: '#12132D',
    primary: '#6366F1',
    danger: '#DC2626',
    dangerSoft: '#991B1B',
    border: '#1E2048',
    text: '#FFFFFF',
    textSecondary: '#9B9BC0',
    overlay: 'rgba(10, 11, 30, 0.95)',
    cardBackground: '#181935',
};

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
                activeOpacity={0.7}
            >
                <View style={styles.buttonContent}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="log-out-outline" color={CinematicColors.danger} size={24} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.buttonText}>Sign Out</Text>
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
                                    <View style={styles.warningIconContainer}>
                                        <Ionicons name="warning-outline" size={28} color={CinematicColors.danger} />
                                    </View>
                                    <Text style={styles.modalTitle}>Sign Out</Text>
                                </View>
                                <Text style={styles.modalText}>
                                    Are you sure you want to sign out? You'll need to sign in again to access your account.
                                </Text>
                                <View style={styles.modalButtons}>
                                    <TouchableOpacity
                                        style={styles.cancelButton}
                                        onPress={() => setShowConfirmation(false)}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.cancelButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.logoutButton}
                                        onPress={handleLogout}
                                        activeOpacity={0.8}
                                    >
                                        <Ionicons name="log-out-outline" size={20} color={CinematicColors.text} style={styles.logoutButtonIcon} />
                                        <Text style={styles.logoutButtonText}>Sign Out</Text>
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
        backgroundColor: CinematicColors.cardBackground,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: CinematicColors.border,
        marginHorizontal: 16,
        marginTop: 8,
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconContainer: {
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    buttonText: {
        color: CinematicColors.danger,
        fontSize: 16,
        fontFamily: "Satoshi",
        fontWeight: "600",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: CinematicColors.overlay,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: CinematicColors.surface,
        borderRadius: 24,
        padding: 24,
        width: '85%',
        maxWidth: 400,
        borderWidth: 1,
        borderColor: CinematicColors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 16,
    },
    warningIconContainer: {
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        padding: 8,
        borderRadius: 12,
    },
    modalTitle: {
        color: CinematicColors.text,
        fontSize: 24,
        fontFamily: "Satoshi",
        fontWeight: "700",
    },
    modalText: {
        color: CinematicColors.textSecondary,
        fontSize: 16,
        fontFamily: "Satoshi",
        lineHeight: 24,
        marginBottom: 28,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    cancelButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 1,
        borderColor: CinematicColors.border,
    },
    cancelButtonText: {
        color: CinematicColors.textSecondary,
        fontSize: 16,
        fontFamily: "Satoshi",
        fontWeight: "600",
    },
    logoutButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        backgroundColor: CinematicColors.danger,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutButtonIcon: {
        marginRight: 8,
    },
    logoutButtonText: {
        color: CinematicColors.text,
        fontSize: 16,
        fontFamily: "Satoshi",
        fontWeight: "600",
    },
});