import React, {useRef, useEffect, useState, useMemo, createRef} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

import {TrueSheet} from '@lodev09/react-native-true-sheet';

import CommandList from './CommandList';
import {$isSearchOpen} from '~/store';
import {useTheme} from '@react-navigation/native';
export const searchSheetRef = createRef<TrueSheet>();

const SearchSheet = () => {
  const searchFlatListRef = useRef<FlatList>(null);

  const {colors} = useTheme();
  return (
    <TrueSheet
      ref={searchSheetRef}
      // style={{backgroundColor: colors.card}}
      contentContainerStyle={{height: '100%'}}
      dimmed={true}
      sizes={['75%', 'large']}
      // keyboardMode="pan"
      cornerRadius={15}
      // onDismiss={() => $isSearchOpen.set(false)}
      scrollRef={searchFlatListRef}>
      <CommandList flatListRef={searchFlatListRef} />
    </TrueSheet>
  );
};

export default SearchSheet;

const styles = StyleSheet.create({
  sheetContainer: {
    // backgroundColor: new DynamicValue('white', darkBGColor),
  },
  container: {
    // padding: 5,
    // backgroundColor: new DynamicValue('white', darkBGColor),
    // flex: 1,
  },
  codeSyntaxContainer: {
    // marginTop: 10,
  },
});
