import React, {useState, useRef, useEffect} from 'react';
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
  BackHandler,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AdMobInterstitial} from 'react-native-admob';
import {ExecuteQuery} from '../utils/storage';

import {getLargestWidths, shouldShowAd} from '../utils/utils';
import AppBar from './AppBar';
import Table from './Table';
import RunButton from './RunButton';
import InputContainer from './InputContainer';
import UpdateChecker from './UpdateChecker';

//set app id and load ad
AdMobInterstitial.setAdUnitID('ca-app-pub-9677914909567793/9794581114');
AdMobInterstitial.requestAd();

const App = () => {
  const [tableData, setTableData] = useState({header: [], rows: []}); // header rows with value
  const tableWidths = useRef([]);
  const [inputValue, setInputValue] = useState('SELECT * FROM employees');

  const runQuery = async () => {
    ToastAndroid.showWithGravity(
      'Executing Query',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );

    try {
      // execute the query
      const res = await ExecuteQuery(inputValue);

      //show ad
      AdMobInterstitial.isReady((isReady) => {
        if (isReady) {
          //if true only show ad
          if (shouldShowAd()) {
            AdMobInterstitial.showAd();
          }
        } else {
          AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());
        }
      });

      const len = res.rows.length;

      if (len < 1) {
        // console.log('nothing found');
        ToastAndroid.showWithGravity(
          'Query Executed',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
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
      <StatusBar barStyle="dark-content" backgroundColor="#c8b900" />
      <SafeAreaView>
        <View style={styles.outerContainer}>
          <AppBar setInputValue={setInputValue} />
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
