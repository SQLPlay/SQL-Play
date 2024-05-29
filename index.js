/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import 'react-native-gesture-handler';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import App from './src/App';

AppRegistry.registerComponent(appName, () => App);

messaging().setBackgroundMessageHandler(
  () => new Promise(resolve => resolve()),
);
