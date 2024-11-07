import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/state/AuthContext';
import { useNavigation } from 'expo-router';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Button from '@/components/Button';
import logo from '../assets/images/logo.png';

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
          <ThemedText style={styledComponents.text}>Police Hotline</ThemedText>
          <ThemedText style={styledComponents.text}>Movement</ThemedText>
          <ThemedText style={styledComponents.text}>Incorporated</ThemedText>
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
    width: 50,
    height: 50,
    marginBottom: 20, // Increased space below the logo
  },

  textContainer: {
    alignItems: 'center', // Centers the text horizontally
    marginBottom: 24, // Space between text and login button
  },

  text: {
    color: 'white',
    fontSize: 18, // Adjust text size for better readability
    textAlign: 'center', // Centers the text horizontally
  },

  welcomeText: {
    fontSize: 24,
    marginBottom: 24,
  },
});

export default Index;
