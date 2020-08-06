import React, {useState, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  Pressable,
  Button,
  Alert,
  ToastAndroid,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

import {ExecuteQuery} from './storage';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {getLargestWidths} from './component/utils';
import AppBar from './component/AppBar';
import Table from './component/Table';
import RunButton from './component/RunButton';
import InputContainer from './component/InputContainer';

const {height, width} = Dimensions.get('window');

const App = () => {
  const [tableData, setTableData] = useState({header: [], rows: []}); // header rows with value
  const tableWidths = useRef([]);
  const [inputValue, setInputValue] = useState('select * from employees');

  const runQuery = async () => {
    try {
      // execute the query
      const res = await ExecuteQuery(value);

      const len = res.rows.length;

      if (len < 1) {
        console.log('nothing found');
        ToastAndroid.showWithGravity(
          'Query Executed',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
        return;
      }

      const header = Object.keys(res.rows.item(0)).reverse();
      const rowsArr = [];

      for (let i = 0; i < len; i++) {
        let row = res.rows.item(i);
        rowsArr.push(Object.values(row).reverse());
      }
      // pass the header and result arr to get the largest widths of their respective column
      tableWidths.current = await getLargestWidths([header, ...rowsArr]);
      // console.log(tableWidths);

      setTableData({header: header, rows: rowsArr});
    } catch (error) {
      Alert.alert('Error in DB', error.message);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <SafeAreaView>
        <View style={styles.outerContainer}>
          <AppBar />
          <View style={styles.innercontainer}>
            <InputContainer
              inputValue={inputValue}
              setInputValue={setInputValue}
            />
            <Table {...tableData} tableWidths={tableWidths} />
          </View>
          <RunButton runQuery={runQuery} />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
  },
  innercontainer: {
    padding: 5,
  },
});

export default App;
