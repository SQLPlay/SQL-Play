import TabBar from '~/component/TabBar';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import CodeRunner from './CodeRunner';
import {Text} from 'react-native';
import LearnStackNav from './LearnStackNav';
import {useEffect} from 'react';
import {$isAppLoading} from '~/store';
import colors from 'tailwindcss/colors';

const Tab = createMaterialTopTabNavigator();

const TabNav = () => {
  useEffect(() => {
    $isAppLoading.set(false);
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
