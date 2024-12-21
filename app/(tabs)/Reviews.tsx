import {Drawer} from "expo-router/drawer";
import {Ionicons} from "@expo/vector-icons";
import {StyleSheet, Text, View} from "react-native";

export default function Reviews() {


    return (
        <View style={[styles.container, { backgroundColor: '#14171C' }]}>
            <Text style={styles.text}>Reviews</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#ffffff',
        fontSize: 20,
    },
});