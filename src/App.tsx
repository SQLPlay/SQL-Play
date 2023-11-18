import React, {useState, useRef, useEffect} from 'react';
import {StatusBar, StyleSheet, Text, useColorScheme} from 'react-native';

import {NotifierWrapper} from 'react-native-notifier';
// import SplashScreen from 'react-native-bootsplash';

import {getStatusBarHeight} from 'react-native-status-bar-height';
// import {BottomSheetModalProvider} from '@gorhom/bottom-sheet/';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createStackNavigator} from '@react-navigation/stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
// import messaging from '@react-native-firebase/messaging';
import {
  DefaultTheme,
  DarkTheme as DefaultDarkTheme,
  NavigationContainer,
} from '@react-navigation/native';
// import {initDb} from '~/utils/storage';
// import SupportedQuery from '~/screens/Lesson';
// import {setupKeyboardListener} from '~/utils/keyboard-status';
import {RootStackParamList} from '~/types/nav';
// import Purchase from './screens/Purchase';
import {isCached, preload, register} from 'react-native-bundle-splitter';
import CodeRunner from '~/screens/CodeRunner';
import TabNav from '~/screens/TabNav';
// import Export from './screens/Export';
// import SupportTicket from './screens/SupportTicket';
// import SupportTicketsList from './screens/SupportTicketsList';
// import {secureStore} from './store/mmkv';

const IS_DEV = process.env.NODE_ENV === 'development';
import {StartupTime, getTimeSinceStartup} from 'react-native-startup-time';
if (IS_DEV) {
  // secureStore.setBoolAsync('hasPro', true);
}

const Stack = createStackNavigator<RootStackParamList>();

const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
};

const DarkTheme = {
  ...DefaultDarkTheme,
  colors: {
    ...DefaultDarkTheme.colors,
  },
};

const setupMsg = async () => {
  // await messaging().registerDeviceForRemoteMessages();
  // await messaging().subscribeToTopic('alerts');
};

const LazyTab = register({
  loader: () => import('./screens/TabNav'),
  placeholder: () => <Text>Wait up bro</Text>,
});

const LazyCodeRunner = register({
  loader: () => import('./screens/CodeRunner'),
  placeholder: () => <Text>Wait up bro</Text>,
  name: 'CodeRunner',
});

const RootStackNav = () => (
  <Stack.Navigator screenOptions={{}} initialRouteName="Main">
    <Stack.Screen
      name="Main"
      options={{headerShown: false}}
      component={TabNav}
    />
    {/**
    <Stack.Screen
      options={{title: 'SQL Compatibility'}}
      //@ts-ignore
      name="SupportedQuery"
      component={SupportedQuery}
    />
    <Stack.Screen name="Export" component={Export} />
    <Stack.Screen
      //@ts-ignore
      name="TicketsList"
      options={{title: 'Your support tickets'}}
      component={SupportTicketsList}
    />
    <Stack.Screen
      name="SupportTicket"
      options={{title: 'Create support ticket'}}
      component={SupportTicket}
    />
    <Stack.Group
      screenOptions={{presentation: 'transparentModal', headerShown: false}}>
      <Stack.Screen name="Purchase" component={Purchase} />
    </Stack.Group>

    **/}
  </Stack.Navigator>
);

const App = () => {
  useEffect(() => {
    // isCached('CodeRunner') ? null : preload().component('CodeRunner');
    // initDb();
    // setupKeyboardListener();
    setupMsg();
  }, []);

  const scheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : LightTheme}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={LightTheme.colors.background}
        />
        <SafeAreaProvider>
          <NotifierWrapper>
            <RootStackNav />
            <StartupTime />
          </NotifierWrapper>
        </SafeAreaProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  statusBar: {
    height: getStatusBarHeight(),
    backgroundColor: '#c8b900',
  },
  modalStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000a1',
  },
});

export default App;
