import React, {useState, useRef, useEffect} from 'react';
import {StatusBar, StyleSheet, useColorScheme} from 'react-native';

import {NotifierWrapper} from 'react-native-notifier';
import SplashScreen from 'react-native-bootsplash';

import {getStatusBarHeight} from 'react-native-status-bar-height';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet/';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {
  setup,
  initConnection,
  getAvailablePurchases,
  getProducts,
} from 'react-native-iap';
import {
  DefaultTheme,
  DarkTheme as DefaultDarkTheme,
  NavigationContainer,
} from '@react-navigation/native';
import Home from '~/screens/Home';
import {initDb} from '~/utils/storage';
import Lesson from '~/screens/Lesson';
import {setupKeyboardListener} from '~/utils/keyboard-status';
import OptionMenu from './component/RightHeader';
import TabBar from './component/TabBar';
import Learn from './screens/Learn';
import {RootStackParamList} from '~/types/nav';
import Purchase from './screens/Purchase';

initDb();
setupKeyboardListener();

const Stack = createNativeStackNavigator<RootStackParamList>();

const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
};

const DarkTheme = {
  ...DefaultDarkTheme,
  colors: {
    ...DefaultDarkTheme.colors,
  },
};

const HomeStackNav = () => (
  <Stack.Navigator
    screenOptions={{headerShown: false}}
    initialRouteName="CodeRunner">
    <Stack.Screen
      options={{
        title: 'SQL Play',
        headerStyle: {backgroundColor: 'gold'},
        headerRight: OptionMenu,
      }}
      name="CodeRunner"
      component={Home}
    />
    <Stack.Group
      screenOptions={{presentation: 'transparentModal', headerShown: false}}>
      <Stack.Screen name="Purchase" component={Purchase} />
    </Stack.Group>
  </Stack.Navigator>
);

const LearnStackNav = () => (
  <Stack.Navigator
    screenOptions={{headerShown: false}}
    initialRouteName="Learn">
    <Stack.Screen
      options={{title: 'SQL Compatibility'}}
      name="SupportedQuery"
      component={Lesson}
    />
    <Stack.Screen options={{}} name="Learn" component={Learn} />
    <Stack.Screen options={{}} name="Lesson" component={Lesson} />
  </Stack.Navigator>
);

const Tab = createMaterialTopTabNavigator();
const App = () => {
  const [isPremium, setIsPremium] = useState<boolean>(false);

  const setupIAp = async () => {
    const res = await initConnection();
    console.log('connected', res);
    const products = await getProducts({skus: ['premium']});
    console.log(products);
    getAvailablePurchases().then(res => console.log('got', res));
  };

  useEffect(() => {
    setupIAp();
  }, []);

  useEffect(() => {
    // const init = async () => {
    //   const isPremRes = await getIsPremium();
    //   setIsPremium(isPremRes);
    //   // Setup ad only when user is not premium
    //   if (!isPremRes) {
    //   }
    //   await SplashScreen.hide({fade: true});
    // };
    // init();
    // return () => {};
  }, []);
  const scheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : LightTheme}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={LightTheme.colors.background}
        />
        <BottomSheetModalProvider>
          <SafeAreaProvider>
            <NotifierWrapper>
              <Tab.Navigator
                tabBar={props => <TabBar {...props} />}
                screenOptions={{}}>
                <Tab.Screen name="SQL Play" component={HomeStackNav} />
                <Tab.Screen
                  options={{title: 'Learn'}}
                  name="Learn Stack"
                  component={LearnStackNav}
                />
              </Tab.Navigator>
            </NotifierWrapper>
          </SafeAreaProvider>
        </BottomSheetModalProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  statusBar: {
    height: getStatusBarHeight(),
    backgroundColor: '#c8b900',
  },
  modalStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000a1',
  },
});

export default App;
