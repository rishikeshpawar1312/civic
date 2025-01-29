import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

// Initial sample post data
const initialPosts = [
  {
    id: '1',
    title: 'New React Native update released',
    author: 'ReactNativeTeam',
    impressions: 1234,
    comments: 250,
    likes: 1200,
  },
  {
    id: '2',
    title: 'Expo tips and tricks for beginners',
    author: 'ExpoExpert',
    impressions: 499,
    comments: 150,
    likes: 800,
  },
  {
    id: '3',
    title: 'React Native vs Flutter: Which is better?',
    author: 'TechDebater',
    impressions: 500,
    comments: 320,
    likes: 900,
  },
  // Add more sample posts as needed
];

const RedditStyleFeed = () => {
  const [posts, setPosts] = useState(initialPosts);

  // Function to handle card click and update impressions
  const handleCardClick = (id) => {
    setPosts((prevPosts) => {
      const updatedPosts = prevPosts.map((post) => {
        if (post.id === id) {
          // Increase impressions by a small random value
          const increment = Math.floor(Math.random() * 20) + 1; // Randomly increase by 1 to 20
          return { ...post, impressions: post.impressions + increment };
        }
        return post;
      });

      // Re-sort posts based on updated impressions
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
