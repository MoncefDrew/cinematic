import React from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { Colors } from "@/constants/Colors";
import { useAuthStore } from "@/api/store/AuthStore";

const ProfileHeader = () => {
    const { user, loading } = useAuthStore();

    // Loading state
    if (loading) {
        return (
            <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}>
                <ActivityIndicator size="small" color={Colors.theme.tabIconDefault} />
            </View>
        );
    }

    // Handle case when user data isn't available
    if (!user) {
        return (
            <View >
                <Text style={{ color: Colors.theme.textSecondary }}>Loading profile...</Text>
            </View>
        );
    }

    return (
        <View >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        borderWidth: 1,
                        borderColor: Colors.theme.tabIconDefault,
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'hidden',
                        backgroundColor: Colors.theme.background,
                    }}
                >
                    {user.photo_profile ? (
                        <Image
                            source={{ uri: user.photo_profile }}
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 25,
                            }}
                        />
                    ) : (
                        // Fallback to displaying first letter of username
                        <Text style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                        }}>
                            {user.username ? user.username.charAt(0).toUpperCase() : '?'}
                        </Text>
                    )}
                </View>

                <View style={{ marginLeft: 16, flex: 1 }}>
                    <Text
                        style={{
                            color: Colors.theme.BigTitle,
                            fontSize: 18,
                            fontWeight: '600',
                        }}
                        numberOfLines={1}
                    >
                        {user.username || 'User'}
                    </Text>
                    <Text
                        style={{
                            color: Colors.theme.textSecondary,
                            fontSize: 14,
                        }}
                        numberOfLines={1}
                    >
                        {user.email}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default ProfileHeader;