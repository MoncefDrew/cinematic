// ProfilePic.js
import React from 'react';
import { View, Image } from 'react-native';
import { Colors } from "@/constants/Colors";
import { useAuthStore } from "@/api/store/AuthStore";

const ProfilePic = () => {
    const { user } = useAuthStore();

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
                style={{
                    width: 30,
                    height: 30,
                    borderRadius: 50,
                    borderWidth: 1,
                    borderColor: Colors.theme.tabIconDefault,
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                    backgroundColor: Colors.theme.background,
                }}
            >
                {user?.photo_profile ? (
                    <Image
                        source={{ uri: user.photo_profile }}
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 50
                        }}
                        defaultSource={require('@/assets/images/Screenshot 2025-02-21 202802.png')}
                    />
                ) : (
                    <Image
                        source={require('@/assets/images/Screenshot 2025-02-21 202802.png')}
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 50
                        }}
                    />
                )}
            </View>
        </View>
    );
};

export default ProfilePic;