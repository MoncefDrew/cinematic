
import {Text, View} from "react-native";
import { StyleSheet } from 'react-native';

export default function Popular() {


    return (
        <View style={[styles.container, { backgroundColor: '#14171C' }]}>
            <Text style={styles.text}>Popular</Text>
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