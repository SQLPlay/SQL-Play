/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import 'react-native-gesture-handler';
import App from './src/App';
import {name as appName} from './app.json';
// import NoApp from './NoApp';

// console.log('yo bro');
AppRegistry.registerComponent(appName, () => App);
