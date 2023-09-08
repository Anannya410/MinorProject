import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SplashScreen from '../screens/SplashScreen';
import SupportScreen from '../screens/SupportScreen';
import MainScreen from "../screens/LandingPage/LandingPage";
import MainScreen2 from "../screens/MainScreen2/MainScreen2.js"
import DrawerScreen from "../screens/DrawerScreen"; 
import ParentScreen from "../screens/ParentScreen";
import ChildScreen from "../screens/ChildScreen/ChildScreen"
import AboutScreen from '../screens/AboutScreen';
import SignOutScreen from '../screens/SignOutScreen/SignOutScreen';
import UserScreen from '../screens/UserScreen/UserScreen';
import Terms_PrivacyScreen from '../screens/Terms_PrivacyScreen/Terms_PrivacyScreen';
import RegisterSuccessAnimation from "../screens/RegistrationSuccessAnimation/RegistrationSuccessAnimation";
import DataScreen from '../screens/DataScreen/DataScreen';
import VerifyOTP from '../screens/VerifyOTPScreen/VerifyOTPScreen';
import HomeScreen from '../screens/IdentifyPlant/IdentifyPlant';
import WeatherScreen from '../screens/WeatherScreen/WeatherScreen';
import BottomNavigator from '../screens/BottomNavigator/BottomNavigator.js';
import IdentifyPlant from '../screens/IdentifyPlant/IdentifyPlant.js';
import LandingPage from '../screens/LandingPage/LandingPage.js';
import PlantData from '../screens/PlantData/PlantData';

const Stack = createNativeStackNavigator();
const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Main2" component={MainScreen2}/>
        <Stack.Screen name="Parent" component={ParentScreen} />
        <Stack.Screen name="Child" component={ChildScreen}/>
        <Stack.Screen name="Support" component={SupportScreen} />
        <Stack.Screen name="Drawer" component={DrawerScreen} />
        <Stack.Screen name="About" component={AboutScreen}/>
        <Stack.Screen name="SignOut" component={SignOutScreen}/>
        <Stack.Screen name="User" component={UserScreen}/>
        <Stack.Screen name = "Terms_Privacy" component={Terms_PrivacyScreen}/>
        <Stack.Screen name = "RegisterSuccess" component ={RegisterSuccessAnimation} />
        <Stack.Screen name= "DataScreen" component ={DataScreen}/>
        <Stack.Screen name= "VerifyOTP" component = {VerifyOTP}/>
        <Stack.Screen name= "Home" component = {HomeScreen}/>
        <Stack.Screen name= "Weather" component = {WeatherScreen}/>
        <Stack.Screen name= "Bottom" component = {BottomNavigator}/>
        <Stack.Screen name = "Identify" component = {IdentifyPlant}/>
        <Stack.Screen name = "LandingPage" component = {LandingPage}/>
        <Stack.Screen name = "PlantData" component = {PlantData}/>
      </Stack.Navigator>
    </NavigationContainer>
    
  );
};

export default Navigation;