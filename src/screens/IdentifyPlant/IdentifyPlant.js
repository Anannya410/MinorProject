
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, Alert } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import Permissions from 'react-native-permissions';
import { PermissionsAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import rainyBackground from '../../../assets/Images/rain.png';
import snowyBackground from '../../../assets/Images/snow.png';
import cloudyBackground from '../../../assets/Images/cloudy.png';
import sunnyBackground from '../../../assets/Images/sunny.png';



const API_KEY = '41a58879ed6634523c5164918cf248eb';
const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=Aligarh&units=metric&appid=${API_KEY}`;

const API_DETECT_KEY = '2b10uRgvei8Ukbkb1xe6aBC2Nu';
const project = 'all';
const API_DETECT_URL = `https://my-api.plantnet.org/v2/identify/${project}?api-key=${API_DETECT_KEY}`;


const HomeScreen = () => {
  const [weatherData, setWeatherData] = useState(null);
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [plantName, setPlantName] = useState('');

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Grow ask for Camera Permission',
          message: 'Grow needs access to your Location ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the Camera');
        getLocation();
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(API_URL);
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const handleTakePhoto = async () => {
    try {
      const options = {
        mediaType: 'photo',
        cropping: true,
        width: 500,
        height: 500,
      };

      const image = await ImagePicker.openCamera(options);
      setSelectedImage(image.path);
    } catch (error) {
      console.log('ImagePicker Error: ', error);
    }
  };

  const handleSelectPhoto = async () => {
    try {
      const options = {
        mediaType: 'photo',
        cropping: true,
        width: 500,
        height: 500,
      };

      const image = await ImagePicker.openPicker(options);
      setSelectedImage(image.path);
    } catch (error) {
      console.log('ImagePicker Error: ', error);
    }
  };

  const choosePlant = async () => {
    setIsModalVisible(true);
    
  }
  const handleIdentifyPlantBtn = async () => {
    handleIdentifyPlant();
  }
  
  const handleIdentifyPlant = async () => {
    try {
      const formData = new FormData();
      formData.append('organs', 'flower');
      formData.append('images', {
        uri: selectedImage,
        type: 'image/jpeg',
        name: 'image.jpg',
      });

      const response = await axios.post(API_DETECT_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.data.results || response.data.results.length === 0) {
        Alert.alert('No plant identified.');
        return;
      }
      const identifiedPlant = response.data.results[0].species;
      const commonNames = identifiedPlant.commonNames.join(', ');
      setPlantName(commonNames);
    } catch (error) {
      console.log('Error:', error.message);
      setSelectedImage(null);
      Alert.alert('An error occurred while identifying the plant.');
    }
  };


  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    setSelectedImage(null);
  };

  const getBackgroundImageForWeather = (weatherCode) => {
    if (weatherCode >= 200 && weatherCode < 600) {
      return rainyBackground;
    } else if (weatherCode >= 600 && weatherCode < 700) {
      return snowyBackground;
    } else if (weatherCode >= 801 && weatherCode <= 804) {
      return cloudyBackground;
    }
    return sunnyBackground;
  };
  

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" color="black" size={30} />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

       {weatherData && (
  <TouchableOpacity style={styles.weatherInfoContainer}>
    <ImageBackground
      source={getBackgroundImageForWeather(weatherData.weather[0].id)}
      style={styles.weatherInfoBackground}
    >
      <Image
        style={styles.weatherIcon}
        source={{ uri: `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png` }}
      />
      <Text style={styles.temperature}>{weatherData.main.temp}°C</Text>
      <Text style={styles.description}>{weatherData.weather[0].description}</Text>
    </ImageBackground>
  </TouchableOpacity>
)}


        {/* {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
        )} */}
        <Text style={styles.plantName}>{plantName}</Text>

        <TouchableOpacity style={styles.identifyButton} onPress={choosePlant}>
          <Text style={styles.identifyButtonText}>Identify Plant</Text>
        </TouchableOpacity>

        {isModalVisible && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeIconContainer3} onPress={toggleModal}>
              <Icon name="close-circle" color="gray" size={30} />
            </TouchableOpacity>
              {selectedImage && (
                <Image source={{ uri: selectedImage }} style={styles.modalImage} />
              )}
              <TouchableOpacity style={styles.photoButton} onPress={handleSelectPhoto}>
                <Text style={styles.photoButtonText}>Select Photo</Text>
              </TouchableOpacity>
              <View style={styles.lineBreak}></View>
              <TouchableOpacity style={styles.photoButton} onPress={handleTakePhoto}>
                <Text style={styles.photoButtonText}>Take Photo</Text>
              </TouchableOpacity>
              <View style={styles.lineBreak}></View>
              <TouchableOpacity style={styles.photoButton} onPress={handleIdentifyPlantBtn}>
                <Text style={styles.photoButtonText}>Identify</Text>
              </TouchableOpacity>
              {/* <View style={styles.closeModalButtonContainer}>
                <TouchableOpacity style={styles.closeModalButton} onPress={toggleModal}>
                  <Icon name="close-circle" color="white" size={30} />
                  <Text style={styles.closeModalButtonText}>Close</Text>
                </TouchableOpacity>
              </View> */}
            </View>
          </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  plantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherInfoBackground: {
    flex: 1,
    borderRadius: 30,
    padding: 25,
    top: 60,  
    left: 0,  
    right: 0,  
    position: 'absolute',
    alignItems: 'center',
  },
  weatherInfoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 30,
    padding: 25,
    position: 'absolute',  
    top: 60,  
    left: 0,  
    right: 0,  
    alignItems: 'center',
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
  temperature: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 10,
  },
  description: {
    fontSize: 20,
    marginTop: 5,
    textAlign: 'center',
  },
  photoButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    paddingHorizontal: 20,
    marginBottom: 20, 
  },
  photoButton: {
    backgroundColor: '#C3EDC0',
    borderRadius: 20,
    padding: 10,
    alignSelf: 'flex-end',
  },
  photoButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'black',
  },
  closeIconContainer3: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: 'black',
  },
  selectedImage: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },

  identifyButton: {
    backgroundColor: '#C3EDC0',
    borderRadius: 20,
    padding: 10,
    alignSelf: 'center',
    marginTop: 400,
  },

  identifyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'black',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  closeModalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  closeModalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'gray',
    borderRadius: 10,
    padding: 10,
  },
  closeModalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5, 
  },
  lineBreak:{
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginVertical: 2,
  }
});

