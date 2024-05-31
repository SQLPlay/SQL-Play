import TabBar from '~/component/TabBar';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import CodeRunner from './CodeRunner';
import {Text} from 'react-native';
import LearnStackNav from './LearnStackNav';
import {useEffect} from 'react';
import {$isAppLoading} from '~/store';
import colors from 'tailwindcss/colors';
import {initDb} from '~/utils/storage';
import {
  finishTransaction,
  initConnection,
  purchaseUpdatedListener,
} from 'react-native-iap';
import {showSuccessNotif} from '~/utils/notif';
import {useMMKVStorage} from 'react-native-mmkv-storage';
import {secureStore} from '~/store/mmkv';

const Tab = createMaterialTopTabNavigator();

const TabNav = () => {
  const [hasPro, setHasPro] = useMMKVStorage('hasPro', secureStore, false);

  useEffect(() => {
    $isAppLoading.set(false);

    initConnection()
      .then(() => {
        purchaseUpdatedListener(async purchase => {
          // TODO: Call backend server to validate the transaction
          await finishTransaction({purchase, isConsumable: false});
          setHasPro(true);
          showSuccessNotif(
            'Wow! Did you just get SQL pro?',
            'You made my day. Enjoy the pro features.',
          );
        });
      })
      .catch(err => {
        console.log(err);
      });
    initDb();
  }, []);

  return (
    <Tab.Navigator
      tabBar={props => <TabBar {...props} />}
      screenOptions={{
        lazy: true,
        lazyPlaceholder: () => <Text>Loading tab nav</Text>,
        swipeEnabled: false,
        tabBarLabelStyle: {backgroundColor: colors.slate[600]},
      }}>
      <Tab.Screen name="SQL Play" component={CodeRunner} />
      <Tab.Screen
        options={{title: 'Learn'}}
        name="Learn Stack"
        component={LearnStackNav}
      />
    </Tab.Navigator>
  );
};

export default TabNav;
