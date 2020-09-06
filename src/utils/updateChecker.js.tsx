import {Alert, Linking} from 'react-native';
import pkginfo from '../../package.json';
import {setAppData, getAppData} from './storage';

const appInfoURL =
  'https://github.com/ShivamJoker/SQL-Playground/raw/master/package.json';

// we will fetch the package.json from the github and check against the current version
const fetchAppDetails = async () => {
  const res = await fetch(appInfoURL);
  const body = await res.json();
  const info = {version: body.version, whatsNew: body.whatsNew};
  // console.log(info);
  return info;
};

// show the alert to user to update app
const showAlert = (msg) => {
  Alert.alert(
    'New Update Available',
    `Whats New ? \n${msg}
          `,
    [
      {
        text: 'Remind me later',
        onPress: saveForLater,
        style: 'cancel',
      },
      {
        text: 'Update',
        onPress: () =>
          Linking.openURL('market://details?id=com.sql_playground'),
      },
    ],
    {cancelable: true},
  );
};

const remindedDateId = 'remindedDate';
const saveForLater = async () => {
  const date = new Date().toJSON();
  setAppData(remindedDateId, date);
};

const checkIsUpdated = async () => {
  const remindedDate = await getAppData(remindedDateId);
  console.log(new Date(remindedDate));
  const remindFrequencyMS = 48 * 60 * 60 * 1000; // 24hr

  // if time spend is not more than 48hr then dont check
  if (new Date() - new Date(remindedDate) < remindFrequencyMS) {
    return;
  }

  const {whatsNew, version} = await fetchAppDetails();
  const localVersion = pkginfo.version;

  if (localVersion !== version) {
    showAlert(whatsNew);
  }
};

checkIsUpdated();
