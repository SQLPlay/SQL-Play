import React, {useRef, useEffect, useState, useMemo, createRef} from 'react';
import {
  TouchableOpacity,
  Keyboard,
  Platform,
  Text,
  StyleSheet,
  View,
} from 'react-native';

import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import commandsJSON from '../data/commands.json';

import {debounce} from '../utils/utils';
import fil from '../utils/fil';
import CommandList from './CommandList';
import {CustomHandle, CustomBG, CustomBackdrop} from './CustomHandle';
import {ids} from '../../e2e/ids';
import BaseIcon from './Icons/BaseIcon';
import Icon from 'react-native-vector-icons/Ionicons';

export const searchSheetRef = createRef<BottomSheetModal>();

const SearchSheet = () => {
  const [listData, setListData] = useState(commandsJSON);
  const [searchInput, setSearchInput] = useState<string>('');

  const {top: topSafeArea, bottom: bottomSafeArea} = useSafeAreaInsets();
  const snapPoints = useMemo(() => ['50%', '100%'], []);

  // const handleSheetChanges = useCallback((index: number) => {
  //   console.log('handleSheetChanges', index);
  // }, []);

  const openTabSheet = () => {
    searchSheetRef.current?.present();
    if (Platform.OS === 'ios') {
      Keyboard.dismiss();
    }
  };

  useEffect(() => {
    const filterData = () => {
      return fil(item => {
        const query = searchInput.toLowerCase();
        // console.log(item);
        const keywords = `${item.title}  ${item.tag}  ${item.description}`;
        const index = keywords.toLowerCase().indexOf(query);

        return index !== -1;
      }, commandsJSON);
    };

    const filteredArr = filterData();
    // console.log(filterData(), value);

    debounce(setListData(filteredArr));
  }, [searchInput]);

  return (
    <BottomSheetModal
      ref={searchSheetRef}
      index={0}
      snapPoints={snapPoints}
      topInset={topSafeArea}
      style={styles.container}
      handleComponent={CustomHandle}
      backgroundComponent={CustomBG}
      backdropComponent={CustomBackdrop}
      enableOverDrag={false}
      android_keyboardInputMode="adjustResize"
      // keyboardBehavior="extend"
      // onChange={handleSheetChanges}
    >
      <BottomSheetView
        style={{flex: 1}}
        accessibilityLabel="commands list panel">
        <View style={styles.inputContainer}>
          <BottomSheetTextInput
            style={styles.searchInput}
            value={searchInput}
            blurOnSubmit={false}
            testID={ids.commandSearchInput}
            placeholderTextColor="gray"
            accessibilityLabel="command search"
            accessibilityHint="Search for SQL commands"
            onChangeText={(val: string) => setSearchInput(val)}
            placeholder="Search Query"
          />
          <Icon
            name="close"
            accessibilityLabel="clear command"
            accessibilityHint="clears searched command"
            size={24}
            color="gray"
            testID={ids.commandSearchClearBtn}
            onPress={() => setSearchInput('')}
          />
        </View>
        <CommandList listData={commandsJSON} />
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default SearchSheet;

const styles = StyleSheet.create({
  sheetContainer: {
    // backgroundColor: new DynamicValue('white', darkBGColor),
  },
  container: {
    padding: 5,
    // backgroundColor: new DynamicValue('white', darkBGColor),
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 5,
    paddingRight: 5,
    height: 42,
  },
  searchInput: {
    height: 42,
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 16,
    color: 'black',
    // textAlign: 'center',
  },
  codeSyntaxContainer: {
    // marginTop: 10,
  },
});
