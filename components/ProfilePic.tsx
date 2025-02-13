import React from 'react';
import {View, Text, Image} from 'react-native';
import {Colors} from "@/constants/Colors";
import {useAuthStore} from "@/api/store/AuthStore";

const ProfilePic = () => {
    const auth = useAuthStore()
    const profilePic = auth.user.profilePicture

    return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {/* Circle around the profile picture */}
            <View
                style={{

                    width: 30, // Container size
                    height: 30, // Container size
                    borderRadius: 50, // Half of the width/height to make it circular
                    borderWidth: 1, // Border width around the profile picture
                    borderColor: Colors.theme.tabIconDefault, // Border color
                    justifyContent: 'center', // Center the image inside the container
                    alignItems: 'center', // Align items horizontally
                    overflow: 'hidden', // Ensure the image is clipped within the circle
                }}
            >
                <Image
                    source={profilePic}
                    style={{width: '100%', height: '100%', borderRadius: 50}} // Make the image fully cover the circle
                />
            </View>
        </View>
    )
}
export default ProfilePic;