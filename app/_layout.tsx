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
import {useAuthStore} from "@/api/store/AuthStore";
import MyTicketsScreen from "@/app/(tabs)/myTickets";
import myTickets from "@/app/(tabs)/myTickets";
import MyTickets from "@/app/(tabs)/myTickets";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const CinematicColors = {
    background: '#0A0B1E', // Deep navy background
    surface: '#12132D', // Slightly lighter navy for layers
    primary: '#6366F1', // Electric purple
    primaryLight: '#818CF8', // Lighter purple for hover states
    accent: '#4F46E5', // Deep purple accent
    accentSoft: 'rgba(99, 102, 241, 0.15)', // Soft purple for active states
    text: '#FFFFFF',
    textSecondary: '#9B9BC0',
    border: '#1E2048',
    gradientStart: 'rgba(18, 19, 45, 0.95)',
    gradientEnd: 'rgba(10, 11, 30, 0.98)',
    cardBackground: '#181935',
};

// Root Layout Component
export default function RootLayout() {
    const [session, setSession] = useState<Session | null>(null);
    const {user} = useAuthStore()
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        Satoshi: require('../assets/fonts/Satoshi-Variable.ttf'),
        Poppins: require('../assets/fonts/Poppins-SemiBold.ttf')
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
                    backgroundColor: CinematicColors.surface,
                    width: 300,
                    borderTopRightRadius: 24,
                    borderBottomRightRadius: 24,
                    borderRightWidth: 1,
                    borderColor: CinematicColors.border,
                },
                drawerItemStyle: {
                    borderRadius: 16,
                    marginHorizontal: 16,
                    marginVertical: 4,
                    padding: 4,
                },
                drawerActiveTintColor: CinematicColors.primary,
                drawerInactiveTintColor: CinematicColors.textSecondary,
                drawerActiveBackgroundColor: CinematicColors.accentSoft,
                drawerLabelStyle: {
                    fontFamily: 'Poppins',
                    fontSize: 15,
                    fontWeight: '500',
                    marginLeft: -16,
                },
                headerStyle: {
                    backgroundColor: CinematicColors.background,
                    borderBottomWidth: 1,
                    borderBottomColor: CinematicColors.border,
                    elevation: 0,
                    shadowOpacity: 0,
                },
                headerTintColor: CinematicColors.primary,
                headerTitleStyle: {
                    fontFamily: 'Satoshi',
                    fontSize: 20,
                    color: CinematicColors.text,
                    fontWeight: '600',
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
                name="My tickets"
                component={MyTickets}
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
            <Stack.Screen name="MyTickets" component={MyTickets}/>

        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    drawerScrollView: {
        backgroundColor: CinematicColors.surface,
    },
    profileContainer: {
        marginBottom: 32,
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: CinematicColors.border,
    },
    drawerIcon: {
        marginRight: 20,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutContainer: {
        marginTop: 24,
        borderTopWidth: 1,
        borderTopColor: CinematicColors.border,
        paddingTop: 24,
        marginHorizontal: 16,
    },
    headerButton: {
        marginHorizontal: 16,
        padding: 8,
        borderRadius: 12,
        backgroundColor: CinematicColors.accentSoft,
    },
    headerIcon: {
        color: CinematicColors.primary,
    },
    drawerText: {
        color: CinematicColors.text,
        fontSize: 16,
        fontFamily: 'Satoshi',
        marginVertical: 8,
        letterSpacing: 0.3,
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 16,
        marginVertical: 4,
    },
    drawerItemText: {
        color: CinematicColors.text,
        fontSize: 15,
        fontFamily: 'Satoshi',
        fontWeight: '500',
        letterSpacing: 0.2,
    },
    activeDrawerItem: {
        backgroundColor: CinematicColors.accentSoft,
        borderRadius: 16,
    },
    drawerHeader: {
        paddingTop: 48,
        paddingBottom: 24,
        paddingHorizontal: 24,
        backgroundColor: CinematicColors.cardBackground,
    },
    profileImage: {
        width: 64,
        height: 64,
        borderRadius: 32,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: CinematicColors.primary,
    },
    profileName: {
        color: CinematicColors.text,
        fontSize: 18,
        fontFamily: 'Satoshi',
        fontWeight: '600',
        marginBottom: 4,
    },
    profileEmail: {
        color: CinematicColors.textSecondary,
        fontSize: 14,
        fontFamily: 'Satoshi',
    },
    divider: {
        height: 1,
        backgroundColor: CinematicColors.border,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    // New movie card style matching the image
    movieCard: {
        backgroundColor: CinematicColors.cardBackground,
        borderRadius: 16,
        overflow: 'hidden',
        marginHorizontal: 16,
        marginVertical: 8,
    },
    movieCardImage: {
        width: '100%',
        height: 200,
        borderRadius: 12,
    },
    movieCardContent: {
        padding: 16,
    },
    movieTitle: {
        color: CinematicColors.text,
        fontSize: 18,
        fontFamily: 'Satoshi',
        fontWeight: '600',
        marginBottom: 8,
    },
    movieDescription: {
        color: CinematicColors.textSecondary,
        fontSize: 14,
        fontFamily: 'Satoshi',
        lineHeight: 20,
    },
    bookButton: {
        backgroundColor: CinematicColors.primary,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginTop: 12,
    },
    bookButtonText: {
        color: CinematicColors.text,
        fontSize: 14,
        fontFamily: 'Satoshi',
        fontWeight: '500',
    }
});