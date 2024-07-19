import '../global.css';

import React from 'react';
import {
  InteractionManager,
  Platform,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import {NotifierWrapper} from 'react-native-notifier';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {KeyboardProvider} from 'react-native-keyboard-controller';

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
  secureStore.setBoolAsync('hasPro', false);
  setTimeout(() => {
    secureStore.setBoolAsync('hasPro', true);
  }, 9000);
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
import RootStackNav from './RootStackNav';
import {showErrorNotif} from './utils/notif';

export const navigationRef = createNavigationContainerRef();

const navigateToSupportTicketDetails = (
  msg: FirebaseMessagingTypes.RemoteMessage,
) => {
  if (msg.data?.event_type !== 'new_ticket_response') return;
  const ticketId = msg.data?.ticketId as string;
  if (!ticketId) return;

  navigationRef.navigate('SupportTicketDetails', {ticketId});
};

const isIos = Platform.OS === 'ios';

const setupMsg = async () => {
  // if (isIos) return;
  const notificationPermissions = await messaging().hasPermission();

  const AUTHORIZED_STATUS = 1;

  if (notificationPermissions !== AUTHORIZED_STATUS) {
    const status = await messaging().requestPermission();
    if (status !== AUTHORIZED_STATUS) {
      showErrorNotif('Failed to get notification permission');
      return;
    }
  }

  // await messaging().registerDeviceForRemoteMessages();
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

// let RootStackNav: null | React.JSX.Element = null;

InteractionManager.runAfterInteractions(() => {
  setupKeyboardListener();
  setupMsg();
});

const App = () => {
  const scheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer
        ref={navigationRef}
        theme={scheme === 'dark' ? DarkTheme : LightTheme}>
        <SafeAreaProvider>
          <KeyboardProvider>
            <NotifierWrapper>
              <RootStackNav />
            </NotifierWrapper>
          </KeyboardProvider>
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
