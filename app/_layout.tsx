import { AuthContextProvider } from '@/state/AuthContext';
import { useAuth } from '@/state/AuthContext';
import { Stack, useNavigation } from 'expo-router';
import { Provider } from 'react-redux';
import store from '../store';
import { TabProvider } from '@/components/helpers/TabContext';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <Provider store={store}>
        <AuthContextProvider>
          <TabProvider>
            <LayoutWithAuth />
          </TabProvider>
        </AuthContextProvider>
      </Provider>
    </GestureHandlerRootView>
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
        <>
          <Stack.Screen name='auth/login' />
          <Stack.Screen name='auth/register' />
        </>
      ) : (
        <>
          <Stack.Screen name='home' />
          <Stack.Screen name='index' />

          <Stack.Screen name='employee/index' />
          <Stack.Screen name='employee/new' />

          <Stack.Screen name='attendance/index' />
          <Stack.Screen name='attendance/new' />

          <Stack.Screen name='attendance/index' />
          <Stack.Screen name='attendance/new' />

          <Stack.Screen name='leave/index' />
          <Stack.Screen name='leave/new' />
          {/* <Stack.Screen name='employee/index' /> 
          <Stack.Screen name='employee/new' /> */}
        </>
      )}
    </Stack>
  );
}
