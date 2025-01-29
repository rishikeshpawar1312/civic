// screens/SignupScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

function SignupScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [region, setRegion] = useState('');
  const [gender, setGender] = useState('');

  const indoreRegions = [
    "Vijay Nagar",
    "Palasia",
    "Rau",
    "Rajendra Nagar",
    "Mhow",
    "Sukhlia",
    "Banganga",
    "Bhanwarkuan",
    "Khajrana",
  ];

  const genders = ["Male", "Female", "Other"];

  const handleSignup = () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }

    // Handle signup logic
    console.log('Signup Details:', { username, name, email, number, region, gender });
    Alert.alert('Signup Successful', 'Welcome to the app!');
    navigation.navigate('LoginPage');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={(text) => setName(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Number"
        value={number}
        onChangeText={(text) => setNumber(text)}
        style={styles.input}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Select Region:</Text>
      <Picker
        selectedValue={region}
        onValueChange={(itemValue) => setRegion(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Region" value="" />
        {indoreRegions.map((region) => (
          <Picker.Item key={region} label={region} value={region} />
        ))}
      </Picker>

      <Text style={styles.label}>Select Gender:</Text>
      <Picker
        selectedValue={gender}
        onValueChange={(itemValue) => setGender(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Gender" value="" />
        {genders.map((gender) => (
          <Picker.Item key={gender} label={gender} value={gender} />
        ))}
      </Picker>

      <Button title="Signup" onPress={handleSignup} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
  },
});

export default SignupScreen;
