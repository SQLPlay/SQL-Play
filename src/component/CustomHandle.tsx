import {
  BottomSheetBackdropProps,
  BottomSheetHandleProps,
} from '@gorhom/bottom-sheet';
import React, {FC} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {darkBGColor} from '../data/colors.json';

const WINDOW_WIDTH = Dimensions.get('window').width;

export const CustomHandle: FC<BottomSheetHandleProps> = () => {
  return (
    <View style={styles.container}>
      <View style={styles.indicator} />
    </View>
  );
};

export const CustomBG: FC<BottomSheetBackdropProps> = () => {
  return <View style={styles.background} />;
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },

  indicator: {
    alignSelf: 'center',
    width: (7.5 * WINDOW_WIDTH) / 100,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#fcfcfc',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});
