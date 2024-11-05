import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/state/AuthContext';
import { useNavigation } from 'expo-router';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Button from '@/components/Button';

const Index = () => {
  const nav: any = useNavigation();
  return (
    <ThemedView style={styledComponents.background}>
      <ThemedText>Welcome to the Home Page!</ThemedText>
      <Button
        text='Login'
        onClick={() => nav.navigate('auth/login')}
      />
    </ThemedView>
  );
};

const styledComponents = {
  background: {
    flex: 1,
  },
};

export default Index;
