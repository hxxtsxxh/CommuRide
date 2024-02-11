import React, { useState, useEffect, useRef } from 'react';
import { View, Text, BackHandler, StyleSheet, Platform, TouchableOpacity, Animated, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { db } from '../../config';
import { collection, query, where, getDocs} from "firebase/firestore";
import { auth } from "../../firebase";
import HistoryScreen from './HistoryScreen'; // Import your HistoryScreen component
import SettingsScreen from './SettingsScreen'; // Import your SettingsScreen component
import QuoteCarousel from '../../components/QuoteCarousel1';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo, otherwise import icons from a different library

const Tab = createBottomTabNavigator();

const HomeScreen = ({ navigation }) => {

  // Define state variables
  const [userData, setUserData] = useState(); // State to hold user data
  const [userLocation, setUserLocation] = useState(null); // State to hold user location
  const fadeAnim = useRef(new Animated.Value(0)).current; // Create a ref for fade animation

  // Fetch data and navigate to Dashboard screen on initial render
  useEffect(() => {
    fetchData(); // Function to fetch user data and location
    navigation.navigate("Dashboard"); // Navigate to Dashboard screen
  }, []);

  // Perform fade-in animation when component mounts
  useEffect(() => {
    // Configure fade-in animation
    Animated.timing(
      fadeAnim,
      {
        toValue: 1, // Target opacity value
        duration: 2000, // Duration of animation in milliseconds
        useNativeDriver: true, // Use native driver for performance
      }
    ).start(); // Start the animation
  }, []);

  // This fetches the data of the user who logs in or signs up.
  // For now this just prints Full Name, phoneNumber, email, etc..
  const fetchData = async () => {
    // Get the currently logged-in user's UID
    const currentUserUID = auth.currentUser.uid;
    console.log(currentUserUID);

    // Construct a Firestore query to get user data based on UID
    const q = query(collection(db, "users"), where("uid", "==", currentUserUID));

    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          setUserData(doc.data());
          setUserLocation(doc.data().location);
        });
      } else {
        console.log("No user data found for the current user.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // The following code will use a layout effect that will disable the ability to go back a page
  // once on the home screen.

  React.useLayoutEffect(() => {
    navigation.setOptions({
      gestureEnabled: false, // Disable swipe gesture
    });
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // prevents navigating back to Start Screen
        return true; // Returning true prevents default behavior (navigating back)
      };

      // Add event listener for the hardware back button (for android)
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      // Cleanup function to remove the event listener (this needs to happen afterwards)
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarLabelStyle: { color: 'black' },
          tabBarStyle: { backgroundColor: 'rgba(133, 147, 93, 1)' },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let iconColor = focused ? 'black' : 'black'; // Set active color to #0c023f when focused

            if (route.name === 'Dashboard') {
              iconName = focused ? 'home' : 'home-outline'; // Using Ionicons for home icon
            } else if (route.name === 'History') {
              iconName = focused ? 'time' : 'time-outline'; // Using Ionicons for history icon
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline'; // Using Ionicons for settings icon
            }

            // You can return any component here as the icon for the tab.
            return <Ionicons name={iconName} size={size} color={iconColor} />;
          },
        })}
      >
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Dashboard">
          {() => <HomeContent userData={userData} navigation={navigation} fadeAnim={fadeAnim} />}
        </Tab.Screen>
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </View>
  );
}

const HomeContent = ({ userData, navigation, fadeAnim }) => {
  const handleGiveRide = () => {
    // Navigate to GiveRideScreen
    navigation.navigate('Giving');
  };

  const handleGetRide = () => {
    // Navigate to GetRideScreen
    navigation.navigate('Sharing');
  };

  // imports custom made images to put on top of buttons in home
  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.welcomeContainer}>
        {userData && (
          <Text style={styles.welcomeText}>Welcome {userData.name.trim().split(' ')[0]}!</Text>
        )}
      </View>
      <View style= {styles.bodyContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleGiveRide}>
            <Image source={require('../../assets/images/driver.png')} style={styles.image} />
            <Text style={styles.buttonText}>Give a ride</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleGetRide}>
            <Image source={require('../../assets/images/rider.png')} style={styles.image} />
            <Text style={styles.buttonText}>Receive a ride</Text>
          </TouchableOpacity>
        </View>
        <QuoteCarousel />
      </View>
    </Animated.View>
  );
}

export default HomeScreen;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D7D1C4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyContainer: {
    marginTop: 300,
    height: 700,
    alignItems: "center",
  },
  welcomeContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 70 : 40, // Adjusted for iOS notch
    left: 20,
  },
  welcomeText: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#0c023f',
  },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: "10%",
    gap: 30,
  },
  button: {
    width: "43%",
    height: "80%",
    backgroundColor: '#351C5E',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 1,
    elevation: 10,
    shadowRadius: 150,
    shadowOffset : { width: 1, height: 13},
    position: 'relative', // To position the image relative to the button
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 35, // Adjust the margin between the image and text
  },
  image: {
    position: 'absolute', // Position the image absolute to overlay it on the button
    top: 45, // Adjust the positioning of the image
    width: 130, // Adjust the width of the image
    height: 130, // Adjust the height of the image
  },
});