export default HomeScreen;


// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import React, {useState} from 'react';
// import {StyleSheet, Text, View, Image, TouchableOpacity, ToastAndroid} from 'react-native';
// import { openCamera, openPicker } from 'react-native-image-crop-picker';
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

// const HomeScreen= () =>{
//   const[state, setState] = useState({
//     photo: '',
//   });

//   const option = {
//     mediaType:'photo',
//     quality:1,
//     saveToPhotos: true,
//   };

//   const toast = (msg) => {
//     ToastAndroid.show(msg, ToastAndroid.SHORT)
//   }

//   const openCamera = () => {
//     launchCamera(option,(res) => {
//       if(res.didCancel){
//         toast('take a picture cancled')
//       }else if(res.errorCode){
//         toast('error while opening camera',res.errorCode)
//       }else{
//         console.log(res.uri)
//       }
//     });
//   };

//   const openPicker = () => {
//     launchImageLibrary(option,(res) => {
//       console.log(res);
//     });
//   };

//   return(
//     <View style={styles.container}>
//       {state.photo == "" ? (<Text>No Image</Text>
//       ) : (
//         <Image source={{uri:state.photo}} />
//       )}
//       <View style={styles.wrapBtn}>
//         <TouchableOpacity onPress={openCamera}>
//           <Text>Open Camera</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={openPicker}>
//           <Text>Open Gallery</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default HomeScreen;
// const styles = StyleSheet.create({
//   container:{
//     flex:1,
//     justifyContent:'center',
//     alignItems: 'center',
//     backgroundColor:"white",
//   },
//   wrapBtn:{
//     flexDirection:'row',
//     justifyContent: 'space-between',
//     widht: 200,
//     marginTop: 50,    
//   },
//   image:{
//     height: 250,
//     width: 250,
//   }
// });

// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, Alert } from 'react-native';
// import axios from 'axios';
// import Icon from 'react-native-vector-icons/Ionicons';
// import ImagePicker from 'react-native-image-crop-picker';
// import Permissions from 'react-native-permissions';
// import { PermissionsAndroid } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// // import rainyBackground from '../../../assets/Images/rain.png';
// // import snowyBackground from '../../../assets/Images/snow.png';
// // import cloudyBackground from '../../../assets/Images/cloudy.png';
// // import sunnyBackground from '../../../assets/Images/sunny.png';



