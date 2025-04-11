import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Alert, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import Slider from '@react-native-community/slider';
import Button from '../components/Button';

function SuccessScreen({ navigation }) {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaLibraryPermissionResponse, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();
  const [hasAllPermissions, setHasAllPermissions] = useState(false);
  const [cameraProps, setCameraProps] = useState({
    zoom: 0,
    facing: 'back',
    flash: 'on',
    animateShutter: false,
    enableTorch: false
  });
  const [image, setImage] = useState(null);
  const [previousImage, setPreviousImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const cameraRef = useRef(null);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const cameraPermissionResult = await requestCameraPermission();
      const mediaLibraryPermissionResult = await requestMediaLibraryPermission();
      const { status: locationStatus } = await requestLocationPermission() || {};
      
      const allGranted = 
        cameraPermissionResult?.granted &&
        mediaLibraryPermissionResult?.status === 'granted' &&
        locationStatus === 'granted';

      setHasAllPermissions(allGranted);

      if (!allGranted) {
        Alert.alert(
          'Permissions Required',
          'This app needs camera, media library, and location permissions to function properly.',
          [{ text: 'OK' }]
        );
      } else {
        getLastSavedImage();
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Error', 'Failed to request necessary permissions');
    }
  };

  const toggleProperty = (prop, option1, option2) => {
    setCameraProps((current) => ({
      ...current,
      [prop]: current[prop] === option1 ? option2 : option1
    }));
  };

  const zoomIn = () => {
    setCameraProps((current) => ({
      ...current,
      zoom: Math.min(current.zoom + 0.1, 1)
    }));
  };

  const zoomOut = () => {
    setCameraProps((current) => ({
      ...current,
      zoom: Math.max(current.zoom - 0.1, 0)
    }));
  };

  const takePicture = async () => {
    if (!hasAllPermissions) {
      Alert.alert(
        'Permissions Required',
        'Please grant all permissions to take pictures with location data.',
        [{ text: 'Grant Permissions', onPress: requestPermissions }]
      );
      return;
    }

    if (cameraRef.current) {
      try {
        const picture = await cameraRef.current.takePictureAsync();
        const locationResult = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High
        });
        setImage(picture.uri);
        setLocation(locationResult);
        console.log('Image location:', locationResult);
      } catch (err) {
        console.log('Error while taking the picture:', err);
        Alert.alert(
          'Error',
          'Failed to capture image or location data. Please ensure all permissions are granted.',
          [{ text: 'Retry Permissions', onPress: requestPermissions }]
        );
      }
    }
  };

  const savePicture = async () => {
    if (image) {
      try {
        const asset = await MediaLibrary.createAssetAsync(image);
        
        if (location) {
          await MediaLibrary.createAlbumAsync('GeotaggedPhotos', asset, false);
          console.log('Photo saved with geolocation:', location);
        }
        
        Alert.alert('Photo saved!', 'Redirecting to photo display...', [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('PhotoDisplay', { imageUri: image, location: location });
            }
          }
        ]);
        setImage(null);
        setLocation(null);
        getLastSavedImage();
      } catch (err) {
        console.log('Error while saving the picture:', err);
        Alert.alert('Error', 'Failed to save the picture');
      }
    }
  };

  const getLastSavedImage = async () => {
    if (mediaLibraryPermissionResponse && mediaLibraryPermissionResponse.status === 'granted') {
      try {
        const dcimAlbum = await MediaLibrary.getAlbumAsync('DCIM');

        if (dcimAlbum) {
          const { assets } = await MediaLibrary.getAssetsAsync({
            album: dcimAlbum,
            sortBy: [[MediaLibrary.SortBy.creationTime, false]],
            mediaType: MediaLibrary.MediaType.photo,
            first: 1
          });

          if (assets.length > 0) {
            const assetInfo = await MediaLibrary.getAssetInfoAsync(assets[0].id);
            setPreviousImage(assetInfo.localUri || assetInfo.uri);
          } else {
            setPreviousImage(null);
          }
        } else {
          setPreviousImage(null);
        }
      } catch (error) {
        console.error('Error getting last saved image:', error);
        setPreviousImage(null);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.successText}>Signup Successful!</Text>
      
      {!hasAllPermissions ? (
        <TouchableOpacity 
          style={styles.button} 
          onPress={requestPermissions}
        >
          <Text style={styles.buttonText}>Grant Permissions</Text>
        </TouchableOpacity>
      ) : !isCameraOpen ? (
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => setIsCameraOpen(true)}
        >
          <Text style={styles.buttonText}>Open Camera</Text>
        </TouchableOpacity>
      ) : (
        <>
          {!image ? (
            <>
              <View style={styles.topControlsContainer}>
                <Button 
                  icon={cameraProps.flash === 'on' ? 'flash-on' : 'flash-off'}
                  onPress={() => toggleProperty('flash', 'on', 'off')}
                />
                <Button 
                  icon='animation'
                  color={cameraProps.animateShutter ? 'white' : '#404040'}
                  onPress={() => toggleProperty('animateShutter', true, false)}
                />
                <Button 
                  icon={cameraProps.enableTorch ? 'flashlight-on' : 'flashlight-off'}
                  onPress={() => toggleProperty('enableTorch', true, false)}
                />
              </View>
              <CameraView 
                style={styles.camera} 
                zoom={cameraProps.zoom}
                facing={cameraProps.facing}
                flash={cameraProps.flash}
                animateShutter={cameraProps.animateShutter}
                enableTorch={cameraProps.enableTorch}
                ref={cameraRef}
              />
              <View style={styles.sliderContainer}>
                <Button 
                  icon='zoom-out'
                  onPress={zoomOut}
                />
                <Slider 
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={1}
                  value={cameraProps.zoom}
                  onValueChange={(value) => setCameraProps((current) => ({...current, zoom: value}))}
                  step={0.1}
                />
                <Button 
                  icon='zoom-in'
                  onPress={zoomIn}
                />
              </View>
              <View style={styles.bottomControlsContainer}> 
                <TouchableOpacity onPress={() => previousImage && setImage(previousImage)}>
                  <Image 
                    source={{ uri: previousImage }}
                    style={styles.previousImage}
                  />
                </TouchableOpacity>
                <Button 
                  icon='camera'
                  size={60}
                  style={{ height: 60 }}
                  onPress={takePicture}
                />
                <Button 
                  icon='flip-camera-ios'
                  onPress={() => toggleProperty('facing', 'front', 'back')}
                  size={40}
                />
              </View>
            </>
          ) : (
            <>
              <Image source={{ uri: image }} style={styles.camera} />
              <View style={styles.bottomControlsContainer}>
                <Button 
                  icon='flip-camera-android'
                  onPress={() => setImage(null)}
                />
                <Button 
                  icon='check'
                  onPress={savePicture}
                />
              </View>
            </>
          )}
        </>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successText: {
    fontSize: 24,
    marginBottom: 20,
  },
  topControlsContainer: {
    height: 100,
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  camera: {
    flex: 1,
    width: '100%',
    aspectRatio: 3 / 4,
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  sliderContainer: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
  },
  bottomControlsContainer: {
    height: 100,
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  previousImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'white',
  }
});

export default SuccessScreen;