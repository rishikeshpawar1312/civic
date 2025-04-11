import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { jsPDF } from "jspdf";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const ReportScreen = ({ route, navigation }) => {
  const { imageUri, location, hashtags, tags, caption } = route.params;
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  const generatePDF = async () => {
    setIsLoading(true);
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.setTextColor(40, 89, 146);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Caption: ${caption}`, 10, 10);
    pdf.text(`Location: ${location.coords.latitude}, ${location.coords.longitude}`, 10, 20);
    pdf.text(`Hashtags: ${hashtags}`, 10, 30);
    pdf.text(`Tags: ${tags}`, 10, 40);

    const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${location.coords.latitude},${location.coords.longitude}`;
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 255);
    pdf.textWithLink('📍 View Location on Google Maps', 10, 50, { url: googleMapsLink });

    const mapUri = await captureMapView();
    if (mapUri) {
      const mapBase64 = await FileSystem.readAsStringAsync(mapUri, { encoding: 'base64' });
      pdf.addImage(`data:image/png;base64,${mapBase64}`, 'PNG', 10, 60, 180, 160);
    }

    const pdfUri = `${FileSystem.documentDirectory}report.pdf`;
    await FileSystem.writeAsStringAsync(pdfUri, pdf.output('datauristring').split(',')[1], { encoding: FileSystem.EncodingType.Base64 });
    setIsLoading(false);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(pdfUri);
    } else {
      alert('Sharing is not available on this device');
    }
  };

  const captureMapView = async () => {
    try {
      const screenshotUri = await mapRef.current.takeSnapshot({
        width: 300,
        height: 300,
        format: 'png',
        result: 'file'
      });
      return screenshotUri;
    } catch (error) {
      console.error("Error capturing map view:", error);
      return null;
    }
  };

  const handlePostToFeed = () => {
    const postData = { imageUri, location, hashtags, tags, caption };
    navigation.navigate('RedditStyleFeed', { postData });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>PDF Report Generation</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Caption:</Text>
        <Text style={styles.infoText}>{caption}</Text>
        <Text style={styles.label}>Location:</Text>
        <Text style={styles.infoText}>{location.coords.latitude}, {location.coords.longitude}</Text>
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
          {/* <TouchableOpacity style={styles.button} onPress={generatePDF}>
            <Text style={styles.buttonText}>Generate PDF Report</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.button} onPress={handlePostToFeed}>
            <Text style={styles.buttonText}>Post to Feed</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f7f9fc' },
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
  button: {
    backgroundColor: '#3897f0',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#3897f0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
    marginVertical: 10, // Added spacing between buttons
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default ReportScreen;