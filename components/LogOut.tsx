import { supabase } from "@/lib/supabase";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function LogOut(props: any) {
    return (
        <TouchableOpacity
            onPress={async () => {
                const { error } = await supabase.auth.signOut();
                if (error) {
                    Alert.alert("Error", error.message);
                } else {
                    Alert.alert("Logged Out", "You have successfully logged out!");
                    props.navigation.navigate("Landing"); // Navigate to the Landing page
                }
            }}
            style={styles.buttonContainer}
        >
            <View style={styles.buttonContent}>
                {/* Icon Flex */}
                <View style={styles.iconContainer}>
                    <Ionicons name="exit" color="#FF3B30" size={26} />
                </View>
                {/* Text Flex */}
                <View style={styles.textContainer}>
                    <Text style={styles.buttonText}>Log Out</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: "transparent",
        paddingVertical:11,
        paddingLeft:18,
        paddingRight:16,
        borderRadius: 6,
        borderWidth: 0,
        justifyContent: "flex-start", // Align items at the start
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center", // Ensure icon and text are aligned vertically
    },
    iconContainer: {
        justifyContent: "flex-start", // Align icon at the start
        marginRight: 32, // Space between the icon and text
    },
    textContainer: {
        justifyContent: "flex-start", // Align text at the start
    },
    buttonText: {
        color: "#FF3B30",
        fontSize: 15, // Optional: Adjust the title font size
        fontWeight: 'normal',
    },
});
