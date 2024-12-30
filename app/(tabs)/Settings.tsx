import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch } from "react-native";
import { useState } from "react";

export default function Settings() {
    const [notifications, setNotifications] = useState(true);
    const [emailUpdates, setEmailUpdates] = useState(true);
    const [darkMode, setDarkMode] = useState(true);

    const renderSetting = (
        icon: string,
        title: string,
        value: boolean,
        onToggle: (value: boolean) => void,
        description?: string
    ) => (
        <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
                <Ionicons name={icon as any} size={24} color="#4caf50" />
                <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>{title}</Text>
                    {description && <Text style={styles.settingDescription}>{description}</Text>}
                </View>
            </View>
            <Switch value={value} onValueChange={onToggle} ios_backgroundColor="#3e3e3e" />
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notifications</Text>
                {renderSetting(
                    "notifications-outline",
                    "Push Notifications",
                    notifications,
                    setNotifications,
                    "Get notified about movie releases and showtime reminders"
                )}
                {renderSetting(
                    "mail-outline",
                    "Email Updates",
                    emailUpdates,
                    setEmailUpdates,
                    "Receive promotional offers and newsletters"
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preferences</Text>
                {renderSetting(
                    "moon-outline",
                    "Dark Mode",
                    darkMode,
                    setDarkMode,
                    "Switch between light and dark themes"
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account</Text>
                <TouchableOpacity style={styles.button}>
                    <Ionicons name="person-outline" size={24} color="#4caf50" />
                    <Text style={styles.buttonText}>Change Password</Text>
                    <Ionicons name="chevron-forward" size={24} color="#4caf50" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.button}>
                    <Ionicons name="card-outline" size={24} color="#4caf50" />
                    <Text style={styles.buttonText}>Payment Methods</Text>
                    <Ionicons name="chevron-forward" size={24} color="#4caf50" />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.logoutButton]}>
                    <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
                    <Text style={[styles.buttonText, styles.logoutText]}>Logout</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#14171C',
    },
    section: {
        padding: 16,
        marginBottom: 8,
    },
    sectionTitle: {
        color: '#888',
        fontSize: 16,
        marginBottom: 16,
        marginLeft: 4,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1A1D24',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingText: {
        marginLeft: 12,
        flex: 1,
    },
    settingTitle: {
        color: '#FFF',
        fontSize: 16,
    },
    settingDescription: {
        color: '#888',
        fontSize: 14,
        marginTop: 4,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1D24',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        flex: 1,
        marginLeft: 12,
    },
    logoutButton: {
        marginTop: 16,
    },
    logoutText: {
        color: '#FF3B30',
    },
});