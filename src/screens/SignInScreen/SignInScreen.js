import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  useWindowDimensions,
  TextInput,
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import Logo from '../../../assets/Images/logoName.png';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../components/context';
import RNRestart from 'react-native-restart';
import LinearGradient from 'react-native-linear-gradient';
import { ActivityIndicator } from 'react-native';
import plantLogo from '../../../assets/Images/plantlogo.png';
//192.168.97.162
const SignInScreen = () => {
   let url = "http://192.168.97.162/Integrate/login.php"
   const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const { height } = useWindowDimensions();
  const navigation = useNavigation();
  const [IsOffline, setIsOffline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const offline = !(state.isConnected && state.isInternetReachable);
      console.log("offline:", offline);
      setIsOffline(offline);
    });

    return () => removeNetInfoSubscription();
  }, []);

  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ phone: phone })
  };

  const login = async () => {
    try {
      fetch(
        "http://192.168.97.162/Integrate/login.php", requestOptions, 100)
        .then((response) => response.json())
        .then(async response => {
          console.log("Message: ", response.Message);
          if (response.status == "Success") {
            await AsyncStorage.setItem("IsLoggedIn", JSON.stringify(true));
            if(response.name) await AsyncStorage.setItem("name", response.name);
            if(response.phone)  await AsyncStorage.setItem("phone", response.phone);
            if(response.age) await AsyncStorage.setItem("age",response.age);
            if(response.gender) await AsyncStorage.setItem("gender",response.gender)
            if(response.designation) await AsyncStorage.setItem("designation", response.designation);
            if(response.address) await AsyncStorage.setItem("address", response.address);
            if(response.district)await AsyncStorage.setItem("district",response.district);
            if(response.state) await AsyncStorage.setItem("state", response.state);
            //await AsyncStorage.setItem("pinCode", response.pin);

            setPhone('');
            setIsLoading(false);
            //RNRestart.Restart();
            navigation.navigate('Parent');

          } else {
            alert(response.Message);
            setIsLoading(false);
            setPhone('');
          }
        })
        .catch((error) => {
          alert(error);
          console.log(error);
          setIsLoading(false);
          setPhone('');
        });
    } catch (error) {
      alert("error", error);
    }
  };

  const onSignInPressed = () => {
    if (phone.length === 10 && !IsOffline) {
      setIsLoading(true);
      login();
      navigation.navigate('Parent');
    } else if (IsOffline) {
      alert('Please check your internet connection');
    } else {
      alert('Phone number should be of valid 10 digits');
    }
  };
  const onSignUpPress = () => {
    navigation.navigate('SignUp');
  };

  return (

    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={Logo}
          style={[styles.logo, { height: height * 0.25 }]}
          resizeMode="contain"
        />
         <View style={styles.header}>
                <Animatable.Image
                    animation="bounceIn"
                    duraton="1500"
                    source={plantLogo}
                    style={styles.logoIcon}
                    resizeMode="contain"
                />
            </View>

        
          <TextInput
          name="username"
          placeholder="User Name"
          value={username}
          onChangeText={text =>
            setUsername(text)}
          style={{ ...styles.input, backgroundColor: 'white' }}
        />

        <TextInput
          name="phone"
          placeholder="Phone Number"
          value={phone}
          onChangeText={(text) => {
            const numericRegex = /^[0-9]{0,10}$/;
            if (numericRegex.test(text)) {
              setPhone(text);
            }
          }}
          style={{ ...styles.input, backgroundColor: 'white' }}
          keyboardType="numeric"
          maxLength={10}
        />


        <CustomButton
          text={'Sign In'}
          onPress={onSignInPressed}
          style={styles.signInButton}
          textStyle={styles.signInButtonText}
        />

        <CustomButton
          text="Don't have an account? Register"
          onPress={onSignUpPress}
          type="TERTIARY"
          style={styles.signUpButton}
          textStyle={styles.signUpButtonText}
        />
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Please wait...</Text>
        </View>
      ) : null}
      <View style={styles.footer}>
        <Image
          source={require('../../../assets/Images/logoName.png')}
          style={styles.footerImage}
          resizeMode="contain"
        />
        <Text style={styles.footerText}>Design and Developed by A&A</Text>
      </View>
    </View>
  );
};
const { height } = Dimensions.get("screen");
const height_logo = height * 0.22;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4EAF7',
    //backgroundColor: '#4285F4',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: '60%',
    maxWidth: 300,
    maxHeight: 200,
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#E1EDF9',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
    fontSize: 16,
    color: '#444',
  },
  signInButton: {
    marginBottom: 15,
    backgroundColor: '#1E88E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  signUpButton: {
    backgroundColor: 'transparent',
    marginBottom: 5,
    fontSize: 16,
  },
  signUpButtonText: {
    fontSize: 14,
    color: '#1E88E5',
  },
  emblemLogo: {
    width: 100,
    height: 100,
    marginTop: 20,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#F4F8FD',
    borderTopWidth: 1,
    borderTopColor: '#D3DCE6',
  },
  footerText: {
    fontSize: 14,
    color: '#888',
  },
  footerImage: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 999,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    fontFamily: 'Helvetica',
  },
  logoIcon: {
    width: height_logo,
    height: height_logo,
    marginTop:-100,
    //alignSelf: 'center',
},
});

export default SignInScreen;
