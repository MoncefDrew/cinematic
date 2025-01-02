import React from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '@/constants/Colors';
import {router} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/constants/Movie";
type SignUpPageProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

export default function SignUp({navigation}: SignUpPageProps) {

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Join Letterboxd</Text>

            <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor={Colors.theme.currentTab}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={Colors.theme.currentTab}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={Colors.theme.currentTab}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
                Already have an account?{' '}
                <Text
                    style={styles.link}
                    onPress={() => navigation.navigate('SignIn')} // Navigate to SignIn
                >
                    Sign In
                </Text>
            </Text>

            <TouchableOpacity
                style={{
                    marginVertical:20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: Colors.theme.currentTab,
                    padding: 10,
                    borderRadius: 8,
                    width: '100%',
                    borderWidth: 1,
                    borderColor: Colors.theme.border,
                }}
                onPress={() => router.back()}
            >
                <Ionicons name='arrow-back-outline' size={23} color='white' style={{marginHorizontal: 10}}/>
                <Text style={{
                    color: Colors.theme.textPrimary,
                    fontSize: 16,
                    fontWeight: 'bold',
                }}>Go Back</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.theme.background,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.theme.BigTitle,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        backgroundColor: Colors.theme.backgroundCard,
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        color: Colors.theme.textColorSmall,
    },
    button: {
        width: '100%',
        backgroundColor: Colors.theme.button,
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footerText: {
        color: Colors.theme.textColorSmall,
        fontSize: 14,
    },
    link: {
        color: Colors.theme.link,
        fontWeight: 'bold',
    },
});
