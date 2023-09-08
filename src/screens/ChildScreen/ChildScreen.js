import { View, Text } from 'react-native'
import React from 'react'
import BottomNavigator from '../BottomNavigator/BottomNavigator';

const ChildScreen = (navigation) => {
  return (
    <View style={{flex:1}}>
    <BottomNavigator/>
    </View>
  )
}

export default ChildScreen;