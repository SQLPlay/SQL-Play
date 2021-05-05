import React, {useState, useRef, useEffect, FC} from 'react';
import {
  View,
  StatusBar,
  Alert,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
  Keyboard,
  Button,
  TouchableOpacity,
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
import SplashScreen from 'react-native-splash-screen';

import {getLargestWidths, shouldShowAd, getIsPremium} from '../utils/utils';
import AppBar from './AppBar';
import Table from './Table';
import RunButton from './RunButton';
import InputContainer from './InputContainer';

import '../utils/appReviewer';
import '../utils/updateChecker';
import {darkBGColor, darkYellow} from '../data/colors.json';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Snackbar from 'react-native-snackbar';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet/';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppTour, AppTourView} from 'react-native-app-tour';

MCIcon.loadFont();

MIcon.loadFont();

const {height, width} = Dimensions.get('window');

//set app id and load ad
AdMobInterstitial.setAdUnitID('ca-app-pub-9677914909567793/9794581114');

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
  let target;

  const runQuery = async () => {
    Keyboard.dismiss();
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
      Alert.alert('Error in DB', error.message);
    }
  };

  useEffect(() => {
    /** check premium and set here */
    SplashScreen.hide();

    const init = async () => {
      const isPremRes = await getIsPremium();
      setIsPremium(isPremRes);
    };

    init();
  }, []);

  useEffect(() => {
    if (canStart) {
      console.log('calling start');
      start?.();
    }
  }, [canStart]);
  const handleOnStart = () => console.log('start');
  const handleOnStop = () => console.log('stop');
  const handleOnStepChange = () => console.log(`stepChange`);

  React.useEffect(() => {
    eventEmitter?.on('start', handleOnStart);
    eventEmitter?.on('stop', handleOnStop);
    eventEmitter?.on('stepChange', handleOnStepChange);

    return () => {
      eventEmitter?.off('start', handleOnStart);
      eventEmitter?.off('stop', handleOnStop);
      eventEmitter?.off('stepChange', handleOnStepChange);
    };
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
          <KeyboardAvoidingView
            style={{flex: 1}}
            {...(Platform.OS === 'ios' && {behavior: 'padding'})}
            keyboardVerticalOffset={Platform.select({
              ios: 0,
              android: 500,
            })}>
            <View style={styles.statusBar} />

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

              <View
                style={styles.runBtn}
                key={'Center Right'}
                ref={(ref) => {
                  if (!ref) return;

                  let props = {
                    order: 2,
                    title: 'This is a target button 5',
                    description: 'We have the best targets, believe me',
                    outerCircleColor: '#3f52ae',
                  };

                  target = AppTourView.for(ref, {...props});
                  AppTour.ShowFor(target);
                }}>
                <RunButton runQuery={runQuery} />
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaProvider>
      </BottomSheetModalProvider>
    </ColorSchemeProvider>
  );
};
const App = () => (
  <ColorSchemeProvider>
    <BottomSheetModalProvider>
      <SafeAreaProvider>
        <TourGuideProvider
          dismissOnPress={true}
          androidStatusBarVisible={true}
          animationDuration={250}>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="#c8b900"
            translucent
          />
          <AppContent />
        </TourGuideProvider>
      </SafeAreaProvider>
    </BottomSheetModalProvider>
  </ColorSchemeProvider>
);

const dynamicStyles = new DynamicStyleSheet({
  statusBar: {
    height: getStatusBarHeight(),
    backgroundColor: '#c8b900',
  },
  runBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  outerContainer: {
    backgroundColor: new DynamicValue('white', darkBGColor),
    flex: 1,
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
