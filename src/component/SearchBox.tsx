import React, {useRef, useEffect, useState, useCallback, useMemo} from 'react';
import {
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';

import BottomSheet, {
  BottomSheetBackdrop,
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
import CommandList from './CommandList';
import {darkBGColor} from '../data/colors.json';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {CustomHandle, CustomBG} from './CustomHandle';

const {height} = Dimensions.get('window');

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
  console.log(height, getStatusBarHeight());
  const snapPoints = useMemo(() => ['50%', '100%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const styles = useDynamicValue(dynamicStyles);
  const openTabSheet = () => {
    bottomSheetRef.current?.present();
  };

  useEffect(() => {
    const filterData = () => {
      return commandsList.filter((item) => {
        const query = searchInput.toLowerCase();
        // console.log(item);
        const keywords = `${item.title}  ${item.tag}  ${item.description}`;
        const index = keywords.toLowerCase().indexOf(query);

        return index !== -1;
      });
    };

    const filteredArr = filterData();
    // console.log(filterData(), value);

    debounce(setListData(filteredArr));
  }, [searchInput]);

  return (
    <>
      <TouchableOpacity onPress={openTabSheet}>
        <Icon name="search" size={25} />
      </TouchableOpacity>

      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        topInset={topSafeArea}
        handleComponent={CustomHandle}
        backgroundComponent={CustomBG}
        backdropComponent={BottomSheetBackdrop}
        keyboardBehavior="extend"
        onChange={handleSheetChanges}>
        <BottomSheetView style={styles.container}>
          <BottomSheetView style={styles.inputContainer}>
            <Icon name="search" color="gray" size={24} />

            <BottomSheetTextInput
              style={styles.searchInput}
              value={searchInput}
              placeholderTextColor="gray"
              onChangeText={(val: string) => setSearchInput(val)}
              placeholder="Search Query"
            />
            <Icon
              name="close"
              size={24}
              color="gray"
              onPress={() => setSearchInput('')}
            />
          </BottomSheetView>
          <BottomSheetView style={{marginTop: 10, flexGrow: 1}}>
            <CommandList
              listData={listData}
              setInputValue={setInputValue}
              bottomSheetRef={bottomSheetRef}
            />
          </BottomSheetView>
        </BottomSheetView>
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
