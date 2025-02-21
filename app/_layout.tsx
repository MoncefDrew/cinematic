import { useFonts } from 'expo-font';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/api/store/AuthStore';

// Import Screens
import Popular from "@/app/(tabs)/Popular";
import Program from "@/app/(tabs)/Program";
import Profile from "@/app/(tabs)/Profile";
import MovieDetails from "@/app/(tabs)/MovieDetails";
import ReserveTicket from "@/app/(tabs)/ReserveTicket";
import TicketPage from "@/app/(tabs)/TicketPage";
import WelcomeScreen from './welcomescreen';
import aboutApp from './aboutApp';
import SignUpPage from './auth/sign-up';
import SignInPage from './auth/sign-in';
import LandingPage from "@/app/auth";
import MyTickets from './(tabs)/myTickets'
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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

function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarHideOnKeyboard: true,
                tabBarStyle: {
                    position: "absolute",
                    bottom: Platform.OS === "android" ? 20 : 30, // Adjust position above nav bar
                    left: 20,
                    paddingTop:10,
                    right: 20,
                    height: 80,
                    backgroundColor: CinematicColors.surface,
                    borderRadius: 20,
                    borderTopWidth: 0,
                    elevation: 5, // Shadow for Android
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.3,
                    shadowRadius: 10,
                },
                tabBarShowLabel: false,
            }}
        >
            <Tab.Screen
                name="Popular"
                component={Popular}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            name="home"
                            size={28}
                            color={focused ? CinematicColors.primary : CinematicColors.textSecondary}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Program"
                component={Program}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            name="calendar"
                            size={28}
                            color={focused ? CinematicColors.primary : CinematicColors.textSecondary}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="MyTickets"
                component={MyTickets}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            name="ticket"
                            size={28}
                            color={focused ? CinematicColors.primary : CinematicColors.textSecondary}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            name="person"
                            size={28}
                            color={focused ? CinematicColors.primary : CinematicColors.textSecondary}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default function RootLayout() {
    const [session, setSession] = useState<Session | null>(null);
    const { user } = useAuthStore();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        Satoshi: require('../assets/fonts/Satoshi-Variable.ttf'),
        Poppins: require('../assets/fonts/Poppins-SemiBold.ttf'),
    });

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    if (!loaded) return null;

    return (
        <>
            <StatusBar style="light" backgroundColor="transparent" />
            {session && session.user ? <MainStack /> : <AuthStack />}
        </>
    );
}

function MainStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: CinematicColors.background },
            }}
        >
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="MovieDetails" component={MovieDetails} />
            <Stack.Screen name="ReserveTicket" component={ReserveTicket} />
            <Stack.Screen name="TicketPage" component={TicketPage} />
            <Stack.Screen name="myTickets" component={MyTickets}/>

        </Stack.Navigator>
    );
}

function AuthStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: CinematicColors.background },
            }}
            initialRouteName="Welcome"
        >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="aboutApp" component={aboutApp} />
            <Stack.Screen name="Landing" component={LandingPage} />
            <Stack.Screen name="SignIn" component={SignInPage} />
            <Stack.Screen name="SignUp" component={SignUpPage} />
        </Stack.Navigator>
    );
}
