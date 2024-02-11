import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import InitialScreen from './screens/InitialScreen'; // Import InitialScreen component
import StartingScreen from './screens/StartingScreen';
import LogInScreen from './screens/LogInScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/tabScreens/HomeScreen';
import SettingsScreen from './screens/tabScreens/SettingsScreen';
import HistoryScreen from './screens/tabScreens/HistoryScreen';
import GiveRideScreen from './screens/GiveRideScreen';
import ShareRideScreen from './screens/ShareRideScreen';
import ListScreen from './screens/ListScreen';
import RideCard from './components/RideCard';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="InitialScreen"
        screenOptions={{
          headerShown: false,
          presentation: 'card',
          stackPresentation: 'card',
          animation: 'slide_from_bottom',
        }}
      >
        <Stack.Screen name="InitialScreen" component={InitialScreen} />
        <Stack.Screen name="Start Screen" component={StartingScreen} />
        <Stack.Screen name="Log In" component={LogInScreen} />
        <Stack.Screen name='Sign Up' component={SignUpScreen} />
        <Stack.Screen name="List Screen" component={ListScreen} options={{presentation: "modal"}} />
        <Stack.Screen name='Home' component={HomeScreen} options={{ gestureEnabled: false }}/>
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Giving" component={GiveRideScreen} options={{ presentation: 'modal' }}/>
        <Stack.Screen name="Sharing" component={ShareRideScreen} options={{ presentation: 'modal' }}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}
