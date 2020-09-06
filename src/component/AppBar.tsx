import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SearchBox from './SearchBox';

export interface SeachInputProp {
  setInputValue: (query: string) => void;
}

const AppBar: React.FC<SeachInputProp> = ({setInputValue}) => {
  return (
    <View style={styles.appBar}>
      <Text style={styles.appBarTxt}>SQL Playground</Text>
      <SearchBox setInputValue={setInputValue} />
    </View>
  );
};

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
    color: '#2f3542',
  },
});

export default AppBar;
