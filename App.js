import 'react-native-gesture-handler';  // Must be first import
import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import AccountsScreen from './screens/AccountsScreen';
import DeletedTransactionsScreen from './screens/DeletedTransactionsScreen';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#000000',
    card: '#000000',
    text: '#ffffff',
    border: '#333333',
  },
};

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer theme={MyTheme}>
          <Stack.Navigator 
            initialRouteName="Home"
            screenOptions={{
              headerShown: false,
              cardStyle: { backgroundColor: '#000' },
              presentation: 'card',
              animationEnabled: true,
              cardOverlayEnabled: true,
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen 
              name="Settings" 
              component={SettingsScreen}
              options={{
                gestureEnabled: true,
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen 
              name="Accounts" 
              component={AccountsScreen}
              options={{
                gestureEnabled: true,
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen 
              name="DeletedTransactions" 
              component={DeletedTransactionsScreen}
              options={{
                gestureEnabled: true,
                animation: 'slide_from_right',
              }}
            />
          </Stack.Navigator>
          <StatusBar style="light" />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
});
