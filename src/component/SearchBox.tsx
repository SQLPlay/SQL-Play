import React, {useRef, useEffect, useState, useCallback} from 'react';
import {View, TextInput, SafeAreaView, TouchableOpacity} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
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
import {SeachInputProp} from './AppBar';

const SearchBox: React.FC<SeachInputProp> = ({setInputValue}) => {
  interface listDataProps {
    id: string;
    title: string;
    description: string;
    syntax: string;
  }
  const refRBSheet = useRef<RBSheet>(null);
  const [flatlistVisiblity, setFlatlistVisiblity] = useState<boolean>(false);
  const [listData, setListData] = useState<listDataProps[]>(commandsList);
  const [searchInput, setSearchInput] = useState<string>('');

  const styles = useDynamicValue(dynamicStyles);
  const openTabSheet = () => {
    if (refRBSheet.current !== null) {
      refRBSheet.current.open();
    }
    setTimeout(() => {
      setFlatlistVisiblity(true);
    }, 350);
  };

  const onTabSheetClose = () => {
    setTimeout(() => {
      setFlatlistVisiblity(false);
    }, 350);
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

      <RBSheet
        ref={refRBSheet}
        animationType="fade"
        customStyles={{container: styles.sheetContainer}}
        closeOnDragDown={true}
        closeOnPressMask={true}
        onClose={onTabSheetClose}
        height={380}>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <Icon name="search" color="gray" size={24} />

            <TextInput
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
          </View>
          <SafeAreaView style={{marginBottom: 65, marginTop: 10, flexGrow: 1}}>
            {flatlistVisiblity && (
              <CommandList
                listData={listData}
                setInputValue={setInputValue}
                refRBSheet={refRBSheet}
              />
            )}
          </SafeAreaView>
        </View>
      </RBSheet>
    </>
  );
};

export default SearchBox;

const dynamicStyles = new DynamicStyleSheet({
  sheetContainer: {
    backgroundColor: new DynamicValue('white', darkBGColor),
  },
  container: {
    padding: 5,
    height: '100%',
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
    marginTop: 10,
  },
});
