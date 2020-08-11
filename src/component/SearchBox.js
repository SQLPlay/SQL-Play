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

import SyntaxHighlighter from 'react-native-syntax-highlighter';
import {tomorrow} from 'react-syntax-highlighter/styles/hljs';

import commandsList from '../data/commands.json';
import {debounce} from '../utils/utils';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function SearchBox() {
  const refRBSheet = useRef();
  const [flatlistVisiblity, setFlatlistVisiblity] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
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

  const onItemPress = (index) => {
    setCurrentIndex(index === currentIndex ? null : index);
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        150,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity,
      ),
    );
  };

  const ListItem = ({title, description, index}) => {
    return (
      <TouchableWithoutFeedback onPress={() => onItemPress(index)}>
        <View style={styles.item}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <View style={styles.codeSyntaxContainer}>
            {index === currentIndex && (
              <SyntaxHighlighter
                fontSize={14}
                language="sql"
                wrapLines={true}
                style={tomorrow}
                wrapLines={true}
                highlighter="hljs">
                {listData[index].syntax}
              </SyntaxHighlighter>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderItem = useCallback(
    ({item, index}) => <ListItem {...item} index={index} />,
    [currentIndex],
  );

  return (
    <>
      <Icon name="search" size={24} onPress={openTabSheet} />
      <RBSheet
        ref={refRBSheet}
        animationType="fade"
        closeOnDragDown={true}
        closeOnPressMask={true}
        onClose={onTabSheetClose}
        height={380}
        customStyles={
          {
            // wrapper: {
            //     backgroundColor: "transparent"
            //   },
            //   draggableIcon: {
            //     backgroundColor: "#000"
            //   }
          }
        }>
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
            {flatlistVisiblity ? (
              <FlatList
                data={listData}
                bounces={false}
                maxToRenderPerBatch={3}
                renderItem={renderItem}
                initialNumToRender={2}
                windowSize={5}
                keyExtractor={(item) => item.id}
              />
            ) : null}
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
  item: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 2,
  },
  title: {
    fontSize: 18,
  },
  description: {
    fontSize: 16,
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
