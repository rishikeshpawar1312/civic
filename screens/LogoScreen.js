// screens/LogoScreen.js
import React, { useEffect, useRef } from 'react';
import { View, Button, Animated, StyleSheet, Text } from 'react-native';

function LogoScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity for logo
  const textScaleAnim = useRef(new Animated.Value(0.8)).current; // Initial scale for text
  const textFadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity for text

  useEffect(() => {
    // Start fade-in animation for logo when the component mounts
    Animated.timing(fadeAnim, {
      toValue: 1, // Animate to fully visible (opacity 1)
      duration: 2000, // Duration of 2 seconds
      useNativeDriver: true,
    }).start();

    // Start scale and fade-in animation for "CivicAction" text
    Animated.parallel([
      Animated.timing(textScaleAnim, {
        toValue: 0.8, // Scale to normal size (1x)
        duration: 2000, // Duration of 2 seconds
        useNativeDriver: true,
      }),
      Animated.timing(textFadeAnim, {
        toValue: 1, // Fade-in to full opacity
        duration: 2000, // Duration of 2 seconds
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, textScaleAnim, textFadeAnim]);

  return (
    <View style={styles.container}>
      {/* Animated logo */}
      <Animated.Image
        source={require('../assets/logo.png')} // Update with your logo path
        style={[styles.logo, { opacity: fadeAnim }]} // Apply animated opacity
      />

      {/* Animated CivicAction text */}
      <Animated.Text
        style={[
          styles.appName,
          {
            opacity: textFadeAnim,
            transform: [{ scale: textScaleAnim }],
          },
        ]}
      >
        CivicAction
      </Animated.Text>

      {/* Navigation button */}
      <Button title="Go to Login page" onPress={() => navigation.navigate('LoginPage')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Customize background color
  },
  logo: {
    width: 150, // Set desired width
    height: 150, // Set desired height
    marginBottom: 20, // Space between logo and text
  },
  appName: {
    fontSize: 28, // Font size for the app name
    fontWeight: 'bold', // Bold text style
    marginBottom: 30, // Space between app name and button
    color: '#000', // Customize text color as needed
    letterSpacing: 1.5, // Optional spacing for style
  },
});

export default LogoScreen;
