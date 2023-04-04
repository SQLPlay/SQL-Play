import React, {FC} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import {ids} from '../../e2e/ids';
import BaseIcon from './Icons/BaseIcon';

interface Props {
  runQuery: (event: GestureResponderEvent) => void;
}
const RunButton: FC<Props> = ({runQuery}) => {
  return (
    <TouchableOpacity
      testID={ids.runBtn}
      accessibilityLabel="run button"
      accessibilityHint="runs the command which is typed in input box"
      onPress={runQuery}
      style={styles.runBtn}>
      <BaseIcon name="PaperPlaneRight" fill="#ffffff" />
    </TouchableOpacity>
  );
};

export default RunButton;

const styles = StyleSheet.create({
  runBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    padding: 10,
    // width: 50,
    // height: 50,
    backgroundColor: '#2ecc71',
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
