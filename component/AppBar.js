import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function AppBar() {
  return (
    <View style={styles.appBar}>
      {/* <Icon name="menu" size={24} /> */}
      <Text style={styles.appBarTxt}>SQL Playground</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  appBar: {
    width: '100%',
    height: 45,
    backgroundColor: '#ffea00',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  appBarTxt: {
    textAlign: 'center',
    fontSize: 22,
    color: "#2f3542",
  },
});
