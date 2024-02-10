import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { db } from '../config';
import { collection, query, where, getDocs} from "firebase/firestore";
import {auth} from "../firebase";


const HomeScreen = ({ navigation }) => {

  const [userData, setUserData] = useState();

  useEffect(() => {
    fetchData();
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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{userData && (
        <View>
          <Text>Name: {userData.name}</Text>
          <Text>Email: {userData.email}</Text>
          <Text>Phone Number: {userData.phoneNumber}</Text>
        </View>
      )}</Text>
    </View>
  );
}


export default HomeScreen;

// When the screen is first called, the current users unique identifier is found
// and is then used to gain access to their data.
// Currently that data is being displayed.


