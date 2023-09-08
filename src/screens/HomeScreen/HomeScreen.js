import React from 'react';
import { View, Text, TouchableOpacity} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {

    const goto = () => {
        navigation.navigate('PlantData');
       //navigation.navigate('DataScreen');
      // navigation.navigate('HomeScreen');
    };

    return (
      
        <View>
        <GestureHandlerRootView>
                <TouchableOpacity  onPress={() => navigation.goBack()} >
                <Text>Fetch Plants</Text>
            </TouchableOpacity>
        </GestureHandlerRootView>
        </View>
           
   
    );
};

export default HomeScreen;


