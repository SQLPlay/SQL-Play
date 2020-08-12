import React, {useRef, useEffect, useState, useCallback} from 'react';
import {
  View,
  Button,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  FlatList,
  SafeAreaView,
  TouchableHighlight,
  TouchableOpacity,
  Platform,
  UIManager,
  LayoutAnimation,
  TouchableWithoutFeedback,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon from 'react-native-vector-icons/MaterialIcons';

import commandsList from '../data/commands.json';
import {debounce} from '../utils/utils';
import CommandList from './CommandList';

export default function SearchBox() {
  const refRBSheet = useRef();
  const [flatlistVisiblity, setFlatlistVisiblity] = useState(false);
  const [listData, setListData] = useState(commandsList);
  const [textInput, setTextInput] = useState('');

  const openTabSheet = () => {
    refRBSheet.current.open();
    setTimeout(() => {
      setFlatlistVisiblity(true);
    }, 350);
  };

  const onTabSheetClose = () => {
    setTimeout(() => {
      setFlatlistVisiblity(false);
    }, 350);
  };

  const onInputChange = (value) => {
    setTextInput(value);

    console.log(value);

    const filterData = () => {
      return commandsList.filter((item) => {
        const val = value.toLowerCase();
        // console.log(item);
        const keywords = `${item.title}  ${item.tag}  ${item.description}`;
        const index = keywords.toLowerCase().indexOf(val);

        return index !== -1;
      });
    };

    const filteredArr = filterData();
    // console.log(filterData(), value);
    debounce(setListData(filteredArr));
  };

  return (
    <>
      <Icon name="search" size={24} onPress={openTabSheet} />
      <RBSheet
        ref={refRBSheet}
        animationType="fade"
        closeOnDragDown={true}
        closeOnPressMask={true}
        onClose={onTabSheetClose}
        height={380}>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <Icon name="search" color="gray" size={24} />

            <TextInput
              style={styles.searchInput}
              value={textInput}
              onChangeText={onInputChange}
              placeholder="Search Query"
            />
            <Icon name="close" size={24} />
          </View>
          <SafeAreaView style={{marginBottom: 65, marginTop: 10, flexGrow: 1}}>
            {flatlistVisiblity && <CommandList listData={listData} />}
          </SafeAreaView>
        </View>
      </RBSheet>
    </>
  );
}

const styles = StyleSheet.create({
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
    // textAlign: 'center',
  },
  codeSyntaxContainer: {
    marginTop: 10,
  },
});
