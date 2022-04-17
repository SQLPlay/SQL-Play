import React, {useState, FC, useEffect, useRef, useCallback} from 'react';

import {
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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

import {lightDark, sideButton} from '../data/colors.json';
import {findUserCommands, getLastUserCommand} from '../utils/storage';
import {debounce} from '../utils/utils';
import GestureRecognizer from 'react-native-swipe-gestures';
import {ids} from '../../e2e/ids';

interface Props {
  inputValue: string;
  setInputValue: (val: string) => void;
  isPremium: boolean;
  setPremiumModalOpen: (isOpen: boolean) => void;
}

const codeFont = Platform.OS === 'ios' ? 'courier' : 'monospace';

const InputContainer: FC<Props> = ({
  inputValue,
  setInputValue,
  isPremium,
  setPremiumModalOpen,
}) => {
  const historyOffset = useRef<number>(-1);
  const [autoCompleteTxt, setAutoCompleteTxt] = useState<string>('');

  const showPremiumAlert = (): void => {
    Alert.alert(
      'Go premium to unlock query history',
      'By going premium, you can unlock history with autocomplete and many more',
      [
        {text: 'Go Premium', onPress: () => setPremiumModalOpen(true)},
        {text: 'Close', style: 'cancel'},
      ],
    );
  };

  const onUpArrowPress = async (): Promise<void> => {
    /** show premium alert when user is not premium */
    if (!isPremium) {
      showPremiumAlert();
      return;
    }
    const lastCommand = await getLastUserCommand(historyOffset.current + 1);
    // console.log(historyOffset.current + 1, lastCommand);

    // only set if command is there
    if (lastCommand) {
      setInputValue(lastCommand);
      historyOffset.current++;
    }
  };
  const onDownArrowPress = async (): Promise<void> => {
    /** show premium alert when user is not premium */
    if (!isPremium) {
      showPremiumAlert();
      return;
    }

    if (historyOffset.current === 0) {
      return;
    } // do nothing if offset it 0

    const lastCommand = await getLastUserCommand(historyOffset.current - 1);
    // console.log(historyOffset.current - 1, lastCommand);
    // only set if command is there
    if (lastCommand) {
      setInputValue(lastCommand);
      historyOffset.current--;
    }
  };

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

  useEffect(() => {
    // console.log(inputValue);
    if (!isPremium) {
      return;
    }
    if (inputValue !== '') {
      getAutoComplete(inputValue);
    } else {
      setAutoCompleteTxt('');
    }
  }, [getAutoComplete, inputValue, isPremium]);

  const clearInput = () => {
    setInputValue('');
  };

  const setAutoInput = () => {
    isPremium && setInputValue(autoCompleteTxt);
  };

  const handleSwipeLeft = ({
    nativeEvent,
  }: FlingGestureHandlerStateChangeEvent) => {
    if (nativeEvent.state === State.ACTIVE) {
      isPremium && clearInput();
    }
  };

  const handleSwipeRight = ({
    nativeEvent,
  }: FlingGestureHandlerStateChangeEvent) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      setAutoInput();
    }
  };
  const styles = useDynamicValue(dynamicStyles);
  return (
    <View>
      <Text style={styles.inputHeader}>Type your SQL Query</Text>
      <View style={styles.inputContainer}>
        <GestureRecognizer
          onSwipeRight={setAutoInput}
          onSwipeLeft={() => isPremium && clearInput()}
        >
          <FlingGestureHandler
            direction={Directions.RIGHT}
            onHandlerStateChange={handleSwipeRight}
          >
            <FlingGestureHandler
              direction={Directions.LEFT}
              onHandlerStateChange={handleSwipeLeft}
            >
              <TextInput
                style={styles.input}
                autoFocus={true}
                testID={ids.queryTextInput}
                onChangeText={text => setInputValue(text)}
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
        </GestureRecognizer>
        <Text
          suppressHighlighting={true}
          onLongPress={setAutoInput}
          style={styles.autoCompleteTxt}
        >
          {autoCompleteTxt}
        </Text>
      </View>
      <View style={styles.sideButtonContainer}>
        <TouchableOpacity
          accessibilityLabel="Up Button"
          accessibilityHint="gets the previous command from history"
          onPress={onUpArrowPress}
        >
          <Icon size={30} name="arrow-up-bold-box" color={sideButton} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.downArrow}
          accessibilityLabel="Down Button"
          accessibilityHint="gets the next command from history"
          onPress={onDownArrowPress}
        >
          <Icon size={30} name="arrow-up-bold-box" color={sideButton} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={clearInput}
          accessibilityLabel="Clear command button"
          accessibilityHint="clear the command input"
        >
          <Icon size={30} name="text-box-remove" color={sideButton} />
        </TouchableOpacity>
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
    borderColor: 'gray',
    marginBottom: 10,
    marginTop: 10,
    borderWidth: 1,
    backgroundColor: new DynamicValue('white', lightDark),
  },
  input: {
    fontSize: 16,
    fontFamily: codeFont,
    padding: 5,
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
  sideButtonContainer: {
    position: 'absolute',
    bottom: 12,
    right: 3,
  },
  downArrow: {
    transform: [{rotate: '180deg'}],
    marginTop: -5,
    marginBottom: -5,
  },
  deleteBtn: {
    // position: 'absolute',
    // bottom: 12,
    // right: 3,
  },
});
