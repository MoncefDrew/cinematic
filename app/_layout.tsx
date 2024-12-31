import {useFonts} from 'expo-font';
import {Colors} from "@/constants/Colors"
import 'react-native-reanimated';
import {Ionicons} from '@expo/vector-icons';
import ProfileHeader from "@/components/ProfileHeader";
import {createDrawerNavigator, DrawerContentScrollView, DrawerItemList} from "@react-navigation/drawer";
import {StatusBar} from "expo-status-bar";
import React from 'react';
import Popular from "@/app/(tabs)/Popular";
import Search from "@/app/(tabs)/Search";
import Profile from "@/app/(tabs)/Profile";
import Watchlist from "@/app/(tabs)/Watchlist";
import Program from "@/app/(tabs)/Program";
import Activity from "@/app/(tabs)/Activity";
import Settings from "@/app/(tabs)/Settings";
import SignOut from "@/app/(tabs)/SignOut";
import MovieDetails from "@/app/(tabs)/MovieDetails";
import ReserveTicket from "@/app/(tabs)/ReserveTicket";
import CustomHeader from '../components/CustomHeader';
// @ts-ignore
import SearchButton from "@/components/SearchButton";

// Prevent the splash screen from auto-hiding before asset loading is complete.

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        Satoshi: require('../assets/fonts/Satoshi-Variable.ttf')
    });

    const Drawer = createDrawerNavigator();


    // @ts-ignore
    // @ts-ignore
    return (

        //Architecture
        //Gesture Handler Root view :
        //Status Bar
        //-Drawer :
        //

        <>
            <StatusBar style="light" backgroundColor='transparent'/>

            <Drawer.Navigator
            screenOptions={{

                drawerContentStyle: {

                },

                //drawer style
                drawerStyle: {
                    backgroundColor: Colors.theme.background, // Drawer background color
                    width: 280, // Optional: Adjust drawer width if needed
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                },
                drawerItemStyle:{
                  borderRadius:6
                },
                drawerActiveTintColor: Colors.theme.Activetint, // Active item text/icon color
                drawerInactiveTintColor: Colors.theme.currentTab, // Inactive item text/icon color

                drawerActiveBackgroundColor: Colors.theme.currentTab, // Active item background

                drawerLabelStyle: {
                    fontSize: 15, // Adjust font size
                },

                // Header styles
                headerStyle: {
                    backgroundColor: '#445566', // Change the nav bar color here
                },
                headerTintColor: '#ffffff', // Change the text/icon color in the nav bar
                headerTitleStyle: {
                    fontFamily:'Satoshi',
                    fontSize: 18, // Optional: Adjust the title font size
                },



            }}

            //Drawer Structure
            drawerContent={(props) => (
                <DrawerContentScrollView {...props}>

                    {/* Profile Header at the top of the Drawer */}
                    <ProfileHeader/>

                    {/* Drawer Items */}
                    <DrawerItemList {...props} />


                </DrawerContentScrollView>
            )}>


            <Drawer.Screen
                name='Popular'
                component={Popular}
                options={{
                    drawerLabel: 'Popular',
                    headerTitle: 'Popular',
                    drawerIcon: ({size, color}) => (
                        <Ionicons name="copy" size={size} color={color} style={{marginRight: 25}}></Ionicons>
                    ),

                    // Custom header component



                }}
            />


            <Drawer.Screen
                name='Search'
                component={Search}

                options={{
                    drawerLabel: 'Search',
                    headerTitle: '',
                    drawerIcon: ({size, color}) => (
                        <Ionicons name="search" size={size} color={color} style={{marginRight: 25}}></Ionicons>
                    ),
                    headerRight: () => (
                        <SearchButton/>
                    ),
                }}
            />

            <Drawer.Screen
                name='Profile'
                component={Profile}

                options={{
                    drawerLabel: 'Profile',
                    headerTitle: 'Profile',
                    drawerIcon: ({size, color}) => (
                        <Ionicons name="person" size={size} color={color} style={{marginRight: 25}}></Ionicons>
                    )
                }}
            />

            <Drawer.Screen
                name='Watchlist'
                component={Watchlist}

                options={{
                    drawerLabel: 'Watch list',
                    headerTitle: 'Watchlist',
                    drawerIcon: ({size, color}) => (
                        <Ionicons name="time" size={size} color={color} style={{marginRight: 25}}></Ionicons>
                    )
                }}
            />

            <Drawer.Screen
                name='Program'
                component={Program}

                options={{
                    drawerLabel: 'Program',
                    headerTitle: 'Program',
                    drawerIcon: ({size, color}) => (
                        <Ionicons name="calendar" size={size} color={color} style={{marginRight: 25}}></Ionicons>
                    )
                }}
            />


            <Drawer.Screen
                name='Activity'
                component={Activity}

                options={{
                    drawerLabel: 'Activity',
                    headerTitle: 'Activity',
                    drawerIcon: ({size, color}) => (
                        <Ionicons name="bar-chart" size={size} color={color} style={{marginRight: 25}}></Ionicons>
                    )
                }}
            />

            <Drawer.Screen
                name='Settings'
                component={Settings}

                options={{
                    drawerLabel: 'Settings',
                    headerTitle: 'Settings',
                    drawerIcon: ({size, color}) => (
                        <Ionicons name="settings" size={size} color={color} style={{marginRight: 25}}></Ionicons>
                    )
                }}
            />

            <Drawer.Screen
                name='SignOut'
                component={SignOut}

                options={{
                    drawerLabel: 'Sign Out',
                    headerTitle: 'SignOut',
                    drawerIcon: ({size, color}) => (
                        <Ionicons name="log-out" size={size} color={color} style={{marginRight: 25}}></Ionicons>
                    )
                }}
            />

            <Drawer.Screen
                name='MovieDetails'
                // @ts-ignore
                component={MovieDetails}
                options={{
                    drawerItemStyle: { display: 'none' },
                    headerTitle: '',
                    headerStyle: {
                        height: 0, // Set the header height to 0
                    },
                    headerTransparent: true, // Makes header background transparent

                    headerLeft: () => (null),
                }}


            />

                <Drawer.Screen
                    name='ReserveTicket'
                    // @ts-ignore
                    component={ReserveTicket}
                    options={{
                        drawerItemStyle: { display: 'none' },
                        headerTitle: '',
                        headerStyle: {
                            height: 0, // Set the header height to 0
                        },
                        headerTransparent: true, // Makes header background transparent

                        headerLeft: () => (null),
                    }}


                />
        </Drawer.Navigator>
        </>


    );
}
