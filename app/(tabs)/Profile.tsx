import React, { useState } from 'react';
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Modal, TextInput, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '@/api/store/AuthStore';

export default function Profile() {
    const [showTickets, setShowTickets] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const auth = useAuthStore();
    const [formData, setFormData] = useState({
        username: auth.user.username,
        email: auth.user.email,
    });

    const profilePhoto = auth.user.profilePicture; // Get profile picture from store

    const handleChangePhoto = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to upload a profile picture.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const selectedImage = result.assets[0].uri;
            auth.updateProfilePicture(selectedImage); // Update profile picture in store
        }
    };

    const userStats = {
        moviesWatched: 28,
        reviewsWritten: 12,
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.profileImageContainer}>
                    {profilePhoto ? (
                        <Image source={{ uri: profilePhoto }} style={styles.profileImage} />
                    ) : (
                        <Ionicons name="person-circle-outline" size={100} color="#10B981" />
                    )}
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
                        <Ionicons name={key === 'moviesWatched' ? 'film-outline' : 'star-outline'} size={24} color="#10B981" />
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
                            {profilePhoto ? (
                                <Image source={{ uri: profilePhoto }} style={styles.editProfileImage} />
                            ) : (
                                <Ionicons name="person-circle-outline" size={120} color="#10B981" />
                            )}
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
                                onChangeText={(text) => setFormData({ ...formData, username: text })}
                                placeholderTextColor="#94A3B8"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.email}
                                onChangeText={(text) => setFormData({ ...formData, email: text })}
                                placeholderTextColor="#94A3B8"
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={() => {
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
    editProfileContainer: { padding: 10 },
    imageEditContainer: { alignItems: 'center', marginBottom: 20 },
    editProfileImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 },
    changePhotoButton: { flexDirection: 'row', alignItems: 'center' },
    changePhotoText: { color: '#10B981', marginLeft: 8, fontFamily: 'Satoshi' },
    inputContainer: { marginBottom: 15 },
    inputLabel: { color: '#FFF', marginBottom: 5, fontFamily: 'Satoshi' },
    input: { backgroundColor: '#1F2937', borderRadius: 12, padding: 16, color: '#FFF', fontSize: 16, fontFamily: 'Satoshi', borderWidth: 1, borderColor: '#374151' },
    saveButton: { backgroundColor: '#10B981', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
    saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', fontFamily: 'Satoshi' },
});