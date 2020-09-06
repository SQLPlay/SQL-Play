import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function RunButton({runQuery}) {
  return (
    <TouchableOpacity onPress={runQuery} style={styles.runBtn}>
      <Icon
        name="send-circle"
        size={50}
        color="#2ecc71"
        style={{transform: [{scale: 1.2}]}}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  runBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 250,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
});
