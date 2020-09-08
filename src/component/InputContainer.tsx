import React, {useState, FC} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  DynamicStyleSheet,
  DynamicValue,
  useDynamicValue,
} from 'react-native-dynamic';

import {lightDark} from '../data/colors.json';

interface Props {
  inputValue: string;
  setInputValue: (val: string) => void;
}

const InputContainer: FC<Props> = ({inputValue, setInputValue}) => {
  const styles = useDynamicValue(dynamicStyles);
  return (
    <View>
      <Text style={styles.inputHeader}>Type your SQL Query</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setInputValue(text)}
        multiline
        placeholderTextColor="gray"
        textAlignVertical="top"
        value={inputValue}
        autoCorrect={false}
        numberOfLines={4}
        placeholder="Type your SQL query"
      />
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => setInputValue('')}>
        <Icon size={28} name="text-box-remove" color="#e74c3c" />
      </TouchableOpacity>
    </View>
  );
};

const dynamicStyles = new DynamicStyleSheet({
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'monospace',
    marginBottom: 10,
    marginTop: 10,
    opacity: 1,
    height: 120,
    color: new DynamicValue('black', 'white'),
    backgroundColor: new DynamicValue('white', lightDark),
  },
  inputHeader: {
    fontSize: 16,
    color: new DynamicValue('black', 'white'),
  },
  deleteBtn: {
    position: 'absolute',
    bottom: 12,
    right: 3,
  },
});
