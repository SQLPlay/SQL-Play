import {MMKVLoader} from 'react-native-mmkv-storage';

export const storage = new MMKVLoader().initialize();

export const secureStore = new MMKVLoader().withEncryption().initialize();
