import React, {useRef, useEffect, useState, useMemo, createRef} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

import {TrueSheet} from '@lodev09/react-native-true-sheet';

import CommandList from './CommandList';
import {$isSearchOpen} from '~/store';
export const searchSheetRef = createRef<TrueSheet>();

const SearchSheet = () => {
  const searchFlatListRef = useRef<FlatList>(null);

  return (
    <TrueSheet
      ref={searchSheetRef}
      style={styles.container}
      dimmed={false}
      sizes={['75%', 'large']}
      keyboardMode="pan"
      onDismiss={() => $isSearchOpen.set(false)}
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
    flex: 1,
  },
  codeSyntaxContainer: {
    // marginTop: 10,
  },
});
