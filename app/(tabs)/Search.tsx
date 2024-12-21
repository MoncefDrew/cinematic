import {View, Text, StyleSheet} from 'react-native';


export default function Search() {


    return (
        <View style={[styles.container, {backgroundColor: '#14171C'}]}>
            <Text style={styles.text}>Search</Text>
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