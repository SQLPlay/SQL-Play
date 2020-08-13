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
  Modal,
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
AdMobInterstitial.isReady((isReady) => {
  if (!isReady) {
    AdMobInterstitial.requestAd();
  }
});

const App = () => {
  const [tableData, setTableData] = useState({header: [], rows: []}); // header rows with value
  const tableWidths = useRef([]);
  const [inputValue, setInputValue] = useState('SELECT * FROM employees');
  const [loaderVisibility, setLoaderVisibility] = useState(false);

  const runQuery = async () => {
    setLoaderVisibility(true);
 
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

      const header = Object.keys(res.rows.item(0)).reverse();
      const rowsArr = [];

      for (let i = 0; i < len; i++) {
        let row = res.rows.item(i);
        rowsArr.push(Object.values(row).reverse());
      }
      // pass the header and result arr to get the largest widths of their respective column
      tableWidths.current = await getLargestWidths([header, ...rowsArr]);
      // console.log(tableWidths);
      setLoaderVisibility(false);


      setTableData({header: header, rows: rowsArr});
    } catch (error) {
      setLoaderVisibility(false);
      Alert.alert('Error in DB', error.message);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#c8b900" />
      <SafeAreaView>
        <Modal visible={loaderVisibility} transparent={true}>
          <View style={styles.modalStyle}>
            <ActivityIndicator size={50} color="gold" />
          </View>
        </Modal>
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
  modalStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000a1',
  },
});

export default App;
