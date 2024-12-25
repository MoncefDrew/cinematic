import {TextInput, TouchableOpacity, Text, View, StyleSheet} from "react-native";
import type {DrawerNavigationProp} from '@react-navigation/drawer';
import React from "react";
import {Colors} from "@/constants/Colors";
import SearchButton from "@/components/searchButton";
import {Ionicons} from "@expo/vector-icons";

type DrawerNavigation = DrawerNavigationProp<any>; // Replace `any` with your custom drawer param list type if available

type CustomHeaderProps = {
    navigation: DrawerNavigation;
    title: string;
};


const CustomHeader: React.FC<CustomHeaderProps> = ({navigation, title}) => {
    return (
        <View style={styles.headerContainer}>
            {/* Drawer Toggle Button */}


        </View>
    );
}
export default CustomHeader;
const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.theme.currentTab,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    menuButton: {
        padding: 10,
    },
    menuText: {
        fontSize: 24,
        color: 'white',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    searchBarContainer: {
        flex: 1,
        marginLeft: 10,
    },
    searchInput: {
        backgroundColor: 'white',
        borderRadius: 5,
        height: 40,
        paddingHorizontal: 10,
    },
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
