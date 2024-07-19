import React from 'react';

import {View, Platform, StyleSheet, TextInput} from 'react-native';

import {ids} from '../../e2e/ids';
import {useStore} from '@nanostores/react';
import {$inputQuery, $inputSelection} from '~/store/input';
import {useTheme} from '@react-navigation/native';

const codeFont = Platform.OS === 'ios' ? 'courier' : 'monospace';

const InputContainer = ({}) => {
  const inputValue = useStore($inputQuery);
  const {colors} = useTheme();

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.input, {color: colors.text}]}
        // autoFocus={true}
        testID={ids.queryTextInput}
        onChangeText={text => $inputQuery.set(text)}
        onSelectionChange={e => $inputSelection.set(e.nativeEvent.selection)}
        multiline
        placeholderTextColor="gray"
        textAlignVertical="top"
        defaultValue={inputValue}
        keyboardType="ascii-capable"
        autoCorrect={false}
        numberOfLines={6}
        placeholder="Type your SQL query"
      />
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
    marginHorizontal: 10,
    padding: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 4,
  },
  input: {
    fontSize: 16,
    paddingVertical: 0,
    paddingBottom: 3,
    fontFamily: codeFont,
    paddingHorizontal: 5,
    // position: 'relative',
    // zIndex: 2,
    opacity: 1,
    minHeight: 80,
    maxHeight: 200,
  },
});