// // const API_KEY = '41a58879ed6634523c5164918cf248eb';
// // const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=Aligarh&units=metric&appid=${API_KEY}`;

// const API_DETECT_KEY = '2b10uRgvei8Ukbkb1xe6aBC2Nu';
// const API_DETECT_URL = `https://my-api.plantnet.org/v2/identify/${project}?api-key=${apiKey}`;


// const HomeScreen = () => {
//   // const [weatherData, setWeatherData] = useState(null);
//   const navigation = useNavigation();
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [plantName, setPlantName] = useState('');

//   const requestCameraPermission = async () => {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         {
//           title: 'Grow ask for Camera Permission',
//           message: 'Grow needs access to your Location ',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         },
//       );
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         console.log('You can use the Camera');
//         getLocation();
//       } else {
//         console.log('Camera permission denied');
//       }
//     } catch (err) {
//     }
//   };

//   useEffect(() => {
//     requestCameraPermission();
//   }, []);

//   // const fetchWeatherData = async () => {
//   //   try {
//   //     const response = await axios.get(API_URL);
//   //     setWeatherData(response.data);
//   //   } catch (error) {
//   //     console.error('Error fetching weather data:', error);
//   //   }
//   // };

//   // useEffect(() => {
//   //   fetchWeatherData();
//   // }, []);

//   const handleTakePhoto = async () => {
//     try {
//       const options = {
//         mediaType: 'photo',
//         cropping: true,
//         width: 500,
//         height: 500,
//       };

//       const image = await ImagePicker.openCamera(options);
//       setSelectedImage(image.path);
//     } catch (error) {
//       console.log('ImagePicker Error: ', error);
//     }
//   };

//   const handleSelectPhoto = async () => {
//     try {
//       const options = {
//         mediaType: 'photo',
//         cropping: true,
//         width: 500,
//         height: 500,
//       };

//       const image = await ImagePicker.openPicker(options);
//       setSelectedImage(image.path);
//     } catch (error) {
//       console.log('ImagePicker Error: ', error);
//     }
//   };

//   const choosePlant = async () => {
//     setIsModalVisible(true);
    
//   }
//   const handleIdentifyPlantBtn = async () => {
//     handleIdentifyPlant();
//   }

//   const images = [
//     {
//       uri: '../../../assets/flower/1_LawsoniaAlba.jpeg',
//       type: 'image/jpeg',
//       name: 'image1.jpg',
//     }
//   ]
  
//   const handleIdentifyPlant = async () => {
//     try {
//       const formData = new FormData();
//       formData.append('organs', 'flower');
//       for(let i = 0; i<images.length; i++){
//         formData.append(images[i]);
//     }

//       const response = await axios.post(API_DETECT_URL, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       if (!response.data.results || response.data.results.length === 0) {
//         Alert.alert('No plant identified.');
//         return;
//       }
//       const identifiedPlant = response.data.results[0].species;
//       const commonNames = identifiedPlant.commonNames.join(', ');
//       setPlantName(commonNames);
//     } catch (error) {
//       console.log('Error:', error.message);
//       setSelectedImage(null);
//       Alert.alert('An error occurred while identifying the plant.');
//     }
//   };


//   const toggleModal = () => {
//     setIsModalVisible(!isModalVisible);
//     setSelectedImage(null);
//   };

//   // const getBackgroundImageForWeather = (weatherCode) => {
//   //   if (weatherCode >= 200 && weatherCode < 600) {
//   //     return rainyBackground;
//   //   } else if (weatherCode >= 600 && weatherCode < 700) {
//   //     return snowyBackground;
//   //   } else if (weatherCode >= 801 && weatherCode <= 804) {
//   //     return cloudyBackground;
//   //   }
//   //   return sunnyBackground;
//   // };
  

//   return (
//     <View style={styles.container}>
//         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//           <Icon name="arrow-back" color="black" size={30} />
//           <Text style={styles.backButtonText}>Back</Text>
//         </TouchableOpacity>

//        {/* {weatherData && (
//   <TouchableOpacity style={styles.weatherInfoContainer}>
//     <ImageBackground
//       source={getBackgroundImageForWeather(weatherData.weather[0].id)}
//       style={styles.weatherInfoBackground}
//     >
//       <Image
//         style={styles.weatherIcon}
//         source={{ uri: `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png` }}
//       />
//       <Text style={styles.temperature}>{weatherData.main.temp}°C</Text>
//       <Text style={styles.description}>{weatherData.weather[0].description}</Text>
//     </ImageBackground>
//   </TouchableOpacity>
// )} */}


