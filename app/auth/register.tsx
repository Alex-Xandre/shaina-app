import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ToastAndroid } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { UserIcon, KeyIcon, AtSymbolIcon } from 'react-native-heroicons/outline';
import { ThemedText } from '@/components/ThemedText';
import logo from '../../assets/images/logo.png';
import { useNavigation } from 'expo-router';
import { registerUser } from '@/api/register.api';

const Register = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [userIdError, setUserIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const handleRegister = async () => {
    // Validate input fields
    if (!userId) {
      setUserIdError('User ID is required');
      return;
    } else {
      setUserIdError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      return;
    } else {
      setPasswordError('');
    }

    if (!email) {
      setEmailError('Email is required');
      return;
    } else {
      setEmailError('');
    }

    //  email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      return;
    } else {
      setEmailError('');
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Confirm password is required');
      return;
    } else {
      setConfirmPasswordError('');
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    } else {
      setConfirmPasswordError('');
    }

    // Proceed with registration
    // const res = await registerUser({ userId, email, password });

    // if (res.success === false) {
    //   ToastAndroid.show(res.data?.msg || 'Error', ToastAndroid.SHORT);
    //   return;
    // }

    // Navigate or perform other actions
    // navigation.navigate('home');

    const res = await registerUser({
      userId: userId,
      email: email,
      password: password,
      role: 'user',
    });

    if (res.success === false) {
      ToastAndroid.show(res.data?.msg || 'Error', ToastAndroid.SHORT);
      // return;
    }
    ToastAndroid.show(res.data?.msg, ToastAndroid.SHORT);
    navigation.navigate('auth/login');
  };

  const navigation: any = useNavigation();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={logo}
          style={styles.logo}
        />
        <View style={styles.textContainer}>
          <ThemedText style={styles.text}>Police Hotline</ThemedText>
          <ThemedText style={styles.text}>Movement</ThemedText>
          <ThemedText style={styles.text}>Incorporated</ThemedText>
        </View>
      </View>
      <ThemedText style={styles.title}>Register</ThemedText>

      <Input
        icon={<UserIcon height={16} />}
        placeholder='Officer ID'
        value={userId}
        onChangeText={setUserId}
        error={userIdError}
      />

      <Input
        placeholder='Email'
        value={email}
        icon={<AtSymbolIcon height={16} />}
        onChangeText={setEmail}
        error={emailError}
      />

      <Input
        placeholder='Password'
        value={password}
        icon={<KeyIcon height={16} />}
        onChangeText={setPassword}
        secureTextEntry={true}
        error={passwordError}
      />

      <Input
        placeholder='Confirm Password'
        value={confirmPassword}
        icon={<KeyIcon height={16} />}
        onChangeText={setConfirmPassword}
        secureTextEntry={true}
        error={confirmPasswordError}
      />

      <View style={styles.linkContainer}>
        <TouchableOpacity>
          <ThemedText style={styles.linkText}>Back to Login</ThemedText>
        </TouchableOpacity>
      </View>

      <Button
        text='Register'
        onClick={handleRegister}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  textContainer: {
    justifyContent: 'center',
  },
  text: {
    color: 'white',
  },
  title: {
    fontSize: 32,
    fontWeight: 'semibold',
    textAlign: 'center',
    marginBottom: 24,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 16,
  },
  linkText: {
    color: 'white',
  },
});

export default Register;
