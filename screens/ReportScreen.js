import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { jsPDF } from 'jspdf';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReportScreen = ({ route, navigation }) => {
  const { imageUri, location, hashtags, tags, caption } = route.params;
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  const saveImageLocally = async () => {
    try {
      const fileName = `image_${Date.now()}.jpg`;
      const destPath = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.copyAsync({
        from: imageUri,
        to: destPath,
      });
      return destPath;
    } catch (error) {
      console.error('Error saving image:', error);
      return null;
    }
  };

  const checkExistingPost = async (newPost) => {
    try {
      const posts = await AsyncStorage.getItem('posts');
      let postArray = posts ? JSON.parse(posts) : [];

      // Define a radius (e.g., 50 meters) for "same location"
      const RADIUS = 50; // meters
      const toRadians = (deg) => deg * Math.PI / 180;
      const distance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3; // Earth's radius in meters
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      };

      // Find matching post
      const existingPost = postArray.find((post) => {
        const isSameLocation =
          distance(
            post.location.latitude,
            post.location.longitude,
            newPost.location.latitude,
            newPost.location.longitude
          ) <= RADIUS;
        const isSameIssue = post.tags === newPost.tags;
        return isSameLocation && isSameIssue;
      });

      if (existingPost) {
        existingPost.count = (existingPost.count || 1) + 1;
      } else {
        newPost.count = 1;
        postArray.push(newPost);
      }

      await AsyncStorage.setItem('posts', JSON.stringify(postArray));
      return postArray;
    } catch (error) {
      console.error('Error checking posts:', error);
      return null;
    }
  };

  const generatePDF = async () => {
    setIsLoading(true);
    try {
      const pdf = new jsPDF();
      pdf.setFontSize(16);
      pdf.setTextColor(40, 89, 146);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Caption: ${caption}`, 10, 10);
      pdf.text(`Location: ${location.coords.latitude}, ${location.coords.longitude}`, 10, 20);
      pdf.text(`Hashtags: ${hashtags}`, 10, 30);
      pdf.text(`Tags: ${tags}`, 10, 40);

      const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${location.coords.latitude},${location.coords.longitude}`;
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 255);
      pdf.textWithLink('📍 View Location on Google Maps', 10, 50, { url: googleMapsLink });

      const mapUri = await captureMapView();
      if (mapUri) {
        const mapBase64 = await FileSystem.readAsStringAsync(mapUri, { encoding: 'base64' });
        pdf.addImage(`data:image/png;base64,${mapBase64}`, 'PNG', 10, 60, 180, 160);
      }

      const pdfUri = `${FileSystem.documentDirectory}report.pdf`;
      await FileSystem.writeAsStringAsync(pdfUri, pdf.output('datauristring').split(',')[1], {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(pdfUri);
      } else {
        alert('Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    } finally {
      setIsLoading(false);
    }
  };

  const captureMapView = async () => {
    try {
      const screenshotUri = await mapRef.current.takeSnapshot({
        width: 300,
        height: 300,
        format: 'png',
        result: 'file',
      });
      return screenshotUri;
    } catch (error) {
      console.error('Error capturing map view:', error);
      return null;
    }
  };

  const handlePostToFeed = async () => {
    setIsLoading(true);
    try {
      const localImageUri = await saveImageLocally();
      if (!localImageUri) {
        alert('Failed to save image locally');
        return;
      }

      const postData = {
        id: Date.now().toString(),
        title: caption || 'Untitled Post',
        author: 'CurrentUser',
        imageUri: localImageUri,
        location: location.coords,
        hashtags,
        tags,
        caption,
        timestamp: Date.now(),
        likes: 0,
        comments: 0,
        impressions: 0,
      };

      const updatedPosts = await checkExistingPost(postData);
      if (updatedPosts) {
        navigation.navigate('RedditStyleFeed', { posts: updatedPosts });
      } else {
        alert('Failed to process post');
      }
    } catch (error) {
      console.error('Error posting to feed:', error);
      alert('Error posting to feed');
    } finally {
      setIsLoading(false);
    }
  };

  // Debug log to confirm rendering and screen dimensions
  console.log('Rendering ReportScreen, isLoading:', isLoading, 'Screen Dimensions:', Dimensions.get('window'));

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>PDF Report Generation</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Caption:</Text>
        <Text style={styles.infoText}>{caption}</Text>
        <Text style={styles.label}>Location:</Text>
        <Text style={styles.infoText}>
          {location.coords.latitude}, {location.coords.longitude}
        </Text>
        <Text style={styles.label}>Hashtags:</Text>
        <Text style={styles.infoText}>{hashtags}</Text>
        <Text style={styles.label}>Tags:</Text>
        <Text style={styles.infoText}>{tags}</Text>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onMapReady={() => setIsMapReady(true)}
        >
          <Marker coordinate={location.coords} />
        </MapView>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#3897f0" style={styles.loadingIndicator} />
      ) : (
        <>
          {/* Separate block for Generate PDF Report button */}
          <View style={styles.pdfButtonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.pdfButton]}
              onPress={generatePDF}
              disabled={isLoading}
              testID="generate-pdf-button"
            >
              <Text style={styles.buttonText}>Generate PDF Report</Text>
            </TouchableOpacity>
          </View>
          {/* Separate block for Post to Feed button */}
          <View style={styles.postButtonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.postButton]}
              onPress={handlePostToFeed}
              disabled={isLoading}
              testID="post-to-feed-button"
            >
              <Text style={styles.buttonText}>Post to Feed</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 30, // Added to ensure buttons are not cut off
    backgroundColor: '#f7f9fc',
    flexShrink: 1,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3897f0',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  label: {
    fontWeight: 'bold',
    color: '#444444',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333333',
  },
  mapContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  map: {
    width: '100%',
    height: 250,
  },
  pdfButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10, // Reduced for compact layout
  },
  postButtonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 10, // Reduced from 15
    borderRadius: 8, // Slightly smaller radius
    alignItems: 'center',
    shadowColor: '#3897f0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
    width: '90%', // Reduced from 100% to add margin
  },
  pdfButton: {
    backgroundColor: '#3897f0',
  },
  postButton: {
    backgroundColor: '#40c4ff',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16, // Reduced from 18
    fontWeight: 'bold',
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default ReportScreen;