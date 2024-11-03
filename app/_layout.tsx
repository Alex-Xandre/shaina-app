import { AuthContextProvider } from '@/state/AuthContext';
import { useAuth } from '@/state/AuthContext';
import { Stack, useNavigation } from 'expo-router';
import { Provider } from 'react-redux';
import store from '../store';
import { TabProvider } from '@/components/helpers/TabContext';
import { useEffect } from 'react';
export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthContextProvider>
        <TabProvider>
          <LayoutWithAuth />
        </TabProvider>
      </AuthContextProvider>
    </Provider>
  );
}

function LayoutWithAuth() {
  const { isLoggedIn } = useAuth();
  const navigation: any = useNavigation();

  useEffect(() => {
    if (isLoggedIn) {
      navigation.navigate('home');
    }
  }, [isLoggedIn]);
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <Stack.Screen name='auth/login' />
      ) : (
        <>
          <Stack.Screen name='/home' />
          {/* <Stack.Screen name='employee/index' /> 
          <Stack.Screen name='employee/new' /> */}
        </>
      )}
    </Stack>
  );
}
