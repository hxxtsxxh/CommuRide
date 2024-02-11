import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import { auth } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from '../config';

/**
 * Functional component for the sign-up screen.
 *
 * @param {object} navigation - The navigation object provided by React Navigation.
 * @returns {JSX.Element} Sign-up screen JSX.
 */

const SignUpScreen = ({ navigation }) => {

  // State variables for user input fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(async (userCredentials) => {
        const user = userCredentials.user;

        // Store additional user details in Firestore

        await setDoc(doc(db, "users", user.uid), {
          name: name,
          email: email,
          phoneNumber: phoneNumber,
          uid: user.uid,
        }).then(() => {
        }).catch((error) => {
        });

        // Navigate to the "Home" screen
        navigation.replace("Home")
      })
      .catch(error => alert(error.message))
  }

  // JSX structure for the sign-up screen
  return (
    <ImageBackground source={{ uri: 'https://wallpapers.com/images/high/city-iphone-qy4xod9kblj4fl0p.webp' }} blurRadius={0.7} resizeMode="cover" style={styles.background}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <Text style={styles.title}>Create an Account</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor={"#807877"}
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor={"#807877"}
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={"#807877"}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={"#635d5c"}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>Terms and Conditions</Text>
        </View>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: "white",
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  signUpButton: {
    width: '80%',
    height: 50,
    backgroundColor: 'black',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  termsText: {
    color: 'white',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});

export default SignUpScreen;
