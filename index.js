import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

function SendOtp() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRequestOtp = async () => {
    if (!email) {
      setMessage('Please enter a valid email');
      return;
    }
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://192.168.1.7:3001/request-otp', {  // Use the correct URL here
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('OTP sent successfully');
        router.push({ pathname: 'VerifyOtpScreen', params: { email } });
      } else {
        setMessage(data.message || 'An error occurred');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
      console.error('Error sending OTP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Request OTP</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address" />

      {message ? <Text style={styles.message}>{message}</Text> : null}

      <Button
        title={isLoading ? 'Sending...' : 'Send OTP'}
        onPress={handleRequestOtp}
        disabled={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  message: {
    marginBottom: 16,
    color: 'red',
  },
});

export default SendOtp;
