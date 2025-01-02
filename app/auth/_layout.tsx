import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Colors} from "@/constants/Colors";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/constants/Movie"; // Adjust this import to point to your types file


type LandingPageProps = NativeStackScreenProps<RootStackParamList, 'Landing'>;

export default function LandingPage({navigation}: LandingPageProps) {
    return (
        <>

            <View style={styles.container}>
                <Text style={styles.title}>Welcome to Cinematik</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('SignIn')} // Navigate to SignIn
                >
                    <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        console.log("Navigating to SignUp...");
                        navigation.navigate('SignUp');
                    }}
                >
                    <Text style={styles.buttonText}>Join Letterboxd</Text>
                </TouchableOpacity>
            </View>
        </>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.theme.background,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: Colors.theme.BigTitle,
    },
    button: {
        backgroundColor: Colors.theme.backgroundCard,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
