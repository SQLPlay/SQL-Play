import React, {useEffect} from 'react';
import {StyleSheet, Text, View, Alert, Linking} from 'react-native';
import pkginfo from '../../package.json';

const appInfoURL =
  'https://github.com/ShivamJoker/SQL-Playground/raw/master/package.json';

// we will fetch the package.json from the github and check against the current version
const fetchAppDetails = async () => {
  const res = await fetch(appInfoURL);
  const body = await res.json();
  const info = {version: body.version, whatsNew: body.whatsNew};
  console.log(info);
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
        onPress: () => console.log('Ask me later pressed'),
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

const checkIsUpdated = async () => {
  const {whatsNew, version} = await fetchAppDetails();
  const localVersion = pkginfo.version;

  if (localVersion !== version) {
    showAlert(whatsNew);
  }
};

checkIsUpdated();
