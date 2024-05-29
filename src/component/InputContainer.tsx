import React, {useState, FC, useEffect, useRef, useCallback} from 'react';

import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  Platform,
  StyleSheet,
} from 'react-native';

import {
  Directions,
  FlingGestureHandler,
  FlingGestureHandlerStateChangeEvent,
  State,
  TextInput,
} from 'react-native-gesture-handler';

import {lightDark} from '../data/colors.json';
import {findUserCommands, getLastUserCommand} from '../utils/storage';
import {debounce} from '../utils/utils';
import {ids} from '../../e2e/ids';
import BaseIcon from './Icons/BaseIcon';
import {useStore} from '@nanostores/react';
import {$inputQuery, $inputSelection} from '~/store/input';

const codeFont = Platform.OS === 'ios' ? 'courier' : 'monospace';

const InputContainer = ({}) => {
  const historyOffset = useRef<number>(-1);
  const [autoCompleteTxt, setAutoCompleteTxt] = useState<string>('');

  type CallbackType = (...args: string[]) => void;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getAutoComplete = useCallback<CallbackType>(
    debounce(
      (val: string) =>
        findUserCommands(val).then(e => {
          // console.log('autocomplete', e);
          setAutoCompleteTxt(e);
        }),
      100,
    ),
    [],
  );

  const handleSwipeLeft = ({
    nativeEvent,
  }: FlingGestureHandlerStateChangeEvent) => {
    if (nativeEvent.state === State.ACTIVE) {
      // isPremium && clearInput();
    }
  };

  const handleSwipeRight = ({
    nativeEvent,
  }: FlingGestureHandlerStateChangeEvent) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      // setAutoInput();
    }
  };
  const inputValue = useStore($inputQuery);

  return (
    <View style={{marginHorizontal: 5}}>
      <View style={styles.inputContainer}>
        <FlingGestureHandler
          direction={Directions.RIGHT}
          onHandlerStateChange={handleSwipeRight}>
          <FlingGestureHandler
            direction={Directions.LEFT}
            onHandlerStateChange={handleSwipeLeft}>
            <TextInput
              style={styles.input}
              autoFocus={true}
              testID={ids.queryTextInput}
              onChangeText={text => $inputQuery.set(text)}
              onSelectionChange={e =>
                $inputSelection.set(e.nativeEvent.selection)
              }
              multiline
              placeholderTextColor="gray"
              className="text-black dark:text-gray-100"
              textAlignVertical="top"
              defaultValue={inputValue}
              keyboardType="ascii-capable"
              autoCorrect={false}
              numberOfLines={6}
              placeholder="Type your SQL query"
            />
          </FlingGestureHandler>
        </FlingGestureHandler>
      </View>
    </View>
  );
};

export default InputContainer;

const styles = StyleSheet.create({
  inputHeader: {
    fontSize: 16,
  },
  inputContainer: {
    position: 'relative',
    borderColor: '#353b48',
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 4,
  },
  input: {
    fontSize: 16,
    paddingVertical: 0,
    paddingBottom: 3,
    fontFamily: codeFont,
    // paddingHorizontal: 5,
    // position: 'relative',
    // zIndex: 2,
    opacity: 1,
    minHeight: 80,
    maxHeight: 200,
  },
  autoCompleteTxtContainer: {
    position: 'absolute',
  },
});
