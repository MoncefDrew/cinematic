import {useFonts} from 'expo-font';
import {Colors} from "../constants/Colors"
import 'react-native-reanimated';
import {Ionicons} from '@expo/vector-icons';
import {View, Text} from "react-native";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {Drawer} from "expo-router/drawer";
import ProfileHeader from "@/components/ProfileHeader";
import {DrawerContentScrollView, DrawerItemList} from "@react-navigation/drawer";
import {StatusBar} from "expo-status-bar";

// Prevent the splash screen from auto-hiding before asset loading is complete.

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/Satoshi-Variable.ttf'),
    });



    return (
        <GestureHandlerRootView>
            <StatusBar style="light" backgroundColor="#14171C" />

            <Drawer
                screenOptions={{

                    drawerContentStyle: {
                        padding: 10, // Adjust the padding between the drawer content and screen

                        //@ debugging it later
                        borderRadius: 1,
                        overflow: 'hidden', // This ensures that content inside the drawer doesn't overflow outside the border radius

                    },

                    drawerStyle: {
                        backgroundColor: Colors.theme.background, // Drawer background color
                        width: 300, // Optional: Adjust drawer width if needed

                    },

                    drawerActiveTintColor: '#ffffff', // Active item text/icon color
                    drawerInactiveTintColor: '#888888', // Inactive item text/icon color
                    drawerActiveBackgroundColor: '#333333', // Active item background
                    drawerLabelStyle: {
                        fontSize: 15, // Adjust font size
                    },
                }}

                //Drawer Structure
                drawerContent={(props) => (
                    <DrawerContentScrollView {...props}>
                        {/* Profile Header at the top of the Drawer */}
                        <ProfileHeader />

                        {/* Drawer Items */}
                        <DrawerItemList {...props} />
                    </DrawerContentScrollView>
                )}>




                <Drawer.Screen
                    name='(tabs)/Popular'
                    options={{
                        drawerLabel: 'Popular',
                        headerTitle: 'Popular',
                        drawerIcon: ({size, color}) => (
                            <Ionicons name="copy" size={size} color={color} style={{marginRight: 10}} ></Ionicons>
                        )
                    }}
                />

                <Drawer.Screen
                    name='(tabs)/Search'
                    options={{
                        drawerLabel: 'Search',
                        headerTitle: 'Search for a movie',
                        drawerIcon: ({size, color}) => (
                            <Ionicons name="search" size={size} color={color} style={{marginRight: 10}}></Ionicons>
                        )
                    }}
                />

                <Drawer.Screen
                    name='(tabs)/Profile'
                    options={{
                        drawerLabel: 'Profile',
                        headerTitle: 'Profile',
                        drawerIcon: ({size, color}) => (
                            <Ionicons name="person" size={size} color={color} style={{marginRight: 10}}></Ionicons>
                        )
                    }}
                />

                <Drawer.Screen
                    name='(tabs)/Watchlist'
                    options={{
                        drawerLabel: 'Watch list',
                        headerTitle: 'Watchlist',
                        drawerIcon: ({size, color}) => (
                            <Ionicons name="time" size={size} color={color} style={{marginRight: 10}}></Ionicons>
                        )
                    }}
                />

                <Drawer.Screen
                    name='(tabs)/Program'
                    options={{
                        drawerLabel: 'Program',
                        headerTitle: 'Program',
                        drawerIcon: ({size, color}) => (
                            <Ionicons name="calendar" size={size} color={color} style={{marginRight: 10}}></Ionicons>
                        )
                    }}
                />

                <Drawer.Screen
                    name='(tabs)/Reviews'
                    options={{
                        drawerLabel: 'Reviews',
                        headerTitle: 'Reviews',
                        drawerIcon: ({size, color}) => (
                            <Ionicons name="reorder-four" size={size} color={color} style={{marginRight: 10}}></Ionicons>
                        )
                    }}
                />

                <Drawer.Screen
                    name='(tabs)/Activity'
                    options={{
                        drawerLabel: 'Activity',
                        headerTitle: 'Activity',
                        drawerIcon: ({size, color}) => (
                            <Ionicons name="bar-chart" size={size} color={color} style={{marginRight: 10}}></Ionicons>
                        )
                    }}
                />

                <Drawer.Screen
                    name='(tabs)/Settings'
                    options={{
                        drawerLabel: 'Settings',
                        headerTitle: 'Settings',
                        drawerIcon: ({size, color}) => (
                            <Ionicons name="pencil" size={size} color={color} style={{marginRight: 10}}></Ionicons>
                        )
                    }}
                />

                <Drawer.Screen
                    name='(tabs)/SignOut'
                    options={{
                        drawerLabel: 'Sign Out',
                        headerTitle: 'SignOut',
                        drawerIcon: ({size, color}) => (
                            <Ionicons name="log-out" size={size} color={color} style={{marginRight: 10}}></Ionicons>
                        )
                    }}
                />
            </Drawer>

        </GestureHandlerRootView>
    );
}
