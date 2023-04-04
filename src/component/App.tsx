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
} from 'react-native';

import {
  DynamicStyleSheet,
  DynamicValue,
  useDynamicValue,
  ColorSchemeProvider,
} from 'react-native-dynamic';
import {NotifierWrapper} from 'react-native-notifier';
import {ExecuteUserQuery, insertUserCommand} from '../utils/storage';
import SplashScreen from 'react-native-bootsplash';

import {getLargestWidths, shouldShowAd, getIsPremium} from '../utils/utils';
import AppBar from './AppBar';
import Table from './Table';
import RunButton from './RunButton';
import InputContainer from './InputContainer';

import '../utils/appReviewer';
import '../utils/updateChecker';
import {darkBGColor} from '../data/colors.json';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet/';
import {SafeAreaProvider} from 'react-native-safe-area-context';
// import GoPremium from './GoPremium';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {showErrorNotif, showSuccessNotif} from '../utils/notif';
import {calculateWidths} from '../utils/measureTextSize';
// import {AppTour, AppTourView} from 'react-native-app-tour';

interface tableDataNode {
  header: Array<string>;
  rows: Array<Array<string>>;
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

  const showAd = async () => {
    if (!shouldShowAd()) return;
  };

  const runQuery = async () => {
    setLoaderVisibility(true);
    // await insertUserCommand(inputValue); // store the command in db
    try {
      /** Show add if user is not premium */
      if (!isPremium) {
        showAd();
      }
      // execute the query
      const res = await ExecuteUserQuery(inputValue);

      // console.log(res);
      if (!res?.rows || !res.header) {
        setLoaderVisibility(false);
        showSuccessNotif(
          'Command Executed Successfully',
          'There was nothing  to show',
        );
        return;
      }

      console.log('got data');
      const rowWidths = await calculateWidths(res?.header, res.rows);
      tableWidths.current = rowWidths;
      console.log('got widths');
      setTableData(res);
      // pass the header and result arr to get the largest widths of their respective column
      // tableWidths.current = await getLargestWidths([header, ...rowsArr]);
      // console.log(([header, ...rowsArr]));

      setLoaderVisibility(false);
      // console.log(rowsArr);

      // setTableData({header: header, rows: rowsArr});
    } catch (error) {
      if (error instanceof Error) {
        setLoaderVisibility(false);
        console.log(error);
        showErrorNotif(error?.message);
      }
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
    <GestureHandlerRootView style={{flex: 1}}>
      <ColorSchemeProvider>
        <BottomSheetModalProvider>
          <SafeAreaProvider>
            <StatusBar
            // barStyle="dark-content"
            // backgroundColor="#c8b900"
            // translucent
            />

            <NotifierWrapper>
              {/* <GoPremium
              modalState={premiumModalOpen}
              setModalState={setPremiumModalOpen}
              isPremium={isPremium}
              setIsPremium={setIsPremium}
            /> */}

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
                  {tableData.header.length ? (
                    <Table {...tableData} columnWidths={tableWidths.current} />
                  ) : null}
                </View>

                <RunButton runQuery={runQuery} />
              </View>
            </NotifierWrapper>
          </SafeAreaProvider>
        </BottomSheetModalProvider>
      </ColorSchemeProvider>
    </GestureHandlerRootView>
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
    flex: 1,
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