//         {/* {selectedImage && (
//           <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
//         )} */}
//         <Text style={styles.plantName}>{plantName}</Text>

//         <TouchableOpacity style={styles.identifyButton} onPress={choosePlant}>
//           <Text style={styles.identifyButtonText}>Identify Plant</Text>
//         </TouchableOpacity>

//         {isModalVisible && (
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//             <TouchableOpacity style={styles.closeIconContainer3} onPress={toggleModal}>
//               <Icon name="close-circle" color="gray" size={30} />
//             </TouchableOpacity>
//               {selectedImage && (
//                 <Image source={{ uri: selectedImage }} style={styles.modalImage} />
//               )}
//               <TouchableOpacity style={styles.photoButton} onPress={handleSelectPhoto}>
//                 <Text style={styles.photoButtonText}>Select Photo</Text>
//               </TouchableOpacity>
//               <View style={styles.lineBreak}></View>
//               <TouchableOpacity style={styles.photoButton} onPress={handleTakePhoto}>
//                 <Text style={styles.photoButtonText}>Take Photo</Text>
//               </TouchableOpacity>
//               <View style={styles.lineBreak}></View>
//               <TouchableOpacity style={styles.photoButton} onPress={handleIdentifyPlantBtn}>
//                 <Text style={styles.photoButtonText}>Identify</Text>
//               </TouchableOpacity>
//               {/* <View style={styles.closeModalButtonContainer}>
//                 <TouchableOpacity style={styles.closeModalButton} onPress={toggleModal}>
//                   <Icon name="close-circle" color="white" size={30} />
//                   <Text style={styles.closeModalButtonText}>Close</Text>
//                 </TouchableOpacity>
//               </View> */}
//             </View>
//           </View>
//         )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   plantName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 10,
//   },
//   backgroundImage: {
//     flex: 1,
//     resizeMode: 'cover',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   // weatherInfoBackground: {
//   //   flex: 1,
//   //   borderRadius: 30,
//   //   padding: 25,
//   //   top: 60,  
//   //   left: 0,  
//   //   right: 0,  
//   //   position: 'absolute',
//   //   alignItems: 'center',
//   // },
//   // weatherInfoContainer: {
//   //   backgroundColor: 'rgba(255, 255, 255, 0.8)',
//   //   borderRadius: 30,
//   //   padding: 25,
//   //   position: 'absolute',  
//   //   top: 60,  
//   //   left: 0,  
//   //   right: 0,  
//   //   alignItems: 'center',
//   // },
//   // weatherIcon: {
//   //   width: 100,
//   //   height: 100,
//   // },
//   // temperature: {
//   //   fontSize: 36,
//   //   fontWeight: 'bold',
//   //   marginTop: 10,
//   // },
//   description: {
//     fontSize: 20,
//     marginTop: 5,
//     textAlign: 'center',
//   },
//   photoButtonsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignSelf: 'stretch',
//     paddingHorizontal: 20,
//     marginBottom: 20, 
//   },
//   photoButton: {
//     backgroundColor: '#C3EDC0',
//     borderRadius: 20,
//     padding: 10,
//     alignSelf: 'flex-end',
//   },
//   photoButtonText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color:'black',
//   },
//   closeIconContainer3: {
//     position: 'absolute',
//     top: 2,
//     right: 2,
//   },
//   backButton: {
//     position: 'absolute',
//     top: 10,
//     left: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   backButtonText: {
//     fontSize: 16,
//     color: 'black',
//   },
//   selectedImage: {
//     width: 200,
//     height: 200,
//     marginVertical: 20,
//   },

//   identifyButton: {
//     backgroundColor: '#C3EDC0',
//     borderRadius: 20,
//     padding: 10,
//     alignSelf: 'center',
//     marginTop: 400,
//   },

//   identifyButtonText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color:'black',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   modalImage: {
//     width: 200,
//     height: 200,
//     marginBottom: 10,
//   },
//   closeModalButtonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 10,
//   },
//   closeModalButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'gray',
//     borderRadius: 10,
//     padding: 10,
//   },
//   closeModalButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     marginLeft: 5, 
//   },
//   lineBreak:{
//     borderBottomWidth: 1,
//     borderBottomColor: '#333',
//     marginVertical: 2,
//   }
// });

// export default HomeScreen;