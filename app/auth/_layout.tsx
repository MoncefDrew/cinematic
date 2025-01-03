import React, { useState } from 'react'
import {
    Alert,
    StyleSheet,
    View,
    AppState,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    KeyboardAvoidingView
} from 'react-native'
import { supabase } from '@/lib/supabase'
import { Button, Input } from '@rneui/themed'
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/constants/Movie";
import {Colors} from "@/constants/Colors";
import {router, useRouter} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {Client} from "@/constants/Client";

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh().then(r => console.log(r))
    } else {
        supabase.auth.stopAutoRefresh().then(r => console.log(r))
    }
})


export default function LandingPage() {
    const router = useRouter();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    async function signInWithEmail() {
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) Alert.alert(error.message)
        setLoading(false)
    }



    async function signUpWithEmail() {
        setLoading(true)
        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email: email,
            password: password,
        })

        if (error) Alert.alert(error.message)
        await addClient({email,password})
        if (!session) Alert.alert('Please check your inbox for email verification!')
        setLoading(false)
    }

    const generateSimpleId = (): string => {
        return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    };


    const addClient = async (clientData:Client) => {
        const customId = generateSimpleId();

        const { data, error } = await supabase
            .from('client')
            .insert([
                {
                    id: customId, // Insert the custom ID
                    email: clientData.email,
                    password:clientData.password,
                },
            ]);

        if (error) {
            console.error('Error adding client:', error);
        } else {
            console.log('Client added:', data);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

            <Text style={styles.title}>Sign In</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={Colors.theme.inputPlaceholder}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={Colors.theme.inputPlaceholder}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>
            <TouchableOpacity style={styles.signInButton} onPress={signInWithEmail}>
                <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => console.log('Forgot password pressed')}>
                <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
                <View style={styles.dividerLine}/>
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine}/>
            </View>

            <TouchableOpacity
                style={styles.joinButton}
                onPress={signUpWithEmail}
            >
                <Text style={styles.joinButtonText}>Join Letterboxd</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.joinButton,{flexDirection:'row',alignItems: 'center',justifyContent: 'center'}]}
                onPress={() => router.back()}
            >
                <Ionicons name='arrow-back-outline' size={23} color='white' style={{marginHorizontal:10}}/>
                <Text style={styles.joinButtonText}>Go Back</Text>
            </TouchableOpacity>

        </KeyboardAvoidingView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.theme.background,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.theme.BigTitle,
        marginBottom: 30,
    },
    inputContainer: {
        width: '100%',
    },
    input: {
        backgroundColor: Colors.theme.backgroundCard,
        color: Colors.theme.textPrimary,
        fontSize: 16,
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: Colors.theme.border,
    },
    signInButton: {
        backgroundColor: Colors.theme.buttonPrimary,
        padding: 15,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    signInButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    forgotPasswordText: {
        color: Colors.theme.link,
        fontSize: 14,
        marginTop: 15,
        textDecorationLine: 'underline',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.theme.border,
    },
    dividerText: {
        marginHorizontal: 10,
        color: Colors.theme.textSecondary,
        fontSize: 14,
    },
    joinButton: {
        backgroundColor: 'transparent',
        padding: 15,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.theme.border,
    },
    joinButtonText: {
        color: Colors.theme.textPrimary,
        fontSize: 16,
        fontWeight: 'bold',
    },
})