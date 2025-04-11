import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import RNPickerSelect from 'react-native-picker-select';

function PhotoDisplayScreen({ route, navigation }) {
  const { imageUri, location } = route.params;
  const [hashtags, setHashtags] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');

  const handleNext = () => {
    navigation.navigate('FinalPost', {
      imageUri,
      location,
      hashtags,
      tags,
      category,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Add Details</Text>
      <Image source={{ uri: imageUri }} style={styles.image} />

      {/* Category Dropdown */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Select Problem Category:</Text>
        <RNPickerSelect
          onValueChange={(value) => setCategory(value)}
          items={[
            { label: 'Water Issue', value: 'water' },
            { label: 'Potholes', value: 'potholes' },
            { label: 'Electricity Issue', value: 'electricity' },
            { label: 'Garbage', value: 'garbage' },
            { label: 'Other', value: 'other' },
          ]}
          placeholder={{ label: 'Choose a category...', value: null }}
          style={pickerSelectStyles}
        />
      </View>

      {/* Hashtags & Tags Input */}
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
    aspectRatio: 3 / 4,
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// Custom styles for Picker
const pickerSelectStyles = {
  inputIOS: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  inputAndroid: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
};

export default PhotoDisplayScreen;
