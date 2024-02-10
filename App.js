import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StartingScreen from './screens/StartingScreen';
import LogInScreen from './screens/LogInScreen';
import SignUpScreen from './screens/SignUpScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='StartScreen'
        screenOptions={{
          headerShown: false,
          presentation: 'modal', // Set presentation to modal
          stackPresentation: 'modal', // Set stack presentation to modal
          animation: 'slide_from_bottom', // Custom transition animation
        }}
      >
        <Stack.Screen name="Start Screen" component={StartingScreen} />
        <Stack.Screen name="Log In" component={LogInScreen} />
        <Stack.Screen name='Sign Up' component={SignUpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
