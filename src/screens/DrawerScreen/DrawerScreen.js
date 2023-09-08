import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import SupportScreen from '../SupportScreen/SupportScreen';
import AboutScreen from '../AboutScreen/AboutScreen';
import MainScreen from '../LandingPage/LandingPage';
import SignOutScreen from '../SignOutScreen/SignOutScreen';
import UserScreen from '../UserScreen/UserScreen';
import MainScreen2 from '../MainScreen2/MainScreen2.js';
import Logo from '../../../assets/Images/plantlogo.png';
import LogoName from "../../../assets/Images/logoName.png";
import Terms_PrivacyScreen from '../Terms_PrivacyScreen/Terms_PrivacyScreen';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const navigation = useNavigation();

  const handleSupportPress = () => {
    navigation.navigate('Support');
  };

  const renderDrawerItem = (iconName, text, onPress) => {
    return (
      
      <TouchableOpacity onPress={onPress} style={styles.drawerItemContainer}>
        <Icon name={iconName} size={28} color="#333" />
        <Text style={styles.drawerItemText}>{text}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <Image source={LogoName} style={{ width: 140, height: 40 }} />
      </View>
      {renderDrawerItem('search','Identify Plant',()=>navigation.navigate('Home'))}
      {renderDrawerItem('location','Change Location',()=>navigation.navigate('Main2'))}
      {renderDrawerItem('person-outline', 'User', () => navigation.navigate('User'))}
      {renderDrawerItem('information-circle-outline', 'Support', handleSupportPress)}
      {renderDrawerItem('help-circle-outline', 'About', () => navigation.navigate('About'))}
      {renderDrawerItem('document-outline', 'Terms & Conditions', () => navigation.navigate('Terms&Conditions'))}
      {renderDrawerItem('log-out-outline', 'Sign Out', () => navigation.navigate('SignOut'))}
      
      <View style={styles.footer}>
        <Image
          source={require('../../../assets/Images/plantlogo.png')}
          style={styles.footerImage}
          resizeMode="contain"
        />
        <Text style={styles.footerText}>Design and Developed by A&A</Text>
      </View>
    </DrawerContentScrollView>
  );
};

const DrawerScreen = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="Grow"
        component={MainScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#C3EDC0',
          },
          headerTitleAlign: 'center',
          headerTitle: () => <Image source={LogoName} style={{ width: 140, height: 40 }} />,
          headerRight: () => null,
        }}
      />
      <Drawer.Screen name="User" component={UserScreen} options={{ headerShown: false }} />
      <Drawer.Screen name="Support" component={SupportScreen} options={{ headerShown: false }} />
      <Drawer.Screen name="About" component={AboutScreen} options={{ headerShown: false }} />
      <Drawer.Screen name="Terms&Conditions" component={Terms_PrivacyScreen} options={{ headerShown:false }} />
      <Drawer.Screen name="SignOut" component={SignOutScreen} options={{ headerShown: false }} />
      <Drawer.Screen name="Main2" component={MainScreen2} option={{headerShown:false}}/>
    </Drawer.Navigator>

    
  );
};
const styles = StyleSheet.create({
  drawerItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 16,
  },
  drawerItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 150,
    //backgroundColor: '#F4F8FD',
    borderTopWidth: 1,
    borderTopColor: 'white',//'#D3DCE6',
  },
  footerText: {
    fontSize: 12,
    color: '#888',
  },
  footerImage: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
});

export default DrawerScreen;