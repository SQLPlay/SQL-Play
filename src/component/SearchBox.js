import React, {useRef, useEffect, useState} from 'react';
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
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon from 'react-native-vector-icons/MaterialIcons';

import commandsList from '../data/commands.json';

const ListItem = ({title, description}) => {
  return (
    <TouchableHighlight>
      <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableHighlight>
  );
};

export default function SearchBox() {
  const refRBSheet = useRef();
  const [flatlistVisiblity, setFlatlistVisiblity] = useState(false);

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

  const renderItem = ({item}) => <ListItem {...item} />;

  return (
    <>
      <Icon name="search" size={24} onPress={openTabSheet} />
      <RBSheet
        ref={refRBSheet}
        animationType="fade"
        closeOnDragDown={true}
        closeOnPressMask={true}
        onClose={onTabSheetClose}
        height={350}
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
              // value=""
              placeholder="Search Query"
            />
            <Icon name="close" size={24} />
          </View>
          <SafeAreaView style={{marginBottom: 65, marginTop: 10}}>
            {flatlistVisiblity ? (
              <FlatList
                data={commandsList}
                renderItem={renderItem}
                initialNumToRender={2}
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
});
