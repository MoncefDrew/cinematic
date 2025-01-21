import { supabase } from "@/lib/supabase"
import { Ionicons } from "@expo/vector-icons"
import { router, useNavigation, useRouter } from "expo-router"
import { useState } from "react"
import { Alert, KeyboardAvoidingView, StyleSheet, TextInput, TouchableOpacity, View,Text, Platform } from "react-native"
import { Colors } from "../../constants/Colors"

export default function SignInPage() {
    const router = useRouter();
    
    const [loading, setLoading] = useState(false)
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    async function signInWithEmail() {
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })
        if (error) Alert.alert(error.message)
        setLoading(false)
    }


    return(
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
