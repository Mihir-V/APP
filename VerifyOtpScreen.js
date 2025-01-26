import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';

const VerifyOtpScreen = () => {
  const [otp, setOtp] = useState('');
  const { email } = useLocalSearchParams(); 
  const router = useRouter(); 

  const verifyOtp = async () => {
    try {
      await axios.post(`http://192.168.1.7:3001/verify-otp`, { email, otp });
      Alert.alert('Success', 'OTP verified successfully');
      router.push({ pathname: 'landingpage', params: { email } }); 
    } catch (error) {
      console.error('Error verifying OTP:', error.response?.data || error.message);
      Alert.alert('Error', 'Invalid or expired OTP');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter OTP sent to {email}</Text>
      <TextInput
        style={styles.input}
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        placeholder="Enter OTP"
      />
      <Button title="Verify OTP" onPress={verifyOtp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});

export default VerifyOtpScreen;
