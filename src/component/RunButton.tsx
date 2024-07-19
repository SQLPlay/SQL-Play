import React, {useEffect} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import {useReanimatedKeyboardAnimation} from 'react-native-keyboard-controller';
import {ids} from '../../e2e/ids';
import BaseIcon from './Icons/BaseIcon';
import {runQuery} from '~/utils/run-query';
import Animated from 'react-native-reanimated';

const RunButton = () => {
  const {height, progress} = useReanimatedKeyboardAnimation();

  return (
    <Animated.View
      style={{transform: [{translateY: height}], position: 'relative'}}>
      <TouchableOpacity
        testID={ids.runBtn}
        accessibilityLabel="run button"
        accessibilityHint="runs the command which is typed in input box"
        onPress={runQuery}
        style={[styles.runBtn]}>
        <BaseIcon name="PaperPlaneRight" fill="#ffffff" />
      </TouchableOpacity>
    </Animated.View>
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
