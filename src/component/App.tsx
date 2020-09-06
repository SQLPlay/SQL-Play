import React, {useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Alert,
  ActivityIndicator,
  Modal,
  ToastAndroid,
  useColorScheme,
} from 'react-native';

import {
  DynamicStyleSheet,
  DynamicValue,
  useDynamicValue,
  ColorSchemeProvider,
} from 'react-native-dynamic';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// @ts-ignore
import {AdMobInterstitial} from 'react-native-admob';
import {ExecuteQuery} from '../utils/storage';

import {getLargestWidths, shouldShowAd} from '../utils/utils';
import AppBar from './AppBar';
import Table from './Table';
import RunButton from './RunButton';
import InputContainer from './InputContainer';
import '../utils/updateChecker';
import '../utils/appReviewer';
import {darkBGColor} from '../data/colors.json';

//set app id and load ad
AdMobInterstitial.setAdUnitID('ca-app-pub-9677914909567793/9794581114');
AdMobInterstitial.isReady((isReady: boolean) => {
  if (!isReady) {
    AdMobInterstitial.requestAd();
  }
});

interface tableDataNode {
  header: Array<string>;
  rows: Array<Array<any>>;
}

const App: React.FC = () => {
  const [tableData, setTableData] = useState<tableDataNode>({
    header: [],
    rows: [],
  }); // header rows with value

  const tableWidths = useRef<Array<any>>([]);
  const [inputValue, setInputValue] = useState<string>(
    'SELECT * FROM employees',
  );
  const [loaderVisibility, setLoaderVisibility] = useState<boolean>(false);

  const styles = useDynamicValue(dynamicStyles);

  const runQuery = async () => {
    setLoaderVisibility(true);

    try {
      // execute the query
      const res: any = await ExecuteQuery(inputValue);

      //show ad
      AdMobInterstitial.isReady((isReady: boolean) => {
        if (shouldShowAd()) {
          //if true only show ad
          if (isReady) {
            AdMobInterstitial.showAd();
          } else {
            AdMobInterstitial.requestAd().then(() =>
              AdMobInterstitial.showAd(),
            );
          }
        }
      });

      const len: number = res.rows.length;

      console.log(res.rows);
      if (len === 0) {
        setLoaderVisibility(false);
        ToastAndroid.showWithGravity(
          'Query Executed!',
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
      console.log(typeof tableWidths.current[1]);
      setLoaderVisibility(false);
      // console.log(rowsArr);

      setTableData({header: header, rows: rowsArr});
    } catch (error) {
      setLoaderVisibility(false);
      Alert.alert('Error in DB', error.message);
    }
  };

  return (
    <>
      <ColorSchemeProvider>
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
      </ColorSchemeProvider>
    </>
  );
};

const dynamicStyles = new DynamicStyleSheet({
  outerContainer: {
    height: '100%',
    width: '100%',
    backgroundColor: new DynamicValue('white', darkBGColor),
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
