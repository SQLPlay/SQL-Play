import React, {useRef, useEffect, useState, useMemo} from 'react';
import {TouchableOpacity, Keyboard, Platform} from 'react-native';

import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  DynamicStyleSheet,
  DynamicValue,
  useDynamicValue,
} from 'react-native-dynamic';

import commandsList from '../data/commands.json';
import {debounce} from '../utils/utils';
import fil from '../utils/fil';
import CommandList from './CommandList';
import {CustomHandle, CustomBG, CustomBackdrop} from './CustomHandle';
import {ids} from '../../e2e/ids';

interface Props {
  setInputValue: (query: string) => void;
}

const SearchBox: React.FC<Props> = ({setInputValue}) => {
  interface listDataProps {
    id: string;
    title: string;
    description: string;
    syntax: string;
  }
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [listData, setListData] = useState<listDataProps[]>(commandsList);
  const [searchInput, setSearchInput] = useState<string>('');

  const {top: topSafeArea, bottom: bottomSafeArea} = useSafeAreaInsets();
  const snapPoints = useMemo(() => ['50%', '100%'], []);

  // const handleSheetChanges = useCallback((index: number) => {
  //   console.log('handleSheetChanges', index);
  // }, []);

  const styles = useDynamicValue(dynamicStyles);
  const openTabSheet = () => {
    bottomSheetRef.current?.present();
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
      }, commandsList);
    };

    const filteredArr = filterData();
    // console.log(filterData(), value);

    debounce(setListData(filteredArr));
  }, [searchInput]);

  return (
    <>
      <TouchableOpacity
        accessibilityLabel="Search"
        accessibilityHint="Search for commands"
        testID={ids.searchBtn}
        onPress={openTabSheet}
      >
        <Icon name="search" size={25} />
      </TouchableOpacity>

      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        topInset={topSafeArea}
        style={styles.container}
        handleComponent={CustomHandle}
        backgroundComponent={CustomBG}
        backdropComponent={CustomBackdrop}
        android_keyboardInputMode="adjustResize"
        keyboardBehavior="extend"
        // onChange={handleSheetChanges}
      >
        <BottomSheetView
          style={styles.inputContainer}
          accessibilityLabel="commands list panel"
        >
          <Icon name="search" color="gray" size={24} />

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
        </BottomSheetView>
        <CommandList
          listData={listData}
          setInputValue={setInputValue}
          bottomSheetRef={bottomSheetRef}
        />
      </BottomSheetModal>
    </>
  );
};

export default SearchBox;

const dynamicStyles = new DynamicStyleSheet({
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
    flex: 1,
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 16,
    color: new DynamicValue('black', 'white'),
    // textAlign: 'center',
  },
  codeSyntaxContainer: {
    // marginTop: 10,
  },
});
