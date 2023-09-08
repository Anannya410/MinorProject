import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../HomeScreen/HomeScreen';
import IdentifyPlant from '../IdentifyPlant/IdentifyPlant';
import WeatherScreen from '../WeatherScreen/WeatherScreen';

import { View, Text, StyleSheet } from 'react-native';

const Bottom = createBottomTabNavigator();

const BottomNavigator = () => {
  return (
    <Bottom.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeScreen') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'Identify') {
            // iconName = focused ? 'list' : 'list';
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Weather') {
            iconName = focused ? 'cloudy' : 'cloudy-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'blue', // Change the active icon color
        inactiveTintColor: 'gray', // Change the inactive icon color
        style: styles.tabBar,
        labelStyle: styles.tabLabel,
      }}
    >
      <Bottom.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Bottom.Screen name="Identify" component={IdentifyPlant} options={{ headerShown: false }} />
      <Bottom.Screen name="Weather" component={WeatherScreen} options={{ title: 'Weather' }} />
    </Bottom.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white', // Change the background color of the tab bar
  },
  tabLabel: {
    fontSize: 12,
  },
});

export default BottomNavigator;
