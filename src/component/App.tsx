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

// @ts-ignore
import {AdMobInterstitial} from 'react-native-admob';
import {ExecuteUserQuery, insertUserCommand} from '../utils/storage';
// @ts-ignore
import {startUpdateFlow} from '@gurukumparan/react-native-android-inapp-updates';
import SplashScreen from 'react-native-splash-screen';

import {
  getLargestWidths,
  shouldShowAd,
  checkForPremiumUser,
} from '../utils/utils';
import AppBar from './AppBar';
import Table from './Table';
import RunButton from './RunButton';
import InputContainer from './InputContainer';

import '../utils/appReviewer';
import {darkBGColor} from '../data/colors.json';

//set app id and load ad
AdMobInterstitial.setAdUnitID('ca-app-pub-9677914909567793/9794581114');
// AdMobInterstitial.isReady((isReady: boolean) => {
//   // console.log('Ad is ready', isReady);

//   if (!isReady) {
//     AdMobInterstitial.requestAd();
//   }
// });

const loadAd = () => {
  //show ad
  AdMobInterstitial.isReady((isReady: boolean) => {
    if (shouldShowAd()) {
      //if true only show ad
      if (isReady) {
        AdMobInterstitial.showAd();
      } else {
        AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());
      }
    }
  });
};

interface tableDataNode {
  header: Array<string>;
  rows: Array<Array<any>>;
}

const App: React.FC = () => {
  const [tableData, setTableData] = useState<tableDataNode>({
    header: [],
    rows: [[]],
  }); // header rows with value

  const tableWidths = useRef<Array<number>>([]);
  const [inputValue, setInputValue] = useState<string>(
    'SELECT * FROM employees',
  );
  const [loaderVisibility, setLoaderVisibility] = useState<boolean>(false);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [premiumModalOpen, setPremiumModalOpen] = useState<boolean>(false);

  const styles = useDynamicValue(dynamicStyles);

  const runQuery = async () => {
    setLoaderVisibility(true);
    await insertUserCommand(inputValue); // store the command in db
    try {
      // execute the query
      const res: any = await ExecuteUserQuery(inputValue);
      /** Show add if user is not premium */
      if (!isPremium) {
        loadAd();
      }
      const len: number = res.rows.length;

      // console.log(res.rows);
      if (len === 0) {
        setLoaderVisibility(false);
        ToastAndroid.showWithGravity(
          'Query Executed!',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
        return;
      }
      const header: string[] = Object.keys(res.rows.item(0)).reverse();
      const rowsArr: any[] = [];

      for (let i = 0; i < len; i++) {
        let row = res.rows.item(i);
        rowsArr.push(Object.values(row).reverse());
      }
      // pass the header and result arr to get the largest widths of their respective column
      tableWidths.current = await getLargestWidths([header, ...rowsArr]);
      // console.log(([header, ...rowsArr]));

      setLoaderVisibility(false);
      // console.log(rowsArr);

      setTableData({header: header, rows: rowsArr});
    } catch (error) {
      setLoaderVisibility(false);
      Alert.alert('Error in DB', error.message);
    }
  };

  useEffect(() => {
    /** check premium and set here */
    const init = async () => {
      const isPremRes = await checkForPremiumUser();
      console.log('is prem res', isPremRes);
      SplashScreen.hide();

      setIsPremium(isPremRes);

      try {
        const result = await startUpdateFlow('flexible');
        console.log(result);
      } catch (e) {
        console.log('error:', e);
      }
    };

    init();
  }, []);

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
            <AppBar
              premiumModalOpen={premiumModalOpen}
              setPremiumModalOpen={setPremiumModalOpen}
              setInputValue={setInputValue}
              isPremium={isPremium}
              setIsPremium={setIsPremium}
            />
            <View style={styles.innercontainer}>
              <InputContainer
                setPremiumModalOpen={setPremiumModalOpen}
                inputValue={inputValue}
                setInputValue={setInputValue}
                isPremium={isPremium}
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
