import { StyleSheet, Text, View, ImageBackground, TouchableOpacity} from 'react-native';
import React from 'react';
import { useFonts } from "expo-font";
import { StatusBar } from 'expo-status-bar';

/**
 * StartingScreen component represents the initial screen of the CommuRide application.
 * It includes a background image, the CommuRide title, and buttons for logging in or signing up.
 *
 * @param {Object} navigation - The navigation object used to navigate between screens.
 */

const StartingScreen = ({ navigation }) => {
    const title = "CommuRide";
    const image = { uri: 'https://wallpapers.com/images/high/city-iphone-qy4xod9kblj4fl0p.webp' };
    const [fontsLoaded] = useFonts({
        RacingSansOne: require("../assets/fonts/RacingSansOne-Regular.ttf"),
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={styles.container}>
            <ImageBackground source={image} blurRadius={0.7} resizeMode="cover" style={styles.image}>
                <View style={{ height: "50%", width: "100%", justifyContent: "center", alignItems: "center" }}>
                    <TouchableOpacity>
                        <Text style={{ fontSize: 40, fontFamily: "RacingSansOne" }}>{title}</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: "50%", width: "100%", alignItems: "center", justifyContent: "center" }}>
                    <TouchableOpacity activeOpacity={0.6} style={styles.button} onPress={() => navigation.navigate('Log In')}>
                        <View>
                            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 17 }}>Log In</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.6} style={styles.button} onPress={() => navigation.navigate('Sign Up')}>
                        <View>
                            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 17 }}>Sign Up</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <StatusBar style="auto" />
            </ImageBackground>
        </View>
    );
}


// Styles
export default StartingScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "space-around",
    },

    button: {
        backgroundColor: 'black',
        width: "55%",
        height: "13%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        borderRadius: 30,
    },

    image: {
        flex: 1,
        justifyContent: 'center',
        width: "100%",
        height: "100%",
        opacity: 1,
    },
});
