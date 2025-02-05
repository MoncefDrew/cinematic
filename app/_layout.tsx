import { useFonts } from 'expo-font';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import LandingPage from "@/app/auth";
import Popular from "@/app/(tabs)/Popular";
import Search from "@/app/(tabs)/Search";
import Profile from "@/app/(tabs)/Profile";
import Watchlist from "@/app/(tabs)/Watchlist";
import Program from "@/app/(tabs)/Program";
import Activity from "@/app/(tabs)/Activity";
import Settings from "@/app/(tabs)/Settings";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import ProfileHeader from "@/components/ProfileHeader";
import SearchButton from "@/components/SearchButton";
import MovieDetails from "@/app/(tabs)/MovieDetails";
import ReserveTicket from "@/app/(tabs)/ReserveTicket";
import {View, StyleSheet } from "react-native";
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import LogOut from "@/components/LogOut";
import SignUpPage from './auth/sign-up';
import SignInPage from './auth/sign-in';
import TicketPage from "@/app/(tabs)/TicketPage";
import PaymentPage from "@/app/(tabs)/PaymentPage";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Modern Cinematic Theme Colors
const CinematicColors = {
    background: '#0A0A0A',
    secondary: '#1A1A1A',
    border: '#2A2A2A',
    accent: '#E31837', // Cinema red
    accentSoft: 'rgba(227, 24, 55, 0.15)', // Soft red for active states
    text: '#FFFFFF',
    textSecondary: '#B8B8B8',
    highlight: '#3E7BFA', // Electric blue for special highlights
};

// Root Layout Component
export default function RootLayout() {
    const [session, setSession] = useState<Session | null>(null);
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        Satoshi: require('../assets/fonts/Satoshi-Variable.ttf'),
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
            {session && session.user ? <MainApp /> : <AuthStack />}
        </>
    );
}

// Custom Drawer Content Component
function CustomDrawerContent(props: any) {
    return (
        <DrawerContentScrollView
            {...props}
            style={styles.drawerScrollView}
        >
            <View style={styles.profileContainer}>
                <ProfileHeader />
            </View>
            <DrawerItemList {...props} />
            <View style={styles.logoutContainer}>
                <LogOut {...props} />
            </View>
        </DrawerContentScrollView>
    );
}

