import React from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import MapView, { Marker, Callout, Polygon, Polyline } from 'react-native-maps';

const MapScreen = ({ route }) => {
  const { location } = route.params;

  const initialRegion = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const markers = [
    {
      coordinate: { latitude: location.coords.latitude, longitude: location.coords.longitude },
      title: "Current Location",
      description: "This is where you are now."
    },
    // Add more markers here
  ];

  const polygonCoordinates = [
    { latitude: location.coords.latitude + 0.01, longitude: location.coords.longitude + 0.01 },
    { latitude: location.coords.latitude + 0.01, longitude: location.coords.longitude - 0.01 },
    { latitude: location.coords.latitude - 0.01, longitude: location.coords.longitude - 0.01 },
    { latitude: location.coords.latitude - 0.01, longitude: location.coords.longitude + 0.01 },
  ];

  const polylineCoordinates = [
    { latitude: location.coords.latitude, longitude: location.coords.longitude },
    { latitude: location.coords.latitude + 0.02, longitude: location.coords.longitude + 0.02 },
  ];

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        onMapReady={() => {
          this.map.animateToRegion(initialRegion, 1000);
        }}
        ref={(ref) => { this.map = ref; }}
      >
        {markers.map((marker, index) => (
          <Marker key={index} coordinate={marker.coordinate}>
            <Callout>
              <View>
                <Text>{marker.title}</Text>
                <Text>{marker.description}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
        <Polygon
          coordinates={polygonCoordinates}
          strokeColor="#000"
          fillColor="rgba(255,0,0,0.5)"
          strokeWidth={1}
        />
        <Polyline
          coordinates={polylineCoordinates}
          strokeColor="#000"
          strokeWidth={3}
        />
      </MapView>
      <Button
        title="Center on Current Location"
        onPress={() => {
          this.map.animateToRegion(initialRegion, 1000);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapScreen;
