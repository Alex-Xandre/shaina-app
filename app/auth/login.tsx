import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ToastAndroid } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { UserIcon, KeyIcon } from 'react-native-heroicons/outline';
import { ThemedText } from '@/components/ThemedText';
import logo from '../../assets/images/logo.png';
import { loginUser } from '@/api/login.api';
import { useAuth } from '@/state/AuthContext';
import { login } from '@/state/AuthReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUser } from '@/api/user.api';

const Login = () => {
  const router = useRouter();
  const { dispatch } = useAuth();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [userIdError, setUserIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigation: any = useNavigation();

  const handleLogin = async () => {
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

    const res = await loginUser({ userId, password });

    if (res.success === false) {
      ToastAndroid.show(res.data?.msg || 'Error', ToastAndroid.SHORT);

      return;
    }

    await AsyncStorage.setItem('token', res.token);
    const getUsers = await getUser();
    dispatch(login({ user: getUsers, token: res.token }));
    navigation.navigate('home');
    // setTimeout(() => {
    //   window.location.reload();
    // }, 1500);
  };

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
      <ThemedText style={styles.title}>LOGIN</ThemedText>
      <Input
        icon={
          <UserIcon
            height={24}
            width={24}
            color='#000'
          />
        }
        placeholder='Officer ID'
        value={userId}
        onChangeText={setUserId}
        error={userIdError}
      />
      <Input
        placeholder='Password'
        value={password}
        icon={
          <KeyIcon
            height={24}
            width={24}
            color='#000'
          />
        }
        onChangeText={setPassword}
        secureTextEntry={true}
        error={passwordError}
      />

      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('auth/register')}>
          <ThemedText style={styles.linkText}>Signup</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity>
          <ThemedText style={styles.linkText}>Forgot Password?</ThemedText>
        </TouchableOpacity>
      </View>

      <Button
        text='Login'
        onClick={handleLogin}
      />
      <Button
        text='Back to Home'
        customStyle={{ marginTop: 20 }}
        onClick={() => navigation.navigate('index')}
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
    fontSize: 25,
    fontWeight: 'semibold',
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 10,
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

export default Login;
