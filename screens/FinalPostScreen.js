import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

function FinalPostScreen({ route, navigation }) {
  const { imageUri, location, hashtags, tags, category } = route.params;
  const [caption, setCaption] = useState('');

  const handlePost = () => {
    const postData = { imageUri, location, hashtags, tags, caption,  };
    console.log('Posting:', postData);
    alert('Post created successfully!');
     navigation.navigate('Feed', { postData });
  };

  const handleLocationPress = () => {
    navigation.navigate('Map', { location });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="auto" />
      <Image source={{ uri: imageUri }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <TextInput
          style={styles.captionInput}
          placeholder="Write a caption..."
          value={caption}
          onChangeText={setCaption}
          multiline
        />
        {location && (
          <Text style={styles.locationText} onPress={handleLocationPress}>
            📍 {location.coords.latitude.toFixed(2)}, {location.coords.longitude.toFixed(2)}
          </Text>
        )}
        <Text style={styles.tagsText}>Tags: {tags}</Text>
        <Text style={styles.hashtagsText}>{hashtags}</Text>
        <Text style={styles.categoryText}>Category: {category}</Text>

      </View>
      <TouchableOpacity style={styles.postButton} onPress={handlePost}>
        <Text style={styles.postButtonText}>Post</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  detailsContainer: {
    padding: 15,
  },
  captionInput: {
    fontSize: 16,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 14,
    color: '#3897f0',
    marginBottom: 5,
  },
  tagsText: {
    fontSize: 14,
    color: '#385185',
    marginBottom: 5,
  },
  hashtagsText: {
    fontSize: 14,
    color: '#003569',
  },
  postButton: {
    backgroundColor: '#3897f0',
    padding: 15,
    alignItems: 'center',
    margin: 15,
    borderRadius: 5,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryText: {
    fontSize: 14,
    color: '#FF5733', // Different color for visibility
    marginBottom: 5,
  },
});

export default FinalPostScreen;
