import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StartingScreen from './screens/StartingScreen';
import LogInScreen from './screens/LogInScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='StartScreen'
        screenOptions={{
          headerShown: false,
          presentation: 'card',
          stackPresentation: 'card',
          animation: 'slide_from_bottom',
        }}
      >
        <Stack.Screen name="Start Screen" component={StartingScreen} />
        <Stack.Screen name="Log In" component={LogInScreen} />
        <Stack.Screen name='Sign Up' component={SignUpScreen} />
        <Stack.Screen name='Home' component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// First we create a stack and initialize all of the Screens in the app.
// We also set the presentation style to card, which is just how the screen
// is displayed and also how it transitions
