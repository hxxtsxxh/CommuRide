import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { auth } from '../firebase';

/**
 * LoginScreen component for user authentication.
 * Allows users to log in using email and password.
 * Redirects authenticated users to the Home screen.
 *
 * @param {object} navigation - React Navigation prop for navigating between screens.
 * @returns {JSX.Element} - Rendered component for user login.
 */

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');



  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.replace("Home") // TODO: MAKE THIS GO TO THE HOME PAGE
      }
    })

    return unsubscribe
  }, [])

  const handleLogin = () => {
    auth
    .signInWithEmailAndPassword(email, password)
    .then(userCredentials => {
      const user = userCredentials.user;

    })
    .catch(error => alert(error.message))
  };

  return (
    <ImageBackground source={{uri: 'https://wallpapers.com/images/high/city-iphone-qy4xod9kblj4fl0p.webp'}} blurRadius={0.7} resizeMode="cover" style={styles.background}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <Text style={styles.title}>Welcome Back!</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={"#807877"}
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={"#807877"}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log In</Text>
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
    width: '100%',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#ffffff', // Set text color to white
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Adjust opacity here
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },

  loginButton: {
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

export default LoginScreen;

// The user inputs their email and password which we then authenticate
// if it exists we move to home screen else we alert them that something is wrong
