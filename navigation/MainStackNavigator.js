import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LogoScreen from '../screens/LogoScreen';
import SignupScreen from '../screens/SignupScreen';
import SuccessScreen from '../screens/SuccessScreen';
import PhotoDisplayScreen from '../screens/PhotoDisplayScreen';
import FinalPostScreen from '../screens/FinalPostScreen';
import FeedScreen from '../screens/FeedScreen';
import MapScreen from '../screens/MapScreen';
import ReportScreen from '../screens/ReportScreen';

import RedditStyleFeed  from '../screens/RedditStyleFeed';
import LoginScreen from '../screens/LoginPage';
const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Logo">
      <Stack.Screen name="RedditStyleFeed" component={RedditStyleFeed} />  
        <Stack.Screen name="Logo" component={LogoScreen} />
        <Stack.Screen name="LoginPage" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Success" component={SuccessScreen} />
        <Stack.Screen name="PhotoDisplay" component={PhotoDisplayScreen} />
        <Stack.Screen name="FinalPost" component={FinalPostScreen} />
        <Stack.Screen name="Feed" component={FeedScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Report" component={ReportScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
