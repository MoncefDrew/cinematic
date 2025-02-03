import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import { Colors } from "@/constants/Colors";
import {useAuthStore} from "@/api/store/AuthStore";

const ProfileHeader = () => {
    const auth = useAuthStore()

    const username = auth.user.username; // Static username
    const profilePic = require('../assets/images/alucard.jpg'); // Static profile picture

    return (
        <View >
            {/* Circle around the profile picture */}
            <View style={{ flexDirection: 'row',alignItems: 'center', }}>
                <View
                    style={{
                        width: 50, // Container size
                        height: 50, // Container size
                        borderRadius: 50, // Half of the width/height to make it circular
                        borderWidth: 1, // Border width around the profile picture
                        borderColor: Colors.theme.tabIconDefault, // Border color
                        justifyContent: 'center', // Center the image inside the container
                        overflow: 'hidden', // Ensure the image is clipped within the circle
                    }}
                >
                    <Image
                        source={profilePic}
                        style={{ width: '100%', height: '100%', borderRadius: 50 }} // Make the image fully cover the circle
                    />


                </View>

                {/* Username text */}
                <Text
                    style={{
                        marginLeft: 20, // Space between image and text
                        color: Colors.theme.BigTitle, // Set text color
                        fontSize: 18, // Adjust font size
                        fontWeight: 'bold', // Optional: Make the text bold
                    }}
                >
                    {username}
                </Text>
            </View>

        </View>
    );
};

export default ProfileHeader;