// Main App Drawer Navigation
function MainApp() {
    return (
        <Drawer.Navigator
            screenOptions={{
                drawerContentStyle: {
                    paddingTop: 0,
                },
                drawerStyle: {
                    backgroundColor: CinematicColors.background,
                    width: 280,
                    borderTopRightRadius: 16,
                    borderBottomRightRadius: 16,
                    borderRightWidth: 1,
                    borderColor: CinematicColors.border,
                },
                drawerItemStyle: {
                    borderRadius: 8,
                    marginHorizontal: 12,
                    marginVertical: 4,
                },
                drawerActiveTintColor: CinematicColors.accent,
                drawerInactiveTintColor: CinematicColors.textSecondary,
                drawerActiveBackgroundColor: CinematicColors.accentSoft,
                drawerLabelStyle: {
                    fontFamily: 'Satoshi',
                    fontSize: 15,
                    marginLeft: -20,
                },
                headerStyle: {
                    backgroundColor: '#111827', // Dark background to match the container
                    borderBottomWidth: 1,
                    borderBottomColor: '#374151', // Matching border color
                    elevation: 0, // Remove shadow
                    shadowOpacity: 0, // Remove shadow
                },
                headerTintColor: '#fff', // White color for back button and icons
                headerTitleStyle: {
                    fontFamily: 'Satoshi', // Matching font family
                    fontSize: 18, // Slightly smaller font size for the header
                    color: '#fff', // White color for the title text
                    fontWeight: '700', // Bold font weight to match your title style
                },
            }}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
            <Drawer.Screen
                name="Popular"
                component={Popular}
                options={{
                    drawerLabel: 'Popular',
                    headerTitle: 'Popular',
                    drawerIcon: ({ size, color }) => (
                        <Ionicons name="copy" size={size} color={color} style={styles.drawerIcon} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Search"
                component={Search}
                options={{
                    drawerLabel: 'Search',
                    headerTitle: 'Discover',
                    drawerIcon: ({ size, color }) => (
                        <Ionicons name="search" size={size} color={color} style={styles.drawerIcon} />
                    ),
                    headerRight: () => <SearchButton />,
                }}
            />
            <Drawer.Screen
                name="Profile"
                component={Profile}
                options={{
                    drawerLabel: 'Profile',
                    headerTitle: 'Profile',
                    drawerIcon: ({ size, color }) => (
                        <Ionicons name="person" size={size} color={color} style={styles.drawerIcon} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Watchlist"
                component={Watchlist}
                options={{
                    drawerLabel: 'Watch list',
                    headerTitle: 'Watchlist',
                    drawerIcon: ({ size, color }) => (
                        <Ionicons name="time" size={size} color={color} style={styles.drawerIcon} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Program"
                component={Program}
                options={{
                    drawerLabel: 'Program',
                    headerTitle: 'Program',
                    drawerIcon: ({ size, color }) => (
                        <Ionicons name="calendar" size={size} color={color} style={styles.drawerIcon} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Activity"
                component={Activity}
                options={{
                    drawerLabel: 'Activity',
                    headerTitle: 'Activity',
                    drawerIcon: ({ size, color }) => (
                        <Ionicons name="bar-chart" size={size} color={color} style={styles.drawerIcon} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Settings"
                component={Settings}
                options={{
                    drawerLabel: 'Settings',
                    headerTitle: 'Settings',
                    drawerIcon: ({ size, color }) => (
                        <Ionicons name="settings" size={size} color={color} style={styles.drawerIcon} />
                    ),
                }}
            />
            <Drawer.Screen
                name="MovieDetails"
                component={MovieDetails}
                options={{
                    drawerItemStyle: { display: 'none' },
                    headerTitle: '',
                    headerStyle: {
                        height: 0,
                        backgroundColor: 'transparent',
                    },
                    headerTransparent: true,
                    headerLeft: () => null,
                }}
            />
            <Drawer.Screen
                name="ReserveTicket"
                component={ReserveTicket}
                options={{
                    drawerItemStyle: { display: 'none' },
                    headerTitle: '',
                    headerStyle: {
                        height: 0,
                        backgroundColor: 'transparent',
                    },
                    headerTransparent: true,
                    headerLeft: () => null,
                }}
            />
            <Drawer.Screen
                name="TicketPage"
                component={TicketPage}
                options={{
                    drawerItemStyle: { display: 'none' },
                    headerTitle: '',
                    headerStyle: {
                        height: 0,
                        backgroundColor: 'transparent',
                    },
                    headerTransparent: true,
                    headerLeft: () => null,
                }}
            />
            <Drawer.Screen
                name="Payment"
                component={PaymentPage}
                options={{
                    headerTitle: '',
                    headerStyle: {
                        height: 0,
                        backgroundColor: 'transparent',
                    },
                    headerTransparent: true,
                    headerLeft: () => null,
                }}
            />
        </Drawer.Navigator>
    );
}

// Auth Stack Navigation
export function AuthStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: CinematicColors.background }
            }}>
            <Stack.Screen name="Landing" component={LandingPage} />
            <Stack.Screen name="SignIn" component={SignInPage} />
            <Stack.Screen name="SignUp" component={SignUpPage} />
            <Stack.Screen name="MainApp" component={MainApp} />
            <Stack.Screen name="MovieDetails" component={MovieDetails}/>
            <Stack.Screen name="TicketPage" component={TicketPage}/>
            <Stack.Screen name="PaymentPage" component={PaymentPage}/>
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    drawerScrollView: {
        backgroundColor: '#111827', // Darker, more sophisticated background
    },
    profileContainer: {
        marginBottom: 30,
        padding: 25,
        borderBottomWidth: 1,
        borderBottomColor: '#374151', // Matching border color
    },
    drawerIcon: {
        marginRight: 25,
        color: '#fff', // White color for icons to match the text color
    },
    logoutContainer: {
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#374151', // Matching border color
        paddingTop: 20,
        marginHorizontal: 12,
    },
    headerButton: {
        marginHorizontal: 16,
    },
    headerIcon: {
        color: '#fff', // White color for header icons
    },
    // Additional styles for text and other elements in the drawer
    drawerText: {
        color: '#fff', // White color for text
        fontSize: 16,
        fontFamily: 'Satoshi',
        marginVertical: 10,
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 25,
    },
    drawerItemText: {
        color: '#fff', // White color for item text
        fontSize: 16,
        fontFamily: 'Satoshi',
    },
    // Style for active drawer item
    activeDrawerItem: {
        backgroundColor: '#1F2937', // Dark background for active item
        borderRadius: 12,
    },
});

