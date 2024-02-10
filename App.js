import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import StartingScreen from './screens/StartingScreen';
import LogInScreen from './screens/LogInScreen';
import SignUpScreen from './screens/SignUpScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='StartScreen' screenOptions={{headerShown: false}}>
        <Stack.Screen name="StartScreen" component= {StartingScreen}/>
        <Stack.Screen name="LogInScreen" component={LogInScreen} />
        <Stack.Screen name='SignUpScreen' component={SignUpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
  };
