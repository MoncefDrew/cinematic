import {useFonts} from 'expo-font';
import {Colors} from "@/constants/Colors"
import 'react-native-reanimated';
import {Ionicons} from '@expo/vector-icons';
import {View, Text, Button, TouchableOpacity} from "react-native";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {Drawer} from "expo-router/drawer";
import ProfileHeader from "@/components/ProfileHeader";
import {DrawerContentScrollView, DrawerItemList} from "@react-navigation/drawer";
import {StatusBar} from "expo-status-bar";
import SearchButton from "@/components/SearchButton";

// Prevent the splash screen from auto-hiding before asset loading is complete.

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        Satoshi: require('../assets/fonts/Satoshi-Variable.ttf')
    });


    return (

        //Architecture
        //Gesture Handler Root view :
        //Status Bar
        //-Drawer :
        //
        <GestureHandlerRootView>
            <StatusBar style="light" backgroundColor="#445566"/>

            <Drawer
                screenOptions={{

                    drawerContentStyle: {
                        padding: 12, // Adjust the padding between the drawer content and screen
                    },

                    //drawer style
                    drawerStyle: {
                        backgroundColor: Colors.theme.background, // Drawer background color
                        width: 300, // Optional: Adjust drawer width if needed
                    },
                    drawerActiveTintColor: Colors.theme.Activetint, // Active item text/icon color
                    drawerInactiveTintColor: Colors.theme.InactiveTint, // Inactive item text/icon color
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
                    name='(tabs)/Popular'
                    options={{
                        drawerLabel: 'Popular',
                        headerTitle: 'Popular',
                        drawerIcon: ({size, color}) => (
                            <Ionicons name="copy" size={size} color={color} style={{marginRight: 25}}></Ionicons>
                        ),
                        headerRight: () => (
                            <SearchButton/>
                        ),

                    }}
                />


                <Drawer.Screen
                    name='(tabs)/Search'
                    options={{
                        drawerLabel: 'Search',
                        headerTitle: 'Search for a movie',
                        drawerIcon: ({size, color}) => (
                            <Ionicons name="search" size={size} color={color} style={{marginRight: 25}}></Ionicons>
                        ),
                        headerRight: () => (
                            <SearchButton/>
                        ),
                    }}
                />

                <Drawer.Screen
                    name='(tabs)/Profile'
                    options={{
                        drawerLabel: 'Profile',
                        headerTitle: 'Profile',
                        drawerIcon: ({size, color}) => (
                            <Ionicons name="person" size={size} color={color} style={{marginRight: 25}}></Ionicons>
                        )
                    }}
                />

                <Drawer.Screen
                    name='(tabs)/Watchlist'
                    options={{
                        drawerLabel: 'Watch list',
                        headerTitle: 'Watchlist',
                        drawerIcon: ({size, color}) => (
                            <Ionicons name="time" size={size} color={color} style={{marginRight: 25}}></Ionicons>
                        )
                    }}
                />

                <Drawer.Screen
                    name='(tabs)/Program'
                    options={{
                        drawerLabel: 'Program',
                        headerTitle: 'Program',
                        drawerIcon: ({size, color}) => (
                            <Ionicons name="calendar" size={size} color={color} style={{marginRight: 25}}></Ionicons>
                        )
                    }}
                />



                <Drawer.Screen
                    name='(tabs)/Activity'
                    options={{
                        drawerLabel: 'Activity',
                        headerTitle: 'Activity',
                        drawerIcon: ({size, color}) => (
                            <Ionicons name="bar-chart" size={size} color={color} style={{marginRight: 25}}></Ionicons>
                        )
                    }}
                />

                <Drawer.Screen
                    name='(tabs)/Settings'
                    options={{
                        drawerLabel: 'Settings',
                        headerTitle: 'Settings',
                        drawerIcon: ({size, color}) => (
                            <Ionicons name="settings" size={size} color={color} style={{marginRight: 25}}></Ionicons>
                        )
                    }}
                />

                <Drawer.Screen
                    name='(tabs)/SignOut'
                    options={{
                        drawerLabel: 'Sign Out',
                        headerTitle: 'SignOut',
                        drawerIcon: ({size, color}) => (
                            <Ionicons name="log-out" size={size} color={color} style={{marginRight: 25}}></Ionicons>
                        )
                    }}
                />
            </Drawer>


        </GestureHandlerRootView>
    );
}
