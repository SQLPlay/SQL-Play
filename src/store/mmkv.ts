import {MMKVLoader} from 'react-native-mmkv-storage';

export const storage = new MMKVLoader()
  .withInstanceID('general_store')
  .initialize();

export const historyStore = new MMKVLoader()
  .withInstanceID('commands_history')
  .initialize();

export const secureStore = new MMKVLoader()
  .withInstanceID('encrypted_store')
  .withEncryption()
  .initialize();
