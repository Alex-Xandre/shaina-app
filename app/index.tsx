import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/state/AuthContext';
import { useNavigation } from 'expo-router';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Button from '@/components/Button';
import logo from '../assets/images/PHMI.jpg';

const Index = () => {
  const nav: any = useNavigation();
  return (
    <ThemedView style={styledComponents.background}>
      <View style={styledComponents.container as any}>
        <Image
          source={logo}
          style={styledComponents.logo}
        />
        <View style={styledComponents.textContainer}>
          <ThemedText style={styledComponents.text}>PHMI</ThemedText>
        </View>
        <Button
          text='Login'
          customStyle={{ paddingRight: 15 }}
          onClick={() => nav.navigate('auth/login')}
        />
      </View>
    </ThemedView>
  );
};

const styledComponents = StyleSheet.create({
  background: {
    flex: 1,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },

  textContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },

  text: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },

  welcomeText: {
    fontSize: 24,
    marginBottom: 24,
  },
});

export default Index;
