import React, {useRef, useEffect} from 'react';
import {
  View,
  Button,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function SearchBox() {
  const refRBSheet = useRef();

  const openSheet = () => {};

  return (
    <>
      <Icon name="search" size={24} onPress={() => refRBSheet.current.open()} />
      <RBSheet
        ref={refRBSheet}
        animationType="fade"
        closeOnDragDown={true}
        closeOnPressMask={true}
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
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.inputContainer}>
            <Icon name="search" color="gray" size={24} />

            <TextInput
              style={styles.searchInput}
              // value=""
              placeholder="Search Query"
            />
            <Icon name="close" size={24} />
          </View>
        </ScrollView>
      </RBSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    borderColor: 'gray',
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 5,
    paddingRight: 5,
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
