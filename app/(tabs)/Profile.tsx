import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Modal, TextInput } from "react-native";
import { useState } from "react";
import { Ticket, sampleTickets } from "@/constants/ticket";
import { useAuthStore } from "@/api/store/AuthStore"; // Import the tickets

export default function Profile() {
    // State for toggling visibility of tickets and edit profile modals
    const [showTickets, setShowTickets] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false);

    const auth = useAuthStore();

    // State for managing form data in the edit profile modal
    const [formData, setFormData] = useState({
        username: auth.user.username,
        email: auth.user.email,
    });

    // State for managing the profile photo
    const [profilePhoto, setProfilePhoto] = useState();

    // Function to handle profile photo change
    const handleChangePhoto = () => {
        // Add logic to open image picker and update the profile photo
        // For now, we'll just simulate a photo change
    };

    // User statistics (e.g., movies watched, reviews written)
    const userStats = {
        moviesWatched: 28,
        reviewsWritten: 12
    };

    /**
     * Renders a single ticket item.
     *
     * @param {Ticket} ticket - The ticket data to render.
     * @returns JSX.Element - A styled view representing the ticket.
     */
    const renderTicket = (ticket: Ticket) => (
        <View key={ticket.id} style={styles.ticketItem}>
            <View style={styles.ticketMain}>
                <Ionicons name="ticket-outline" size={24} color="#10B981" />
                <View style={styles.ticketInfo}>
                    <Text style={styles.movieTitle}>{ticket.movieTitle}</Text>
                    <Text style={styles.ticketDetails}>
                        {ticket.date} | {ticket.time} | Seat {ticket.seat}
                    </Text>
                </View>
            </View>
            <Ionicons name="qr-code-outline" size={24} color="#10B981" />
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.profileImageContainer}>
                    <Image source={profilePhoto} style={styles.profileImage} />
                    <TouchableOpacity style={styles.editButton} onPress={() => setShowEditProfile(true)}>
                        <Ionicons name="pencil" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.username}>{formData.username}</Text>
                <Text style={styles.email}>{formData.email}</Text>
            </View>

            {/* User Statistics Section */}
            <View style={styles.statsContainer}>
                {Object.entries(userStats).map(([key, value]) => (
                    <View key={key} style={styles.statItem}>
                        <Ionicons name={key === 'moviesWatched' ? 'film-outline' : 'star-outline'}
                                  size={24} color="#10B981" />
                        <Text style={styles.statNumber}>{value}</Text>
                        <Text style={styles.statLabel}>
                            {key === 'moviesWatched' ? 'Movies Watched' : 'Reviews'}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Menu Options */}
            <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.menuItem} onPress={() => setShowTickets(true)}>
                    <Ionicons name="ticket-outline" size={24} color="#10B981" />
                    <Text style={styles.menuText}>My Tickets</Text>
                    <Ionicons name="chevron-forward" size={24} color="#10B981" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="settings-outline" size={24} color="#10B981" />
                    <Text style={styles.menuText}>Settings</Text>
                    <Ionicons name="chevron-forward" size={24} color="#10B981" />
                </TouchableOpacity>
            </View>

            {/* Tickets Modal */}
            <Modal visible={showTickets} animationType="slide" transparent>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>My Tickets</Text>
                        <TouchableOpacity onPress={() => setShowTickets(false)}>
                            <Ionicons name="close" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                    {sampleTickets.map(renderTicket)} {/* Use imported tickets */}
                </View>
            </Modal>

            {/* Edit Profile Modal */}
            <Modal visible={showEditProfile} animationType="slide" transparent>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Edit Profile</Text>
                        <TouchableOpacity onPress={() => setShowEditProfile(false)}>
                            <Ionicons name="close" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.editProfileContainer}>
                        <View style={styles.imageEditContainer}>
                            <Image source={profilePhoto} style={styles.editProfileImage} />
                            <TouchableOpacity style={styles.changePhotoButton} onPress={handleChangePhoto}>
                                <Ionicons name="camera" size={24} color="#10B981" />
                                <Text style={styles.changePhotoText}>Change Photo</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Username</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.username}
                                onChangeText={(text) => setFormData({...formData, username: text})}
                                placeholderTextColor="#94A3B8"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.email}
                                onChangeText={(text) => setFormData({...formData, email: text})}
                                placeholderTextColor="#94A3B8"
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={() => {
                                // Save changes to AuthStore
                                auth.updateUser({ username: formData.username, email: formData.email });
                                setShowEditProfile(false);
                            }}
                        >
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

/**
 * Styles for the Profile Component
 */
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#111827' },
    header: { alignItems: 'center', padding: 20, paddingTop: 40 },
    profileImageContainer: { position: 'relative' },
    profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
    editButton: { position: 'absolute', right: 0, bottom: 10, backgroundColor: '#10B981', borderRadius: 15, padding: 5 },
    username: { color: '#FFF', fontSize: 24, fontWeight: 'bold', fontFamily: 'Satoshi' },
    email: { color: '#94A3B8', fontSize: 16, fontFamily: 'Satoshi' },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-around', padding: 20, backgroundColor: '#1F2937', marginHorizontal: 15, borderRadius: 12, marginTop: 20 },
    statItem: { alignItems: 'center' },
    statNumber: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginTop: 5, fontFamily: 'Satoshi' },
    statLabel: { color: '#94A3B8', fontSize: 14, fontFamily: 'Satoshi' },
    menuContainer: { padding: 15 },
    menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1F2937', padding: 15, borderRadius: 12, marginBottom: 10 },
    menuText: { color: '#FFF', fontSize: 16, flex: 1, marginLeft: 15, fontFamily: 'Satoshi' },
    modalContent: { backgroundColor: '#111827', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '80%', marginTop: 'auto', borderWidth: 1, borderColor: '#374151' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', fontFamily: 'Satoshi' },
    ticketItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1F2937', padding: 15, borderRadius: 12, marginBottom: 10 },
    ticketMain: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    ticketInfo: { marginLeft: 15, flex: 1 },
    movieTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', fontFamily: 'Satoshi' },
    ticketDetails: { color: '#94A3B8', fontSize: 14, fontFamily: 'Satoshi' },
    editProfileContainer: { padding: 10 },
    imageEditContainer: { alignItems: 'center', marginBottom: 20 },
    editProfileImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 },
    changePhotoButton: { flexDirection: 'row', alignItems: 'center' },
    changePhotoText: { color: '#10B981', marginLeft: 8, fontFamily: 'Satoshi' },
    inputContainer: { marginBottom: 15 },
    inputLabel: { color: '#FFF', marginBottom: 5, fontFamily: 'Satoshi' },
    input: { backgroundColor: '#1F2937', borderRadius: 12, padding: 16, color: '#FFF', fontSize: 16, fontFamily: 'Satoshi', borderWidth: 1, borderColor: '#374151' },
    saveButton: { backgroundColor: '#10B981', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
    saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', fontFamily: 'Satoshi' }
});