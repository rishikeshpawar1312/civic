import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const FeedScreen = ({ route, navigation }) => {
  const { postData } = route.params;

  const handleLocationPress = (location) => {
    navigation.navigate('Map', { location });
  };

  const handleReportPress = (post) => {
    navigation.navigate('Report', { ...post });
  };

  const renderItem = ({ item }) => (
    <View style={styles.postContainer}>
      <Image source={{ uri: item.imageUri }} style={styles.postImage} />
      <Text style={styles.postCaption}>{item.caption}</Text>
      {item.location && (
        <TouchableOpacity onPress={() => handleLocationPress(item.location)}>
          <Text style={styles.postLocation}>
            {item.location.coords.latitude.toFixed(2)}, {item.location.coords.longitude.toFixed(2)}
          </Text>
        </TouchableOpacity>
      )}
      <Text style={styles.postTags}>Tags: {item.tags}</Text>
      <Text style={styles.postHashtags}>{item.hashtags}</Text>
      <TouchableOpacity style={styles.reportButton} onPress={() => handleReportPress(item)}>
        <Text style={styles.reportButtonText}>Generate Report</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={[postData]} // This should be your array of posts
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff' },
  postContainer: { marginBottom: 20, padding: 15, backgroundColor: '#f8f8f8', borderRadius: 10 },
  postImage: { width: '100%', aspectRatio: 1, borderRadius: 10 },
  postCaption: { fontSize: 16, marginVertical: 10 },
  postLocation: { fontSize: 14, color: '#3897f0', marginBottom: 5 },
  postTags: { fontSize: 14, color: '#385185', marginBottom: 5 },
  postHashtags: { fontSize: 14, color: '#003569' },
  reportButton: { backgroundColor: '#3897f0', padding: 10, alignItems: 'center', borderRadius: 5, marginTop: 10 },
  reportButtonText: { color: '#fff', fontSize: 16 },
});

export default FeedScreen;
