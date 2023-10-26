import React, {useState, FC, useEffect, useRef, useCallback} from 'react';

import {Text, View, TouchableOpacity, Alert, Platform} from 'react-native';

import {
  DynamicStyleSheet,
  DynamicValue,
  useDynamicValue,
} from 'react-native-dynamic';

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
  const styles = useDynamicValue(dynamicStyles);
  console.log(inputValue.replaceAll('\n', '<br/>'));
  return (
    <View style={{paddingHorizontal: 5}}>
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
              textAlignVertical="top"
              defaultValue={inputValue}
              keyboardType="ascii-capable"
              autoCorrect={false}
              numberOfLines={4}
              placeholder="Type your SQL query"
            />
          </FlingGestureHandler>
        </FlingGestureHandler>
      </View>
    </View>
  );
};

export default InputContainer;

const dynamicStyles = new DynamicStyleSheet({
  inputHeader: {
    fontSize: 16,
    color: new DynamicValue('black', 'white'),
  },
  inputContainer: {
    position: 'relative',
    borderColor: '#353b48',
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: new DynamicValue('white', lightDark),
  },
  input: {
    fontSize: 16,
    fontFamily: codeFont,
    paddingHorizontal: 5,
    paddingRight: 18,
    // position: 'relative',
    zIndex: 2,
    opacity: 1,
    height: 120,
    color: new DynamicValue('black', 'white'),
  },
  autoCompleteTxtContainer: {
    position: 'absolute',
  },
  autoCompleteTxt: {
    position: 'absolute',
    zIndex: 1,
    fontFamily: codeFont,
    fontSize: 16,
    color: 'gray',
    top: 4.8,
    left: 4.8,
    opacity: 0.8,
  },
});
