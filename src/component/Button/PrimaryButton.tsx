import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface BtnProps extends PressableProps {
  title: string;
  isLoading?: boolean;
}
const PrimaryButton = ({title, isLoading, ...rest}: BtnProps) => {
  return (
    <Pressable disabled={isLoading} {...rest}>
      {({pressed}) => (
        <View
          style={[
            styles.container,
            {
              opacity: pressed ? 0.7 : 1,
              backgroundColor: rest.disabled ? 'grey' : '#007AFF',
            },
          ]}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.text}>{title}</Text>
          )}
        </View>
      )}
    </Pressable>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
  },
  container: {
    height: 44,
    maxWidth: 500,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginVertical: 12,
    marginHorizontal: 'auto',
  },
});
