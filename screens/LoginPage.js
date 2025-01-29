import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Add your login logic here
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    // Sample login logic
    console.log('Logging in with:', { email, password });
    // Navigate to your main app screen after successful login
    navigation.navigate('Success');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView className="flex-1">
        <View className="flex-1 p-6">
          {/* Logo/Header Section */}
          <View className="items-center mb-10 mt-10">
            <Text className="text-3xl font-bold text-blue-600 mb-2">Welcome Back</Text>
            <Text className="text-gray-500 text-center">
              Sign in to continue accessing your account
            </Text>
          </View>

          {/* Form Section */}
          <View className="space-y-4">
            {/* Email Input */}
            <View>
              <Text className="text-gray-700 mb-2 font-medium">Email</Text>
              <TextInput
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View>
              <Text className="text-gray-700 mb-2 font-medium">Password</Text>
              <TextInput
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {/* Forgot Password */}
            <TouchableOpacity className="items-end">
              <Text className="text-blue-600">Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              className="bg-blue-600 rounded-lg py-4 items-center mt-6"
              onPress={handleLogin}
            >
              <Text className="text-white font-semibold text-lg">Login</Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up Section */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-600">Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text className="text-blue-600 font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Social Login Section */}
          <View className="mt-8">
            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-0.5 bg-gray-300" />
              <Text className="mx-4 text-gray-500">Or continue with</Text>
              <View className="flex-1 h-0.5 bg-gray-300" />
            </View>

            {/* Social Login Buttons */}
            <View className="flex-row justify-center space-x-4">
              <TouchableOpacity className="flex-row items-center border border-gray-300 rounded-lg px-6 py-2">
                <Text className="text-gray-700">Google</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center border border-gray-300 rounded-lg px-6 py-2">
                <Text className="text-gray-700">Facebook</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;