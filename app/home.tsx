import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/state/AuthContext'; // Import your auth context
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';
import { Container } from '@/components/helpers/Container';

const Home = () => {
  const { user } = useAuth();
  if (!user) {
    return null;
  }
  return (
    <View>
      <Sidebar />
    </View>
  );
};

export default Home;
