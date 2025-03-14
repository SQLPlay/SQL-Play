import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MIcon from '@react-native-vector-icons/material-icons';
import colors from 'tailwindcss/colors';

interface FeatureListItemProps {
  text: string;
}
const iconSize = 18;

const FeatureListItem = ({text}: FeatureListItemProps) => {
  return (
    <View style={styles.container}>
      <MIcon
        name="verified"
        color={colors.green['500']}
        size={iconSize}
        style={styles.icon}
      />
      <Text style={[styles.text, {color: '#000'}]}>{text}</Text>
    </View>
  );
};

export default FeatureListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  icon: {
    width: iconSize,
    height: iconSize,
    marginRight: 8,
  },
  text: {
    fontSize: 13,
  },
});
