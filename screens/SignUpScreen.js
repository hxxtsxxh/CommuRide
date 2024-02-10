import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import {auth} from "../firebase";
import { doc, setDoc} from "firebase/firestore";
import { db } from '../config';

const SignUpScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(async (userCredentials) => {
        const user = userCredentials.user;
        console.log('Registered with:', user.email);
        await setDoc(doc(db, "users", user.uid), {
          name: name,
          email: email,
          phoneNumber: phoneNumber,
          uid: user.uid,
        }).then(() => {
          console.log('data submitted');
        }).catch((error) => {
          console.log(error);
        });
        navigation.replace("Home")
      })
      .catch(error => alert(error.message))
  }

  return (
    <ImageBackground source={{uri: 'https://wallpapers.com/images/high/city-iphone-qy4xod9kblj4fl0p.webp'}} blurRadius={0.7} resizeMode="cover" style={styles.background}>
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
    backgroundColor: 'rgba(0,0,0,0.5)', // Add some opacity to make text readable
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
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Adjust opacity here
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
});

export default SignUpScreen;

// Once the user inputs their name, email, phone number, and password; we store them as variables
// We then add the users name, email, and phone number into firebase alongside their unique identifier, which is also where the data is stored
// This is very important as it can be used to access the data later on.
// Once the data has been registered, the screen switches to the home screen
