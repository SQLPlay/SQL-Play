import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import pkginfo from '../package.json';

const appInfoURL =
  'https://raw.githubusercontent.com/ShivamJoker/SQL-Playground/master/package.json';

export default function UpdateChecker() {
  const fetchAppDetails = async () => {
    const res = await fetch(appInfoURL);
    const json = await res.json();
    console.log(json);
  };
  
  useEffect(() => {
    fetchAppDetails();
  }, []);

  return (
    <View>
      <Text>{pkginfo.version}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
