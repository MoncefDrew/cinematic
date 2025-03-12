import { useFonts } from "expo-font";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/api/store/AuthStore";
import { Text } from "react-native";
// Import Screens
import Popular from "@/app/(tabs)/Popular";
import Program from "@/app/(tabs)/Program";
import Profile from "@/app/(tabs)/Profile";
import MovieDetails from "@/app/(tabs)/MovieDetails";
import ReserveTicket from "@/app/(tabs)/ReserveTicket";
import TicketPage from "@/app/(tabs)/TicketPage";
import WelcomeScreen from "./welcomescreen";
import aboutApp from "./aboutApp";
import SignUpPage from "./auth/sign-up";
import SignInPage from "./auth/sign-in";
import LandingPage from "@/app/auth";
import MyTickets from "./(tabs)/myTickets";
import Activity from "@/app/(tabs)/Activity";
import { DefaultTheme } from "@react-navigation/native";
import Browse from "./(tabs)/Search";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/components/ui/toast";
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const CinematicColors = {
  background: "#0A0B1E",
  surface: "#12132D",
  primary: "#6366F1",
  primaryLight: "#818CF8",
  accent: "#4F46E5",
  accentSoft: "rgba(99, 102, 241, 0.15)",
  text: "#FFFFFF",
  textSecondary: "#9B9BC0",
  border: "#1E2048",
  cardBackground: "#181935",
};
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "black", // Set this to your desired background color
  },
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
          paddingTop: 10,
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
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontFamily: "Satoshi",
          fontSize: 12,
          paddingTop: 6,
        },
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
              color={
                focused
                  ? CinematicColors.primary
                  : CinematicColors.textSecondary
              }
            />
          ),
        }}
      />
      <Tab.Screen
        name="Activity"
        component={Activity}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="podium"
              size={28}
              color={
                focused
                  ? CinematicColors.primary
                  : CinematicColors.textSecondary
              }
            />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Browse}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="search"
              size={28}
              color={
                focused
                  ? CinematicColors.primary
                  : CinematicColors.textSecondary
              }
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
              color={
                focused
                  ? CinematicColors.primary
                  : CinematicColors.textSecondary
              }
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
              color={
                focused
                  ? CinematicColors.primary
                  : CinematicColors.textSecondary
              }
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
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Satoshi: require("../assets/fonts/Satoshi-Variable.ttf"),
    Poppins: require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // First, make sure you have the Toast component rendered at the root of your app
  // Add this at the end of your RootLayout return statement, after your current JSX

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        // Fetch user details from the store
        const { user } = useAuthStore.getState();
        // Show welcome toast when user is logged in
        Toast.show({
          type: "success",
          text1: `Welcome back, ${user?.username || session.user.email}!`, // Use username from the store or fallback to email
          visibilityTime: 3000,
          position: "top",
          topOffset: 50, // Distance from the top of the screen
        });
      }
    });
  
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // Show toast when auth state changes to signed in
      if (_event === "SIGNED_IN" && session?.user) {
        const { user } = useAuthStore.getState();
        Toast.show({
          type: "success",
          text1: `Welcome back, ${user?.username || session.user.email}!`, 
          visibilityTime: 3000,
          position: "top",
          topOffset: 50,
        });
      }else{
        Toast.show({
          type: "error",
          text1: "Signed Out ", 
          visibilityTime: 3000,
          position: "top",
          topOffset: 50,
        });
      }
    });

    
  }, []);
  

  // Add this before your RootLayout function

  if (!loaded) return null;

  return (
    <>
      <StatusBar style="light" backgroundColor="transparent" />
      {session && session.user ? <MainStack /> : <AuthStack />}
      <Toast config={toastConfig} /> {/* Add this line */}
    </>
  );
}

function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: CinematicColors.background },
        detachPreviousScreen: false, // Prevents unmounting
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="MovieDetails" component={MovieDetails} />
      <Stack.Screen name="ReserveTicket" component={ReserveTicket} />
      <Stack.Screen name="TicketPage" component={TicketPage} />
      <Stack.Screen name="myTickets" component={MyTickets} />
      <Stack.Screen name="Activity" component={Activity} />
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
