import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Alert,
  Modal,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  ActivityIndicator,
  StatusBar,
  LogBox,
} from 'react-native';

import {
  DynamicStyleSheet,
  DynamicValue,
  useDynamicValue,
  ColorSchemeProvider,
} from 'react-native-dynamic';

import * as Sentry from '@sentry/react-native';

import {ExecuteUserQuery, insertUserCommand} from '../utils/storage';
import SplashScreen from 'react-native-bootsplash';

import {
  getLargestWidths,
  shouldShowAd,
  getIsPremium,
  getInterstitialId,
} from '../utils/utils';
import AppBar from './AppBar';
import Table from './Table';
import RunButton from './RunButton';
import InputContainer from './InputContainer';

import '../utils/appReviewer';
import '../utils/updateChecker';
import {darkBGColor} from '../data/colors.json';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Snackbar from 'react-native-snackbar';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet/';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import GoPremium from './GoPremium';
import {
  FullScreenAdOptions,
  useInterstitialAd,
} from '@react-native-admob/admob';
import {DNS} from '@env';
// import {AppTour, AppTourView} from 'react-native-app-tour';

Sentry.init({
  dsn: DNS,
  debug: __DEV__,
});

MCIcon.loadFont();
MIcon.loadFont();

interface tableDataNode {
  header: Array<string>;
  rows: Array<Array<any>>;
}

const adConfig: FullScreenAdOptions = {
  showOnLoaded: true,
  loadOnMounted: false,
};
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
  const {load, adLoaded} = useInterstitialAd(getInterstitialId(), adConfig);
  const styles = useDynamicValue(dynamicStyles);

  const showAd = async () => {
    if (!shouldShowAd()) return;

    if (adLoaded) return;
    try {
      load();
    } catch (error) {
      console.log('failed to load ad', error);
    }
  };

  const runQuery = async () => {
    Keyboard.dismiss();
    setLoaderVisibility(true);
    await insertUserCommand(inputValue); // store the command in db
    try {
      /** Show add if user is not premium */
      if (!isPremium) {
        showAd();
      }
      // execute the query
      const res: any = await ExecuteUserQuery(inputValue);

      const len: number = res.rows.length;

      // console.log(res.rows);
      if (len === 0) {
        setLoaderVisibility(false);
        Snackbar.show({text: 'Query Executed!'});
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
      Alert.alert('Error in DB', error?.message);
    }
  };

  useEffect(() => {
    const init = async () => {
      const isPremRes = await getIsPremium();
      setIsPremium(isPremRes);
      // Setup ad only when user is not premium
      if (!isPremRes) {
      }
      await SplashScreen.hide({fade: true});
    };
    init();
    // return () => {};
  }, []);

  return (
    <ColorSchemeProvider>
      <BottomSheetModalProvider>
        <SafeAreaProvider>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="#c8b900"
            translucent
          />
          <GoPremium
            modalState={premiumModalOpen}
            setModalState={setPremiumModalOpen}
            isPremium={isPremium}
            setIsPremium={setIsPremium}
          />
          <KeyboardAvoidingView
            style={{flex: 1}}
            {...(Platform.OS === 'ios' && {behavior: 'padding'})}
            keyboardVerticalOffset={Platform.select({
              ios: 0,
              android: 500,
            })}
          >
            <View style={styles.statusBar} />

            <Modal visible={loaderVisibility} transparent={true}>
              <View style={styles.modalStyle}>
                <ActivityIndicator size={50} color="gold" />
              </View>
            </Modal>
            <View testID="query-runner" style={styles.outerContainer}>
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
                {!!tableData.header.length && (
                  <Table {...tableData} tableWidths={tableWidths} />
                )}
              </View>

              <RunButton runQuery={runQuery} />
            </View>
          </KeyboardAvoidingView>
        </SafeAreaProvider>
      </BottomSheetModalProvider>
    </ColorSchemeProvider>
  );
};

const dynamicStyles = new DynamicStyleSheet({
  statusBar: {
    height: getStatusBarHeight(),
    backgroundColor: '#c8b900',
  },
  outerContainer: {
    backgroundColor: new DynamicValue('white', darkBGColor),
    flex: 1,
  },
  innercontainer: {
    padding: 5,
    paddingBottom: 10,
  },
  modalStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000a1',
  },
});

export default App;
