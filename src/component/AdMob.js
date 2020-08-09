import React, {useEffect} from 'react';
import {StyleSheet, Text, View,} from 'react-native';
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
} from 'react-native-admob';

export default function AdMob() {
  useEffect(() => {
    AdMobInterstitial.setAdUnitID('ca-app-pub-3940256099942544/8691691433');
    AdMobInterstitial.setTestDevices([AdMobInterstitial.simulatorId]);
   
    AdMobInterstitial.requestAd().then(() =>
      // AdMobInterstitial.showAd(),
      null
    );
  }, []);
  return (
    null
  );
}

const styles = StyleSheet.create({});
