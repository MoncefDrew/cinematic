import React, { useState, useEffect } from 'react';
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Modal, TextInput, Alert, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '@/api/store/AuthStore';
import { useRouter, Link } from 'expo-router';
import LogOut from "@/components/LogOut";
import AppHeader from "@/components/AppHeader";
import { LinearGradient } from 'expo-linear-gradient';

const CinematicColors = {
    background: '#0A0B1E',
    surface: '#12132D',
    primary: '#6366F1',
    primaryLight: '#818CF8',
    accent: '#4F46E5',
    accentSoft: 'rgba(99, 102, 241, 0.15)',
    text: '#FFFFFF',
    textSecondary: '#9B9BC0',
    border: '#1E2048',
    cardBackground: '#181935',
};

export default function Profile() {
    const router = useRouter();
    const [showTickets, setShowTickets] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const { user, updateProfilePicture, updateUser } = useAuthStore();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',

            });
        } else {
            router.replace('/welcomescreen');
        }
    }, [user]);

    if (!user) return null;

    const profilePhoto = user.photo_profile;

    const handleChangePhoto = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to upload a profile picture.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images', 'videos'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled) {
                const selectedImage = result.assets[0].uri;
                console.log('Selected Image URI:', selectedImage); // Log the URI
                await updateProfilePicture(selectedImage);
                Alert.alert('Success', 'Profile picture updated successfully!');
            }
        } catch (error) {
            console.error('Error updating profile picture:', error);
            Alert.alert('Error', 'Failed to update profile picture. Please check your network connection and try again.');
        }
    };
    const userStats = {
        moviesWatched: 28,
        reviewsWritten: 12,
        favoriteMovies: 8,
    };

    return (
        <>
            <LinearGradient
                colors={['#02040a', '#030314']}
                style={styles.container}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
            >
                <AppHeader name={'home'} header='Profile' transparent={true}/>
                <ScrollView style={styles.scrollContainer}>
                    {/* Profile Section */}
                    <View style={styles.profileSection}>
                        <View style={styles.profileImageContainer}>
                            {profilePhoto ? (
                                <Image source={{ uri: profilePhoto }} style={styles.profileImage} />
                            ) : (
                                <View style={styles.placeholderImage}>
                                    <Ionicons name="person" size={50} color={CinematicColors.primary} />
                                </View>
                            )}
                            <TouchableOpacity style={styles.editPhotoButton} onPress={handleChangePhoto}>
                                <Ionicons name="camera" size={20} color={CinematicColors.text} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.username}>{formData.username}</Text>
                        <Text style={styles.email}>{formData.email}</Text>
                        <TouchableOpacity
                            style={styles.editProfileButton}
                            onPress={() => setShowEditProfile(true)}
                        >
                            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Stats Section */}
                    <View style={styles.statsContainer}>
                        {Object.entries(userStats).map(([key, value]) => (
                            <View key={key} style={styles.statItem}>
                                <View style={styles.statIconContainer}>
                                    <Ionicons
                                        name={
                                            key === 'moviesWatched' ? 'film' :
                                                key === 'reviewsWritten' ? 'star' : 'heart'
                                        }
                                        size={24}
                                        color={CinematicColors.primary}
                                    />
                                </View>
                                <Text style={styles.statNumber}>{value}</Text>
                                <Text style={styles.statLabel}>
                                    {key === 'moviesWatched' ? 'Watched' :
                                        key === 'reviewsWritten' ? 'Reviews' : 'Favorites'}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Menu Options */}
                    <View style={styles.menuContainer}>
                        <Link href="/myTickets" asChild>
                            <TouchableOpacity style={styles.menuItem}>
                                <Ionicons name="ticket" size={24} color={CinematicColors.primary} />
                                <Text style={styles.menuText}>My Tickets</Text>
                                <Ionicons name="chevron-forward" size={24} color={CinematicColors.primary} />
                            </TouchableOpacity>
                        </Link>

                        <Link href="/Watchlist" asChild>
                            <TouchableOpacity style={styles.menuItem}>
                                <Ionicons name="bookmark" size={24} color={CinematicColors.primary} />
                                <Text style={styles.menuText}>Watchlist</Text>
                                <Ionicons name="chevron-forward" size={24} color={CinematicColors.primary} />
                            </TouchableOpacity>
                        </Link>

                        <LogOut/>
                    </View>
                </ScrollView>

                {/* Edit Profile Modal */}
                <Modal visible={showEditProfile} animationType="slide" transparent>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Edit Profile</Text>
                                <TouchableOpacity onPress={() => setShowEditProfile(false)}>
                                    <Ionicons name="close" size={24} color={CinematicColors.text} />
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={styles.modalScrollContent}>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Username</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={formData.username}
                                        onChangeText={(text) => setFormData({ ...formData, username: text })}
                                        placeholderTextColor={CinematicColors.textSecondary}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Email</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={formData.email}
                                        onChangeText={(text) => setFormData({ ...formData, email: text })}
                                        placeholderTextColor={CinematicColors.textSecondary}
                                    />
                                </View>
                                <TouchableOpacity
                                    style={styles.saveButton}
                                    onPress={() => {
                                        updateUser({ username: formData.username, email: formData.email });
                                        setShowEditProfile(false);
                                    }}
                                >
                                    <Text style={styles.saveButtonText}>Save Changes</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            </LinearGradient>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CinematicColors.background,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: CinematicColors.surface,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: CinematicColors.text,
        fontFamily: 'Satoshi',
    },
    scrollContainer: {
        flex: 1,
    },
    profileSection: {
        alignItems: 'center',
        padding: 20,
    },
    profileImageContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: CinematicColors.primary,
    },
    placeholderImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: CinematicColors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: CinematicColors.primary,
    },
    editPhotoButton: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: CinematicColors.primary,
        borderRadius: 20,
        padding: 8,
    },
    username: {
        color: CinematicColors.text,
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Satoshi',
    },
    email: {
        color: CinematicColors.textSecondary,
        fontSize: 16,
        fontFamily: 'Satoshi',
        marginTop: 5,
    },
    editProfileButton: {
        backgroundColor: CinematicColors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginTop: 15,
    },
    editProfileButtonText: {
        color: CinematicColors.text,
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Satoshi',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: CinematicColors.surface,
        marginHorizontal: 15,
        borderRadius: 16,
        marginVertical: 20,
    },
    statItem: {
        alignItems: 'center',
    },
    statIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: CinematicColors.accentSoft,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statNumber: {
        color: CinematicColors.text,
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Satoshi',
    },
    statLabel: {
        color: CinematicColors.textSecondary,
        fontSize: 14,
        fontFamily: 'Satoshi',
        marginTop: 4,
    },
    menuContainer: {
        padding: 15,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: CinematicColors.surface,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    menuText: {
        color: CinematicColors.text,
        fontSize: 16,
        flex: 1,
        marginLeft: 15,
        fontFamily: 'Satoshi',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(10, 11, 30, 0.9)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: CinematicColors.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        color: CinematicColors.text,
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Satoshi',
    },
    modalScrollContent: {
        paddingHorizontal: 10,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        color: CinematicColors.text,
        marginBottom: 8,
        fontSize: 16,
        fontFamily: 'Satoshi',
    },
    input: {
        backgroundColor: CinematicColors.background,
        borderRadius: 12,
        padding: 16,
        color: CinematicColors.text,
        fontSize: 16,
        fontFamily: 'Satoshi',
        borderWidth: 1,
        borderColor: CinematicColors.border,
    },
    saveButton: {
        backgroundColor: CinematicColors.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: CinematicColors.text,
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Satoshi',
    },
});