import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetHandleProps,
} from '@gorhom/bottom-sheet';
import React, {FC} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {
  DynamicStyleSheet,
  DynamicValue,
  useDynamicValue,
} from 'react-native-dynamic';
import ids from '../../e2e/ids';
import {darkBGColor, lightDark} from '../data/colors.json';

const WINDOW_WIDTH = Dimensions.get('window').width;

export const CustomHandle: FC<BottomSheetHandleProps> = () => {
  const styles = useDynamicValue(dynamicStyles);
  return (
    <View testID={ids.bottomSheetHandle} style={styles.container}>
      <View style={styles.indicator} />
    </View>
  );
};

export const CustomBackdrop: FC<BottomSheetBackdropProps> = props => (
  <BottomSheetBackdrop {...props} appearsOnIndex={1} disappearsOnIndex={-1} />
);

export const CustomBG: FC<BottomSheetBackdropProps> = () => {
  const styles = useDynamicValue(dynamicStyles);
  return <View style={styles.background} />;
};

const dynamicStyles = new DynamicStyleSheet({
  container: {
    padding: 10,
  },

  indicator: {
    alignSelf: 'center',
    width: (7.5 * WINDOW_WIDTH) / 100,
    height: 4,
    borderRadius: 4,
    backgroundColor: new DynamicValue('rgba(0, 0, 0, 0.75)', 'grey'),
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: new DynamicValue('white', darkBGColor),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});
