import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import rnTextSize from 'react-native-text-size';

import SyntaxHighlighter from 'react-native-syntax-highlighter';
import {vs} from 'react-syntax-highlighter/styles/hljs';


const {height, width} = Dimensions.get('window');

export default function InputContainer({inputValue, setInputValue}) {
  const onInputChange = async (value) => {
    setInputValue(value);
    const txtWidth = await rnTextSize.measure({text: value});
    const calcWidth = txtWidth.width + 130;

    if (calcWidth > width) {
      console.log(calcWidth, width);
      setInputValue(value + '\n');
    } 
  };

  const codeString = `SELECT firstName FROM  employees`;
  return (
    <View>
      <Text style={styles.inputHeader}>Type your SQL Query</Text>
      <TextInput
        style={styles.input}
        onChangeText={onInputChange}
        multiline
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
      <View style={styles.syntaxContainer}>
        <SyntaxHighlighter
          fontSize={16}
          language="sql"
          style={vs}
          wrapLines={true}
          highlighter="hljs">
          {inputValue}
        </SyntaxHighlighter>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'monospace',
    marginBottom: 10,
    marginTop: 10,
    opacity: 1,
    color: 'transparent',
  },
  inputHeader: {
    fontSize: 16,
  },
  deleteBtn: {
    position: 'absolute',
    bottom: 12,
    right: 3,
  },
  syntaxContainer: {
    position: 'absolute',
    top: 32,
    left: -3,
    zIndex: -1,
  },
});
