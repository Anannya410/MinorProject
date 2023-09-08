
import React from 'react';
import { View, Image, TouchableOpacity, FlatList, StyleSheet ,Text} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import BottomNavigator from "../BottomNavigator/BottomNavigator"
import ChildScreen from "../ChildScreen/ChildScreen"

 import img1 from '../../../assets/flower/1_LawsoniaAlba.jpeg';
 import img2 from '../../../assets/flower/2_NyctanthesArbortristis.jpeg';
 import img3 from '../../../assets/flower/3_ThevetiaNeriifolia.jpeg';
 import img4 from '../../../assets/flower/4_CapparisSpinosa.jpeg';
 import img5 from '../../../assets/flower/5_EuphorbiaNivulia.jpeg';
 import img6 from '../../../assets/flower/6_TerminaliaArjuna.jpeg';
 import img7 from '../../../assets/flower/7_PeltophorumInerme.png';
 import img8 from '../../../assets/flower/8_ButeaMonosperma.jpg';
 import img9 from '../../../assets/flower/9_BauhiniaPurpurea.jpg';
 import img10 from '../../../assets/flower/10_BTomentosa.jpeg';
 import img11 from '../../../assets/flower/11_TamarindusIndica.jpg';
 import img12 from '../../../assets/flower/12_AzadirachtaIndica.jpg';
 import img13 from '../../../assets/flower/13_AegleMarmelos.jpg';
 import img14 from '../../../assets/flower/14_AilanthusExcelsa.jpeg';
 import img15 from '../../../assets/flower/15_SoymidaFebrifuga.jpeg';
 import img16 from '../../../assets/flower/1_LawsoniaAlba.jpeg';
 import img17 from '../../../assets/flower/2_NyctanthesArbortristis.jpeg';
 import img18 from '../../../assets/flower/3_ThevetiaNeriifolia.jpeg';
 import img19 from '../../../assets/flower/4_CapparisSpinosa.jpeg';

 const images = [
   img1,
   img2,
   img3,
   img4,
   img5,
   img6,
   img7,
   img8,
   img9,
   img10,
   img11,
   img12,
   img13,
   img14,
   img15,
   img16,
   img17,
   img18,
   img19,
 ];
const logoName = require("../../../assets/Images/logoName.png");
const logo = require("../../../assets/Images/plantogo.png");
const MainScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>

        <ChildScreen/>

      {/* <ScrollView style={styles.scrollView}>
        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              // Handle image 
            }}
          >
            <View style={styles.imageContainer}>
              <Image source={image} style={styles.image} />
            </View>
          </TouchableOpacity>
        ))}
        
      </ScrollView> */}
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    padding: 20,
  },
  imageContainer: {
    marginBottom: 20,
    borderRadius: 10, 
    overflow: 'hidden', 
  },
  image: {
    width: '100%',
    height: 200, 
    resizeMode: 'cover',
  },
});

export default MainScreen;