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
  isLoading: boolean;
}
const PrimaryButton = ({title, isLoading, ...rest}: BtnProps) => {
  return (
    <Pressable {...rest}>
      {({pressed}) => (
        <View
          style={[
            styles.container,
            {
              transform: [{scale: pressed ? 0.98 : 1}],
              backgroundColor: rest.disabled ? 'grey' : '#007AFF',
            },
          ]}>
          {isLoading ? (
            <ActivityIndicator />
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
    width: 295,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginVertical: 12,
  },
});
