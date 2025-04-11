import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

// Initial sample post data (with image support)
const initialPosts = [
  {
    id: '1',
    title: 'New React Native update released',
    author: 'ReactNativeTeam',
    impressions: 1234,
    comments: 250,
    likes: 1200,
    imageUri: null, // No image for initial sample
  },
  {
    id: '2',
    title: 'Expo tips and tricks for beginners',
    author: 'ExpoExpert',
    impressions: 499,
    comments: 150,
    likes: 800,
    imageUri: null,
  },
  {
    id: '3',
    title: 'React Native vs Flutter: Which is better?',
    author: 'TechDebater',
    impressions: 500,
    comments: 320,
    likes: 900,
    imageUri: null,
  },
];

const RedditStyleFeed = ({ route }) => {
  const [posts, setPosts] = useState(initialPosts);

  // Check if there's new post data from navigation params and add it to the feed
  useEffect(() => {
    if (route?.params?.postData) {
      const { imageUri, location, hashtags, tags, caption } = route.params.postData;
      const newPost = {
        id: Date.now().toString(), // Unique ID based on timestamp
        title: caption || 'Untitled Post', // Use caption as title
        author: 'CurrentUser', // Replace with actual user data if available
        impressions: 0,
        comments: 0,
        likes: 0,
        imageUri: imageUri || null,
        location: location || null,
        hashtags: hashtags || '',
        tags: tags || '',
      };
      setPosts((prevPosts) => [newPost, ...prevPosts]); // Add new post at the top
    }
  }, [route?.params?.postData]);

  // Function to handle card click and update impressions
  const handleCardClick = (id) => {
    setPosts((prevPosts) => {
      const updatedPosts = prevPosts.map((post) => {
        if (post.id === id) {
          const increment = Math.floor(Math.random() * 20) + 1;
          return { ...post, impressions: post.impressions + increment };
        }
        return post;
      });
      return [...updatedPosts].sort((a, b) => b.impressions - a.impressions);
    });
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => <PostCard post={item} onPress={() => handleCardClick(item.id)} />}
    />
  );
};

const PostCard = ({ post, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.postCard}>
      <View style={styles.authorContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{post.author[0]}</Text>
        </View>
        <Text style={styles.authorText}>{post.author}</Text>
      </View>
      <Text style={styles.postTitle}>{post.title}</Text>
      {post.imageUri && (
        <Image source={{ uri: post.imageUri }} style={styles.postImage} />
      )}
      {post.location && (
        <Text style={styles.locationText}>
          📍 {post.location.coords.latitude.toFixed(2)}, {post.location.coords.longitude.toFixed(2)}
        </Text>
      )}
      {post.hashtags && <Text style={styles.hashtagsText}>{post.hashtags}</Text>}
      {post.tags && <Text style={styles.tagsText}>Tags: {post.tags}</Text>}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Ionicons name="heart-outline" size={18} color="#333" />
          <Text style={styles.statText}>{post.likes}</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="chatbubble-outline" size={18} color="#333" />
          <Text style={styles.statText}>{post.comments}</Text>
        </View>
        <Text style={styles.statText}>{post.impressions} impressions</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 8,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  authorText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  postImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#3897f0',
    marginBottom: 5,
  },
  hashtagsText: {
    fontSize: 14,
    color: '#003569',
    marginBottom: 5,
  },
  tagsText: {
    fontSize: 14,
    color: '#385185',
    marginBottom: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    marginLeft: 4,
    color: '#666',
  },
});

export default RedditStyleFeed;