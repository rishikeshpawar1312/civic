import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

function PhotoDisplayScreen({ route, navigation }) {
  const { imageUri, location } = route.params;
  const [hashtags, setHashtags] = useState('');
  const [tags, setTags] = useState('');

  const handleNext = () => {
    navigation.navigate('FinalPost', {
      imageUri,
      location,
      hashtags,
      tags,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Add Details</Text>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add hashtags (comma separated)"
          value={hashtags}
          onChangeText={setHashtags}
        />
        <TextInput
          style={styles.input}
          placeholder="Add tags (comma separated)"
          value={tags}
          onChangeText={setTags}
        />
      </View>
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    aspectRatio: 3/4,
    marginBottom: 20,
  },
  locationContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  locationText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PhotoDisplayScreen;