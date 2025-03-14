import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';

interface BtnProps extends TouchableOpacityProps {
  title: string;
}
const SecondaryButton = ({title, ...rest}: BtnProps) => {
  return (
    <TouchableOpacity {...rest}>
      <View style={styles.container}>
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SecondaryButton;

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '500',
    textAlign: 'center',
  },
  container: {
    padding: 10,
  },
});
