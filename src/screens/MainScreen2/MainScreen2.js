import React, { useEffect, useState, useRef } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  PermissionsAndroid,
  Image,
  Alert,
  TextInput,
  BackHandler,
  Modal,
  Button,
  ActivityIndicator,
  PanResponder,
  Animated,
  Easing,
} from 'react-native';
import MapView, {
  UrlTile,
  Marker,
  WMSTile,
  Polygon,
  name,
  location,
  type,
  landuseClass,
  shapeType,
  Geojson,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Dialog from 'react-native-dialog';
import { captureRef } from 'react-native-view-shot';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import * as Animatable from 'react-native-animatable';
import RNPermissions from 'react-native-permissions';
import shpwrite from 'shp-write';
import axios from 'axios';
import polyline from '@mapbox/polyline';

const MainScreen2 = () => {
  const [mLat, setMLat] = useState(null);
  const [mLong, setMLong] = useState(null);
  const [markerColor, setMarkerColor] = useState(null);
  const [selectedCoordinate, setSelectedCoordinate] = useState(null);
  const [boundaryMarkers, setBoundaryMarkers] = useState([]);
  const [imageUri, setImageUri] = useState(null);
  const [showMapOptions, setShowMapOptions] = useState(false);
  const navigation = useNavigation();
  const [showAlert, setShowAlert] = useState(false);
  const [layer, setLayer] = useState('satellite');
  const [selectedMapOption, setSelectedMapOption] = useState('satellite');
  const windowHeight = Dimensions.get('window').height * 1.3;
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [markedLocation, setMarkedLocation] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  const [showMarkedLocationModal, setShowMarkedLocationModal] = useState(false);
  const [mapping, setMapping] = useState(false);
  const mapViewRef = useRef(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [contourCoordinates, setContourCoordinates] = useState([]);
  const [footerText, setFooterText] = useState('');
  const [showDACPopup, setShowDACPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dacValue, setDacValue] = useState('');
  const [mapPolygon, setMapPolygon] = useState(false);
  const [shapeType, setShapeType] = useState('')
  const [markers, setMarkers] = useState([]);
  const [polygonCoordinates, setPolygonCoordinates] = useState([]);
  const [PolygonMarkers, setPolygonMarkers] = useState([]);
  const [drawpolygonCoordinates, setDrawPolygonCoordinates] = useState([]);
  const [isDrawingEnabled, setDrawingEnabled] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [DAC, setDAC] = useState(false);
  const [footerPosition, setFooterPosition] = useState(new Animated.Value(0));
  const [footerVisible, setFooterVisible] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  const [tip1, setTip1] = useState(false);
  const [DACdataInvalid, setDACdataInvalid] = useState(false);
  const [markNewLocation, setMarkNewLocation] = useState(false);
  const [SaveAndSend, setSaveAndSend] = useState(false);

const numColumns = 2;
const logoName = require("../../../assets/Images/logoName.png");
const renderItem = ({ item }) => (
      <TouchableOpacity style={styles.imageContainer}>
        <Image source={item} style={styles.image} />
      </TouchableOpacity>
    );

  useEffect(() => {
    requestCameraPermission();
    fetchDataAndDisplayOnMap();
    getUserLocation();
  }, []);

  useEffect(() => {
    requestPermission();
  }, []);

  const getUserLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
      },
      error => {
        console.log('Error getting user location:', error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Grow ask for Location Permission',
          message: 'Grow needs access to your Location ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
        getLocation();
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const requestPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Permission Request',
          message: 'This app needs permission to access your photos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Photos permission granted');
      } else {
        console.log('Photos permission denied');
      }
    } catch (error) {
      console.log('Error requesting photos permission:', error);
    }
  };

  const saveToDevice = async () => {
    try {
      const permission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );

      if (!permission) {
        await requestStoragePermission();
        return;
      }

      const filePath = `${RNFS.PicturesDirectoryPath}/screenshot.png`;
      await RNFS.copyFile(imageUri, filePath);
      console.log('Screenshot saved to:', filePath);
      Alert.alert('Screenshot saved to:', filePath);
    } catch (error) {
      console.log('Error saving screenshot:', error);
    }
  };

  const getShare = () => {
    const options = {
      url: imageUri,
      message: 'Captured Screenshot in DAC App'
    };
    Share.open(options);
    console.log('getShare');
  }


  const getRandomColor = () => {
    const colors = ['#4285F4'];// '#34A853', '#FBBC05', '#EA4335',
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log(position);
        setMLat(position.coords.latitude);
        setMLong(position.coords.longitude);
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        const newColor = getRandomColor();
        setMarkerColor(newColor);
      },
      error => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };



  const handleMapLongPress = event => {
    if (mapping) {
      const { latitude, longitude } = event.nativeEvent.coordinate;
      setSelectedCoordinate({ latitude, longitude });
      setMarkedLocation({ latitude, longitude });
      const newColor = getRandomColor();
      setDAC(true);
      setMarkerColor(newColor);
      setMapping(false);
      setShowMarkedLocationModal(true);
    }
  };
  const handleMapPress = event => {
    if (isDrawingEnabled) {
      if (mapping && markers.length < 16) {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        const markerColor = getRandomColor();
        setSelectedLocations(prevLocations => [
          ...prevLocations,
          { latitude, longitude, color: markerColor },
        ]);
        setMarkers(prevMarkers => [
          ...prevMarkers,
          { latitude, longitude, color: markerColor },
        ]);
        saveLocationToBackend(latitude, longitude);
        fetchDataAndDisplayOnMap();
      } else if (mapping && markers.length === 16) {
        Alert.alert(
          'Maximum Positions Reached',
          'You have marked the maximum allowed positions (16).',
        );
      }
    } else {
      setSelectedLocations([]);
      if (mapping) {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        const markerColor = getRandomColor();
        setSelectedLocations(prevLocations => [
          ...prevLocations,
          { latitude, longitude, color: markerColor },
        ]);
        setDAC(true);
        fetchDataAndDisplayOnMap();
        setPolygonMarkers([]);
        setDACdataInvalid(false);
      }
    }
  };

  const handleSupportPress = () => {
    navigation.navigate('Support');
  };

  const handleMapOptionsPress = () => {
    setShowMapOptions(true);
  };


  const handleBackPress = () => {
    setShowAlert(true);
    return true;
  };
  const closePreview = () => {
    setIsPreviewVisible(false);
    setShowMapOptions(false);
  };
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowMarkedLocationModal(false);
  };

  const handleOptionPress = () => {
    openModal();
  };
  const handleMark = () => {
    console.log('Mark');
    closeModal();
  };

  const handleMarkLocation = () => {
    closeModal();
    setMapping(true);
    setFooterText('LongPress on map to mark a new location');
    setTimeout(() => {
      setFooterText('');
    }, 2000);
  };

  const handleUseCurrentLocation = () => {
    closeModal();
   // navigation.navigate('Main');
  }

  const handleUpdateMarkedLocation = () => {
    closeModal();
    setMapping(true);
    setSelectedLocations([]);
    setTip1(true);
    setUserLocation(null);
    if (markedLocation) {
      setBoundaryMarkers(prevMarkers => [...prevMarkers, markedLocation]);
      setMarkedLocation(null);
    }
  };

  const fetchDataAndDisplayOnMap = async () => {
    const data = await fetchDataFromBackend();
    displayDataOnMap(data);
    console.log(data);
  };

  const fetchDataFromBackend = async (latitude, longitude) => {
    if (typeof latitude === 'number' && typeof longitude === 'number' && !isNaN(latitude) && !isNaN(longitude)) {
    const formattedLatitude = latitude.toFixed(4);
    const formattedLongitude = longitude.toFixed(4);
    console.log(formattedLatitude, formattedLongitude);
    
    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude: formattedLatitude,
        longitude: formattedLongitude,
      }),
    };
    
    try {
      const response = await fetch('http://192.168.97.162/IntegrateGIS/getLocation.php',requestOptions);
      const responseData = await response.json();
      console.log('District retrieved:', responseData);
    } catch (error) {
      console.log('Error fetching data:', error);
    }    
  }
};
  

  const displayDataOnMap = (data) => {
    // if (!data) {
    //   console.log('Invalid data received from backend');
    //   //setDACdataInvalid(true);
    //   //console.log(DataInvalid);
    //   return;
    // }
   // setDacValue(data.dac);
    //  Alert.alert('DAC: ' + data.dac);
    let coordinates;
    try {
      const parsedGeom = JSON.parse(data.geom);
      if (parsedGeom.type === 'MultiPolygon' && Array.isArray(parsedGeom.coordinates)) {
        coordinates = parsedGeom.coordinates[0][0];
        getPolygon(coordinates);
      } else {
        throw new Error('Invalid geometry type or coordinates');
      }
    } catch (error) {
      console.error('Error parsing coordinates:', error);
      return;
    }
    if (!Array.isArray(coordinates) || coordinates.length === 0) {
      console.error('Invalid coordinates received from backend');
      return;
    }
    console.log(coordinates)
    setMapPolygon(true);

    const polygonCoordinates = coordinates.map((coordinatePair) => ({
      latitude: coordinatePair[1],
      longitude: coordinatePair[0],
    }));
    const markerColor = getRandomColor();
    const newMarkers = polygonCoordinates.map(({ latitude, longitude }) => ({
      latitude,
      longitude,
      color: markerColor,
    }));
    setPolygonMarkers(prevMarkers => [...prevMarkers, ...newMarkers]);
    console.log('Polygon Coordinates:', polygonCoordinates);
    console.log('Poly length', polygonCoordinates.length);
    console.log('PolygonMarkers:', PolygonMarkers);
    setCoordinates(polygonCoordinates);
  };

  const getPolygon = (coordinates) => {
    if (coordinates.length >= 3) {
      const polygonCoordinate = coordinates.map(coordinate => ({
        latitude: coordinate[1],
        longitude: coordinate[0],
      }));
      setPolygonCoordinates(polygonCoordinate);
      console.log('Polygon Coordinates:', polygonCoordinates);
      console.log('Poly length', polygonCoordinates.length);
    } else {
      setPolygonCoordinates([]);
      console.log('Polygon Coordinates:', polygonCoordinates);
      console.log('Poly length', polygonCoordinates.length);
    }
  };
  const handleMapReset = () => {
    setMapping(false);
    setBoundaryMarkers([]);
    setDacValue(null);
    setMapPolygon(false);
    setMarkers([]);
    setPolygonMarkers([]);
    setDrawingEnabled(false);
    setDAC(false);
    setMarkedLocation(null);
    setSelectedLocations([]);
    setPolygonCoordinates([]);
    setDrawPolygonCoordinates([]);
    setSaveAndSend(false);
    setUserLocation(null);
    setTip1(false)

  };
  const toggleFooter = () => {
    setFooterVisible(prevState => !prevState);
  };
  useEffect(() => {
    // Animate the footer position whenever footerVisible changes
    Animated.timing(footerPosition, {
      toValue: footerVisible ? 0 : windowHeight - 60,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  }, [footerVisible, windowHeight, footerPosition]);

  useEffect(() => {
    if (selectedLocations.length > 0) {
      setShowTooltip(true);
      setTimeout(() => {
        setShowTooltip(false);
      }, 3000);
    }
  }, [selectedLocations]);
 
  useEffect(() => {
    setTimeout(() => {
      setMarkNewLocation(true);
    }, 3000);
  }, []);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);
  const newColor = getRandomColor();
  const ref = useRef();
  return (

    <View style={styles.container}>
      <View style={styles.headerStyle}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" color="black" size={40} />
          </TouchableOpacity>
        <Image source={logoName} style={styles.logoName}/>
      </View>
      <View style={styles.mapContainer}>

        <MapView
          ref={mapViewRef}
          style={{ ...styles.map, height: windowHeight }}

          region={{
            latitude: 10.3705,
            longitude: 83.8333,
            latitudeDelta: 20,
            longitudeDelta: 30,
          }}
          provider={layer === 'satellite' ? PROVIDER_GOOGLE : undefined}

          mapType={layer === 'satellite' ? 'satellite' : 'none'}
          showsUserLocation={true}
          zoomEnabled={true}
          onLongPress={handleMapPress}
        >
         
          {layer === 'osm' && (
            <WMSTile
              urlTemplate={
                'https://bhuvan-vec1.nrsc.gov.in/bhuvan/wms?service=WMS&tiled=true&version=1.1.1&request=GetMap&layers=india3&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG%3A900913&format=image%2Fjpeg'
              }
              zIndex={1}
              epsgSpec={'EPSG:90031'}
            />
          )}
          {layer === 'bhuvan' && (
            <UrlTile
              urlTemplate={'https://tile.openstreetmap.de/{z}/{x}/{y}.png'}
              zIndex={1}
              epsgSpec={'EPSG:90031'}
            />
          )}
          {layer === 'esri' && (
            <UrlTile
              // urlTemplate={'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'}
              // urlTemplate = {'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'}
              urlTemplate={'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'}
              zIndex={1}
              epsgSpec={'EPSG:90031'}
            />
          )}
          {layer === 'mapbox' && (
            <UrlTile
              urlTemplate={'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWRuYWFuMDcwOSIsImEiOiJjbGo3azM4aDQwazlrM2ZxcHBvaHR4azBhIn0.y10hp3ht1p4vtHiS2_DdBw'}
              zIndex={1}
              epsgSpec={'EPSG:90031'}
            />
          )}
          {selectedLocations.map((location, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: location.latitude, longitude: location.longitude }}
              pinColor={location.color}
            />
          ))}
          {userLocation && (
            <Marker
              coordinate={userLocation}
              pinColor={getRandomColor}
            />
          )}
          {selectedCoordinate && markedLocation && (
            <Marker coordinate={selectedCoordinate} pinColor={getRandomColor} />
          )}
          {selectedCoordinate && (
            <Marker coordinate={selectedCoordinate} pinColor={getRandomColor}>
              <Callout>
                <Text>Selected location: {selectedCoordinate.latitude.toFixed(4)}°N, {selectedCoordinate.longitude.toFixed(4)}°E</Text>
              </Callout>
            </Marker>
          )}

           {polygonCoordinates.length >= 3 &&
            <Polygon
              coordinates={polygonCoordinates}
              strokeWidth={2}
              fillColor="rgba(0, 0, 255,0.5)"
              zIndex={5}
              fillOpacity={0.35}

            />
           }
        </MapView>

      </View>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Please wait...</Text>
        </View>
      )}

      <TouchableOpacity style={styles.optionIconContainer} onPress={handleOptionPress}>
        <Icon name="pin" size={28} color="#333" />
      </TouchableOpacity>

      <Modal visible={showModal} transparent={true} onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <TouchableOpacity style={styles.closeIconContainer3} onPress={closeModal}>
              <Icon name="close-circle" color="gray" size={30} />
            </TouchableOpacity>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleUpdateMarkedLocation}
              >
                <Text style={styles.modalButtonText}>  Mark New Location</Text>
              </TouchableOpacity>


              <Text style={[styles.footerText, styles.designText]}>
                *LongPress on map to mark a new location
              </Text>
            </View>
          </View>
        </View>
      </Modal>




      <Modal visible={isPreviewVisible} onRequestClose={closePreview}>
        <View style={styles.previewContainer}>
          {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}
          <View style={styles.buttonContainer3}>
            <TouchableOpacity style={styles.button3} onPress={saveToDevice}>
              <Text style={styles.buttonText}><Icon name="download" size={30} color="black" />Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button3} onPress={getShare}>
              <Text style={styles.buttonText}><Icon name="share" size={30} color="black" />Share</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.closeIconContainer} onPress={closePreview}>
            <Icon name="close" size={40} color="black" />
          </TouchableOpacity>
        </View>
      </Modal>

      <TouchableOpacity style={styles.MapResetContainer} onPress={handleMapReset}>
        <Icon name="refresh" size={28} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.mapOptionsIcon}
        onPress={handleMapOptionsPress}>
        <Icon name="layers" size={30} color="#333" />

      </TouchableOpacity>



      <View style={styles.footer}>
        <View style={styles.locationContainer}>
          <Animated.View style={[styles.footerContent, { transform: [{ translateY: footerPosition }] }]}>
            <Text style={styles.markedLocationText}>
              Current Location: {mLat !== null ? mLat.toFixed(4) : 28.6139}°N,{' '}
              {mLong !== null ? mLong.toFixed(4) : 77.209}°E
            </Text>
            {selectedLocations.length > 0 && (
              <>
                <View style={styles.line} />
                <Text style={styles.markedLocationText}>
                  Marked Location: {selectedLocations[selectedLocations.length - 1].latitude.toFixed(3)}°N,{' '}
                  {selectedLocations[selectedLocations.length - 1].longitude.toFixed(4)}° E
                </Text>
              </>
            )}
            <View style={styles.line} />
            <View >
            <TouchableOpacity
                style={styles.modalButton}
                onPress={handleUseCurrentLocation}
              >
                <Text style={styles.modalButtonText}>Use Current location</Text>
              </TouchableOpacity>
              <View style={styles.line} />
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleUpdateMarkedLocation}
              >
                <Text style={styles.modalButtonText}>Mark a new location</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.footerText, styles.designText]}>GPS Accuracy: 700 meters</Text>
          </Animated.View>
        </View>
        <TouchableOpacity style={styles.down} onPress={toggleFooter}>
          <Icon name={footerVisible ? 'arrow-down' : 'arrow-up'} size={40} color="black" />
        </TouchableOpacity>
      </View>


      <Dialog.Container visible={showMapOptions}>
        <Dialog.Title>Map Options</Dialog.Title>
        <Dialog.Description>Choose a map option:</Dialog.Description>
        <View style={styles.rowContainer}>
          <TouchableOpacity
            style={[styles.mapOptionButton, selectedMapOption === 'osm' && styles.selectedMapOptionButton]}
            onPress={() => {
              setLayer('osm');
              setSelectedMapOption('osm');
              setShowMapOptions(false);
            }}
          >
            <Image
              source={require('../../../assets/Images/osm.png')}
              style={styles.dialogImage}
            />
            <Text style={styles.buttonText}>Bhuvan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.mapOptionButton, selectedMapOption === 'bhuvan' && styles.selectedMapOptionButton]}
            onPress={() => {
              setLayer('bhuvan');
              setSelectedMapOption('bhuvan'); 
              setShowMapOptions(false);
            }}
          >
            <Image
              source={require('../../../assets/Images/esri.png')}
              style={styles.dialogImage}
            />
            <Text style={styles.buttonText}>OSM</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rowContainer}>
          <TouchableOpacity
            style={[styles.mapOptionButton, selectedMapOption === 'satellite' && styles.selectedMapOptionButton]}
            onPress={() => {
              setLayer('satellite');
              setSelectedMapOption('satellite'); // Update the selected map option
              setShowMapOptions(false);
            }}
          >
            <Image
              source={require('../../../assets/Images/satellite.png')}
              style={styles.dialogImage}
            />
            <Text style={styles.buttonText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.mapOptionButton, selectedMapOption === 'esri' && styles.selectedMapOptionButton]}
            onPress={() => {
              setLayer('esri');
              setSelectedMapOption('esri');
              setShowMapOptions(false);
            }}
          >
            <Image
              source={require('../../../assets/Images/esri_satellite.png')}
              style={styles.dialogImage}
            />
            <Text style={styles.buttonText}>Esri</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.mapOptionButton, selectedMapOption === 'mapbox' && styles.selectedMapOptionButton]}
          onPress={() => {
            setLayer('mapbox');
            setSelectedMapOption('mapbox'); // Update the selected map option
            setShowMapOptions(false);
          }}
        >
          <Image
            source={require('../../../assets/Images/mapbox.png')}
            style={styles.dialogImage}
          />
          <Text style={styles.buttonText}>Mapbox</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeIconContainer} onPress={closePreview}>
          <Icon name="close" size={40} color="black" />
        </TouchableOpacity>
      </Dialog.Container>


      <Dialog.Container visible={showAlert}>
        <Dialog.Title>Are you sure you want to leave the app?</Dialog.Title>
        <Dialog.Button label="Yes   " onPress={BackHandler.exitApp} />
        <Dialog.Button label="    No" onPress={() => setShowAlert(false)} />
      </Dialog.Container>


    </View>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#C3EDC0',
    paddingVertical: 15,
    alignItems: 'center',
  },
    logoName: {
    width: 120,
    height: 30,
    alignSelf: 'center',
  },
    backButtonText: {
    fontSize: 18,
    color: 'black',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Helvetica',
  },
  footerText2: {
    backgroundColor: '#fff',
    textAlign: 'center',
    fontSize: 16,
    color: 'black',
  },
  container: {
    flex: 1,
    backgroundColor: '#E4EAF7',
  },
  mapContainer: {
    flex: 1.2,
  },
  map: {
    width: '100%',
    height: '120%',
  },
  // footer: {
  //   backgroundColor: '#9AC5F4',
  //   paddingVertical: 10,
  //   paddingHorizontal: 20,
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  // },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    justifyContent: 'center', // Center the icon vertically
    alignItems: 'flex-end', // Align the icon to the right-hand side
  },
  footerContent: {

    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  down: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Updated to use RGBA color for 50% opacity
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },

  locationContainer: {
    flex: 1,
  },
  locationText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 5,
  },
  footerText: {
    fontSize: 12,
    color: '#666',
  },
  designText: {
    fontSize: 12,
    marginTop: 5,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginVertical: 2,
  },
  mapOptionsIcon: {
    position: 'absolute',
    top: 120,
    right: 12,
    marginLeft: 10,
    backgroundColor: '#fff',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    padding: 4,
  },
  optionIconContainer: {
    position: 'absolute',
    top: 170,
    right: 14,
    marginLeft: 10,
    backgroundColor: '#fff',
    backgroundColor: '#FFFFFF',
    padding: 4,
    borderRadius: 4,
  },
  MapResetContainer: {
    position: 'absolute',
    top: 220,
    right: 14,
    marginLeft: 10,
    backgroundColor: '#fff',
    backgroundColor: '#FFFFFF',
    padding: 4,
    borderRadius: 4,
  },
  getDACIcon: {
    position: 'absolute',
    top: 200,
    right: 12,
    marginLeft: 10,
    backgroundColor: '#fff',
    backgroundColor: '#FFFFFF',
    padding: 4,
    borderRadius: 4,
  },
  ContourIcon: {
    position: 'absolute',
    top: 295,
    right: 12,
    marginLeft: 10,
    backgroundColor: '#fff',
    backgroundColor: '#FFFFFF',
    padding: 4,
    borderRadius: 4,
  },
  dialogImage: {
    width: 60,
    height: 60,
    marginRight: 10,
  },

  buttonContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 8,
    backgroundColor: 'red',
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
    color: 'black',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  IconContainer2: {
    position: 'absolute',
    top: 300,
    right: 12,
    marginLeft: 10,
    backgroundColor: '#fff',
    backgroundColor: '#FFFFFF',
    padding: 4,
    borderRadius: 4,

  },
  IconContainer3: {
    position: 'absolute',
    backgroundColor: '#fff',
    bottom: 190,
    right: 20,
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 5,
  },
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIconContainer: {
    position: 'absolute',
    // top: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 5,
    zIndex: 1,
    bottom: 20,
  },
  modalContentText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // down:{
  //   alignItems: 'center',
  // },
  buttonText1: {
    fontWeight: 'bold',
    color: 'white',
  },
  markedLocationText: {
    fontSize: 14,
    // fontWeight: 'bold',
    marginBottom: 10,

  },
  previewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    margin: 20,
    padding: 20,
  },
  previewImage: {
    width: "80%",
    height: "80%",
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonContainer3: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  button3: {
    marginHorizontal: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#82CD47',
    borderRadius: 8,
  },
  saveIcon: {
    marginHorizontal: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#82CD47',
    borderRadius: 10, // Increased border radius for a more rounded appearance
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveText: {
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 2,
  },
  buttonText3: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  closeIconContainer: {
    position: 'absolute',
    top: 10,
    right: 5,
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalBox:
  {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 5,
    flexDirection: 'column',
    alignItems: "center",
    shadowColor: "#000",
  },

  closeIconContainer3: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
  closeIconContainer2: {
    position: 'absolute',
    top: -22,
    right: -21,
  },
  modalContent: {
    alignItems: 'center',
    marginTop: 20,
  },
  modalButton: {
    alignSelf: 'stretch',
    backgroundColor: '#C3EDC0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButtonIcon: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#FE0000'
  },
  markedLocationModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  markedLocationModalBox: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
  },
  markedLocationText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
  },
  currentLocationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#82CD47',
  },
  markedLocationButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  markedLocationButton: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateButton: {
    backgroundColor: '#007bff',
  },
  getDacButton: {
    backgroundColor: '#007bff',
  },
  markedLocationButtonText: {
    fontWeight: 'bold',
    color: '#FFF',
  },
  getDACIcon: {
    position: 'absolute',
    top: 200,
    right: 12,
    marginLeft: 10,
    backgroundColor: '#fff',
    backgroundColor: '#FFFFFF',
    padding: 4,
    borderRadius: 4,
  },
 
  DACPopupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginBottom: 60,
  },
  DACPopup: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  closeIconContainer: {
    position: 'absolute',
    top: -1,
    right: -1,
  },
  DACPopupText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
  },
  DACPopupButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  DACPopupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Tooltip styles
  tooltipContainer: {
    position: 'absolute',
    top: 200,
    // left: '50%',
    right: 50,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#333',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tooltipContainerJamalpur: {
    position: 'absolute',
    top: 250,
    // left: '50%',
    right: 50,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#333',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tooltipContainerLocation: {
    position: 'absolute',
    top: 110,
    // left: '50%',
    right: 50,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#333',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tooltipText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mapOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 3,
    borderColor: 'transparent',
  },

  selectedMapOptionButton: {
    borderColor: '#007bff',
  },

});


export default MainScreen2;





