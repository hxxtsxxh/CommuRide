import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');

  const handleLogin = () => {
    let valid = true;

    if (!phoneNumber || phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
      setPhoneNumberError('Phone number must be 10 digits and contain only numbers.');
      valid = false;
    } else {
      setPhoneNumberError('');
    }

    if (valid) {
      // Your login logic here
      console.log('phone number:', phoneNumber, '\npassword:', password);
    }
  };

  const clearError = (fieldName) => {
    switch(fieldName) {
      case 'phoneNumber':
        setPhoneNumberError('');
        break;
      default:
        break;
    }
  };

  return (
    <ImageBackground source={{uri: 'https://wallpapers.com/images/high/city-iphone-qy4xod9kblj4fl0p.webp'}} blurRadius={0.7} resizeMode="cover" style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back!</Text>
        <TextInput
          style={[styles.input, phoneNumberError ? styles.errorInput : null]}
          placeholder="Phone Number"
          placeholderTextColor={"#807877"}
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          onFocus={() => clearError('phoneNumber')}
        />
        {phoneNumberError ? <Text style={styles.error}>{phoneNumberError}</Text> : null}

        <TextInput
          style={[styles.input, phoneNumberError ? styles.errorInput : null]}
          placeholder="Password"
          placeholderTextColor={"#807877"}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
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
  error: {
    color: 'red',
    marginBottom: 10,
  },
  errorInput: {
    borderColor: 'red',
    borderWidth: 1,
  },
});

export default LoginScreen;
