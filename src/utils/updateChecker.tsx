import SpInAppUpdates, {
  NeedsUpdateResponse,
  IAUUpdateKind,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';

import {version} from '../../package.json';
const inAppUpdates = new SpInAppUpdates(
  false, // isDebug
);

inAppUpdates.checkNeedsUpdate({curVersion: version}).then((result) => {
  if (result.shouldUpdate) {
    let updateOptions: StartUpdateOptions = {};
    if (Platform.OS === 'android') {
      // android only, on iOS the user will be promped to go to your app store page
      updateOptions = {
        updateType: IAUUpdateKind.FLEXIBLE,
      };
    }
    inAppUpdates.startUpdate(updateOptions);
  }
});
