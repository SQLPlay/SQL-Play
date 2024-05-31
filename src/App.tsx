import '../global.css';

import React, {useState, useRef, useEffect, Suspense, lazy} from 'react';
import {
  Button,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
} from 'react-native';

import {NotifierWrapper} from 'react-native-notifier';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';

import {
  DefaultTheme,
  DarkTheme as DefaultDarkTheme,
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';

import {setupKeyboardListener} from '~/utils/keyboard-status';

import {RootStackParamList} from '~/types/nav';

import {secureStore} from '~/store/mmkv';

const IS_DEV = process.env.NODE_ENV === 'development';
if (IS_DEV) {
  secureStore.setBoolAsync('hasPro', true);
  secureStore.setStringAsync('transactionId', 'TEST123DFSDFSDFSDFSDFDS');
}

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

import {PermissionsAndroid} from 'react-native';
import HomePageSkeleton from './component/Skeletons/HomePageSkeleton';
import {useStore} from '@nanostores/react';
import {$isAppLoading} from './store';

export const navigationRef = createNavigationContainerRef();

const navigateToSupportTicketDetails = (
  msg: FirebaseMessagingTypes.RemoteMessage,
) => {
  if (msg.data?.event_type !== 'new_ticket_response') return;
  const ticketId = msg.data?.ticketId as string;
  if (!ticketId) return;

  navigationRef.navigate('SupportTicketDetails', {ticketId});
};

const setupMsg = async () => {
  const hasNotificationPermissions = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );

  if (!hasNotificationPermissions) {
    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }

  await messaging().registerDeviceForRemoteMessages();
  await messaging().subscribeToTopic('alerts');

  const initialMessage = await messaging().getInitialNotification();

  if (initialMessage) {
    navigateToSupportTicketDetails(initialMessage);
  }
  messaging().onNotificationOpenedApp(navigateToSupportTicketDetails);
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

let RootStackNav: null | React.JSX.Element = null;

const App = () => {
  const [hasLoadedStack, setHasLoadedStack] = useState(false);
  useEffect(() => {
    setupKeyboardListener();
    setupMsg();
  }, []);

  const isAppLoading = useStore($isAppLoading);
  const scheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer
        ref={navigationRef}
        theme={scheme === 'dark' ? DarkTheme : LightTheme}>
        <SafeAreaProvider>
          <NotifierWrapper>
            {isAppLoading ? (
              <HomePageSkeleton
                onMounted={() => {
                  RootStackNav = require('./RootStackNav.tsx').default;
                  setHasLoadedStack(true);
                }}
              />
            ) : null}

            {
              //@ts-ignore
              hasLoadedStack ? <RootStackNav /> : null
            }
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
