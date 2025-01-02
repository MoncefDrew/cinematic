import React, {useState} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import {useRouter} from 'expo-router';
import {Colors} from '@/constants/Colors';
import {Ionicons} from "@expo/vector-icons";
import {createStackNavigator} from "@react-navigation/stack";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/constants/Movie";
type SignInPageProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

export default function SignIn({navigation}: SignInPageProps) {

    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = () => {
        // Perform sign-in logic here
        console.log('Signing in with:', email, password);
        // Navigate to MainApp after successful sign-in
        navigation.navigate('MainApp');
        console.log('Signed in');


    };

    const handleJoinLetterboxd = () => {

    };

    return (
        <>

            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
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

                <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
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
                    onPress={handleJoinLetterboxd}
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
        </>

    );
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
});
