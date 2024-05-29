import {View, Text, TextInput, TextInputProps} from 'react-native';
import React from 'react';

type Props = TextInputProps & {
  label: string;
};
const BaseTextInput = ({label, ...rest}: Props) => {
  return (
    <View className="mt-2">
      <Text className="mb-2 text-sm font-medium leading-6 text-gray-800 dark:text-gray-100">
        {label}
      </Text>
      <TextInput
        {...rest}
        className="rounded-md border border-gray-300 py-1.5 px-2.5 text-gray-900 dark:text-gray-100"
      />
    </View>
  );
};

export default BaseTextInput;
